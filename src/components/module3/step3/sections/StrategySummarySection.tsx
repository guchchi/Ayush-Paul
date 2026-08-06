import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Award, Shield, CheckCircle2, Target, BookOpen, Layout, ArrowRight } from 'lucide-react';
import { useModule3Store } from '../../../../lib/module3/store';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';
import { cn } from '../../../../lib/utils';
import { DURATION, EASING } from '../../../../lib/motion-presets';

interface Props {
  onComplete: () => void;
}

export const StrategySummarySection: React.FC<Props> = React.memo(({ onComplete }) => {
  const {
    authorityPosition,
    coreTrustPromise,
    proofAssets,
    authoritySuite,
    step3BrandIdentity,
    step3ClaimToAssetMap,
    step3ContentRoadmap,
    authorityBlueprint,
    setStep3Blueprint
  } = useModule3Store();

  const assembledBlueprint: ProfilePortfolioAuthorityBlueprint = useMemo(() => {
    const acceptedProofs = proofAssets.filter(a => a.isAccepted);
    const unacceptedProofs = proofAssets.filter(a => !a.isAccepted);
    const mappedClaims = step3ClaimToAssetMap?.filter(m => m.assetIds.length > 0) || [];
    
    return {
      decisionSummary: {
        positioningClaim: coreTrustPromise || '',
        primaryCategory: authorityPosition || 'builder',
        strongestProofAnchor: acceptedProofs[0]?.title || 'No proof assets',
        primaryProfileFocus: authoritySuite?.profileSystem?.[0]?.title || 'LinkedIn',
        topPortfolioPriorities: (authoritySuite?.portfolioBlueprint || []).slice(0, 3).map(s => s.title),
        keyEvidencePlacement: step3ClaimToAssetMap
          ? `${mappedClaims.length} claims backed`
          : 'Pending',
        alignmentHealth: acceptedProofs.length >= 3 ? 'Strong' : 'Building',
      },
      foundation: {
        authorityPosition: authorityPosition || 'builder',
        trustPromise: coreTrustPromise || '',
        equippedProofCount: acceptedProofs.length,
        skippedProofCount: unacceptedProofs.length,
        strongestProofSignal: acceptedProofs[0]?.title || '',
      },
      profilePositioning: authorityBlueprint?.profilePositioning ?? [],
      portfolioStructure: authorityBlueprint?.portfolioStructure ?? [],
      sectionPriorities: authorityBlueprint?.sectionPriorities ?? [],
      evidencePlacements: (step3ClaimToAssetMap || []).map((m) => ({
        id: m.claimId,
        claim: m.claimLabel,
        proofAssetId: m.assetIds[0] || '',
        proofTitle: proofAssets.find(a => a.id === m.assetIds[0])?.title || 'Unmapped',
        proofStrength: 'demonstration' as const,
        whyItSupportsClaim: `Direct profile claim in ${m.claimPlatform}`,
        recommendedPlacement: m.claimLabel,
        visibilityLevel: 'High' as const,
      })),
      presentationFlow: authorityBlueprint?.presentationFlow ?? { personaContext: '', journey: [] },
      alignmentAudit: authorityBlueprint?.alignmentAudit ?? {
        alignmentScore: 75,
        overallVerdict: 'Building',
        diagnostics: [],
      },
      nextMoves: authorityBlueprint?.nextMoves ?? [],
      isLocked: false,
      generatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  }, [
    authorityPosition, 
    coreTrustPromise, 
    proofAssets, 
    authoritySuite, 
    step3ClaimToAssetMap, 
    authorityBlueprint
  ]);

  const handleComplete = () => {
    setStep3Blueprint(assembledBlueprint);
    onComplete();
  };

  const totalPossibleProofs = Math.max(proofAssets.length, 3);
  const equippedProofs = assembledBlueprint.foundation.equippedProofCount;
  const healthPercent = Math.min(100, Math.round((equippedProofs / totalPossibleProofs) * 100));

  const totalClaims = step3ClaimToAssetMap?.length || 0;
  const backedClaims = step3ClaimToAssetMap?.filter(c => c.assetIds.length > 0).length || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-2">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Section 7 — Strategy Blueprint</h2>
        <p className="text-slate-600 text-lg">
          Your complete profile & portfolio strategy is assembled. Review the summary below, then complete this step to unlock Module 4.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-800 pb-2 border-b">
            <Target className="w-5 h-5 text-indigo-500" />
            Core Positioning
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Authority Position</div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-full border border-indigo-100">
              {authorityPosition || 'Not Set'}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trust Promise</div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-700 italic border border-slate-100">
              "{coreTrustPromise || 'Not Set'}"
            </div>
          </div>
        </div>

        {/* Health & Proof */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-800 pb-2 border-b">
            <Shield className="w-5 h-5 text-emerald-500" />
            Proof & Alignment Health
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">Alignment Health</span>
              <span className="font-bold text-emerald-600">{healthPercent}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {equippedProofs} proof assets equipped out of {totalPossibleProofs} recommended
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="text-sm font-medium text-emerald-900">Evidence Claims</div>
            <div className="text-sm font-bold text-emerald-700">
              {backedClaims} / {totalClaims} Backed
            </div>
          </div>
        </div>

        {/* Blueprint Overview */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center text-center p-4">
            <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{step3ContentRoadmap?.pillars?.length || 0}</div>
            <div className="text-sm font-medium text-slate-500">Content Pillars Ready</div>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
            <Layout className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-slate-800">{authoritySuite?.portfolioBlueprint?.length || 0}</div>
            <div className="text-sm font-medium text-slate-500">Portfolio Sections</div>
          </div>

          <div className="flex flex-col items-center text-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
            <CheckCircle2 className={cn("w-6 h-6 mb-2", step3BrandIdentity ? "text-emerald-500" : "text-amber-500")} />
            <div className="text-2xl font-bold text-slate-800">
              {step3BrandIdentity ? 'Confirmed' : 'Pending'}
            </div>
            <div className="text-sm font-medium text-slate-500">Brand Identity</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={handleComplete}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg overflow-hidden"
        >
          <span className="relative z-10">Complete Step 3 & Continue to Module 4</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </motion.div>
  );
});
