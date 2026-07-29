
import { AuthorityPackContext } from './contextBuilder';

/**
 * Pure function: Context -> Prompt
 * Never accesses stores, repos, or AI.
 */
export class AuthorityPackPromptBuilder {
  static buildGenerationPrompt(context: AuthorityPackContext): string {
    return `
You are an expert strategist for Blueprint OS. Your task is to generate a comprehensive, actionable, and highly educational "Authority Pack" based on the user's strategy inputs.

Context provided:
- Target Audience: ${context.targetAudience}
- Core Topic/Problem: ${context.coreTopic}
- Niche: ${context.niche}
- Offer Type: ${context.offerType}
- Unique Mechanism: ${context.uniqueMechanism}
- Chosen Authority Position: ${context.authorityPosition}
- Core Trust Promise: ${context.coreTrustPromise}

CRITICAL REQUIREMENT: Educational Value
For every recommendation, section, or strategic point you provide in the Authority Pack, you MUST include a "Why this matters" or "Educational rationale" block. Do not just tell the user what to do—explain WHY it works based on human psychology, market dynamics, and authority building principles.

Ensure the output strictly follows the provided JSON schema.
The JSON should map to blocks that contain clear headings, paragraphs, and lists. Where appropriate, add distinct blocks with a 'quote' or 'callout' style for the "Why this matters" educational notes to make them stand out visually.
`;
  }
}
