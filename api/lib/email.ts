import { Resend } from 'resend';

const DEFAULT_FROM = 'Ayush Paul <lab@ayushpaul.in>';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — email not sent.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: payload.from || DEFAULT_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    console.log(`[Email] Sent "${payload.subject}" to ${payload.to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Failed to send "${payload.subject}" to ${payload.to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// Shared dark-themed base wrapper with AyushPaul.in branding
export function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:560px;background-color:#111111;border-radius:12px;border:1px solid #333333;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 24px;background-color:#1a1a1a;border-top-left-radius:12px;border-top-right-radius:12px;border-bottom:1px solid #333333;text-align:center;">
              <h1 style="margin:0;font-size:20px;font-weight:700;color:#d1f34d;letter-spacing:1px;text-transform:uppercase;">AyushPaul.in</h1>
              <p style="margin:4px 0 0;font-size:11px;color:#666666;letter-spacing:2px;text-transform:uppercase;">Innovation Lab</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;border-top:1px solid #222222;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#555555;">
                <a href="https://ayushpaul.in/vault" style="color:#00C2FF;text-decoration:none;">My Vault</a>
                &nbsp;·&nbsp;
                <a href="https://ayushpaul.in/blueprints" style="color:#00C2FF;text-decoration:none;">Blueprints</a>
                &nbsp;·&nbsp;
                <a href="https://ayushpaul.in/mastery" style="color:#00C2FF;text-decoration:none;">Mastery</a>
              </p>
              <p style="margin:0;font-size:11px;color:#444444;">
                Ayush Paul — Systems Builder &amp; Architect
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(text: string, url: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr>
    <td align="center">
      <a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#d1f34d;color:#000000;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}
