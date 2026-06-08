import { useEffect, useRef, useState } from 'react';
import { auth } from '../../firebase';

interface Props {
  enrollments: { updatedAt?: { toDate?: () => Date } | Date; courseId: string; title?: string }[];
}

export function VaultStreak({ enrollments }: Props) {
  const [rewards, setRewards] = useState<string[]>([]);
  const checkedRef = useRef<Set<number>>(new Set());

  const computeStreak = (): { days: number; recent: string | null } => {
    if (!enrollments.length) return { days: 0, recent: null };

    const recentDates = enrollments
      .map((e) => {
        if (!e.updatedAt) return null;
        const d = 'toDate' in e.updatedAt && typeof e.updatedAt.toDate === 'function'
          ? e.updatedAt.toDate()
          : e.updatedAt instanceof Date
            ? e.updatedAt
            : new Date(e.updatedAt as string);
        return d;
      })
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    if (!recentDates.length) return { days: 0, recent: null };

    const latest = recentDates[0];
    const now = new Date();
    const diffHours = (now.getTime() - latest.getTime()) / (1000 * 60 * 60);

    if (diffHours > 48) return { days: 0, recent: latest.toLocaleDateString() };

    let streak = 1;
    for (let i = 1; i < recentDates.length; i++) {
      const diff = (recentDates[i - 1].getTime() - recentDates[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 2) streak++;
      else break;
    }

    return { days: streak, recent: latest.toLocaleDateString() };
  };

  const { days, recent } = computeStreak();

  useEffect(() => {
    const milestoneDays = [3, 7, 14];
    if (milestoneDays.includes(days) && !checkedRef.current.has(days)) {
      checkedRef.current.add(days);
      const user = auth.currentUser;
      if (!user) return;
      fetch('/api/generate-streak-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, currentStreakDays: days }),
      }).then(async (res) => {
        const data = await res.json();
        if (data.rewardsAwarded?.length > 0) {
          setRewards(data.rewardsAwarded.map((r: any) => r.rewardValue));
        }
      }).catch((err) => console.error('[Streak] Report error:', err));
    }
  }, [days]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid #2a2a4a',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      position: 'relative',
    }}>
      {rewards.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '16px',
          background: '#d1f34d',
          color: '#000',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
        }}>
          {rewards.join(', ')} unlocked!
        </div>
      )}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: days > 0
          ? 'conic-gradient(#d1f34d 0deg, #d1f34d ' + (days % 7) * 51.4 + 'deg, #2a2a4a ' + (days % 7) * 51.4 + 'deg)'
          : '#2a2a4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          background: '#0a0a1a',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 700,
          color: days > 0 ? '#d1f34d' : '#555',
        }}>
          {days}
        </span>
      </div>
      <div>
        <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#e0e0e0' }}>
          {days > 0 ? `${days}-day learning streak` : 'No active streak'}
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
          {days > 0
            ? `Last activity: ${recent}`
            : recent
              ? `Last active: ${recent} — pick up where you left off`
              : 'Enroll in a course to start your streak'}
        </p>
        {days > 0 && (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>
            Next milestone: {days < 3 ? '3' : days < 7 ? '7' : '14'} days
          </p>
        )}
      </div>
    </div>
  );
}
