import type { Module3State, Module4BridgeContext, ProfileCopy, PortfolioCopy } from '../../types/module3';

export const Module4BridgeAdapter = {
  generateContext(state: Module3State): Module4BridgeContext {
    const suite = state.authoritySuite;

    // Helper to extract brand asset or profile field value
    const getBrandAsset = (id: string) => suite?.brandAssets.find((a) => a.id === id)?.value;
    const getLinkedInField = (key: string) =>
      suite?.profileSystem.find((p) => p.platform === 'linkedin')?.fields.find((f) => f.key === key)?.value;

    // Generate ProfileCopy structure using persisted suite
    const legacyProfileCopy: ProfileCopy = {
      professionalHeadline: getLinkedInField('headline') || state.authorityProfile?.position || state.authorityPosition || 'Expert',
      shortBio: getBrandAsset('brand_positioning') || state.authorityProfile?.coreTrustPromise || state.coreTrustPromise || '',
      longBio: getLinkedInField('about') || state.profilePortfolioStrategy?.profileStrategy.bio || '',
      offerStatement: getBrandAsset('brand_value_prop') || state.profilePortfolioStrategy?.profileStrategy.bannerConcept || '',
      credibilityBullets: state.profilePortfolioStrategy?.trustStrategy.recommendedElements || [
        getBrandAsset('brand_promise') || 'Verifiable outputs',
        getBrandAsset('brand_diff') || 'Direct implementation',
      ],
      proofReferenceLine: state.profilePortfolioStrategy?.trustStrategy.priority || getBrandAsset('brand_pitch60') || '',
      ctaLine: getLinkedInField('featured_cta') || state.profilePortfolioStrategy?.profileStrategy.callToAction || 'View my work below.',
    };

    const heroSection = suite?.portfolioBlueprint.find((s) => s.id === 'section_hero');

    // Generate PortfolioCopy structure using persisted suite
    const legacyPortfolioCopy: PortfolioCopy = {
      portfolioCta: heroSection?.ctaText || 'Access Authority Portfolio →',
      sections: suite
        ? suite.portfolioBlueprint.map((section, idx) => ({
            type: `section-${idx + 1}`,
            heading: section.headline ? `${section.title}: ${section.headline}` : section.title,
            body: `${section.subheadline ? section.subheadline + '\n\n' : ''}${section.bodyCopy || ''}`,
            bullets: section.trustStatement ? [section.trustStatement] : [],
          }))
        : state.profilePortfolioStrategy?.portfolioStrategy.recommendedStructure.map((section, idx) => ({
            type: `section-${idx}`,
            heading: section,
            body: '',
            bullets: [],
          })) || [],
    };

    return {
      mod1CareerTrackId: state.mod1CareerTrackId,
      mod1ServiceId: state.mod1ServiceId,
      mod1MarketId: state.mod1MarketId,
      mod1NicheId: state.mod1NicheId,
      mod1OfferId: state.mod1OfferId,
      mod1Positioning: state.mod1Positioning,
      mod2OfferType: state.mod2OfferType,
      mod2Deliverables: state.mod2Deliverables,
      mod2UniqueMechanism: state.mod2UniqueMechanism,
      mod2ScopeLimits: state.mod2ScopeLimits as Record<string, any>,
      mod2ValueAmplifier: state.mod2ValueAmplifier,
      mod2PricingModel: state.mod2PricingModel,
      mod2ProposalSummary: state.mod2ProposalSummary as Record<string, any>,
      
      mod3AuthorityPosition: state.authorityProfile?.position || state.authorityPosition || 'builder',
      mod3CoreTrustPromise: getBrandAsset('brand_promise') || state.authorityProfile?.coreTrustPromise || state.coreTrustPromise,
      mod3ProofPriorities: state.proofPriorities.map((p) => ({
        id: p.id,
        gapTitle: p.gapTitle,
        gapDescription: p.gapDescription,
        recommendedFormat: p.recommendedFormat,
      })),
      mod3ProofAssets: state.proofAssets.map((a) => ({
        id: a.id,
        priorityId: a.priorityId,
        title: a.title,
        assetType: a.assetType,
        credibilityGapProved: a.credibilityGapProved,
        portfolioCopy: {
          headline: a.portfolioCopy.headline,
          description: a.portfolioCopy.description,
          proofStatement: a.portfolioCopy.proofStatement,
          cta: a.portfolioCopy.cta,
        },
        presentationStructure: a.presentationStructure,
        isAccepted: a.isAccepted,
        deliverables: a.deliverables,
        completionChecklist: a.completionChecklist,
      })),
      
      mod3ProfileCopy: legacyProfileCopy,
      mod3PortfolioCopy: legacyPortfolioCopy,
    };
  },

  validateBridgeReadiness(state: Module3State): { isReady: boolean; missingItems: string[] } {
    const missingItems: string[] = [];

    if (!state.mod1ServiceId && !state.authorityPosition) {
      missingItems.push('Upstream positioning context from Module 1 & 2');
    }
    if (!state.proofAssets || state.proofAssets.length === 0) {
      missingItems.push('At least one configured proof asset');
    }
    if (!state.authoritySuite && !state.profilePortfolioStrategy) {
      missingItems.push('Generated authority suite or profile copy');
    }

    return {
      isReady: missingItems.length === 0,
      missingItems,
    };
  },

  exportBridgePayloadAsJSON(state: Module3State): string {
    const ctx = this.generateContext(state);
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: 9,
        sourceModule: 'Module3AuthoritySystem',
        targetModule: 'Module4PortfolioSystem',
        context: ctx,
      },
      null,
      2
    );
  }
};
