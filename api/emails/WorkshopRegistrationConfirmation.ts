import { emailLayout, emailButton } from '../lib/email';

export interface WorkshopRegistrationConfirmationProps {
  registrantName: string;
  workshopTitle: string;
  workshopDescription?: string;
  host?: string;
  duration?: string;
  date: string;
  time?: string;
  workshopStartTime?: string;
  meetingLink?: string;
  vaultUrl: string;
}

export function renderWorkshopRegistrationConfirmation(props: WorkshopRegistrationConfirmationProps): string {
  const hasMeetingLink = !!props.meetingLink;

  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      You have successfully reserved your seat for <strong style="color:#d1f34d;">${props.workshopTitle}</strong>!
    </p>
    ${props.workshopDescription ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopDescription}</p>` : ''}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Details</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
          <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;">
            <strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}
          </p>
          ${props.host ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Host:</strong> ${props.host}</p>` : ''}
          ${props.duration ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Duration:</strong> ${props.duration}</p>` : ''}
          ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
        </td>
      </tr>
    </table>

    ${hasMeetingLink ? emailButton('Join Workshop', props.meetingLink!) : `
    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;">
      The workshop joining link will be shared before the session begins.
    </p>
    `}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      You can also access all your workshops from your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a>.
    </p>

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      See you there!<br/>— Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
