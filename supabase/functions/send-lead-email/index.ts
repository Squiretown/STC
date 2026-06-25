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

interface RoutingMatch {
  rule_id: string;
  assign_to_name: string;
  assign_to_email: string;
  notify_emails: string[];
}

async function resolveRouting(
  service: string | null,
  source: string | null,
): Promise<RoutingMatch | null> {
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await db.rpc("evaluate_routing_rules", {
      p_service: service ?? "",
      p_source: source ?? "",
    });
    if (error) { console.error("Routing error:", error.message); return null; }
    return data?.length ? (data[0] as RoutingMatch) : null;
  } catch (e) {
    console.error("Routing resolution failed:", e);
    return null;
  }
}

async function persistAssignment(
  leadId: string,
  routing: RoutingMatch,
): Promise<string | null> {
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const { error } = await db.from("leads").update({
      assigned_to:                 routing.assign_to_name,
      assigned_to_email:           routing.assign_to_email,
      assignment_status:           "pending",
      assignment_token:            token,
      assignment_token_expires_at: expires,
      updated_at:                  new Date().toISOString(),
    }).eq("id", leadId);

    if (error) { console.error("Failed to persist assignment:", error); return null; }

    // Log initial assignment
    await db.from("lead_assignment_history").insert({
      lead_id:           leadId,
      action:            "assigned",
      assigned_to_name:  routing.assign_to_name,
      assigned_to_email: routing.assign_to_email,
      performed_by:      "system",
    });

    return token;
  } catch (e) {
    console.error("persistAssignment failed:", e);
    return null;
  }
}

function buildEmailHtml(
  record: Record<string, unknown>,
  assigneeName: string | null,
  acceptUrl: string | null,
  declineUrl: string | null,
): string {
  const submittedDate = new Date(
    (record?.created_at as string) ?? Date.now(),
  ).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });

  const assignedBanner = assigneeName
    ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
         <p style="margin:0;font-size:14px;color:#1e40af;font-weight:600;">This lead has been assigned to you, ${assigneeName}.</p>
         <p style="margin:4px 0 0;font-size:13px;color:#3b82f6;">Please accept or decline below — your response helps us serve this client promptly.</p>
       </div>`
    : "";

  const acceptDeclineButtons = (acceptUrl && declineUrl)
    ? `<div style="text-align:center;margin:28px 0 8px;padding:20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
         <p style="margin:0 0 14px;font-size:14px;color:#475569;font-weight:500;">Will you take this lead?</p>
         <a href="${acceptUrl}" style="display:inline-block;padding:12px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin:4px 6px;">Accept Lead</a>
         <a href="${declineUrl}" style="display:inline-block;padding:12px 28px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin:4px 6px;">Decline Lead</a>
         <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">Link expires in 7 days. You can also respond in the admin dashboard.</p>
       </div>`
    : `<div style="text-align:center;margin:24px 0;">
         <a href="${APP_URL}/admin" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">View in Dashboard</a>
       </div>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5}
  .container{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)}
  .header{background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);color:#fff;padding:30px;text-align:center}
  .header h1{margin:0 0 8px;font-size:22px;font-weight:700}
  .content{padding:28px}
  .field{margin-bottom:14px;padding:12px 14px;background:#f8fafc;border-radius:8px;border-left:4px solid #2563eb}
  .field-label{font-weight:600;color:#475569;margin-bottom:3px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
  .msg-block{margin-top:18px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
  .footer{padding:20px;background:#1e293b;color:#94a3b8;text-align:center;font-size:13px}
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>New Lead — Squiretown Consulting</h1>
    <p style="margin:0;opacity:.9;font-size:14px;">A potential client has reached out</p>
  </div>
  <div class="content">
    ${assignedBanner}
    <div class="field"><div class="field-label">Contact Name</div><div>${record?.name ?? ""}</div></div>
    <div class="field"><div class="field-label">Email</div><div><a href="mailto:${record?.email ?? ""}" style="color:#2563eb">${record?.email ?? ""}</a></div></div>
    ${record?.company ? `<div class="field"><div class="field-label">Company</div><div>${record.company}</div></div>` : ""}
    ${record?.phone ? `<div class="field"><div class="field-label">Phone</div><div>${record.phone}</div></div>` : ""}
    <div class="field"><div class="field-label">Service Interest</div><div>${getServiceName(record?.service as string)}</div></div>
    <div class="field"><div class="field-label">Submitted</div><div>${submittedDate} ET</div></div>
    <div class="msg-block">
      <div class="field-label">Message</div>
      <div style="white-space:pre-wrap;margin-top:8px;font-size:15px">${record?.message ?? ""}</div>
    </div>
    ${acceptDeclineButtons}
  </div>
  <div class="footer">
    <p style="margin:0 0 4px"><strong style="color:#e2e8f0">Squiretown Consulting</strong></p>
    <p style="margin:0 0 4px">Lead ID: <code style="background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px">${record?.id ?? "new"}</code></p>
    <p style="margin:0;opacity:.6;font-size:12px">Auto-generated from the contact form</p>
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
    const payload  = bodyText ? JSON.parse(bodyText) : {};
    const record   = payload.record as Record<string, unknown> | undefined;

    console.log("send-lead-email: received", { id: record?.id, service: record?.service });

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    if (!ADMIN_EMAIL)    throw new Error("ADMIN_EMAIL not configured");

    // ── Routing ──────────────────────────────────────────────────────────────
    const routing = await resolveRouting(
      (record?.service as string) ?? null,
      (record?.source as string) ?? null,
    );

    let token: string | null = null;
    if (routing && record?.id) {
      token = await persistAssignment(record.id as string, routing);
    }

    // Build accept/decline URLs
    const acceptUrl  = token ? `${APP_URL}/lead-accept?token=${token}&action=accept`  : null;
    const declineUrl = token ? `${APP_URL}/lead-accept?token=${token}&action=decline` : null;

    // Recipients
    const primaryEmail = routing?.assign_to_email ?? ADMIN_EMAIL;
    const toEmails     = [primaryEmail];
    const ccEmails     = (routing?.notify_emails ?? []).filter(
      (e: string) => e && e !== primaryEmail,
    );

    console.log("send-lead-email: routing", { matched: !!routing, to: primaryEmail, cc: ccEmails, hasToken: !!token });

    // ── Email ─────────────────────────────────────────────────────────────────
    const html = buildEmailHtml(
      record ?? {},
      routing?.assign_to_name ?? null,
      acceptUrl,
      declineUrl,
    );

    const emailPayload: Record<string, unknown> = {
      from:     "notifications@support247.solutions",
      to:       toEmails,
      reply_to: record?.email ?? undefined,
      subject:  `New Lead: ${record?.name ?? ""}${record?.company ? ` from ${record.company}` : ""}`,
      html,
    };
    if (ccEmails.length > 0) emailPayload.cc = ccEmails;

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body:    JSON.stringify(emailPayload),
      signal:  controller.signal,
    });
    clearTimeout(timeout);

    const respBody = await res.text();
    if (!res.ok) throw new Error(`Resend error ${res.status}: ${respBody}`);

    console.log("send-lead-email: sent", { to: primaryEmail });

    return new Response(
      JSON.stringify({ success: true, routed_to: primaryEmail, has_token: !!token }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-lead-email: error", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
