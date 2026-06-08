import { useState } from 'react';

interface CouponResult {
  valid: boolean;
  code?: string;
  discountType?: string;
  value?: number;
  description?: string;
  error?: string;
}

interface CouponInputProps {
  onValidated: (coupon: CouponResult | null) => void;
  disabled?: boolean;
}

export function CouponInput({ onValidated, disabled }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  const validate = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await res.json();

      if (data.valid) {
        setStatus('valid');
        const label = data.discountType === 'percentage' ? `${data.value}% off` : `₹${data.value} off`;
        setMessage(`${data.code} — ${label}`);
        onValidated(data);
      } else {
        setStatus('invalid');
        setMessage(data.error || 'Invalid code');
        onValidated(null);
      }
    } catch {
      setStatus('invalid');
      setMessage('Failed to validate');
      onValidated(null);
    }
  };

  const handleClear = () => {
    setCode('');
    setStatus('idle');
    setMessage('');
    onValidated(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus('idle'); setMessage(''); }}
          placeholder="Enter coupon code"
          disabled={disabled}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: '#1a1a2e',
            border: status === 'valid' ? '1px solid #4ade80' : status === 'invalid' ? '1px solid #f87171' : '1px solid #2a2a4a',
            borderRadius: '8px',
            color: '#e0e0e0',
            fontSize: '14px',
            textTransform: 'uppercase',
            outline: 'none',
          }}
        />
        {status === 'idle' || status === 'invalid' ? (
          <button
            onClick={validate}
            disabled={disabled || !code.trim()}
            style={{
              padding: '10px 16px',
              background: '#d1f34d',
              color: '#0a0a1a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: disabled || !code.trim() ? 'not-allowed' : 'pointer',
              opacity: disabled || !code.trim() ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            Apply
          </button>
        ) : status === 'loading' ? (
          <span style={{ color: '#888', fontSize: '14px', padding: '0 8px' }}>...</span>
        ) : (
          <button
            onClick={handleClear}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Remove
          </button>
        )}
      </div>
      {message && (
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: status === 'valid' ? '#4ade80' : '#f87171',
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
