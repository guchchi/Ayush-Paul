export const STEP3_PROMPT_VERSION = 2;

export interface Step3PromptContext {
  module1: {
    niche: string;
    targetAudience: string;
    coreProblem: string;
    uniqueMechanism: string;
  };
  module2: {
    offerName: string;
    pricePoint: string;
    promise: string;
  };
  authorityProfile: {
    position: string;
    summary: string;
    coreTrustPromise: string;
  };
  fieldsToPreserve?: Record<string, any>; 
}

export function buildStep3Prompt(context: Step3PromptContext): string {
  let prompt = `You are an elite Brand Strategist and Authority Consultant.
Your task is to generate a comprehensive Profile & Portfolio Strategy for an expert consultant.

CONTEXT:
---
Target Audience: ${context.module1.targetAudience}
Niche: ${context.module1.niche}
Core Problem Solved: ${context.module1.coreProblem}
Unique Mechanism: ${context.module1.uniqueMechanism}
Offer: ${context.module2.offerName} at ${context.module2.pricePoint} (${context.module2.promise})
Position: ${context.authorityProfile.position}
Summary: ${context.authorityProfile.summary}
Core Trust Promise: ${context.authorityProfile.coreTrustPromise}
---

REQUIREMENTS:
- The tone should be authoritative, structured, and premium.
- Output MUST be strictly in JSON format matching the schema described.
- Do NOT include any markdown formatting around the JSON (no \`\`\`json). Just return the raw JSON object.
- **PERSONALIZATION**: In every "personalizationNote" field, you MUST explicitly reference the user's specific context (e.g., "Because your offer targets [Target Audience]...").
- **EDUCATIONAL FRAMEWORK**: For every "educational" object, follow this exact structure:
  - 'why': Explain the reasoning briefly.
  - 'commonMistake': Point out a pitfall to avoid.
  - 'firstAction': Give one immediate micro-action.
  - 'expectedResult': Describe the tangible outcome of doing this.

`;

  if (context.fieldsToPreserve && Object.keys(context.fieldsToPreserve).length > 0) {
    prompt += `
PRESERVATION INSTRUCTIONS:
The user has previously edited certain fields. You MUST retain the exact values for the following fields in your output:
${JSON.stringify(context.fieldsToPreserve, null, 2)}
`;
  }

  prompt += `
EXPECTED JSON SCHEMA:
{
  "version": ${STEP3_PROMPT_VERSION},
  "strategySummary": {
    "primaryPlatform": "string",
    "primaryGoal": "string",
    "targetClient": "string",
    "portfolioStyle": "string",
    "contentStrategy": "string"
  },
  "platformStrategy": [
    {
      "platform": "string (e.g. LinkedIn, Twitter, Website)",
      "priority": "number (1, 2, or 3)",
      "purpose": "string",
      "action": "string (focus, maintain, ignore, or explore)",
      "aiReasoning": "string",
      "expectedRoi": "string",
      "timeToResults": "string",
      "difficulty": "string (Low, Medium, High)"
    }
  ],
  "profileStrategy": {
    "personalizationNote": "string",
    "educational": { "why": "string", "commonMistake": "string", "firstAction": "string", "expectedResult": "string" },
    "username": "string",
    "displayName": "string",
    "headline": "string (Focus on outcomes and the offer promise)",
    "bio": "string",
    "bannerConcept": "string",
    "profileImageConcept": "string",
    "callToAction": "string"
  },
  "portfolioStrategy": {
    "personalizationNote": "string",
    "educational": { "why": "string", "commonMistake": "string", "firstAction": "string", "expectedResult": "string" },
    "recommendedStructure": ["string"],
    "projectOrdering": ["string"],
    "navigation": ["string"],
    "contentHierarchy": "string"
  },
  "trustStrategy": {
    "personalizationNote": "string",
    "educational": { "why": "string", "commonMistake": "string", "firstAction": "string", "expectedResult": "string" },
    "recommendedElements": ["string"],
    "priority": "string"
  },
  "contentStrategy": {
    "personalizationNote": "string",
    "educational": { "why": "string", "commonMistake": "string", "firstAction": "string", "expectedResult": "string" },
    "contentTypes": ["string"],
    "publishingFrequency": "string",
    "authorityBuildingIdeas": ["string"]
  },
  "brandingStrategy": {
    "personalizationNote": "string",
    "educational": { "why": "string", "commonMistake": "string", "firstAction": "string", "expectedResult": "string" },
    "visualConsistency": "string",
    "typography": "string",
    "colorUsage": "string",
    "toneOfVoice": "string"
  },
  "optimizationRecommendations": [
    {
      "area": "string",
      "suggestion": "string",
      "impact": "string (High, Medium, or Low)"
    }
  ],
  "publishingRoadmap": [
    {
      "week": "string (e.g. Week 1, Week 2)",
      "tasks": ["string"]
    }
  ],
  "status": "draft"
}
`;

  return prompt;
}
