import type { Module3State, Module4BridgeContext, ProfileCopy, PortfolioCopy } from '../../types/module3';

export const Module4BridgeAdapter = {
  generateContext(state: Module3State): Module4BridgeContext {
    // Generate legacy ProfileCopy structure from the structural strategy
    const legacyProfileCopy: ProfileCopy = {
      professionalHeadline: state.authorityProfile?.position || state.authorityPosition || 'Expert',
      shortBio: state.authorityProfile?.coreTrustPromise || state.coreTrustPromise || '',
      longBio: state.profilePortfolioStrategy?.profileStrategy.bio || '',
      offerStatement: state.profilePortfolioStrategy?.profileStrategy.bannerConcept || '',
      credibilityBullets: state.profilePortfolioStrategy?.trustStrategy.recommendedElements || [],
      proofReferenceLine: state.profilePortfolioStrategy?.trustStrategy.priority || '',
      ctaLine: state.profilePortfolioStrategy?.profileStrategy.callToAction || 'View my work below.',
    };

    // Generate legacy PortfolioCopy structure from the structural strategy
    const legacyPortfolioCopy: PortfolioCopy = {
      portfolioCta: 'Let\'s talk',
      sections: state.profilePortfolioStrategy?.portfolioStrategy.recommendedStructure.map((section, idx) => ({
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
      mod3CoreTrustPromise: state.authorityProfile?.coreTrustPromise || state.coreTrustPromise,
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
  }
};
