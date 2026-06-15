import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, ArrowRight, Eye } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, getAudienceLabel, ANGLES_BY_CATEGORY, CREDIBILITY_LEVELS, PROMISE_SUGGESTIONS, generatePositionStatement } from '../../lib/blueprint-content';

export function AuthorityPositionStep() {
  const authorityAngle = useAuthoritySystemStore((s) => s.authorityAngle);
  const credibilityLevel = useAuthoritySystemStore((s) => s.credibilityLevel);
  const trustPromise = useAuthoritySystemStore((s) => s.trustPromise);
  const authorityPosition = useAuthoritySystemStore((s) => s.authorityPosition);
  const market = useAuthoritySystemStore((s) => s.phase2Market);
  const niche = useAuthoritySystemStore((s) => s.phase2Niche);
  const service = useAuthoritySystemStore((s) => s.phase2Service);
  const uniqueMechanism = useAuthoritySystemStore((s) => s.phase2UniqueMechanism);
  const setAuthorityAngle = useAuthoritySystemStore((s) => s.setAuthorityAngle);
  const setCredibilityLevel = useAuthoritySystemStore((s) => s.setCredibilityLevel);
  const setTrustPromise = useAuthoritySystemStore((s) => s.setTrustPromise);
  const setAuthorityPosition = useAuthoritySystemStore((s) => s.setAuthorityPosition);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('authority_position');

  const cat = getServiceCategory(service);
  const angles = ANGLES_BY_CATEGORY[cat];

  const isValid = authorityAngle.trim().length > 0;

  const generated = useMemo(
    () => generatePositionStatement(authorityAngle, service, niche ?? '', market ?? '', uniqueMechanism),
    [authorityAngle, service, niche, market, uniqueMechanism],
  );

  const handleContinue = () => {
    if (!isValid) return;
    if (!authorityPosition) {
      setAuthorityPosition(generated);
    }
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Authority Position</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Define how you want to be perceived. Choose an authority angle that feels true to your current level.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Shield size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Choose or write your authority angle</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            This is how you position yourself. Pick one that matches your current skill level — you can grow into it.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Authority Angle</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {angles.map((a) => (
            <button
              key={a.label}
              onClick={() => setAuthorityAngle(a.label)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                authorityAngle === a.label
                  ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
              )}
            >
              <p className={cn('text-xs font-semibold', authorityAngle === a.label ? 'text-white' : 'text-white/70')}>{a.label}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">{a.desc}</p>
              {authorityAngle === a.label && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] text-brand-primary font-medium">
                  <Check size={8} /> Selected
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={authorityAngle}
          onChange={(e) => setAuthorityAngle(e.target.value)}
          placeholder="Or type your own authority angle..."
          className="w-full h-9 px-3 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 mt-1"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Credibility Level</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CREDIBILITY_LEVELS.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => setCredibilityLevel(lvl.value)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                credibilityLevel === lvl.value
                  ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
              )}
            >
              <p className={cn('text-xs font-semibold', credibilityLevel === lvl.value ? 'text-white' : 'text-white/70')}>{lvl.label}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">{lvl.desc}</p>
              {credibilityLevel === lvl.value && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] text-brand-primary font-medium">
                  <Check size={8} /> Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Trust Promise</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PROMISE_SUGGESTIONS.map((chip) => {
            const active = trustPromise.toLowerCase().includes(chip.toLowerCase());
            return (
              <button
                key={chip}
                onClick={() => setTrustPromise(active ? trustPromise.replace(new RegExp(chip, 'i'), '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') : trustPromise ? `${trustPromise}, ${chip}` : chip)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[9px] font-medium transition-all cursor-pointer border',
                  active ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-primary' : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white/70',
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>
        <textarea
          value={trustPromise}
          onChange={(e) => setTrustPromise(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder="e.g. delivering projects with clear scope, defined timelines, and transparent communication"
        />
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={12} className="text-brand-primary" />
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Live Preview</p>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          {authorityPosition || generated}
        </p>
        {!authorityPosition && (
          <p className="text-[9px] text-zinc-500 mt-2">
            This position statement auto-generates from your selections above.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Or Write Your Own</p>
        <textarea
          value={authorityPosition}
          onChange={(e) => setAuthorityPosition(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder="I help [target client] [achieve outcome] using [unique mechanism]..."
        />
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Authority position saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
            isValid
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          <ArrowRight size={14} />
          Continue to Proof Assets
        </motion.button>
      )}
    </div>
  );
}
