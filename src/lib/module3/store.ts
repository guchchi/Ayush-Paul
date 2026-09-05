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
  Stage1AuditData,
  Stage1IdentityData,
  Stage2ArchetypeData,
  Stage2WireframeSettings,
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
// Removed generateStep3Strategy import
import { calculateBlueprintConfidence } from './confidence-engine';
import { Step3PromptContext } from '../../services/ai/prompts/module3/step3-prompt';
import { Module4BridgeAdapter } from './module4-bridge';
import { applyToneToSuite } from './tone-engine';
import { PORTFOLIO_ARCHETYPES } from './portfolio-architecture-engine';
import type { PortfolioBlueprintSection } from '../../data/module3/authority-suite-engine';

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
      skippedAssets: [],
      strongestAsset: null,
      missingAssets: [],

      proofPriorities: [],
      
      existingProofInventory: '',
      pendingProofAssetStrategy: null,
      proofAssetStrategy: null,

      proofAssets: [],

      authoritySuite: null,
      authorityBlueprint: null,

      // ── Step 3 Wizard section outputs ─────────────────────────────────
      step3CompletedSections: [],
      step3BrandIdentity: null,
      step3AssetOrder: null,
      step3ClaimToAssetMap: null,
      step3ContentRoadmap: null,
      step3Blueprint: null,

      // ── Stage 1 (Profile Strategy) Studio Persistence ──────────────────
      stage1ActiveSection: 1,
      stage1CompletedSections: [],
      stage1Audit: null,
      stage1Identity: null,

      // ── Stage 2 (Portfolio Architecture) Studio Persistence ────────────
      stage2ActiveSection: 1,
      stage2CompletedSections: [],
      stage2Archetype: null,
      stage2WireframeSettings: {
        viewport: 'desktop',
        fidelity: 'wireframe',
        activeSectionId: 'section_hero',
      },

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
        const hasProgress = current.completedSteps.length > 0 || current.isCompleted;
        set({
          mod1CareerTrackId: ctx.careerTrackId,
          mod1ServiceId: ctx.serviceId,
          mod1MarketId: ctx.marketId,
          mod1NicheId: ctx.nicheId,
          mod1OfferId: ctx.offerId,
          mod1Positioning: ctx.positioning,
          isUpstreamStale: hasProgress,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: hasProgress ? 'stale' : current.proofAssetStrategy.status } } : {}),
          ...(current.profilePortfolioStrategy ? { profilePortfolioStrategy: { ...current.profilePortfolioStrategy, status: hasProgress ? 'stale' : current.profilePortfolioStrategy.status } } : {}),
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
        const hasProgress = current.completedSteps.length > 0 || current.isCompleted;
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
          isUpstreamStale: hasProgress,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: hasProgress ? 'stale' : current.proofAssetStrategy.status } } : {}),
          lastUpdated: Date.now(),
        });
      },

      setAuthorityProfile(profile) {
        const current = get();
        const hasProgress = current.completedSteps.length > 0 || current.isCompleted;
        set({ 
          authorityProfile: profile, 
          isUpstreamStale: hasProgress,
          ...(current.proofAssetStrategy ? { proofAssetStrategy: { ...current.proofAssetStrategy, status: hasProgress ? 'stale' : current.proofAssetStrategy.status } } : {}),
          ...(current.profilePortfolioStrategy ? { profilePortfolioStrategy: { ...current.profilePortfolioStrategy, status: hasProgress ? 'stale' : current.profilePortfolioStrategy.status } } : {}),
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

      setSkippedAssets(value: string[]) {
        set({ skippedAssets: value, lastUpdated: Date.now() });
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
            authorityProfile: state.authorityProfile || {
              position: 'builder',
              summary: 'Expert',
              coreTrustPromise: 'Delivering exceptional client outcomes',
            },
            proofAssetStrategy: state.proofAssetStrategy || {
              priorityProofAssets: [],
              status: 'draft',
            },
            mod1ServiceId: state.mod1ServiceId,
            mod2OfferType: state.mod2OfferType,
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
          };

          const strategy = await mockGenerate(context as any);
          
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
            authorityProfile: state.authorityProfile || {
              position: 'builder',
              summary: 'Expert',
              coreTrustPromise: 'Delivering exceptional client outcomes',
            },
            proofAssetStrategy: state.proofAssetStrategy || {
              priorityProofAssets: [],
              status: 'draft',
            },
            mod1ServiceId: state.mod1ServiceId,
            mod2OfferType: state.mod2OfferType,
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
          };

          const currentStrategy = state.pendingProfilePortfolioStrategy || state.profilePortfolioStrategy;
          
          const strategy = await mockGenerate(context as any);
          
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
        set((state) => {
          const currentSuite = state.authoritySuite;
          const currentLegacy = state.pendingProfilePortfolioStrategy || state.profilePortfolioStrategy;
          return {
            authoritySuite: currentSuite
              ? {
                  ...currentSuite,
                  status: 'approved',
                  approvedAt: new Date().toISOString(),
                }
              : null,
            profilePortfolioStrategy: currentLegacy
              ? {
                  ...currentLegacy,
                  status: 'approved',
                  approvedAt: new Date().toISOString(),
                }
              : null,
            pendingProfilePortfolioStrategy: null,
            lastUpdated: Date.now(),
          };
        });
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

      setAuthoritySuite(suite) {
        set({ authoritySuite: suite, lastUpdated: Date.now() });
      },

      setAuthorityBlueprint(blueprint) {
        set({ authorityBlueprint: blueprint, lastUpdated: Date.now() });
      },

      updateMessageLayer(layerKey, customization) {
        set((state) => {
          if (!state.authorityBlueprint) return {};
          return {
            authorityBlueprint: {
              ...state.authorityBlueprint,
              profilePositioning: state.authorityBlueprint.profilePositioning.map((l) =>
                l.layerKey === layerKey
                  ? { ...l, userCustomization: customization, status: 'adjusted' }
                  : l
              ),
              lastUpdated: new Date().toISOString(),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      reorderBlueprintPortfolioSection(fromIdx, toIdx) {
        set((state) => {
          if (!state.authorityBlueprint) return {};
          const sections = [...state.authorityBlueprint.portfolioStructure];
          if (fromIdx < 0 || fromIdx >= sections.length || toIdx < 0 || toIdx >= sections.length) return {};
          const [moved] = sections.splice(fromIdx, 1);
          sections.splice(toIdx, 0, moved);
          const renumbered = sections.map((s, idx) => ({ ...s, position: idx + 1, status: 'adjusted' as const }));
          return {
            authorityBlueprint: {
              ...state.authorityBlueprint,
              portfolioStructure: renumbered,
              lastUpdated: new Date().toISOString(),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      toggleBlueprintPortfolioSection(sectionId) {
        set((state) => {
          if (!state.authorityBlueprint) return {};
          return {
            authorityBlueprint: {
              ...state.authorityBlueprint,
              portfolioStructure: state.authorityBlueprint.portfolioStructure.map((s) =>
                s.id === sectionId ? { ...s, isEnabled: !s.isEnabled, status: 'adjusted' as const } : s
              ),
              lastUpdated: new Date().toISOString(),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      acceptBlueprintRecommendation(sectionKey, itemId) {
        set((state) => {
          if (!state.authorityBlueprint) return {};
          let updated = { ...state.authorityBlueprint };

          if (sectionKey === 'profilePositioning') {
            updated.profilePositioning = updated.profilePositioning.map((item) =>
              item.layerKey === itemId ? { ...item, status: 'accepted' as const } : item
            );
          } else if (sectionKey === 'portfolioStructure') {
            updated.portfolioStructure = updated.portfolioStructure.map((item) =>
              item.id === itemId ? { ...item, status: 'accepted' as const } : item
            );
          }

          return {
            authorityBlueprint: {
              ...updated,
              lastUpdated: new Date().toISOString(),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      toggleNextMoveItem(itemId) {
        set((state) => {
          if (!state.authorityBlueprint) return {};
          return {
            authorityBlueprint: {
              ...state.authorityBlueprint,
              nextMoves: state.authorityBlueprint.nextMoves.map((item) =>
                item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
              ),
              lastUpdated: new Date().toISOString(),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      updateBrandAsset(assetId, newValue) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              brandAssets: state.authoritySuite.brandAssets.map((a) =>
                a.id === assetId ? { ...a, value: newValue, isCustomized: true } : a
              ),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      resetBrandAsset(assetId) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              brandAssets: state.authoritySuite.brandAssets.map((a) =>
                a.id === assetId ? { ...a, value: a.originalValue, isCustomized: false } : a
              ),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      updateProfileField(platform, fieldKey, newValue) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              profileSystem: state.authoritySuite.profileSystem.map((p) => {
                if (p.platform !== platform) return p;
                return {
                  ...p,
                  fields: p.fields.map((f) => (f.key === fieldKey ? { ...f, value: newValue, isCustomized: true } : f)),
                };
              }),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      resetProfileField(platform, fieldKey) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              profileSystem: state.authoritySuite.profileSystem.map((p) => {
                if (p.platform !== platform) return p;
                return {
                  ...p,
                  fields: p.fields.map((f) => (f.key === fieldKey ? { ...f, value: f.originalValue, isCustomized: false } : f)),
                };
              }),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      updatePortfolioSection(sectionId, updatedFields) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              portfolioBlueprint: state.authoritySuite.portfolioBlueprint.map((s) => {
                if (s.id !== sectionId) return s;
                const isHeadlineCustomized = 'headline' in updatedFields ? true : !!s.isHeadlineCustomized;
                const isSubheadlineCustomized = 'subheadline' in updatedFields ? true : !!s.isSubheadlineCustomized;
                const isBodyCustomized = 'bodyCopy' in updatedFields ? true : !!s.isBodyCustomized;
                const isCtaCustomized = 'ctaText' in updatedFields ? true : !!s.isCtaCustomized;
                const isTrustCustomized = 'trustStatement' in updatedFields ? true : !!s.isTrustCustomized;
                return {
                  ...s,
                  ...updatedFields,
                  isHeadlineCustomized,
                  isSubheadlineCustomized,
                  isBodyCustomized,
                  isCtaCustomized,
                  isTrustCustomized,
                  isCustomized: true,
                };
              }),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      toggleOpportunityTask(taskId) {
        set((state) => {
          if (!state.authoritySuite) return {};
          return {
            authoritySuite: {
              ...state.authoritySuite,
              opportunityMatrix: state.authoritySuite.opportunityMatrix.map((o) =>
                o.id === taskId ? { ...o, isCompleted: !o.isCompleted } : o
              ),
            },
            lastUpdated: Date.now(),
          };
        });
      },

      // ── Step 3 Wizard section actions ─────────────────────────────────

      completeStep3Section(n) {
        set((state) => ({
          step3CompletedSections: state.step3CompletedSections.includes(n)
            ? state.step3CompletedSections
            : [...state.step3CompletedSections, n].sort((a, b) => a - b),
          lastUpdated: Date.now(),
        }));
      },

      resetStep3Section(n) {
        set((state) => ({
          step3CompletedSections: state.step3CompletedSections.filter((s) => s !== n),
          lastUpdated: Date.now(),
        }));
      },

      setStep3BrandIdentity(data) {
        set({ step3BrandIdentity: data, lastUpdated: Date.now() });
      },

      setStep3AssetOrder(order) {
        set({ step3AssetOrder: order, lastUpdated: Date.now() });
      },

      setStep3ClaimToAssetMap(map) {
        set({ step3ClaimToAssetMap: map, lastUpdated: Date.now() });
      },

      setStep3ContentRoadmap(roadmap) {
        set({ step3ContentRoadmap: roadmap, lastUpdated: Date.now() });
      },

      setStep3Blueprint(blueprint) {
        // Write to step3Blueprint and mirror to authorityBlueprint for Module 4 bridge
        set({
          step3Blueprint: blueprint,
          authorityBlueprint: blueprint,
          lastUpdated: Date.now(),
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

      setStage1ActiveSection(section: number) {
        set({ stage1ActiveSection: section, lastUpdated: Date.now() });
      },

      setStage1CompletedSections(sections: number[]) {
        set({ stage1CompletedSections: sections, lastUpdated: Date.now() });
      },

      setStage1Audit(auditData: Partial<Stage1AuditData>) {
        set((state) => ({
          stage1Audit: {
            selectedPlatforms: state.stage1Audit?.selectedPlatforms ?? [],
            auditStep: state.stage1Audit?.auditStep ?? 1,
            auditMode: state.stage1Audit?.auditMode ?? 'quiz',
            quizAnswers: state.stage1Audit?.quizAnswers ?? { headlineType: null, hasPinnedProof: null, hasSingleCta: null },
            pastedBio: state.stage1Audit?.pastedBio ?? '',
            isBioAnalyzed: state.stage1Audit?.isBioAnalyzed ?? false,
            diagnosticScore: state.stage1Audit?.diagnosticScore ?? null,
            dimensionScores: state.stage1Audit?.dimensionScores,
            completedAt: state.stage1Audit?.completedAt,
            ...auditData,
          },
          lastUpdated: Date.now(),
        }));
      },

      setStage1Identity(identityData: Partial<Stage1IdentityData>) {
        set((state) => {
          const nextActiveTone = identityData.activeTone ?? state.stage1Identity?.activeTone ?? 'executive';
          const hasToneChanged = state.stage1Identity?.activeTone !== nextActiveTone;
          
          let nextAuthoritySuite = state.authoritySuite;
          if (hasToneChanged && nextAuthoritySuite && identityData.activeTone) {
            nextAuthoritySuite = applyToneToSuite(nextAuthoritySuite, nextActiveTone, {
              market: (state.mod1MarketId || '').replace(/_/g, ' ') || 'clients',
              service: (state.mod1ServiceId || '').replace(/_/g, ' ') || 'systems',
              mechanism: state.mod2UniqueMechanism?.trim() || 'our proven methodology',
              promise: state.mod2ProposalSummary?.solution || 'delivering predictable results',
              positioning: state.mod1Positioning?.trim() || 'Specialist',
              primaryProofTitle: null, // Default fallback
              proofTitles: []
            });
          }

          return {
            stage1Identity: {
              userName: state.stage1Identity?.userName ?? '',
              userHandle: state.stage1Identity?.userHandle ?? '',
              positioningHeadline: state.stage1Identity?.positioningHeadline ?? '',
              proofLine: state.stage1Identity?.proofLine ?? '',
              activeTone: nextActiveTone,
              ...identityData,
            },
            authoritySuite: nextAuthoritySuite,
            lastUpdated: Date.now(),
          };
        });
      },

      setStage2ActiveSection(section: number) {
        set({ stage2ActiveSection: section, lastUpdated: Date.now() });
      },

      setStage2CompletedSections(sections: number[]) {
        set({ stage2CompletedSections: sections, lastUpdated: Date.now() });
      },

      setStage2Archetype(archetypeData: Partial<Stage2ArchetypeData>) {
        set((state) => ({
          stage2Archetype: {
            selectedArchetypeId: archetypeData.selectedArchetypeId ?? state.stage2Archetype?.selectedArchetypeId ?? 'proof_first',
            customNotes: archetypeData.customNotes ?? state.stage2Archetype?.customNotes ?? '',
            confirmedAt: archetypeData.confirmedAt ?? state.stage2Archetype?.confirmedAt ?? new Date().toISOString(),
            portfolioGoal: archetypeData.portfolioGoal !== undefined ? archetypeData.portfolioGoal : state.stage2Archetype?.portfolioGoal,
          },
          lastUpdated: Date.now(),
        }));
      },

      setStage2WireframeSettings(settings: Partial<Stage2WireframeSettings>) {
        set((state) => ({
          stage2WireframeSettings: {
            viewport: settings.viewport ?? state.stage2WireframeSettings?.viewport ?? 'desktop',
            fidelity: settings.fidelity ?? state.stage2WireframeSettings?.fidelity ?? 'wireframe',
            activeSectionId: settings.activeSectionId !== undefined ? settings.activeSectionId : (state.stage2WireframeSettings?.activeSectionId ?? 'section_hero'),
          },
          lastUpdated: Date.now(),
        }));
      },

      reorderPortfolioSections(reordered: PortfolioBlueprintSection[]) {
        set((state) => {
          if (!state.authoritySuite) return {};
          const indexed = reordered.map((sec, idx) => ({
            ...sec,
            sectionNumber: idx + 1,
          }));
          return {
            authoritySuite: {
              ...state.authoritySuite,
              portfolioBlueprint: indexed,
            },
            step3AssetOrder: indexed.map((s) => s.id),
            lastUpdated: Date.now(),
          };
        });
      },

      resetPortfolioSectionsToDefault() {
        set((state) => {
          if (!state.authoritySuite) return {};
          const sorted = [...state.authoritySuite.portfolioBlueprint].sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
            const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
            return numA - numB;
          }).map((sec, idx) => ({
            ...sec,
            sectionNumber: idx + 1,
            isEnabled: true,
          }));
          return {
            authoritySuite: {
              ...state.authoritySuite,
              portfolioBlueprint: sorted,
            },
            step3AssetOrder: sorted.map((s) => s.id),
            lastUpdated: Date.now(),
          };
        });
      },

      applyArchetypePreset(archetypeId: string) {
        set((state) => {
          if (!state.authoritySuite) return {};
          const archetype = PORTFOLIO_ARCHETYPES.find((a) => a.id === archetypeId);
          if (!archetype) return {};

          const currentSections = [...state.authoritySuite.portfolioBlueprint];
          const orderMap = new Map(archetype.recommendedOrder.map((id, idx) => [id, idx]));

          currentSections.sort((a, b) => {
            const idxA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999;
            const idxB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999;
            return idxA - idxB;
          });

          const reindexed = currentSections.map((sec, idx) => ({
            ...sec,
            sectionNumber: idx + 1,
            isEnabled: archetype.recommendedOrder.includes(sec.id),
          }));

          return {
            authoritySuite: {
              ...state.authoritySuite,
              portfolioBlueprint: reindexed,
            },
            step3AssetOrder: reindexed.map((s) => s.id),
            stage2Archetype: {
              selectedArchetypeId: archetypeId,
              confirmedAt: new Date().toISOString(),
              customNotes: state.stage2Archetype?.customNotes ?? '',
              portfolioGoal: state.stage2Archetype?.portfolioGoal,
            },
            lastUpdated: Date.now(),
          };
        });
      },

      restoreRecommendedStructure(archetypeId?: string) {
        set((state) => {
          if (!state.authoritySuite) return {};
          const targetArchId = archetypeId || state.stage2Archetype?.selectedArchetypeId || 'proof_first';
          const archetype = PORTFOLIO_ARCHETYPES.find((a) => a.id === targetArchId) || PORTFOLIO_ARCHETYPES[0];

          const currentSections = [...state.authoritySuite.portfolioBlueprint];
          const orderMap = new Map(archetype.recommendedOrder.map((id, idx) => [id, idx]));

          currentSections.sort((a, b) => {
            const idxA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999;
            const idxB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999;
            return idxA - idxB;
          });

          const restored = currentSections.map((sec, idx) => ({
            ...sec,
            sectionNumber: idx + 1,
            isEnabled: archetype.recommendedOrder.includes(sec.id),
          }));

          return {
            authoritySuite: {
              ...state.authoritySuite,
              portfolioBlueprint: restored,
            },
            step3AssetOrder: restored.map((s) => s.id),
            lastUpdated: Date.now(),
          };
        });
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
          // ── Step 3 Wizard section outputs
          step3CompletedSections: [],
          step3BrandIdentity: null,
          step3AssetOrder: null,
          step3ClaimToAssetMap: null,
          step3ContentRoadmap: null,
          step3Blueprint: null,
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
      version: 9,
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
        if (version < 9) {
          state = {
            ...state,
            step3CompletedSections: [],
            step3BrandIdentity: null,
            step3AssetOrder: null,
            step3ClaimToAssetMap: null,
            step3ContentRoadmap: null,
            step3Blueprint: null,
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
        skippedAssets: state.skippedAssets,
        authoritySuite: state.authoritySuite,
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
        // ── Step 3 Wizard section outputs
        step3CompletedSections: state.step3CompletedSections,
        step3BrandIdentity: state.step3BrandIdentity,
        step3AssetOrder: state.step3AssetOrder,
        step3ClaimToAssetMap: state.step3ClaimToAssetMap,
        step3ContentRoadmap: state.step3ContentRoadmap,
        step3Blueprint: state.step3Blueprint,
        authorityBlueprint: state.authorityBlueprint,
        // ── Stage 1 (Profile Strategy) Studio Persistence
        stage1ActiveSection: state.stage1ActiveSection,
        stage1CompletedSections: state.stage1CompletedSections,
        stage1Audit: state.stage1Audit,
        stage1Identity: state.stage1Identity,
        // ── Stage 2 (Portfolio Architecture) Studio Persistence
        stage2ActiveSection: state.stage2ActiveSection,
        stage2CompletedSections: state.stage2CompletedSections,
        stage2Archetype: state.stage2Archetype,
        stage2WireframeSettings: state.stage2WireframeSettings,
      }),
    },
  ),
);
