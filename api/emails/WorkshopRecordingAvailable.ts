import { emailLayout, emailButton } from '../lib/email';

export interface WorkshopRecordingAvailableProps {
  registrantName: string;
  workshopTitle: string;
  workshopTopic?: string;
  recordingUrl?: string;
  vaultUrl: string;
}

export function renderWorkshopRecordingAvailable(props: WorkshopRecordingAvailableProps): string {
  const recordingSection = props.recordingUrl ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Recording Ready</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
          ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
          <p style="margin:16px 0 4px;font-size:14px;color:#cccccc;">
            The recording is now available to watch.
          </p>
        </td>
      </tr>
    </table>
    ${emailButton('Watch Recording', props.recordingUrl)}
  ` : '';

  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      The recording for <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now available!
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      Whether you attended live or missed it, you can now watch the full session at your convenience.
    </p>

    ${recordingSection || emailButton('View in Vault', props.vaultUrl)}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      Happy building!<br/>— Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
