import { emailLayout, emailButton } from '../lib/email';

export interface PurchaseConfirmationProps {
  customerName: string;
  productName: string;
  amount: string;
  vaultUrl: string;
  downloadUrl?: string;
}

export function renderPurchaseConfirmation(props: PurchaseConfirmationProps): string {
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.customerName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      Your payment of <strong style="color:#ffffff;">${props.amount}</strong> has been successfully processed.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      <strong style="color:#d1f34d;">${props.productName}</strong> is now permanently unlocked in your digital vault.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">What you unlocked</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#d1f34d;">${props.productName}</p>
        </td>
      </tr>
    </table>

    ${emailButton('Open Your Vault', props.vaultUrl)}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      <strong style="color:#888888;">Next step:</strong> Access your files, watch any included video walkthroughs, or start implementing immediately. Everything lives in your vault forever.
    </p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      Reply to this email if you have any questions.
      <br/>— Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
