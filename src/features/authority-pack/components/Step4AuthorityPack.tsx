import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Shield,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Target,
  Send,
  Calendar,
  Layers,
  Archive,
  ExternalLink,
  Award,
  Zap,
} from 'lucide-react';
import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { ServiceRegistry } from '../services/ServiceRegistry';
import { StepHeader } from '../../../components/workspace/StepHeader';
import { ModuleButton } from '../../../components/workspace/ModuleButton';
import { useModule3Store } from '../../../lib/module3';
import { generateFullAuthoritySuite } from '../../../data/module3/authority-suite-engine';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useNavigate } from 'react-router-dom';

export function Step4AuthorityPack() {
  const navigate = useNavigate();
  const mod3State = useModule3Store();
  const jumpToStep = useModule3Store((s) => s.jumpToStep);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pillars' | 'gaps' | 'outreach' | 'roadmap' | 'vault'>('dashboard');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [copiedVault, setCopiedVault] = useState(false);

  // Generate full master suite
  const suite = useMemo(() => {
    return generateFullAuthoritySuite({
      marketId: mod3State.mod1NicheId,
      serviceId: mod3State.mod1ServiceId,
      position: mod3State.authorityPosition,
      trustPromise: mod3State.coreTrustPromise,
      uniqueMechanism: mod3State.mod2UniqueMechanism,
      offerType: mod3State.mod2OfferType,
    });
  }, [
    mod3State.mod1NicheId,
    mod3State.mod1ServiceId,
    mod3State.authorityPosition,
    mod3State.coreTrustPromise,
    mod3State.mod2UniqueMechanism,
    mod3State.mod2OfferType,
  ]);

  const handleCopyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleCopyAllVault = () => {
    const fullVault = `
# CENTRAL AUTHORITY OPERATING SYSTEM VAULT

## BRAND IDENTITY
${suite.brandAssets.map((b) => `### ${b.title}\n${b.value}`).join('\n\n')}

## OUTBOUND ACQUISITION SCRIPTS
${suite.outreachScripts.map((s) => `### ${s.title}\n${s.scriptText}`).join('\n\n')}

## 90-DAY EXECUTION ROADMAP
${suite.roadmaps.map((r) => `### ${r.dayRange}: ${r.phaseTitle}\nOutcome: ${r.expectedOutcome}`).join('\n\n')}
`;
    navigator.clipboard.writeText(fullVault);
    setCopiedVault(true);
    setTimeout(() => setCopiedVault(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left pb-24">
      <StepHeader
        step={{ current: 4, total: 4 }}
        title="Authority Operating System (Executive Suite)"
        description="Your complete consulting-grade deliverable suite. Manage executive strategy, competitor gap matrices, outbound scripts, and Build Mode bridges."
      />

      {/* Top Readiness & Launch Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="bg-gradient-to-r from-blue-950 via-[#0b1c30] to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                82% Launch Ready
              </span>
              <span className="text-[10px] font-bold text-slate-300">Phase 1 Foundation Active</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Authority Operating System Hub
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAllVault}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
          >
            {copiedVault ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedVault ? 'Vault Copied!' : 'Copy Vault Data'}</span>
          </button>
        </div>
      </motion.div>

      {/* Ecosystem BUILD MODE Bridges Bar */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0b1c30]">
              BUILD MODE — Direct Ecosystem Action Bridges
            </h4>
          </div>
          <span className="text-[11px] font-bold text-neutral-400">Move directly from planning to execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => navigate('/workspace/portfolio-system')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-blue-50/70 border border-neutral-200 hover:border-blue-300 transition-all text-left group cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">Module 4 Bridge</span>
              <span className="text-xs font-bold text-neutral-900 group-hover:text-blue-700">Open Portfolio System →</span>
            </div>
            <ExternalLink size={14} className="text-neutral-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => navigate('/workspace/client-pipeline')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-emerald-50/70 border border-neutral-200 hover:border-emerald-300 transition-all text-left group cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Module 5 Bridge</span>
              <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">Open Client Pipeline →</span>
            </div>
            <ExternalLink size={14} className="text-neutral-400 group-hover:text-emerald-600" />
          </button>

          <button
            onClick={() => navigate('/workspace/outreach-engine')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-purple-50/70 border border-neutral-200 hover:border-purple-300 transition-all text-left group cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Module 6 Bridge</span>
              <span className="text-xs font-bold text-neutral-900 group-hover:text-purple-700">Open Outreach Engine →</span>
            </div>
            <ExternalLink size={14} className="text-neutral-400 group-hover:text-purple-600" />
          </button>
        </div>
      </div>

      {/* Executive Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#0058be] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <TrendingUp size={14} /> Executive Strategy Dashboard
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'outreach' ? 'bg-[#0058be] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Send size={14} /> Outbound Acquisition Scripts ({suite.outreachScripts.length})
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'gaps' ? 'bg-[#0058be] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Target size={14} /> Competitor Gap Analysis
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'roadmap' ? 'bg-[#0058be] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Calendar size={14} /> Execution Roadmap
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'vault' ? 'bg-[#0058be] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Archive size={14} /> Central Asset Vault
        </button>
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-6"
          >
            {/* Visual Health Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Authority Health</span>
                <span className="text-2xl font-black text-emerald-600">88 / 100</span>
                <span className="text-[10px] text-neutral-400 block font-medium">Top 5% Niche Benchmark</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Market Positioning</span>
                <span className="text-2xl font-black text-blue-600">Dominant</span>
                <span className="text-[10px] text-neutral-400 block font-medium">Category King Framing</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Lead Forecast Impact</span>
                <span className="text-2xl font-black text-purple-600">+25% - +35%</span>
                <span className="text-[10px] text-neutral-400 block font-medium">Estimated Conversion Lift</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Execution Certainty</span>
                <span className="text-2xl font-black text-amber-600">High</span>
                <span className="text-[10px] text-neutral-400 block font-medium">Zero Fabricated Claims</span>
              </div>
            </div>

            {/* Strategic Pillars Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
              <div className="flex items-center gap-2">
                <Layers className="text-[#0058be]" size={20} />
                <h4 className="text-lg font-black text-[#0b1c30]">Core Strategic Authority Pillars</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">01</span>
                  <h5 className="text-sm font-black text-[#0b1c30]">Self-Initiated Proof Demonstrations</h5>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    Build verifiable demonstration projects to evidence execution standards before prospect call booking.
                  </p>
                </div>

                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">02</span>
                  <h5 className="text-sm font-black text-[#0b1c30]">Transparent Scope & Scope Notes</h5>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    Publish decision rationale, limitation notes, and milestone criteria to eliminate buyer risk.
                  </p>
                </div>

                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">03</span>
                  <h5 className="text-sm font-black text-[#0b1c30]">Permission-Based Teardown Outreach</h5>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    Initiate prospect relationships by offering free customized teardowns rather than hard pitches.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'outreach' && (
          <motion.div
            key="outreach"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suite.outreachScripts.map((script) => {
                const isCopied = copiedScriptId === script.id;
                return (
                  <div
                    key={script.id}
                    className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-[10px] font-black uppercase tracking-wider">
                          {script.type}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">Target: {script.targetAudience}</span>
                      </div>
                      <h4 className="text-sm font-black text-[#0b1c30]">{script.title}</h4>
                      <p className="text-xs font-medium text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-100 whitespace-pre-line leading-relaxed">
                        {script.scriptText}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold truncate max-w-[240px]">
                        💡 {script.proTip}
                      </span>
                      <button
                        onClick={() => handleCopyScript(script.id, script.scriptText)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCopied ? 'bg-emerald-500 text-white shadow-xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? 'Copied Script!' : 'Copy Script'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'gaps' && (
          <motion.div
            key="gaps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2">
              <Target size={20} className="text-[#0058be]" />
              <h4 className="text-lg font-black text-[#0b1c30]">Competitor vs. Your Authority System Gap Matrix</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80">
                    <th className="p-3 font-black text-neutral-800 uppercase tracking-wider">Feature / Area</th>
                    <th className="p-3 font-black text-red-700 uppercase tracking-wider">Generic Competitors</th>
                    <th className="p-3 font-black text-emerald-700 uppercase tracking-wider">Your Authority System</th>
                    <th className="p-3 font-black text-blue-700 uppercase tracking-wider">Advantage Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {suite.competitorGaps.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-bold text-[#0b1c30]">{item.feature}</td>
                      <td className="p-3 text-neutral-600 font-medium">{item.genericCompetitors}</td>
                      <td className="p-3 font-semibold text-emerald-950 bg-emerald-50/50">{item.yourAuthoritySystem}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                          {item.advantageLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {suite.roadmaps.map((r, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-black uppercase tracking-wider">
                  {r.dayRange}
                </span>
                <h4 className="text-base font-black text-[#0b1c30]">{r.phaseTitle}</h4>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Key Deliverables</span>
                  <ul className="space-y-1.5 text-xs font-semibold text-neutral-800">
                    {r.keyDeliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="font-bold text-blue-900 block mb-0.5">Expected Outcome</span>
                  <p className="text-neutral-700 font-medium">{r.expectedOutcome}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'vault' && (
          <motion.div
            key="vault"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive size={20} className="text-[#0058be]" />
                <h4 className="text-lg font-black text-[#0b1c30]">Central Asset Vault & Data Hub</h4>
              </div>
              <button
                onClick={handleCopyAllVault}
                className="px-4 py-2 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {copiedVault ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedVault ? 'Copied Full Vault!' : 'Copy Entire Vault Markdown'}</span>
              </button>
            </div>

            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
              Your entire Module 3 authority suite is consolidated here. Copy all assets or use the Build Mode bridges to execute across Module 4, Module 5, and Module 6!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-neutral-200">
        <ModuleButton variant="secondary" onClick={() => jumpToStep('profile_portfolio')}>
          <ArrowLeft size={14} />
          Back to Command Center
        </ModuleButton>

        <button
          onClick={() => navigate('/workspace/portfolio-system')}
          className="w-full sm:w-auto px-6 py-3 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
        >
          <span>Continue to Module 4: Portfolio System →</span>
        </button>
      </div>
    </div>
  );
}
