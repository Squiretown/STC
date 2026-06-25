import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL    = Deno.env.get("ADMIN_EMAIL");
const SUPABASE_URL   = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL        = Deno.env.get("APP_URL") ?? "https://squiretown.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SERVICE_LABELS: Record<string, string> = {
  "brand-marketing": "Brand Awareness & Marketing",
  "ai-technology": "AI Technology Stack Building",
  "business-funding": "Business Funding",
  "title-services": "Real Estate Title Services",
  "multiple": "Multiple Services",
  "consultation": "General Consultation",
};

const getServiceName = (key?: string | null) =>
  key ? SERVICE_LABELS[key] ?? key : "Not specified";

interface PendingLead {
  lead_id: string;
  lead_name: string;
  company: string | null;
  service: string | null;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  assignment_token: string | null;
  reminder_hours: number;
}

async function sendReminderEmail(
  lead: PendingLead,
  reminderCount: number,
): Promise<boolean> {
  if (!lead.assigned_to_email || !lead.assignment_token) return false;

  const acceptUrl  = `${APP_URL}/lead-accept?token=${lead.assignment_token}&action=accept`;
  const declineUrl = `${APP_URL}/lead-accept?token=${lead.assignment_token}&action=decline`;

  const ordinal = reminderCount === 1 ? "1st" : reminderCount === 2 ? "2nd" : `${reminderCount}th`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5}
  .container{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)}
  .header{background:linear-gradient(135deg,#b45309 0%,#d97706 100%);color:#fff;padding:28px;text-align:center}
  .content{padding:28px}
  .field{margin-bottom:12px;padding:12px 14px;background:#f8fafc;border-radius:8px;border-left:4px solid #d97706}
  .field-label{font-weight:600;color:#475569;margin-bottom:3px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
  .footer{padding:18px;background:#1e293b;color:#94a3b8;text-align:center;font-size:13px}
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1 style="margin:0 0 8px;font-size:20px">Reminder: Lead Awaiting Your Response</h1>
    <p style="margin:0;opacity:.9;font-size:13px">This is your ${ordinal} reminder — please accept or decline</p>
  </div>
  <div class="content">
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">Hi ${lead.assigned_to_name ?? "there"},</p>
      <p style="margin:6px 0 0;font-size:13px;color:#b45309;">A lead assigned to you is still waiting for your response. Please act soon so we can serve this client promptly.</p>
    </div>
    <div class="field"><div class="field-label">Lead Name</div><div>${lead.lead_name}</div></div>
    ${lead.company ? `<div class="field"><div class="field-label">Company</div><div>${lead.company}</div></div>` : ""}
    <div class="field"><div class="field-label">Service Interest</div><div>${getServiceName(lead.service)}</div></div>
    <div style="text-align:center;margin:24px 0 8px;padding:18px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px;font-size:14px;color:#475569;font-weight:500;">Your response is needed</p>
      <a href="${acceptUrl}" style="display:inline-block;padding:12px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin:4px 6px;">Accept Lead</a>
      <a href="${declineUrl}" style="display:inline-block;padding:12px 28px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin:4px 6px;">Decline Lead</a>
    </div>
  </div>
  <div class="footer">
    <p style="margin:0 0 4px"><strong style="color:#e2e8f0">Squiretown Consulting</strong></p>
    <p style="margin:0;opacity:.6;font-size:12px">You are receiving this because a lead was assigned to you</p>
  </div>
</div>
</body></html>`;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 10_000);

  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body:    JSON.stringify({
      from:    "notifications@support247.solutions",
      to:      [lead.assigned_to_email],
      subject: `Reminder: Lead "${lead.lead_name}" awaits your response`,
      html,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeout);

  return res.ok;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    if (!ADMIN_EMAIL)    throw new Error("ADMIN_EMAIL not configured");

    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get leads needing reminders
    const { data: pendingLeads, error: queryErr } = await db.rpc("get_pending_reminder_leads");
    if (queryErr) throw queryErr;

    const leads = (pendingLeads ?? []) as PendingLead[];
    console.log(`send-assignment-reminder: ${leads.length} lead(s) need reminders`);

    let sent = 0;
    let failed = 0;

    for (const lead of leads) {
      // Count prior reminders for this lead
      const { data: priorReminders } = await db
        .from("lead_assignment_history")
        .select("id")
        .eq("lead_id", lead.lead_id)
        .eq("action", "reminder_sent");

      const reminderCount = (priorReminders?.length ?? 0) + 1;

      const ok = await sendReminderEmail(lead, reminderCount);

      if (ok) {
        // Log the reminder
        await db.from("lead_assignment_history").insert({
          lead_id:           lead.lead_id,
          action:            "reminder_sent",
          assigned_to_name:  lead.assigned_to_name,
          assigned_to_email: lead.assigned_to_email,
          performed_by:      "system",
          note:              `Reminder #${reminderCount} sent`,
        });
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`send-assignment-reminder: sent=${sent} failed=${failed}`);

    return new Response(
      JSON.stringify({ success: true, processed: leads.length, sent, failed }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-assignment-reminder: error", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
