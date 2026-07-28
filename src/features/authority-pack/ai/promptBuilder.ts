
import { AuthorityPackContext } from './contextBuilder';

/**
 * Pure function: Context -> Prompt
 * Never accesses stores, repos, or AI.
 */
export class AuthorityPackPromptBuilder {
  static buildGenerationPrompt(context: AuthorityPackContext): string {
    return `
You are an expert strategist.
Generate an Authority Pack for the following context:
Topic: ${context.coreTopic}
Target Audience: ${context.targetAudience}

Ensure the output strictly follows the provided JSON schema.
`;
  }
}
