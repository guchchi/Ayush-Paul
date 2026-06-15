import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, User, Plus, Trash2, Sparkles, Copy } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import { getServiceCategory, generateAuthorityProfile } from '../../lib/blueprint-content';

export function AuthorityProfileStep() {
  const rawProfile = useAuthoritySystemStore((s) => s.authorityProfile);
  const profile = rawProfile ?? { oneLinePositioning: '', shortBio: '', serviceDescription: '', trustBullets: [], ctaLine: '' };
  const setProfile = useAuthoritySystemStore((s) => s.setAuthorityProfile);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('authority_profile');
  const authorityAngle = useAuthoritySystemStore((s) => s.authorityAngle) ?? '';
  const authorityPosition = useAuthoritySystemStore((s) => s.authorityPosition) ?? '';
  const niche = useAuthoritySystemStore((s) => s.phase2Niche) ?? '';
  const market = useAuthoritySystemStore((s) => s.phase2Market) ?? '';
  const service = useAuthoritySystemStore((s) => s.phase2Service);
  const serviceLabel = useAuthoritySystemStore((s) => s.phase2ServiceLabel) ?? '';
  const trustBuilderChecklist = useAuthoritySystemStore((s) => s.trustBuilderChecklist) ?? [];
  const proofAssets = useAuthoritySystemStore((s) => s.proofAssets) ?? [];
  const [copied, setCopied] = useState(false);

  const isValid = profile.oneLinePositioning.trim().length > 0 && profile.shortBio.trim().length > 0;

  const update = (key: string, value: string | string[]) => {
    setProfile({ ...profile, [key]: value });
  };

  const addBullet = () => {
    setProfile({ ...profile, trustBullets: [...profile.trustBullets, ''] });
  };

  const updateBullet = (i: number, v: string) => {
    const bullets = [...profile.trustBullets];
    bullets[i] = v;
    setProfile({ ...profile, trustBullets: bullets });
  };

  const removeBullet = (i: number) => {
    setProfile({ ...profile, trustBullets: profile.trustBullets.filter((_, idx) => idx !== i) });
  };

  const cat = getServiceCategory(service);

  const generateProfile = () => {
    const trustB = trustBuilderChecklist.length > 0
      ? trustBuilderChecklist.slice(0, 5).map((i) => i.label)
      : [];
    const firstProof = proofAssets[0]?.title || proofAssets[0]?.type.replace(/_/g, ' ') || '';
    const result = generateAuthorityProfile(cat, authorityAngle, authorityPosition, niche, market, trustB, firstProof);
    setProfile(result);
  };

  const handleCopyProfile = useCallback(async () => {
    const text = `${profile.oneLinePositioning}\n\n${profile.shortBio}\n\n${profile.serviceDescription}\n\n${profile.trustBullets.filter(Boolean).map((b: string) => `- ${b}`).join('\n')}\n\n${profile.ctaLine}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [profile]);

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 7 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Authority Profile</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Create profile copy you can use on LinkedIn, portfolio, website, or outreach messages.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 shrink-0 mt-0.5">
          <User size={14} className="text-brand-primary" />
        </span>
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Authority Profile</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Consistent profile copy builds recognition and trust across platforms.
          </p>
        </div>
      </div>

      {!profile.oneLinePositioning && (
        <button
          onClick={generateProfile}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Authority Profile
        </button>
      )}

      <div className="space-y-4">
        <ProfileField
          label="One-Line Positioning"
          value={profile.oneLinePositioning}
          onChange={(v) => update('oneLinePositioning', v)}
          placeholder="e.g. I help startups launch fast, conversion-ready websites"
        />

        <ProfileField
          label="Short Bio"
          value={profile.shortBio}
          onChange={(v) => update('shortBio', v)}
          placeholder="2-3 sentences describing who you help and how"
          multiline
        />

        <ProfileField
          label="Service Description"
          value={profile.serviceDescription}
          onChange={(v) => update('serviceDescription', v)}
          placeholder="Brief description of your core service offering"
          multiline
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Trust Bullets</span>
            <button onClick={addBullet} className="flex items-center gap-1 text-[10px] text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
              <Plus size={10} /> Add bullet
            </button>
          </div>
          {profile.trustBullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={bullet}
                onChange={(e) => updateBullet(i, e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                placeholder="e.g. 5+ years of experience in..."
              />
              <button onClick={() => removeBullet(i)} className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        <ProfileField
          label="CTA Line"
          value={profile.ctaLine}
          onChange={(v) => update('ctaLine', v)}
          placeholder="e.g. Send me your current website for 3 improvement suggestions"
        />
      </div>

      {profile.oneLinePositioning && (
        <button
          onClick={handleCopyProfile}
          className="inline-flex items-center gap-2 px-5 h-10 rounded-lg text-[10px] font-bold uppercase tracking-[0.08em] bg-white/[0.03] border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-300 transition-all duration-200 cursor-pointer"
        >
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy Profile'}
        </button>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Authority profile saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className={`inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer ${
            isValid
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <ArrowRight size={14} />
          Generate Authority Report
        </motion.button>
      )}
    </div>
  );
}

function ProfileField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const inputClass = "w-full px-3 py-2 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300";
  return (
    <div className="space-y-1">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} h-9`} placeholder={placeholder} />
      )}
    </div>
  );
}
