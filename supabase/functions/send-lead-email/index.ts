import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  created_at?: string;
}
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('send-lead-email function called', { method: req.method, url: req.url });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'notifications@support247.solutions';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Admin email not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse the request body
    const requestBody = await req.json();
    const lead: Lead = requestBody.record || requestBody;

    if (!lead || !lead.name || !lead.email || !lead.message) {
      console.error('Invalid lead data received:', lead);
      return new Response(
        JSON.stringify({ error: 'Invalid lead data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Format the submission date
    const submissionDate = lead.created_at 
      ? new Date(lead.created_at).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      : new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });

    // Create service display name
    const serviceMap: Record<string, string> = {
      'brand-marketing': 'Brand Awareness & Marketing',
      'ai-technology': 'AI Technology Stack Building',
      'business-funding': 'Business Funding',
      'title-services': 'Real Estate Title Services',
      'multiple': 'Multiple Services',
      'consultation': 'General Consultation'
    };

    const serviceDisplay = lead.service ? serviceMap[lead.service] || lead.service : 'Not specified';
    
    // Email subject
    const subject = lead.service ? `New Lead Inquiry - ${serviceDisplay}` : 'New Lead Inquiry';

    // Create HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .lead-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 10px;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
            width: 140px;
            flex-shrink: 0;
        }
        .detail-value {
            color: #212529;
            flex-grow: 1;
        }
        .message-content {
            background-color: #ffffff;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            white-space: pre-wrap;
            font-family: inherit;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Lead Received</h1>
            <p style="margin: 10px 0 0 0;">Squiretown Consulting LLC</p>
        </div>
        
        <p>You have received a new inquiry through your website contact form. Here are the details:</p>
        
        <div class="lead-details">
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${lead.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${lead.email}" style="color: #667eea; text-decoration: none;">${lead.email}</a></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Company:</span>
                <span class="detail-value">${lead.company || 'Not provided'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Service Interest:</span>
                <span class="detail-value">${serviceDisplay}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${submissionDate}</span>
            </div>
        </div>
        
        <div style="margin: 25px 0;">
            <div class="detail-label" style="margin-bottom: 10px;">Message:</div>
            <div class="message-content">${lead.message}</div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${lead.email}?subject=Re: Your Inquiry - Squiretown Consulting" class="cta-button">Reply to ${lead.name}</a>
        </div>
        
        <div class="footer">
            <p>This notification was automatically generated from your website's contact form.</p>
            <p><strong>Squiretown Consulting LLC</strong><br>
            Professional Business Consulting Services</p>
        </div>
    </div>
</body>
</html>`;

    // Create plain text version
    const textContent = `
NEW LEAD INQUIRY - SQUIRETOWN CONSULTING

A new inquiry has been submitted through your website contact form.

LEAD DETAILS:
==============
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || 'Not provided'}
Service Interest: ${serviceDisplay}
Submitted: ${submissionDate}

MESSAGE:
========
${lead.message}

---
You can reply directly to this lead at: ${lead.email}

This notification was automatically generated from your website's contact form.
Squiretown Consulting LLC
`;

    // Send email using Resend
    console.log(`Sending email notification for lead: ${lead.name} (${lead.email})`);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
    return new Response('ok', { headers: corsHeaders });

    if (error) {
      console.error('Failed to send email:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email notification', 
          details: error 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully',
        data: data
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-lead-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
    // Get environment variables first
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || Deno.env.get('ADMIN_EMAIL_RECIPIENT');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'notifications@support247.solutions';

    console.log('Environment check:', {
      hasResendKey: !!resendApiKey,
      adminEmail: adminEmail,
      fromEmail: fromEmail
    });

    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing RESEND_API_KEY' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Admin email not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse the request body
    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const lead: Lead = requestBody.record || requestBody;

    if (!lead || !lead.name || !lead.email || !lead.message) {
      console.error('Invalid lead data received:', lead);
      return new Response(
        JSON.stringify({ error: 'Invalid lead data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Dynamic import of Resend to avoid import issues
    const { Resend } = await import('npm:resend@3.2.0');
    const resend = new Resend(resendApiKey);

    console.log('Resend client initialized, processing lead:', lead.name);
