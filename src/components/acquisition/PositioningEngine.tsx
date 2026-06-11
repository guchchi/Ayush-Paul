import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PositioningEngineProps {
  track: string;
}

export function PositioningEngine({ track }: PositioningEngineProps) {
  const [who, setWho] = useState('');
  const [result, setResult] = useState('');
  const [method, setMethod] = useState('');

  const positioningStatement = useMemo(() => {
    if (!who || !result || !method) return null;
    return `I help ${who} achieve ${result} by ${method}.`;
  }, [who, result, method]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-brand-primary" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Positioning Engine
        </p>
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        Fill in the three inputs below. Your positioning statement updates in real time.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* WHO input */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
            Who
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-brand-primary/50" />
            <textarea
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder={track === 'editor' ? 'health coaches who post daily Reels' : track === 'developer' ? 'SaaS founders launching a product' : 'coaches building their first brand'}
              className="w-full min-h-[80px] bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-5 pr-3 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-brand-primary/30 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>
        </div>

        {/* RESULT input */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
            Result
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-emerald-400/50" />
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="consistent engagement and more followers"
              className="w-full min-h-[80px] bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-5 pr-3 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-emerald-400/30 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>
        </div>

        {/* METHOD input */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
            Method
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-amber-400/50" />
            <textarea
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="editing raw footage into scroll-stopping Reels"
              className="w-full min-h-[80px] bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-5 pr-3 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-amber-400/30 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Live output */}
      <div className={cn(
        'rounded-2xl border p-5 transition-all duration-300',
        positioningStatement
          ? 'border-brand-primary/20 bg-brand-primary/[0.03]'
          : 'border-white/[0.06] bg-white/[0.02]',
      )}>
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={12} className="text-brand-primary" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
            Live Positioning Statement
          </p>
        </div>

        {positioningStatement ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            key={positioningStatement}
            className="text-sm text-white/80 leading-relaxed font-medium"
          >
            {positioningStatement}
          </motion.p>
        ) : (
          <p className="text-xs text-white/20">
            Complete all three fields above to generate your positioning statement...
          </p>
        )}
      </div>
    </div>
  );
}
