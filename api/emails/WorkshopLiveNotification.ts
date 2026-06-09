import { emailLayout, emailButton } from '../lib/email';

export interface WorkshopLiveNotificationProps {
  registrantName: string;
  workshopTitle: string;
  workshopTopic?: string;
  meetingLink: string;
  meetingPassword?: string;
  workshopStartTime?: string;
  date: string;
  time?: string;
  vaultUrl: string;
}

export function renderWorkshopLiveNotification(props: WorkshopLiveNotificationProps): string {
  const meetingInfo = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Access</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
          ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
          <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;">
            <strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}
          </p>
          ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
          <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;">
            <strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a>
          </p>
          ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
        </td>
      </tr>
    </table>
  `;

  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      Great news — <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now <strong style="color:#d1f34d;">LIVE</strong>!
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      Your reserved spot is ready. Use the details below to join the session.
    </p>

    ${meetingInfo}

    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;">
      <strong style="color:#cccccc;">Quick tips:</strong> Join 5 minutes early to test your audio and video. The session will be recorded and available in your Vault afterward.
    </p>

    ${emailButton('Join Workshop Now', props.meetingLink)}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      Can't make it? The replay will be available in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a> after the session ends.
    </p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      See you there!<br/>— Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
