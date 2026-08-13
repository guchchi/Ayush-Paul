import React from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Shield, Sparkles, Zap, CheckCircle2, AlertTriangle, Layers, ArrowRight, Award } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

export const AuthoritySnapshotSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authorityPosition,
    coreTrustPromise,
    mod2OfferType,
    mod2UniqueMechanism,
    proofAssets,
    isUpstreamStale,
  } = useModule3Store();

  const acceptedProofCount = proofAssets.filter((a) => a.isAccepted).length;
  const totalProofCount = proofAssets.length;

  const capitalize = (s: string | null) => {
    if (!s) return 'Not Configured';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const getPositionBadge = (pos: string | null) => {
    switch (pos?.toLowerCase()) {
      case 'builder': return { title: 'THE BUILDER', desc: 'Proves authority via live working systems & demonstrable execution.', color: 'from-blue-600 to-indigo-600', text: 'text-blue-400' };
      case 'auditor': return { title: 'THE AUDITOR', desc: 'Proves authority via rigorous tear-downs & diagnostic teardowns.', color: 'from-amber-500 to-orange-600', text: 'text-amber-400' };
      case 'deconstructor': return { title: 'THE DECONSTRUCTOR', desc: 'Proves authority by breaking down complex industry frameworks.', color: 'from-purple-600 to-pink-600', text: 'text-purple-400' };
      case 'practitioner': return { title: 'THE PRACTITIONER', desc: 'Proves authority through deep real-world client case experience.', color: 'from-emerald-600 to-teal-600', text: 'text-emerald-400' };
      default: return { title: pos?.toUpperCase() || 'CUSTOM POSITION', desc: 'Specialized authority positioning strategy.', color: 'from-indigo-600 to-violet-600', text: 'text-indigo-400' };
    }
  };

  const badgeInfo = getPositionBadge(authorityPosition);

  return (
    <div className="w-full space-y-6">
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Phase 3 Strategic Baseline
              </span>
              <span className="text-xs text-slate-400 font-medium">Upstream Fingerprint Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Section 1 — Authority Command Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              This is your verified foundation engineered in Modules 1 & 2. Your Profile, Portfolio, and Content Strategy below will directly anchor to these parameters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score</span>
              <span className="text-xl font-black text-emerald-400">94 / 100</span>
            </div>
          </div>
        </div>
      </div>

      {isUpstreamStale && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-amber-200">Upstream Context Modified</h4>
            <p className="text-xs text-amber-300/80">
              You updated Module 1 or Module 2 context recently. Click below to refresh your authority strategy blueprint.
            </p>
          </div>
        </div>
      )}

      {/* 4 Dashboard Command Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Authority Archetype Position */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl text-white flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-indigo-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Shield size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Archetype Stance</span>
                <h3 className="text-base font-black text-white">{badgeInfo.title}</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              Active Strategy
            </span>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 space-y-1">
            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
              {badgeInfo.desc}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={14} /> High-Ticket Market Fit
            </span>
            <span className="font-mono text-[11px]">Pos: {capitalize(authorityPosition)}</span>
          </div>
        </motion.div>

        {/* Card 2: Core Trust Promise */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.05 }}
          className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl text-white flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Award size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Primary Trust Promise</span>
                <h3 className="text-base font-black text-white">Client Risk Elimination</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Verified
            </span>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80">
            <p className="text-xs text-emerald-200 font-serif italic leading-relaxed">
              "{coreTrustPromise || 'Engineering verifiable authority systems that eliminate buyer hesitation before call booking.'}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span className="text-emerald-400 font-bold text-[11px]">100% Non-Fabricated Claims</span>
            <span className="text-neutral-400 text-[11px]">High Conversion Impact</span>
          </div>
        </motion.div>

        {/* Card 3: Offer Context & Unique Mechanism */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
          className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl text-white flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Zap size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Mechanism & Offer Framing</span>
                <h3 className="text-base font-black text-white">Value Delivery Engine</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              Module 2 Bridge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800/80 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Offer Type</span>
              <span className="text-xs font-bold text-white block capitalize">{mod2OfferType || 'One-Time System Build'}</span>
            </div>
            <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800/80 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Unique Mechanism</span>
              <span className="text-xs font-bold text-purple-300 block truncate">{mod2UniqueMechanism || 'Narrative Arc Engineering'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span className="text-purple-400 font-bold text-[11px]">Systemized Deliverable</span>
            <span className="text-neutral-400 text-[11px]">High-Ticket Retainer</span>
          </div>
        </motion.div>

        {/* Card 4: Proof Assets Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.15 }}
          className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl text-white flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Layers size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Proof Inventory Status</span>
                <h3 className="text-base font-black text-white">Demonstrable Assets</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              {acceptedProofCount > 0 ? 'Ready' : 'Pending Assets'}
            </span>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400">{acceptedProofCount}</span>
              <span className="text-xs text-neutral-400 font-medium ml-2">Accepted Proof Assets Ready</span>
            </div>
            <div className="h-2.5 w-24 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(25, (acceptedProofCount / Math.max(1, totalProofCount)) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span className="text-amber-400 font-bold text-[11px]">Section 5 Placement Ready</span>
            <span className="text-neutral-400 text-[11px]">{totalProofCount} Total Inventory Assets</span>
          </div>
        </motion.div>
      </div>

      {/* Continue Action Bar */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2.5 cursor-pointer group"
        >
          <span>Confirm Foundation & Unlock Profile Studio</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
});

AuthoritySnapshotSection.displayName = 'AuthoritySnapshotSection';

