import { IEIO, IXIO } from '../types/objects';
import { getAIProvider } from '../../../../services/ai/index';

export interface UserContext {
  [key: string]: any;
}

export class AIRenderer {
  private static instance: AIRenderer;

  private constructor() {}

  public static getInstance(): AIRenderer {
    if (!AIRenderer.instance) {
      AIRenderer.instance = new AIRenderer();
    }
    return AIRenderer.instance;
  }

  /**
   * Renders personalized content deterministically using the EIO, XIO, and UserContext.
   */
  public async renderWorkflow<T>(xio: IXIO, eio: IEIO, userContext: UserContext, signal?: AbortSignal): Promise<T> {
    const provider = getAIProvider();

    // 1. Construct Deterministic Prompt
    const prompt = `
You are a personalized UI renderer for the Blueprint Operating System.
Your job is strictly to adapt the provided Educational Knowledge (EIO) and Execution Workflow (XIO) to the user's context.

CRITICAL RULES:
1. DO NOT invent new educational frameworks.
2. DO NOT change the Core Concept.
3. You MUST output JSON that matches the expected output fields of the workflow.

--- EIO (KNOWLEDGE) ---
Core Concept: ${eio.education.coreConcept}
Beginner Explanation: ${eio.education.explanations.beginner || 'N/A'}
Intermediate Explanation: ${eio.education.explanations.intermediate || 'N/A'}
Mental Models: ${(eio.education.mentalModels || []).join(', ')}
Common Mistakes: ${(eio.education.commonMistakes || []).join(', ')}

--- XIO (WORKFLOW) ---
Objective: ${xio.workflow.objective}
Expected Outputs: ${xio.workflow.outputs.join(', ')}
Practice Prompt: ${xio.practice?.prompt || 'N/A'}

--- USER CONTEXT ---
${JSON.stringify(userContext, null, 2)}

--- INSTRUCTIONS ---
Generate the exact expected outputs tailored to this user context, applying the exact knowledge from the EIO. Return a JSON object where the keys are the "Expected Outputs".
    `;

    const schemaDesc = `JSON object with keys: ${xio.workflow.outputs.join(', ')}`;

    // 2. Call AI Provider
    let result: T;
    try {
      result = await provider.generateJSON<T>(prompt, schemaDesc, signal);
    } catch (error: any) {
      throw new Error(`AIRenderer Failed: ${error.message}`, { cause: error });
    }

    // 3. Return Raw Output
    return result;
  }
}
