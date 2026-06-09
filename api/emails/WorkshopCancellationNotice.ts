import { emailLayout } from '../lib/email';

export interface WorkshopCancellationNoticeProps {
  registrantName: string;
  workshopTitle: string;
  workshopTopic?: string;
  date: string;
  vaultUrl: string;
}

export function renderWorkshopCancellationNotice(props: WorkshopCancellationNoticeProps): string {
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      Unfortunately, <strong style="color:#d1f34d;">${props.workshopTitle}</strong> scheduled for <strong style="color:#ffffff;">${props.date}</strong> has been <strong style="color:#ff6b6b;">cancelled</strong>.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      We apologize for the inconvenience. If this workshop is rescheduled, we will notify you.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Cancelled Workshop</p>
          <p style="margin:0;font-size:16px;font-weight:700;color:#ff6b6b;">${props.workshopTitle}</p>
          ${props.workshopTopic ? `<p style="margin:8px 0 0;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
        </td>
      </tr>
    </table>

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      In the meantime, check out other workshops and resources in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a>.
    </p>
    <p style="margin:8px 0 0;font-size:14px;line-height:22px;color:#666666;">
      — Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
