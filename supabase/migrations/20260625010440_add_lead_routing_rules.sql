/*
  # Lead Routing Rules

  Creates a routing_rules table and a DB function that auto-assigns
  incoming leads to team members based on admin-configured rules.

  Rules are evaluated in priority order (lower number = higher priority).
  The first matching rule wins.

  Condition operators: equals, contains, any (matches any value)
  Condition fields: service, source, any (catch-all)
*/

CREATE TABLE IF NOT EXISTS routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  -- conditions stored as JSONB array: [{field, operator, value}]
  conditions jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- team member to assign the lead to (name stored for display, email for notification)
  assign_to_name text NOT NULL,
  assign_to_email text NOT NULL,
  -- additional emails to CC on the notification
  notify_emails text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view routing rules"
  ON routing_rules FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert routing rules"
  ON routing_rules FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update routing rules"
  ON routing_rules FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete routing rules"
  ON routing_rules FOR DELETE TO authenticated
  USING (is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON routing_rules TO authenticated;

-- Function: evaluate routing rules and return the matching rule for a lead
CREATE OR REPLACE FUNCTION public.evaluate_routing_rules(
  p_service text,
  p_source text
)
RETURNS TABLE(
  rule_id uuid,
  assign_to_name text,
  assign_to_email text,
  notify_emails text[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  r routing_rules%ROWTYPE;
  cond jsonb;
  cond_field text;
  cond_operator text;
  cond_value text;
  matched boolean;
  all_matched boolean;
BEGIN
  FOR r IN
    SELECT * FROM routing_rules
    WHERE active = true
    ORDER BY priority ASC, created_at ASC
  LOOP
    all_matched := true;

    -- If no conditions, it's a catch-all rule
    IF jsonb_array_length(r.conditions) = 0 THEN
      RETURN QUERY SELECT r.id, r.assign_to_name, r.assign_to_email, r.notify_emails;
      RETURN;
    END IF;

    FOR cond IN SELECT * FROM jsonb_array_elements(r.conditions)
    LOOP
      cond_field    := cond->>'field';
      cond_operator := cond->>'operator';
      cond_value    := cond->>'value';

      matched := false;

      IF cond_field = 'service' THEN
        IF cond_operator = 'equals'   THEN matched := (p_service = cond_value);
        ELSIF cond_operator = 'contains' THEN matched := (p_service ILIKE '%' || cond_value || '%');
        ELSIF cond_operator = 'any'   THEN matched := true;
        END IF;
      ELSIF cond_field = 'source' THEN
        IF cond_operator = 'equals'   THEN matched := (p_source = cond_value);
        ELSIF cond_operator = 'contains' THEN matched := (p_source ILIKE '%' || cond_value || '%');
        ELSIF cond_operator = 'any'   THEN matched := true;
        END IF;
      ELSIF cond_field = 'any' THEN
        matched := true;
      END IF;

      IF NOT matched THEN
        all_matched := false;
        EXIT;
      END IF;
    END LOOP;

    IF all_matched THEN
      RETURN QUERY SELECT r.id, r.assign_to_name, r.assign_to_email, r.notify_emails;
      RETURN;
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.evaluate_routing_rules(text, text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.evaluate_routing_rules(text, text) TO authenticated, service_role;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_routing_rules_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER routing_rules_updated_at
  BEFORE UPDATE ON routing_rules
  FOR EACH ROW EXECUTE FUNCTION update_routing_rules_updated_at();
