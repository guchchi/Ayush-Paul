import type { GeneratedAuthoritySuite, ProfileSystemAsset } from '../../data/module3/authority-suite-engine';
import { PlatformCopyEngine, PlatformCopyContext, ToneType } from './platform-copy-engine';

export type { ToneType };

export interface ToneContext {
  market: string;
  service: string;
  mechanism: string;
  promise: string;
  positioning: string;
  primaryProofTitle: string | null;
  proofTitles: string[];
}

export function applyToneToSuite(
  suite: GeneratedAuthoritySuite,
  tone: ToneType,
  ctx: ToneContext
): GeneratedAuthoritySuite {
  // Map ToneContext to PlatformCopyContext
  const copyContext: PlatformCopyContext = {
    marketId: ctx.market,
    serviceId: ctx.service,
    mechanism: ctx.mechanism,
    promise: ctx.promise,
    positioning: ctx.positioning,
    primaryProofTitle: ctx.primaryProofTitle,
    proofTitles: ctx.proofTitles,
  };

  // Generate a fresh set of profiles for all platforms using the requested tone
  const freshProfiles = PlatformCopyEngine.generateProfiles(copyContext, 0, tone);

  const newProfileSystem: ProfileSystemAsset[] = freshProfiles.map(freshAsset => {
    // Check if the asset existed in the old suite to preserve customizations
    const existingAsset = suite.profileSystem.find(p => p.platform === freshAsset.platform);
    
    if (!existingAsset) {
      return freshAsset;
    }

    return {
      ...freshAsset,
      fields: freshAsset.fields.map(freshField => {
        const existingField = existingAsset.fields.find(f => f.key === freshField.key);
        // If the user customized the field, keep the customized value
        if (existingField && (existingField.isCustomized || existingField.value !== existingField.originalValue)) {
          return {
            ...freshField,
            value: existingField.value,
            isCustomized: true,
          };
        }
        return freshField;
      }),
    };
  });

  return {
    ...suite,
    profileSystem: newProfileSystem,
  };
}
