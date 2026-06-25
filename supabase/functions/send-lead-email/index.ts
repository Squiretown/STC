import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL    = Deno.env.get("ADMIN_EMAIL");
const SUPABASE_URL   = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

interface RoutingMatch {
  rule_id: string;
  assign_to_name: string;
  assign_to_email: string;
  notify_emails: string[];
}

async function resolveRouting(
  service: string | null,
  source: string | null
): Promise<RoutingMatch | null> {
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await db.rpc("evaluate_routing_rules", {
      p_service: service ?? "",
      p_source: source ?? "",
    });
    if (error) {
      console.error("Routing rule evaluation error:", error.message);
      return null;
    }
    return (data && data.length > 0) ? data[0] as RoutingMatch : null;
  } catch (e) {
    console.error("Routing resolution failed:", e);
    return null;
  }
}

async function updateLeadAssignment(leadId: string, assignToName: string): Promise<void> {
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await db.from("leads").update({ assigned_to: assignToName }).eq("id", leadId);
  } catch (e) {
    console.error("Failed to update lead assignment:", e);
  }
}

function buildEmailHtml(record: Record<string, unknown>, assignedTo: string | null): string {
  const submittedDate = new Date(
    (record?.created_at as string) ?? Date.now()
  ).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });

  const assignedBanner = assignedTo
    ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:14px;color:#1e40af;">
         <strong>Assigned to you:</strong> This lead has been routed to ${assignedTo}.
       </div>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5}
  .container{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)}
  .header{background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);color:#fff;padding:30px;text-align:center}
  .header h1{margin:0 0 8px;font-size:22px}
  .content{padding:30px}
  .field{margin-bottom:16px;padding:14px 16px;background:#f8fafc;border-radius:8px;border-left:4px solid #2563eb}
  .field-label{font-weight:600;color:#475569;margin-bottom:4px;font-size:12px;text-transform:uppercase;letter-spacing:.5px}
  .message-block{margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
  .cta{text-align:center;margin:24px 0}
  .btn{display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin:4px}
  .footer{padding:20px;background:#1e293b;color:#94a3b8;text-align:center;font-size:13px}
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>New Lead — Squiretown Consulting</h1>
    <p style="margin:0;opacity:.9;font-size:14px;">A potential client has reached out through the website</p>
  </div>
  <div class="content">
    ${assignedBanner}
    <div class="field"><div class="field-label">Contact Name</div><div>${record?.name ?? ""}</div></div>
    <div class="field"><div class="field-label">Email</div><div><a href="mailto:${record?.email ?? ""}">${record?.email ?? ""}</a></div></div>
    ${record?.company ? `<div class="field"><div class="field-label">Company</div><div>${record.company}</div></div>` : ""}
    ${record?.phone ? `<div class="field"><div class="field-label">Phone</div><div>${record.phone}</div></div>` : ""}
    <div class="field"><div class="field-label">Service Interest</div><div>${getServiceName(record?.service as string)}</div></div>
    <div class="field"><div class="field-label">Submitted</div><div>${submittedDate} ET</div></div>
    <div class="message-block">
      <div class="field-label">Message</div>
      <div style="white-space:pre-wrap;margin-top:8px;font-size:15px">${record?.message ?? ""}</div>
    </div>
    <div class="cta">
      <a href="mailto:${record?.email ?? ""}?subject=Re: Your inquiry about ${getServiceName(record?.service as string)}" class="btn">Reply to Lead</a>
      <a href="https://squiretown.co/admin" class="btn" style="background:#0f172a">View in Dashboard</a>
    </div>
  </div>
  <div class="footer">
    <p><strong>Squiretown Consulting</strong></p>
    <p>Lead ID: <code style="background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px">${record?.id ?? "new"}</code></p>
    <p style="opacity:.7">Auto-generated from the contact form</p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    const payload = bodyText ? JSON.parse(bodyText) : {};
    const record = payload.record as Record<string, unknown> | undefined;

    console.log("send-lead-email: record", { id: record?.id, service: record?.service, source: record?.source });

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    if (!ADMIN_EMAIL)    throw new Error("ADMIN_EMAIL not configured");

    // ── Routing ──────────────────────────────────────────────
    const routing = await resolveRouting(
      (record?.service as string) ?? null,
      (record?.source as string) ?? null
    );

    // Primary recipient: routed assignee OR fallback admin
    const primaryEmail = routing?.assign_to_email ?? ADMIN_EMAIL;
    const toEmails     = [primaryEmail];

    // CC list: notify_emails from the rule (deduplicated, excluding primary)
    const ccEmails = (routing?.notify_emails ?? []).filter(
      (e: string) => e && e !== primaryEmail
    );

    console.log("send-lead-email: routing", {
      matched: !!routing,
      rule: routing?.rule_id,
      to: primaryEmail,
      cc: ccEmails,
    });

    // Auto-assign the lead in the DB
    if (routing && record?.id) {
      await updateLeadAssignment(record.id as string, routing.assign_to_name);
    }

    // ── Build & send email ────────────────────────────────────
    const html = buildEmailHtml(record ?? {}, routing?.assign_to_name ?? null);
    const subject = `New Lead: ${record?.name ?? ""}${record?.company ? ` from ${record.company}` : ""}`;

    const emailPayload: Record<string, unknown> = {
      from: "notifications@support247.solutions",
      to: toEmails,
      reply_to: record?.email ?? undefined,
      subject,
      html,
    };
    if (ccEmails.length > 0) emailPayload.cc = ccEmails;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const respBody = await res.text();
    if (!res.ok) throw new Error(`Resend error ${res.status}: ${respBody}`);

    console.log("send-lead-email: sent successfully", { to: primaryEmail, cc: ccEmails });

    return new Response(
      JSON.stringify({ success: true, routed_to: primaryEmail }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("send-lead-email: error", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
