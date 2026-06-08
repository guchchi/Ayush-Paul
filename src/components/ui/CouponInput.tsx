import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

export interface CouponResult {
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
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');
  const [validatedData, setValidatedData] = useState<CouponResult | null>(null);

  const validate = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setStatus('validating');
    setMessage('');

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data: CouponResult = await res.json();

      if (data.valid) {
        setStatus('valid');
        setValidatedData(data);
        const label = data.discountType === 'percentage'
          ? `${data.value}% OFF`
          : `${formatCurrency(data.value || 0)} OFF`;
        setMessage(`${data.code} — ${label}`);
        onValidated(data);
      } else {
        setStatus('invalid');
        setValidatedData(null);
        setMessage(data.error || 'Invalid coupon code');
        onValidated(null);
      }
    } catch {
      setStatus('invalid');
      setValidatedData(null);
      setMessage('Failed to validate. Check your connection.');
      onValidated(null);
    }
  };

  const handleClear = () => {
    setCode('');
    setStatus('idle');
    setMessage('');
    setValidatedData(null);
    onValidated(null);
  };

  const isDisabled = disabled || status === 'validating';

  const borderColor = status === 'valid'
    ? 'border-emerald-500'
    : status === 'invalid'
      ? 'border-red-500'
      : 'border-white/10';

  const textColor = status === 'valid'
    ? 'text-emerald-400'
    : 'text-white/80';

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-stretch">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setStatus('idle');
            setMessage('');
            setValidatedData(null);
          }}
          placeholder="Enter coupon code"
          disabled={isDisabled}
          className={`flex-1 px-3.5 py-2.5 bg-[#1a1a2e] ${borderColor} ${textColor} text-sm uppercase rounded-lg outline-none transition-colors placeholder:text-white/20 disabled:opacity-50`}
        />

        {status === 'valid' ? (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 bg-white/5 text-white/50 border border-white/10 rounded-lg text-sm hover:bg-white/10 hover:text-white/70 transition-colors flex items-center gap-1.5"
            type="button"
          >
            <X size={14} />
            Remove
          </button>
        ) : (
          <button
            onClick={validate}
            disabled={isDisabled || !code.trim()}
            className="px-4 py-2.5 bg-[#d1f34d] text-[#0a0a1a] rounded-lg text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            type="button"
          >
            {status === 'validating' ? (
              <><Loader2 size={14} className="animate-spin" /> Validating</>
            ) : (
              'Apply'
            )}
          </button>
        )}
      </div>

      {status === 'valid' && validatedData && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-start gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-emerald-400 font-semibold text-sm">
              Coupon {validatedData.code} applied
            </div>
            <div className="text-emerald-300/80 text-xs mt-0.5">
              {validatedData.discountType === 'percentage'
                ? `${validatedData.value}% discount`
                : `${formatCurrency(validatedData.value || 0)} discount`
              }
              {validatedData.description ? ` — ${validatedData.description}` : ''}
            </div>
          </div>
        </div>
      )}

      {status === 'invalid' && message && (
        <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-2.5">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <span className="text-red-300 text-sm font-medium">{message}</span>
        </div>
      )}
    </div>
  );
}
