import { useState } from 'react';

interface Props {
  referralCode: string | null;
}

export function VaultReferralShare({ referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  if (!referralCode) return null;

  const shareUrl = `${window.location.origin}?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Ayush Paul Lab',
        text: 'Join me on Ayush Paul Lab — tools and blueprints to build your next project.',
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid #2a2a4a',
      borderRadius: '12px',
      padding: '24px',
    }}>
      <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#d1f34d' }}>
        Refer & Earn
      </h3>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
        Share your referral link. When a friend makes their first purchase, you both get a discount.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          readOnly
          value={shareUrl}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: '#0a0a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#888',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '10px',
            background: copied ? '#4ade80' : '#d1f34d',
            color: copied ? '#fff' : '#0a0a1a',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        {navigator.share && (
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              padding: '10px',
              background: '#2a2a4a',
              color: '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Share
          </button>
        )}
      </div>

      <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#666' }}>
        Reward: 15% off your next purchase when a referral converts
      </p>
    </div>
  );
}
