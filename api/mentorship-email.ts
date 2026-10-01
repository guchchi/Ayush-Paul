import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const DEFAULT_FROM = 'Ayush Paul <lab@ayushpaul.in>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || 'admin@example.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, contact, topic, description, preferredDate, preferredTime, timezone, requestId } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ success: true, note: "Email not configured" });
  }

  try {
    const resend = new Resend(apiKey);

    const html = `
      <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#888888;">A new 1-on-1 session request has been submitted from the Mastery page. Review the details below.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
        <tr><td style="padding:12px 0 4px;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Status</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#d1f34d;font-weight:700;">PENDING</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Name</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Contact</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">${contact}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Topic</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">${topic}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Description</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#cccccc;line-height:1.5;">${description || '—'}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Preferred Date</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">${preferredDate}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Preferred Time</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#ffffff;font-weight:600;">${preferredTime} ${timezone ? `(${timezone})` : ''}</td></tr>
        <tr><td style="padding:12px 0 4px;border-top:1px solid #222222;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:1px;">Request ID</td></tr>
        <tr><td style="padding:0 0 12px;font-size:12px;color:#888888;">${requestId || '—'}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#666666;">Review this request in the <a href="https://ayushpaul.in/admin" style="color:#00C2FF;text-decoration:none;">Creator Studio</a> admin panel.</p>
    `;

    const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" style="max-width:560px;background-color:#111111;border-radius:12px;border:1px solid #333333;">
<tr><td style="padding:28px 24px;background-color:#1a1a1a;border-top-left-radius:12px;border-top-right-radius:12px;border-bottom:1px solid #333333;text-align:center;">
<h1 style="margin:0;font-size:18px;font-weight:700;color:#d1f34d;letter-spacing:1px;text-transform:uppercase;">New 1-on-1 Session Request</h1>
<p style="margin:4px 0 0;font-size:11px;color:#888888;">AyushPaul.in Mastery</p>
</td></tr>
<tr><td style="padding:32px 24px;">${html}</td></tr>
<tr><td style="padding:20px 24px;border-top:1px solid #222222;text-align:center;">
<p style="margin:0;font-size:11px;color:#444444;">Ayush Paul — Systems Builder &amp; Architect</p>
</td></tr></table></td></tr></table></body></html>`;

    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `New 1-on-1 Session Request — ${name} (${topic})`,
      html: emailHtml,
    });

    if (response?.error) {
      console.error("[mentorship-email] API error:", response.error);
      return res.status(200).json({ success: false, error: response.error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("[mentorship-email] exception:", err.message);
    return res.status(200).json({ success: false, error: err.message });
  }
}
