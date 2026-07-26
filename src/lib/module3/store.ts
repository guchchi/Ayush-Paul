import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Module3State,
  Module3Step,
  StepAccess,
  AuthorityPosition,
  ProofPriority,
  ProofAsset,
  ProofAssetStrategy,
  ProfilePortfolioStrategy,
  ChecklistItem,
  Module1Context,
  Module2Context,
  Module4BridgeContext,
  Module3FieldProvenance,
} from '../../types/module3';
import type {
  ScopeLimits,
  TieredPricing,
  ValueBasedPricing,
  ProposalSummary,
} from '../../types/offer-engineering';
import {
  MODULE3_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/module3';

import { resolveRecommendedPosition, generatePositionRationale, generateCoreTrustPromise } from '../../data/module3/authority-positions';
import { resolveProofPriorities, PriorityContext } from '../../data/module3/proof-priorities';
import { generateProofAsset } from '../../data/module3/proof-assets';
import { evaluateCredibilityProfile } from '../../data/module3/credibility-rules';
import { generateProofAssetStrategyForProfile } from '../../data/module3/proof-asset-strategy';
import { generateProfilePortfolioStrategy as mockGenerate } from '../../data/module3/profile-portfolio-strategy';
import { generateStep3Strategy } from '../../services/ai/ai-service';
import { calculateBlueprintConfidence } from './confidence-engine';
import { Step3PromptContext } from '../../services/ai/prompts/module3/step3-prompt';
import { Module4BridgeAdapter } from './module4-bridge';

export { canNavigateTo, getStepIndex, MODULE3_STEPS };

function defaultScopeLimits(): ScopeLimits {
  return {
    revisionCount: 2,
    communicationMethod: '',
    responseTime: '',
    deliveryTime: '',
    includedRounds: 2,
  };
}

function defaultTieredPricing(): TieredPricing {
  return { starterPrice: null, proPrice: null, premiumPrice: null };
}

function defaultvalueBasedPricing(): ValueBasedPricing {
  return { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' };
}

function defaultProposalSummary(): ProposalSummary {
  return {
    headline: '',
    problem: '',
    solution: '',
    deliverables: [],
    timeline: '',
    pricing: '',
    nextSteps: '',
  };
}



function defaultFieldProvenanceMap(): Module3FieldProvenance {
  return {
    coreTrustPromise: 'auto_generated',
  };
}

export function buildFingerprint(
  mod1: Module1Context,
  mod2: Module2Context,
): string {
  const payload = {
    m1ct: mod1.careerTrackId,
    m1s: mod1.serviceId,
    m1m: mod1.marketId,
    m1n: mod1.nicheId,
    m1o: mod1.offerId,
    m1p: mod1.positioning,
    m2ot: mod2.offerType,
    m2d: mod2.deliverables,
    m2um: mod2.uniqueMechanism,
    m2sl: mod2.scopeLimits,
    m2va: mod2.valueAmplifier,
    m2pm: mod2.pricingModel,
    m2fp: mod2.finalPrice,
    m2tp: mod2.tieredPricing,
    m2vp: mod2.valueBasedPricing,
    m2ps: mod2.proposalSummary,
  };
  return JSON.stringify(payload);
}

const INITIAL_CONTEXT: Pick<Module3State,
  | 'mod1CareerTrackId' | 'mod1ServiceId' | 'mod1MarketId' | 'mod1NicheId' | 'mod1OfferId' | 'mod1Positioning'
  | 'mod2OfferType' | 'mod2Deliverables' | 'mod2UniqueMechanism' | 'mod2ScopeLimits'
  | 'mod2ValueAmplifier' | 'mod2PricingModel' | 'mod2FinalPrice' | 'mod2TieredPricing'
  | 'mod2ValueBasedPricing' | 'mod2ProposalSummary'> = {
  mod1CareerTrackId: null,
  mod1ServiceId: null,
  mod1MarketId: null,
  mod1NicheId: null,
  mod1OfferId: null,
  mod1Positioning: '',
  mod2OfferType: null,
  mod2Deliverables: [],
  mod2UniqueMechanism: '',
  mod2ScopeLimits: defaultScopeLimits(),
  mod2ValueAmplifier: '',
  mod2PricingModel: null,
  mod2FinalPrice: null,
  mod2TieredPricing: defaultTieredPricing(),
  mod2ValueBasedPricing: defaultvalueBasedPricing(),
  mod2ProposalSummary: defaultProposalSummary(),
};

export const useModule3Store = create<Module3State>()(
  persist(
    (set, get) => ({
      provenance: {
        source: 'auto_generated',
        generatorVersion: 2,
        upstreamContextHash: '',
      },
      fieldProvenance: defaultFieldProvenanceMap(),
      promiseVariationIndex: 0,
      staleDecision: null,
      contentGeneratorVersion: 2,

      authorityProfile: null,
      pendingProfile: null,

      authorityPosition: null,
      coreTrustPromise: '',
      authorityPositionRationale: '',

      availableAssets: [],
      strongestAsset: null,
      missingAssets: [],

      proofPriorities: [],
      
      existingProofInventory: '',
      pendingProofAssetStrategy: null,
      proofAssetStrategy: null,

      proofAssets: [],

      pendingProfilePortfolioStrategy: null,
      profilePortfolioStrategy: null,
      isGeneratingStrategy: false,

      executionProgress: {
        completedTasks: {},
        lastUpdated: Date.now(),
      },

      checklist: [],

      isCompleted: false,
      isUpstreamStale: false,
      lastUpdated: Date.now(),
      upstreamFingerprint: '',
      version: 7,

      ...INITIAL_CONTEXT,

      currentStep: 'authority_position',
      completedSteps: [],

      setPhase1Context(ctx: Module1Context) {
        const current = get();
        if (current.mod1CareerTrackId === ctx.careerTrackId &&
            current.mod1ServiceId === ctx.serviceId &&
            current.mod1MarketId === ctx.marketId &&
            current.mod1NicheId === ctx.nicheId &&
            current.mod1OfferId === ctx.offerId &&
            current.mod1Positioning === ctx.positioning) {
          return; // materially identical — skip
        }
        set({
          mod1CareerTrackId: ctx.careerTrackId,
          mod1ServiceId: ctx.serviceId,
          mod1MarketId: ctx.marketId,
          mod1NicheId: ctx.nicheId,
          mod1OfferId: ctx.offerId,
          mod1Positioning: ctx.positioning,
          isUpstreamStale: true,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: 'stale' } } : {}),
          ...(current.profilePortfolioStrategy ? { profilePortfolioStrategy: { ...current.profilePortfolioStrategy, status: 'stale' } } : {}),
          lastUpdated: Date.now(),
        });
      },

      setPhase2Context(ctx: Module2Context) {
        const current = get();
        if (current.mod2OfferType === ctx.offerType &&
            current.mod2UniqueMechanism === ctx.uniqueMechanism &&
            current.mod2ValueAmplifier === ctx.valueAmplifier &&
            current.mod2PricingModel === ctx.pricingModel &&
            current.mod2FinalPrice === ctx.finalPrice &&
            JSON.stringify(current.mod2Deliverables) === JSON.stringify(ctx.deliverables) &&
            JSON.stringify(current.mod2ScopeLimits) === JSON.stringify(ctx.scopeLimits) &&
            JSON.stringify(current.mod2TieredPricing) === JSON.stringify(ctx.tieredPricing) &&
            JSON.stringify(current.mod2ValueBasedPricing) === JSON.stringify(ctx.valueBasedPricing) &&
            JSON.stringify(current.mod2ProposalSummary) === JSON.stringify(ctx.proposalSummary)) {
          return; // materially identical — skip
        }
        set({
          mod2OfferType: ctx.offerType,
          mod2Deliverables: ctx.deliverables,
          mod2UniqueMechanism: ctx.uniqueMechanism,
          mod2ScopeLimits: ctx.scopeLimits,
          mod2ValueAmplifier: ctx.valueAmplifier,
          mod2PricingModel: ctx.pricingModel,
          mod2FinalPrice: ctx.finalPrice,
          mod2TieredPricing: ctx.tieredPricing,
          mod2ValueBasedPricing: ctx.valueBasedPricing,
          mod2ProposalSummary: ctx.proposalSummary,
          isUpstreamStale: true,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: 'stale' } } : {}),
          lastUpdated: Date.now(),
        });
      },

      setAuthorityProfile(profile) {
        const current = get();
        set({ 
          authorityProfile: profile, 
          isUpstreamStale: true,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: 'stale' } } : {}),
          ...(current.profilePortfolioStrategy ? { profilePortfolioStrategy: { ...current.profilePortfolioStrategy, status: 'stale' } } : {}),
          lastUpdated: Date.now() 
        });
      },

      setPendingProfile(profile) {
        set({ pendingProfile: profile, lastUpdated: Date.now() });
      },

      setAuthorityPosition(value: AuthorityPosition) {
        set({ authorityPosition: value, lastUpdated: Date.now() });
      },

      setCoreTrustPromise(value: string) {
        set((s) => ({
          coreTrustPromise: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            coreTrustPromise: 'user_edited',
          },
          lastUpdated: Date.now(),
        }));
      },

      setAuthorityPositionRationale(value: string) {
        set({ authorityPositionRationale: value, lastUpdated: Date.now() });
      },

      setAvailableAssets(value: string[]) {
        set({ availableAssets: value, lastUpdated: Date.now() });
      },

      setStrongestAsset(value: string | null) {
        set({ strongestAsset: value, lastUpdated: Date.now() });
      },

      setMissingAssets(value: string[]) {
        set({ missingAssets: value, lastUpdated: Date.now() });
      },

      setProofPriorities(value: ProofPriority[]) {
        set({ proofPriorities: value, lastUpdated: Date.now() });
      },

      setProofAssets(value: ProofAsset[]) {
        set({ proofAssets: value, lastUpdated: Date.now() });
      },

      updateProofAsset(id: string, updates: Partial<ProofAsset>) {
        set((state) => {
          const isStatusOnly = Object.keys(updates).every((key) => key === 'isAccepted');
          return {
            proofAssets: state.proofAssets.map((asset) => 
              asset.id === id 
                ? { ...asset, ...updates, isCustom: isStatusOnly ? asset.isCustom : true } 
                : asset
            ),
            lastUpdated: Date.now()
          };
        });
      },

      replaceProofAsset(id: string, newAsset: ProofAsset) {
        set((state) => ({
          proofAssets: state.proofAssets.map((asset) => 
            asset.id === id ? newAsset : asset
          ),
        }));
      },

      setExistingProofInventory(value: string) {
        set({ existingProofInventory: value, lastUpdated: Date.now() });
      },

      setPendingProofAssetStrategy(value: ProofAssetStrategy | null) {
        set({ pendingProofAssetStrategy: value, lastUpdated: Date.now() });
      },

      setProofAssetStrategy(value: ProofAssetStrategy | null) {
        set({ proofAssetStrategy: value, lastUpdated: Date.now() });
      },

      generateProofAssetStrategy() {
        const state = get();
        try {
          const strategy = generateProofAssetStrategyForProfile({
            authorityProfile: state.authorityProfile,
            mod1ServiceId: state.mod1ServiceId,
            mod1MarketId: state.mod1MarketId,
            mod1NicheId: state.mod1NicheId,
            mod2OfferType: state.mod2OfferType,
            mod2Deliverables: state.mod2Deliverables,
            existingProofInventory: state.existingProofInventory,
          });
          
          if (state.pendingProofAssetStrategy?.selectedExecutionPriority) {
            strategy.selectedExecutionPriority = state.pendingProofAssetStrategy.selectedExecutionPriority;
          } else if (state.proofAssetStrategy?.selectedExecutionPriority) {
            strategy.selectedExecutionPriority = state.proofAssetStrategy.selectedExecutionPriority;
          }
          
          set({ pendingProofAssetStrategy: strategy, lastUpdated: Date.now() });
        } catch (error) {
          console.error('[Module3] Failed to generate Proof Asset Strategy:', error);
        }
      },

      selectExecutionPriority(priority: 'immediate' | 'short_term' | 'long_term') {
        const state = get();
        if (state.pendingProofAssetStrategy) {
          set({
            pendingProofAssetStrategy: {
              ...state.pendingProofAssetStrategy,
              selectedExecutionPriority: priority,
            },
            lastUpdated: Date.now(),
          });
        }
      },

      approveProofAssetStrategy() {
        const state = get();
        if (state.pendingProofAssetStrategy && state.pendingProofAssetStrategy.selectedExecutionPriority) {
          const newVersion = state.proofAssetStrategy ? state.proofAssetStrategy.strategyVersion + 1 : 1;
          set({
            proofAssetStrategy: {
              ...state.pendingProofAssetStrategy,
              strategyVersion: newVersion,
              status: 'approved',
            },
            pendingProofAssetStrategy: null,
            lastUpdated: Date.now(),
          });
        }
      },

      setPendingProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null) {
        set({ pendingProfilePortfolioStrategy: value, lastUpdated: Date.now() });
      },

      setProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null) {
        set({ profilePortfolioStrategy: value, lastUpdated: Date.now() });
      },

      async generateProfilePortfolioStrategy(signal?: AbortSignal) {
        const state = get();
        try {
          set({ isGeneratingStrategy: true, lastUpdated: Date.now() });
          
          const context = {
            module1: {
              niche: state.mod1NicheId || 'General',
              targetAudience: state.mod1MarketId || 'General Audience',
              coreProblem: state.mod1ServiceId || 'General Problem',
              uniqueMechanism: state.mod2UniqueMechanism || 'Standard Framework',
            },
            module2: {
              offerName: state.mod2OfferType || 'Standard Offer',
              pricePoint: state.mod2FinalPrice ? `$${state.mod2FinalPrice}` : 'TBD',
              promise: state.mod2ValueAmplifier || 'Great results',
            },
            authorityProfile: {
              position: state.authorityProfile?.position || 'builder',
              summary: state.authorityProfile?.summary || 'Expert',
              coreTrustPromise: state.authorityProfile?.coreTrustPromise || '',
            }
          };

          const strategy = await generateStep3Strategy(context as any, { signal });
          
          if (strategy.strategySummary) {
            strategy.strategySummary.confidenceScore = calculateBlueprintConfidence(context as Step3PromptContext);
          }

          set({ 
            pendingProfilePortfolioStrategy: strategy as any, 
            isGeneratingStrategy: false,
            lastUpdated: Date.now() 
          });
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('[Module3] Failed to generate Profile Portfolio Strategy:', error);
          }
          set({ isGeneratingStrategy: false, lastUpdated: Date.now() });
        }
      },

      async regenerateProfilePortfolioStrategy(signal?: AbortSignal) {
        const state = get();
        try {
          set({ isGeneratingStrategy: true, lastUpdated: Date.now() });
          
          const context = {
            module1: {
              niche: state.mod1NicheId || 'General',
              targetAudience: state.mod1MarketId || 'General Audience',
              coreProblem: state.mod1ServiceId || 'General Problem',
              uniqueMechanism: state.mod2UniqueMechanism || 'Standard Framework',
            },
            module2: {
              offerName: state.mod2OfferType || 'Standard Offer',
              pricePoint: state.mod2FinalPrice ? `$${state.mod2FinalPrice}` : 'TBD',
              promise: state.mod2ValueAmplifier || 'Great results',
            },
            authorityProfile: {
              position: state.authorityProfile?.position || 'builder',
              summary: state.authorityProfile?.summary || 'Expert',
              coreTrustPromise: state.authorityProfile?.coreTrustPromise || '',
            }
          };

          // In a real application we would track explicitly edited fields via fieldProvenance.
          // For now, we will pass the entire current strategy as fieldsToPreserve to demonstrate the merge.
          // In production, we'd only pass fields that were actually edited by the user.
          const currentStrategy = state.pendingProfilePortfolioStrategy || state.profilePortfolioStrategy;
          
          const strategy = await generateStep3Strategy(context as any, { 
            signal,
            fieldsToPreserve: currentStrategy || undefined,
            skipCache: true // force regeneration
          });
          
          if (strategy.strategySummary) {
            strategy.strategySummary.confidenceScore = calculateBlueprintConfidence(context as Step3PromptContext);
          }

          set({ 
            pendingProfilePortfolioStrategy: strategy as any, 
            isGeneratingStrategy: false,
            lastUpdated: Date.now() 
          });
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('[Module3] Failed to regenerate Profile Portfolio Strategy:', error);
          }
          set({ isGeneratingStrategy: false, lastUpdated: Date.now() });
        }
      },

      approveProfilePortfolioStrategy() {
        const state = get();
        if (state.pendingProfilePortfolioStrategy) {
          set({
            profilePortfolioStrategy: {
              ...state.pendingProfilePortfolioStrategy,
              status: 'approved',
              approvedAt: new Date().toISOString(),
            },
            pendingProfilePortfolioStrategy: null,
            lastUpdated: Date.now(),
          });
        }
      },

      updateProfilePortfolioStrategy(updates) {
        set((state) => {
          const current = state.pendingProfilePortfolioStrategy || state.profilePortfolioStrategy;
          if (!current) return {};
          const updated = {
            ...current,
            ...updates,
            lastUpdated: Date.now(),
          };
          return state.pendingProfilePortfolioStrategy
            ? { pendingProfilePortfolioStrategy: updated }
            : { profilePortfolioStrategy: updated };
        });
      },

      setTaskCompletion(week: string, taskIdx: number, completed: boolean) {
        set((state) => {
          const taskId = `${week}.task${taskIdx}`;
          return {
            executionProgress: {
              ...state.executionProgress,
              completedTasks: {
                ...state.executionProgress.completedTasks,
                [taskId]: completed,
              },
              lastUpdated: Date.now(),
            },
          };
        });
      },

      replaceGeneratedCoreTrustPromise(value: string) {
        set((s) => ({
          coreTrustPromise: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            coreTrustPromise: 'auto_generated',
          },
          lastUpdated: Date.now(),
        }));
      },



      setChecklist(value: ChecklistItem[]) {
        set({ checklist: value, lastUpdated: Date.now() });
      },

      updateChecklistItem(id: string, updates: Partial<ChecklistItem>) {
        set((state) => ({
          checklist: state.checklist.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
          lastUpdated: Date.now(),
        }));
      },

      getModule4Context(): Module4BridgeContext {
        const state = get();
        return Module4BridgeAdapter.generateContext(state);
      },

      setIsCompleted(value: boolean) {
        set({ isCompleted: value, lastUpdated: Date.now() });
      },

      setIsUpstreamStale(value: boolean) {
        const current = get();
        if (current.isUpstreamStale === value) return; // identical — skip
        set({ isUpstreamStale: value, lastUpdated: Date.now() });
      },

      setUpstreamFingerprint(value: string) {
        const current = get();
        if (current.upstreamFingerprint === value) return; // identical — skip
        set({ upstreamFingerprint: value, lastUpdated: Date.now() });
      },

      clearModule3Data() {
        set({
          provenance: {
            source: 'auto_generated',
            generatorVersion: 2,
            upstreamContextHash: '',
          },
          fieldProvenance: defaultFieldProvenanceMap(),
          promiseVariationIndex: 0,
          staleDecision: null,
          contentGeneratorVersion: 2,
          authorityProfile: null,
          pendingProfile: null,
          authorityPosition: null,
          coreTrustPromise: '',
          authorityPositionRationale: '',
          availableAssets: [],
          strongestAsset: null,
          missingAssets: [],
          existingProofInventory: '',
          pendingProofAssetStrategy: null,
          proofAssetStrategy: null,
          proofPriorities: [],
          proofAssets: [],
          pendingProfilePortfolioStrategy: null,
          profilePortfolioStrategy: null,
          isGeneratingStrategy: false,
          checklist: [],
          isCompleted: false,
          isUpstreamStale: false,
          upstreamFingerprint: '',
          currentStep: 'authority_position',
          completedSteps: [],
          lastUpdated: Date.now(),
          version: 7,
        });
      },

      confirmStep() {
        const state = get();
        const step = state.currentStep;
        let extraSet: Partial<Module3State> = {};
        if (step === 'proof_asset_builder') {
          const ctx = {
            serviceId: state.mod1ServiceId,
            marketId: state.mod1MarketId,
            nicheId: state.mod1NicheId,
            positioning: state.mod1Positioning,
            offerType: state.mod2OfferType,
            authorityPosition: state.authorityPosition,
          };
          const evalRes = evaluateCredibilityProfile(
            state.availableAssets,
            state.strongestAsset,
            state.missingAssets,
            ctx
          );
          extraSet.proofPriorities = evalRes.gapPriorities.slice(0, 3).map((gp) => ({
            id: gp.id,
            gapTitle: gp.label,
            gapDescription: gp.reason,
            recommendedFormat: gp.format as any,
            isCustom: true,
          }));
        }
        set((s) => ({
          ...extraSet,
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          lastUpdated: Date.now(),
        }));
      },

      nextStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const nextIdx = Math.min(currentIdx + 1, MODULE3_STEPS.length - 1);
        const nextStep = MODULE3_STEPS[nextIdx];
        const step = state.currentStep;
        let extraSet: Partial<Module3State> = {};
        if (step === 'proof_asset_builder') {
          const ctx = {
            serviceId: state.mod1ServiceId,
            marketId: state.mod1MarketId,
            nicheId: state.mod1NicheId,
            positioning: state.mod1Positioning,
            offerType: state.mod2OfferType,
            authorityPosition: state.authorityPosition,
          };
          const evalRes = evaluateCredibilityProfile(
            state.availableAssets,
            state.strongestAsset,
            state.missingAssets,
            ctx
          );
          extraSet.proofPriorities = evalRes.gapPriorities.slice(0, 3).map((gp) => ({
            id: gp.id,
            gapTitle: gp.label,
            gapDescription: gp.reason,
            recommendedFormat: gp.format as any,
            isCustom: true,
          }));
        }
        set((s) => ({
          ...extraSet,
          currentStep: nextStep,
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          lastUpdated: Date.now(),
        }));
      },

      previousStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const prevIdx = Math.max(currentIdx - 1, 0);
        const prevStep = MODULE3_STEPS[prevIdx];
        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) {
          set({ currentStep: prevStep, lastUpdated: Date.now() });
        }
      },

      jumpToStep(step: Module3Step) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (!access.unlocked) {
          console.warn(`[Module3] Cannot jump to "${step}": ${access.reason}`);
          return;
        }
        set({ currentStep: step, lastUpdated: Date.now() });
      },

      reset() {
        set({
          provenance: {
            source: 'auto_generated',
            generatorVersion: 2,
            upstreamContextHash: '',
          },
          fieldProvenance: defaultFieldProvenanceMap(),
          promiseVariationIndex: 0,
          staleDecision: null,
          contentGeneratorVersion: 2,
          authorityProfile: null,
          pendingProfile: null,
          authorityPosition: null,
          coreTrustPromise: '',
          authorityPositionRationale: '',
          availableAssets: [],
          strongestAsset: null,
          missingAssets: [],
          proofPriorities: [],
          proofAssets: [],
          pendingProfilePortfolioStrategy: null,
          profilePortfolioStrategy: null,
          isGeneratingStrategy: false,
          checklist: [],
          isCompleted: false,
          isUpstreamStale: false,
          lastUpdated: Date.now(),
          version: 7,
          ...INITIAL_CONTEXT,
          currentStep: 'authority_position',
          completedSteps: [],
        });
      },

      dismissStaleContext() {
        set({
          isUpstreamStale: false,
          staleDecision: 'keep',
          lastUpdated: Date.now(),
        });
      },

      refreshStaleContext() {
        const state = get();
        const ctxM1 = {
          careerTrackId: state.mod1CareerTrackId,
          serviceId: state.mod1ServiceId,
          marketId: state.mod1MarketId,
          nicheId: state.mod1NicheId,
          offerId: state.mod1OfferId,
          positioning: state.mod1Positioning,
        };
        const ctxM2 = {
          offerType: state.mod2OfferType,
          deliverables: state.mod2Deliverables,
          uniqueMechanism: state.mod2UniqueMechanism,
          scopeLimits: state.mod2ScopeLimits,
          valueAmplifier: state.mod2ValueAmplifier,
          pricingModel: state.mod2PricingModel,
          finalPrice: state.mod2FinalPrice,
          tieredPricing: state.mod2TieredPricing,
          valueBasedPricing: state.mod2ValueBasedPricing,
          proposalSummary: state.mod2ProposalSummary,
        };

        const tempCtx = {
          ...ctxM1,
          offerType: state.mod2OfferType,
          deliverables: state.mod2Deliverables,
          uniqueMechanism: state.mod2UniqueMechanism,
          valueAmplifier: state.mod2ValueAmplifier,
        };

        // 1. Re-evaluate position recommendation
        const newRecommended = resolveRecommendedPosition(tempCtx as any);
        let position = state.authorityPosition || newRecommended;
        let rationale = state.authorityPositionRationale;
        if (!rationale || !state.authorityPosition) {
          rationale = generatePositionRationale(position, { ...tempCtx, authorityPosition: position } as any);
        }
        let promise = state.coreTrustPromise;
        if (!promise || state.fieldProvenance.coreTrustPromise === 'auto_generated') {
          promise = generateCoreTrustPromise(position, { ...tempCtx, authorityPosition: position } as any, state.promiseVariationIndex);
        }

        // Complete, typed PriorityContext
        const ctxCombined: PriorityContext = {
          ...tempCtx,
          authorityPosition: position,
          coreTrustPromise: promise,
        };

        // 2. Re-resolve proof priorities (for those not customized)
        const freshPriorities = resolveProofPriorities(ctxCombined);
        const updatedPriorities = state.proofPriorities.map((existing) => {
          if (existing.isCustom) return existing;
          const fresh = freshPriorities.find((fp) => fp.id === existing.id);
          return fresh ? { ...fresh, isCustom: false } : existing;
        });

        // 3. Re-generate proof assets (for those not customized)
        const updatedAssets = state.proofAssets.map((existing) => {
          if (existing.isCustom) return existing;
          const priority = updatedPriorities.find((p) => p.id === existing.priorityId);
          if (priority) {
            const fresh = generateProofAsset(priority, ctxCombined);
            return { ...fresh, isCustom: false, isAccepted: existing.isAccepted };
          }
          return existing;
        });

        set({
          authorityPosition: position,
          authorityPositionRationale: rationale,
          coreTrustPromise: promise,
          proofPriorities: updatedPriorities,
          proofAssets: updatedAssets,
          // Profile and Portfolio copy refresh is no longer relevant for the Strategy data structure.
          isUpstreamStale: false,
          staleDecision: 'refresh',
          lastUpdated: Date.now(),
        });
      },
    }),
    {
      name: 'module-3-progress',
      version: 8,
      migrate(persisted, version) {
        let state = persisted as any;
        if (version < 6) {
          state = {
            provenance: {
              source: 'auto_generated',
              generatorVersion: 2,
              upstreamContextHash: '',
            },
            fieldProvenance: defaultFieldProvenanceMap(),
            promiseVariationIndex: 0,
            staleDecision: null,
            contentGeneratorVersion: 2,
            authorityPosition: null,
            coreTrustPromise: '',
            authorityPositionRationale: '',
            availableAssets: [],
            strongestAsset: null,
            missingAssets: [],
            proofPriorities: [],
            proofAssets: [],
            pendingProfilePortfolioStrategy: null,
            profilePortfolioStrategy: null,
            isGeneratingStrategy: false,
            checklist: [],
            isCompleted: false,
            isUpstreamStale: false,
            existingProofInventory: '',
            pendingProofAssetStrategy: null,
            proofAssetStrategy: null,
            lastUpdated: Date.now(),
            upstreamFingerprint: '',
            version: 8,
            ...INITIAL_CONTEXT,
            currentStep: 'authority_position',
            completedSteps: [],
          };
        }
        if (version < 7) {
          state = {
            ...state,
            availableAssets: state.availableAssets ?? [],
            strongestAsset: state.strongestAsset ?? null,
            missingAssets: state.missingAssets ?? [],
            existingProofInventory: state.existingProofInventory ?? '',
            pendingProofAssetStrategy: state.pendingProofAssetStrategy ?? null,
            proofAssetStrategy: state.proofAssetStrategy ?? null,
            version: 8,
          };
        }
        if (version < 8) {
          state = {
            ...state,
            pendingProfilePortfolioStrategy: null,
            profilePortfolioStrategy: null,
            version: 8,
          };
        }
        return state as Module3State;
      },
      partialize: (state) => ({
        provenance: state.provenance,
        fieldProvenance: state.fieldProvenance,
        promiseVariationIndex: state.promiseVariationIndex,
        staleDecision: state.staleDecision,
        contentGeneratorVersion: state.contentGeneratorVersion,
        authorityProfile: state.authorityProfile,
        pendingProfile: state.pendingProfile,
        authorityPosition: state.authorityPosition,
        coreTrustPromise: state.coreTrustPromise,
        authorityPositionRationale: state.authorityPositionRationale,
        availableAssets: state.availableAssets,
        strongestAsset: state.strongestAsset,
        missingAssets: state.missingAssets,
        proofPriorities: state.proofPriorities,
        proofAssets: state.proofAssets,
        existingProofInventory: state.existingProofInventory,
        pendingProofAssetStrategy: state.pendingProofAssetStrategy,
        proofAssetStrategy: state.proofAssetStrategy,
        pendingProfilePortfolioStrategy: state.pendingProfilePortfolioStrategy,
        profilePortfolioStrategy: state.profilePortfolioStrategy,
        checklist: state.checklist,
        isCompleted: state.isCompleted,
        isUpstreamStale: state.isUpstreamStale,
        lastUpdated: state.lastUpdated,
        upstreamFingerprint: state.upstreamFingerprint,
        version: state.version,
        mod1CareerTrackId: state.mod1CareerTrackId,
        mod1ServiceId: state.mod1ServiceId,
        mod1MarketId: state.mod1MarketId,
        mod1NicheId: state.mod1NicheId,
        mod1OfferId: state.mod1OfferId,
        mod1Positioning: state.mod1Positioning,
        mod2OfferType: state.mod2OfferType,
        mod2Deliverables: state.mod2Deliverables,
        mod2UniqueMechanism: state.mod2UniqueMechanism,
        mod2ScopeLimits: state.mod2ScopeLimits,
        mod2ValueAmplifier: state.mod2ValueAmplifier,
        mod2PricingModel: state.mod2PricingModel,
        mod2FinalPrice: state.mod2FinalPrice,
        mod2TieredPricing: state.mod2TieredPricing,
        mod2ValueBasedPricing: state.mod2ValueBasedPricing,
        mod2ProposalSummary: state.mod2ProposalSummary,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
