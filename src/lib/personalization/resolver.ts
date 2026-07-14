import type { PersonalizationContext, PersonalizationContextM1, PersonalizationContextM2, PersonalizationContextM3, PersonalizedContentBase, NicheSemanticMetadata } from './types';
import { resolveServiceContentProfile, resolveCanonicalMarketModifier, resolveNicheMetadata } from '../../data/personalization';

export { resolvePersonalizationContext, resolveM1Context, resolveM2Context, resolveM3Context } from './context';

export function resolveServiceNiche(
  serviceId: string | null,
  marketId: string | null,
  nicheId: string,
  nicheLabel: string,
) {
  const serviceProfile = resolveServiceContentProfile(serviceId);
  const marketModifier = resolveCanonicalMarketModifier(marketId ?? '');
  const nicheResolution = resolveNicheMetadata(nicheId, nicheLabel, serviceId ?? '', marketId ?? '');
  return { serviceProfile, marketModifier, nicheResolution };
}

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function composeExamples(
  serviceId: string | null,
  nicheMetadata: NicheSemanticMetadata | null,
  count: number = 2,
  variantKey?: string,
): string[] {
  const profile = resolveServiceContentProfile(serviceId);
  const examples: string[] = [];
  if (nicheMetadata && nicheMetadata.exampleSubjects.length > 0) {
    const src = nicheMetadata.exampleSubjects;
    if (variantKey && src.length >= count) {
      /* Rotate within niche subjects AND reserve 1 slot for profile to prevent
         cross-service overlap when services share the same niche */
      const nicheCount = count - 1;
      if (nicheCount > 0) {
        const offset = hashCode(variantKey) % (src.length - nicheCount + 1);
        examples.push(...src.slice(offset, offset + nicheCount));
      }
    } else {
      examples.push(...src.slice(0, count));
    }
  }
  const profileExamples = profile.exampleSubjectPatterns;
  for (let i = 0; i < count && examples.length < count; i++) {
    if (!examples.includes(profileExamples[i])) examples.push(profileExamples[i]);
  }
  return examples.slice(0, count);
}

export function composeHelperText(
  helperTextConcepts: string[],
  count: number = 1,
): string {
  if (helperTextConcepts.length === 0) return '';
  return helperTextConcepts.slice(0, count).join('. ') + '.';
}

export function composeEmptyStateGuidance(
  emptyStateActionConcepts: string[],
  count: number = 2,
): string {
  if (emptyStateActionConcepts.length === 0) return 'Complete the previous steps to get started.';
  const items = emptyStateActionConcepts.slice(0, count);
  return items.map((i) => `${i}.`).join(' ');
}

export function composePersonalizedStepContent(
  ctx: PersonalizationContext,
  stepArea: string,
): PersonalizedContentBase {
  const serviceId = ctx.m1.serviceId;
  const nicheId = ctx.m1.nicheId;
  const profile = resolveServiceContentProfile(serviceId);
  const marketModifier = resolveCanonicalMarketModifier(ctx.m1.marketId ?? '');

  let nicheMetadata: NicheSemanticMetadata | null = null;
  if (nicheId) {
    nicheMetadata = resolveNicheMetadata(nicheId, ctx.m1.nicheLabel, serviceId ?? '', ctx.m1.marketId ?? '').metadata;
  }

  const examples = composeExamples(serviceId, nicheMetadata, 2, ctx.m1.marketId ?? undefined);
  const helperText = composeHelperText(profile.helperTextConcepts, 1);
  const emptyStateGuidance = composeEmptyStateGuidance(profile.emptyStateActionConcepts, 2);

  return { examples, helperText, emptyStateGuidance };
}
