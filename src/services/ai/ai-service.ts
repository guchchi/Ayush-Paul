import { getAIProvider } from './index';
import { buildStep3Prompt, Step3PromptContext, STEP3_PROMPT_VERSION } from './prompts/module3/step3-prompt';
import { validateAndSanitizeStep3Strategy } from './schema/module3-step3';
import { hashObject, deepMergePreserve } from './utils';

// Simple in-memory cache
const cache = new Map<string, any>();

export interface GenerationOptions {
  signal?: AbortSignal;
  fieldsToPreserve?: Record<string, any>;
  skipCache?: boolean;
}

export async function generateStep3Strategy(context: Step3PromptContext, options?: GenerationOptions) {
  const provider = getAIProvider();
  
  // 1. Context Hashing for Cache
  const contextHash = await hashObject(context);
  if (!options?.skipCache && cache.has(contextHash)) {
    return cache.get(contextHash);
  }

  // 2. Build Prompt
  const prompt = buildStep3Prompt(context);

  // 3. Generate via Provider (with basic retry logic for 429s)
  let generatedData: any;
  let attempts = 0;
  const maxRetries = 3;

  while (attempts < maxRetries) {
    try {
      generatedData = await provider.generateJSON(prompt, "Expected JSON schema is provided in prompt", options?.signal);
      break;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      attempts++;
      if (attempts >= maxRetries) {
        throw new Error(`AI generation failed after ${maxRetries} attempts. Last error: ${error.message}`);
      }
      // Exponential backoff
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempts)));
    }
  }

  // 4. Validate and Sanitize (Zod + Business logic)
  let validatedData;
  try {
    validatedData = validateAndSanitizeStep3Strategy(generatedData);
  } catch (validationError: any) {
    throw new Error(`Failed to validate AI output: ${validationError.message}`);
  }

  // 5. Apply User Edits Merge (if regenerating)
  if (options?.fieldsToPreserve) {
    validatedData = deepMergePreserve(validatedData, options.fieldsToPreserve);
  }

  // 6. Attach Generation Metrics
  const finalData = {
    ...validatedData,
    version: STEP3_PROMPT_VERSION,
    generatedAt: new Date().toISOString(),
    _metadata: {
      model: provider.getModelName(),
      promptVersion: STEP3_PROMPT_VERSION,
    }
  };

  // 7. Cache the result
  cache.set(contextHash, finalData);

  return finalData;
}
