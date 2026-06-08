interface Props {
  ownedTier: string | null;
  ownedCount: number;
  totalCount: number;
}

const TIER_LABELS: Record<string, { label: string; price: string }> = {
  free: { label: 'Free', price: '₹0' },
  starter: { label: 'Starter', price: '₹99' },
  pro: { label: 'Pro', price: '₹499' },
  premium: { label: 'Premium', price: '₹999' },
};

const TIER_ORDER = ['free', 'starter', 'pro', 'premium'] as const;

export function VaultNextUnlock({ ownedTier, ownedCount, totalCount }: Props) {
  const currentIndex = TIER_ORDER.indexOf((ownedTier as typeof TIER_ORDER[number]) || 'free');
  const maxTier = ownedTier === 'premium';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid #2a2a4a',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>
          {maxTier ? 'Top tier unlocked' : 'Next unlock available'}
        </p>
        <p style={{ margin: 0, fontSize: '15px', color: '#e0e0e0', fontWeight: 600 }}>
          {maxTier
            ? 'You have access to everything'
            : `${TIER_LABELS[TIER_ORDER[currentIndex + 1]]?.label || 'Pro'} — ${TIER_LABELS[TIER_ORDER[currentIndex + 1]]?.price || '₹499'}`}
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>
          {ownedCount} / {totalCount} owned
        </p>
        {!maxTier && (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#d1f34d',
            color: '#0a0a1a',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
          }}>
            Upgrade
          </span>
        )}
      </div>
    </div>
  );
}
