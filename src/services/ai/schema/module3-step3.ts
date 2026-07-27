import { z } from 'zod';

const educationalBlockSchema = z.object({
  why: z.string(),
  principle: z.string(),
  commonMistake: z.string(),
});

const strategyMetadataSchema = z.object({
  sectionId: z.string(),
  impact: z.enum(['High', 'Medium', 'Low']),
  difficulty: z.enum(['Hard', 'Medium', 'Easy']),
  estimatedMinutes: z.number().int(),
  expectedOutcome: z.string(),
  firstAction: z.string(),
  recommendedAssets: z.array(z.string()).optional(),
  nextStepDependencies: z.array(z.string()).optional(),
});

export const strategySummarySchema = z.object({
  primaryPlatform: z.string(),
  primaryGoal: z.string(),
  targetClient: z.string(),
  portfolioStyle: z.string(),
  contentStrategy: z.string(),
  biggestOpportunity: z.string(),
});

export const platformRecommendationSchema = z.object({
  platform: z.string(),
  priority: z.number().int().min(1).max(3),
  purpose: z.string(),
  action: z.enum(['focus', 'maintain', 'ignore', 'explore']),
  aiReasoning: z.string(),
  expectedRoi: z.string(),
  timeToResults: z.string(),
  difficulty: z.string(),
});

export const platformStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  recommendations: z.array(platformRecommendationSchema),
});

export const profileStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  username: z.string(),
  displayName: z.string(),
  headline: z.string(),
  bio: z.string(),
  bannerConcept: z.string(),
  profileImageConcept: z.string(),
  callToAction: z.string(),
});

export const portfolioStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  recommendedStructure: z.array(z.string()),
  projectOrdering: z.array(z.string()),
  navigation: z.array(z.string()),
  contentHierarchy: z.string(),
});

export const trustStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  recommendedElements: z.array(z.string()),
  priority: z.string(),
});

export const contentStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  contentTypes: z.array(z.string()),
  publishingFrequency: z.string(),
  authorityBuildingIdeas: z.array(z.string()),
});

export const brandingStrategySchema = z.object({
  personalizationNote: z.string(),
  educational: educationalBlockSchema,
  metadata: strategyMetadataSchema,
  visualConsistency: z.string(),
  typography: z.string(),
  colorUsage: z.string(),
  toneOfVoice: z.string(),
});

export const optimizationRecommendationSchema = z.object({
  area: z.string(),
  suggestion: z.string(),
  impact: z.enum(['High', 'Medium', 'Low']),
});

export const publishingRoadmapSchema = z.object({
  week: z.string(),
  tasks: z.array(z.string()),
});

export const step3StrategySchema = z.object({
  version: z.number().int(),
  strategySummary: strategySummarySchema,
  platformStrategy: platformStrategySchema,
  profileStrategy: profileStrategySchema,
  portfolioStrategy: portfolioStrategySchema,
  trustStrategy: trustStrategySchema,
  contentStrategy: contentStrategySchema,
  brandingStrategy: brandingStrategySchema,
  optimizationRecommendations: z.array(optimizationRecommendationSchema),
  publishingRoadmap: z.array(publishingRoadmapSchema),
  status: z.enum(['draft', 'approved', 'archived']).default('draft'),
});

export function validateAndSanitizeStep3Strategy(data: unknown) {
  // 1. Zod runtime validation
  const parsed = step3StrategySchema.parse(data);

  // 2. Business Logic Validation
  // 2. Business Logic Validation
  if (parsed.platformStrategy.recommendations.length > 0) {
    const hasPriority1 = parsed.platformStrategy.recommendations.some(p => p.priority === 1);
    if (!hasPriority1) {
      parsed.platformStrategy.recommendations[0].priority = 1;
    }
  }

  return parsed;
}
