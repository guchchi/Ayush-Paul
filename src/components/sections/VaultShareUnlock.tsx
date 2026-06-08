import { useState } from 'react';
import { auth } from '../../firebase';

interface Props {
  productSlug: string;
  productTitle: string;
  unlockedResources: boolean;
  onUnlock: () => void;
}

export function VaultShareUnlock({ productSlug, productTitle, unlockedResources, onUnlock }: Props) {
  const [copied, setCopied] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const shareUrl = `${window.location.origin}/blueprints/${productSlug}`;

  const trackShare = async (shareTarget: string) => {
    const user = auth.currentUser;
    if (!user) return;
    setIsTracking(true);
    try {
      const token = await user.getIdToken();
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.uid, shareTarget }),
      });
    } catch (err) {
      console.error('[Share] Failed to track:', err);
    } finally {
      setIsTracking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: productTitle,
        text: `Check out "${productTitle}" on Ayush Paul Lab`,
        url: shareUrl,
      });
      await trackShare('other');
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      await trackShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    }
    onUnlock();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid #2a2a4a',
      borderRadius: '12px',
      padding: '24px',
    }}>
      <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#e0e0e0' }}>
        Share to Unlock
      </h4>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
        {unlockedResources
          ? 'Bonus resource unlocked! Check your Vault to access it.'
          : `Share "${productTitle}" with your network to unlock a bonus resource.`}
      </p>

      {!unlockedResources && (
        <button
          onClick={handleShare}
          disabled={isTracking}
          style={{
            width: '100%',
            padding: '12px',
            background: copied ? '#4ade80' : isTracking ? '#555' : '#2a2a4a',
            color: copied ? '#fff' : '#e0e0e0',
            border: '1px solid #333',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isTracking ? 'wait' : 'pointer',
          }}
        >
          {isTracking ? 'Tracking...' : copied ? 'Link Copied!' : 'Share Now'}
        </button>
      )}

      <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#555', fontStyle: 'italic' }}>
        Share 3 times to unlock bonus resources
      </p>
    </div>
  );
}
