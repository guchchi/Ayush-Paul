import { emailLayout, emailButton } from '../lib/email';

export type ReminderType = '24h' | '1h' | '5m';

export interface WorkshopReminderEmailProps {
  registrantName: string;
  workshopTitle: string;
  workshopTopic?: string;
  meetingLink: string;
  meetingPassword?: string;
  meetingId?: string;
  date: string;
  time?: string;
  workshopStartTime?: string;
  vaultUrl: string;
  reminderType: ReminderType;
}

function getReminderLabel(type: ReminderType): string {
  switch (type) {
    case '24h': return '24 hours';
    case '1h': return '1 hour';
    case '5m': return '5 minutes';
  }
}

function getReminderMessage(type: ReminderType): string {
  switch (type) {
    case '24h':
      return 'Your workshop is tomorrow! Here are the access details.';
    case '1h':
      return 'Your workshop starts in 1 hour. Get ready to join!';
    case '5m':
      return 'Your workshop is starting in 5 minutes! Join now.';
  }
}

export function renderWorkshopReminderEmail(props: WorkshopReminderEmailProps): string {
  const meetingInfo = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Access Details</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
          ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
          <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;">
            <strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}
          </p>
          ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
          <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;">
            <strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a>
          </p>
          ${props.meetingId ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Meeting ID:</strong> ${props.meetingId}</p>` : ''}
          ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
        </td>
      </tr>
    </table>
  `;

  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      <strong style="color:#d1f34d;">${getReminderLabel(props.reminderType)} reminder!</strong>
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      ${getReminderMessage(props.reminderType)}
    </p>

    ${meetingInfo}

    ${emailButton('Join Workshop', props.meetingLink)}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      Can't make it? The replay will be available in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a> after the session ends.
    </p>
    <p style="margin:8px 0 0;font-size:14px;line-height:22px;color:#666666;">
      — Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
