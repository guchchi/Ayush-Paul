export interface AuthorityPackContext {
  targetAudience: string;
  coreTopic: string;
  niche: string;
  offerType: string;
  uniqueMechanism: string;
  authorityPosition: string;
  coreTrustPromise: string;
}

/**
 * Gathers state into a single authoritative context object.
 */
export class AuthorityPackContextBuilder {
  buildContext(rawInputs?: any): AuthorityPackContext {
    return {
      targetAudience: rawInputs?.mod1MarketId || 'General Audience',
      coreTopic: rawInputs?.mod1ServiceId || 'General Topic',
      niche: rawInputs?.mod1NicheId || 'General Niche',
      offerType: rawInputs?.mod2OfferType || 'Standard Offer',
      uniqueMechanism: rawInputs?.mod2UniqueMechanism || 'Standard Framework',
      authorityPosition: rawInputs?.authorityPosition || 'Expert',
      coreTrustPromise: rawInputs?.coreTrustPromise || 'Deliver great results'
    };
  }
}
