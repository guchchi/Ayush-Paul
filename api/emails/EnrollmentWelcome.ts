import { emailLayout, emailButton } from '../lib/email';

export interface EnrollmentWelcomeProps {
  userName: string;
  courseName: string;
  courseUrl: string;
  modulesCount: number;
  lessonsCount: number;
  isFree: boolean;
}

export function renderEnrollmentWelcome(props: EnrollmentWelcomeProps): string {
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.userName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      Welcome to <strong style="color:#d1f34d;">${props.courseName}</strong>.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
      You're now enrolled and ready to start learning. This course includes <strong style="color:#ffffff;">${props.modulesCount} modules</strong> and <strong style="color:#ffffff;">${props.lessonsCount} lessons</strong> designed to take you from foundation to production.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Course Roadmap</p>
          <p style="margin:0 0 4px;font-size:13px;color:#cccccc;line-height:1.6;">
            ${props.modulesCount} Modules · ${props.lessonsCount} Lessons
          </p>
          <p style="margin:0;font-size:12px;color:#888888;">
            ${props.isFree ? 'This is a free course — no payment needed.' : 'Premium course — yours forever once enrolled.'}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;">
      <strong style="color:#cccccc;">Suggested approach:</strong> Complete one module per session. Each lesson builds on the last. Take notes and implement alongside the content.
    </p>

    ${emailButton('Start Learning', props.courseUrl)}

    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      Your progress is saved automatically. Pick up where you left off anytime from your <a href="https://ayushpaul.in/vault" style="color:#00C2FF;text-decoration:underline;">Vault</a>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      — Ayush Paul
    </p>
  `;

  return emailLayout(content);
}
