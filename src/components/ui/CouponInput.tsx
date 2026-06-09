import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

export interface CouponResult {
  valid: boolean;
  code?: string;
  discountType?: string;
  value?: number;
  description?: string;
  error?: string;
  assignedToCreator?: string;
  minPurchaseAmount?: number;
}

interface CouponInputProps {
  onValidated: (coupon: CouponResult | null) => void;
  disabled?: boolean;
  initialCoupon?: CouponResult | null;
  productPrice?: number;
}

export function CouponInput({ onValidated, disabled, initialCoupon, productPrice }: CouponInputProps) {
  const [code, setCode] = useState(initialCoupon?.code || '');
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>(
    initialCoupon?.valid ? 'valid' : 'idle'
  );
  const [message, setMessage] = useState(
    initialCoupon?.valid && initialCoupon?.code
      ? `${initialCoupon.code} — ${
          initialCoupon.discountType === 'percentage'
            ? `${initialCoupon.value}% OFF`
            : `${formatCurrency(initialCoupon.value || 0)} OFF`
        }`
      : ''
  );
  const [validatedData, setValidatedData] = useState<CouponResult | null>(
    initialCoupon?.valid ? initialCoupon : null
  );

  useEffect(() => {
    if (initialCoupon?.valid) {
      setCode(initialCoupon.code || '');
      setStatus('valid');
      setValidatedData(initialCoupon);
      setMessage(
        `${initialCoupon.code} — ${
          initialCoupon.discountType === 'percentage'
            ? `${initialCoupon.value}% OFF`
            : `${formatCurrency(initialCoupon.value || 0)} OFF`
        }`
      );
    } else if (!initialCoupon) {
      setCode('');
      setStatus('idle');
      setMessage('');
      setValidatedData(null);
    }
  }, [initialCoupon]);

  const validate = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setStatus('validating');
    setMessage('');

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, productPrice }),
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

  if (status === 'valid' && validatedData) {
    return (
      <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-emerald-300 text-sm font-semibold truncate">
              {validatedData.code}
            </div>
            <div className="text-emerald-400/70 text-xs">
              {validatedData.discountType === 'percentage'
                ? `${validatedData.value}% OFF`
                : `${formatCurrency(validatedData.value || 0)} OFF`
              }
              {validatedData.description ? ` — ${validatedData.description}` : ''}
            </div>
          </div>
        </div>
        <button
          onClick={handleClear}
          disabled={disabled}
          className="p-2 hover:bg-emerald-500/15 rounded-lg transition-colors text-emerald-400/60 hover:text-emerald-300 disabled:opacity-50 shrink-0"
          type="button"
          title="Remove coupon"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

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
            onValidated(null);
          }}
          placeholder="Enter coupon code"
          disabled={isDisabled}
          className={`flex-1 px-3.5 py-2.5 bg-[#1a1a2e] ${borderColor} ${textColor} text-sm uppercase rounded-lg outline-none transition-colors placeholder:text-white/20 disabled:opacity-50`}
        />

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
