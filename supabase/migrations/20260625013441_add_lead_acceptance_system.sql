/*
  # Lead Acceptance System

  Adds identity-based lead acceptance flow:
  - Assignment fields on leads (email, status, token, expiry, decline reason)
  - reminder_hours on routing_rules
  - lead_assignment_history audit table
  - respond_to_lead_assignment() — anon-callable token-based accept/decline
  - get_lead_by_token() — safe public preview for the accept/decline page
*/

-- ── 1. Leads: new assignment columns ─────────────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS assigned_to_email          text,
  ADD COLUMN IF NOT EXISTS assignment_status          text
    CHECK (assignment_status IN ('pending', 'accepted', 'declined')),
  ADD COLUMN IF NOT EXISTS assignment_token           uuid,
  ADD COLUMN IF NOT EXISTS assignment_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS assignment_declined_reason text;

-- Unique index ensures each token maps to at most one lead
CREATE UNIQUE INDEX IF NOT EXISTS leads_assignment_token_uniq
  ON leads (assignment_token)
  WHERE assignment_token IS NOT NULL;

-- ── 2. Routing rules: reminder timing ────────────────────────────────────────
ALTER TABLE routing_rules
  ADD COLUMN IF NOT EXISTS reminder_hours integer NOT NULL DEFAULT 24;

-- ── 3. Assignment history audit table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_assignment_history (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  action          text NOT NULL
    CHECK (action IN ('assigned', 'accepted', 'declined', 'reassigned', 'reminder_sent')),
  assigned_to_name  text,
  assigned_to_email text,
  team_member_id  uuid REFERENCES team_members(id) ON DELETE SET NULL,
  performed_by    text NOT NULL DEFAULT 'system',
  note            text,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_assignment_history_lead_id_idx
  ON lead_assignment_history (lead_id, created_at DESC);

ALTER TABLE lead_assignment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select assignment history"
  ON lead_assignment_history FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert assignment history"
  ON lead_assignment_history FOR INSERT TO authenticated
  WITH CHECK (is_admin());

GRANT SELECT, INSERT ON lead_assignment_history TO authenticated;

-- ── 4. respond_to_lead_assignment() ──────────────────────────────────────────
-- Called by the public LeadAccept page (anon) via token link,
-- or by an admin acting on behalf of an assignee (authenticated).
CREATE OR REPLACE FUNCTION public.respond_to_lead_assignment(
  p_token  uuid,
  p_action text,
  p_note   text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead leads%ROWTYPE;
BEGIN
  IF p_action NOT IN ('accepted', 'declined') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid action');
  END IF;

  SELECT * INTO v_lead
  FROM leads
  WHERE assignment_token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or already-used token');
  END IF;

  IF v_lead.assignment_status IS DISTINCT FROM 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This lead has already been responded to',
      'status', v_lead.assignment_status
    );
  END IF;

  IF v_lead.assignment_token_expires_at IS NOT NULL
     AND v_lead.assignment_token_expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invitation link has expired');
  END IF;

  UPDATE leads
  SET
    assignment_status           = p_action,
    assignment_declined_reason  = CASE WHEN p_action = 'declined' THEN p_note ELSE NULL END,
    assignment_token            = NULL,
    assignment_token_expires_at = NULL,
    updated_at                  = now()
  WHERE id = v_lead.id;

  INSERT INTO lead_assignment_history
    (lead_id, action, assigned_to_name, assigned_to_email, performed_by, note)
  VALUES
    (v_lead.id, p_action, v_lead.assigned_to, v_lead.assigned_to_email, 'assignee', p_note);

  RETURN jsonb_build_object(
    'success',     true,
    'action',      p_action,
    'lead_id',     v_lead.id,
    'lead_name',   v_lead.name,
    'assigned_to', v_lead.assigned_to
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.respond_to_lead_assignment(uuid, text, text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.respond_to_lead_assignment(uuid, text, text)
  TO anon, authenticated, service_role;

-- ── 5. get_lead_by_token() ────────────────────────────────────────────────────
-- Returns a safe, non-sensitive preview of the lead so the accept/decline
-- page can show who is being assigned what without exposing PII.
CREATE OR REPLACE FUNCTION public.get_lead_by_token(p_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead leads%ROWTYPE;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE assignment_token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found',            true,
    'lead_id',          v_lead.id,
    'lead_name',        v_lead.name,
    'company',          v_lead.company,
    'service',          v_lead.service,
    'assigned_to_name', v_lead.assigned_to,
    'assignment_status', v_lead.assignment_status,
    'expired',          (
      v_lead.assignment_token_expires_at IS NOT NULL
      AND v_lead.assignment_token_expires_at < now()
    )
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_lead_by_token(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_lead_by_token(uuid)
  TO anon, authenticated, service_role;

-- ── 6. get_pending_reminder_leads() ──────────────────────────────────────────
-- Returns leads that need a reminder email: pending assignment, no reminder
-- sent since the rule's reminder_hours ago, and past the reminder window.
-- Called by the reminder edge function (service_role).
CREATE OR REPLACE FUNCTION public.get_pending_reminder_leads()
RETURNS TABLE (
  lead_id             uuid,
  lead_name           text,
  company             text,
  service             text,
  assigned_to_name    text,
  assigned_to_email   text,
  assignment_token    uuid,
  reminder_hours      integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    l.id,
    l.name,
    l.company,
    l.service,
    l.assigned_to,
    l.assigned_to_email,
    l.assignment_token,
    COALESCE(
      (
        SELECT rr.reminder_hours
        FROM routing_rules rr
        WHERE rr.active = true
        ORDER BY rr.priority ASC
        LIMIT 1
      ),
      24
    ) AS reminder_hours
  FROM leads l
  WHERE
    l.assignment_status = 'pending'
    AND l.assigned_to_email IS NOT NULL
    -- Past the reminder window since last update
    AND l.updated_at < now() - (
      COALESCE(
        (SELECT rr.reminder_hours FROM routing_rules rr WHERE rr.active ORDER BY rr.priority LIMIT 1),
        24
      ) * interval '1 hour'
    )
    -- No reminder sent yet in the current window
    AND NOT EXISTS (
      SELECT 1
      FROM lead_assignment_history h
      WHERE h.lead_id = l.id
        AND h.action = 'reminder_sent'
        AND h.created_at > now() - (
          COALESCE(
            (SELECT rr2.reminder_hours FROM routing_rules rr2 WHERE rr2.active ORDER BY rr2.priority LIMIT 1),
            24
          ) * interval '1 hour'
        )
    );
$$;

REVOKE EXECUTE ON FUNCTION public.get_pending_reminder_leads() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_pending_reminder_leads()
  TO authenticated, service_role;
