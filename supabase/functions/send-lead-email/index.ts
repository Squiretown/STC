// supabase/functions/send-lead-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Env secrets (set these via `supabase secrets set ...`)
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL"); // e.g. info@squiretown.co

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getServiceName = (serviceKey?: string | null) => {
  const map: Record<string, string> = {
    "brand-marketing": "Brand Awareness & Marketing",
    "ai-technology": "AI Technology Stack Building",
    "business-funding": "Business Funding",
    "title-services": "Real Estate Title Services",
    multiple: "Multiple Services",
    consultation: "General Consultation",
  };
  return serviceKey ? map[serviceKey] ?? serviceKey : "Not specified";
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  // Only POST accepted
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    console.log("send-lead-notification: request received", { method: req.method });

    // Read raw body once, then parse
    const bodyText = await req.text();
    console.log("send-lead-notification: raw body", bodyText);
    const payload = bodyText ? JSON.parse(bodyText) : {};
    const { record } = payload as { record?: any };

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL not configured");

    // Format timestamp (NY time)
    const submittedDate = new Date(record?.created_at ?? Date.now()).toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Build email payload
    const emailData = {
      from: "notifications@support247.solutions", // must match your verified domain/subdomain
      to: [ADMIN_EMAIL],
      reply_to: record?.email ?? undefined,
      subject: `🚀 New Lead: ${record?.name ?? ""}${record?.company ? ` from ${record.company}` : ""}`,
      html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f5f5f5}
  .container{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)}
  .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:30px;text-align:center}
  .header h1{margin:0 0 10px 0;font-size:24px}
  .content{padding:30px}
  .field{margin-bottom:20px;padding:18px;background:#f8fafc;border-radius:8px;border-left:4px solid #667eea}
  .field-label{font-weight:bold;color:#4a5568;margin-bottom:8px;font-size:14px;text-transform:uppercase;letter-spacing:.5px}
  .message-field{margin-top:25px;padding:20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
  .message-content{white-space:pre-wrap;margin-top:10px;line-height:1.6;font-size:15px}
  .cta-section{text-align:center;margin:30px 0;padding:20px;background:#f0f4f8;border-radius:8px}
  .cta-button{display:inline-block;padding:14px 28px;background:#667eea;color:#fff;text-decoration:none;border-radius:6px;font-weight:600}
  .footer{padding:25px;background:#2d3748;color:#fff;text-align:center;font-size:14px}
  .lead-id{font-family:'Courier New',monospace;background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px}
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Lead from Squiretown Consulting</h1>
      <p>A potential client has reached out through your website!</p>
    </div>
    <div class="content">
      <div class="field"><div class="field-label">👤 Contact Name</div><div>${record?.name ?? ""}</div></div>
      <div class="field"><div class="field-label">📧 Email Address</div><div><a href="mailto:${record?.email ?? ""}">${record?.email ?? ""}</a></div></div>
      ${record?.company ? `<div class="field"><div class="field-label">🏢 Company</div><div>${record.company}</div></div>` : ""}
      <div class="field"><div class="field-label">🎯 Service Interest</div><div>${getServiceName(record?.service)}</div></div>
      <div class="field"><div class="field-label">⏰ Submitted</div><div>${submittedDate} EST</div></div>
      <div class="message-field"><div class="field-label">💬 Message</div><div class="message-content">${record?.message ?? ""}</div></div>
      <div class="cta-section">
        <a href="mailto:${record?.email ?? ""}?subject=Re: Your inquiry about ${getServiceName(record?.service)}" class="cta-button" style="margin-right:10px;">Reply to Lead</a>
        <a href="https://squiretown.co/admin" class="cta-button">View in Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Squiretown Consulting</strong></p>
      <p>Lead ID: <span class="lead-id">${record?.id ?? "New submission"}</span></p>
      <p style="opacity:.8;">This email was automatically generated from your contact form.</p>
    </div>
  </div>
</body></html>`,
    };

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    console.log("Resend status", res.status);
    const respBody = await res.text();
    console.log("Resend body", respBody);

    if (!res.ok) throw new Error(`Resend API error: ${res.status} - ${respBody}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification:", error);
    return new Response(JSON.stringify({ success: false, error: String(error?.message ?? error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
