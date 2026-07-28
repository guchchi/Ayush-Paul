import { z } from 'zod';

export const PriorityLevelSchema = z.enum(['high', 'medium', 'low']);
export const ActionItemStatusSchema = z.enum(['pending', 'in-progress', 'completed']);
export const PackStatusSchema = z.enum(['draft', 'generating', 'ready', 'error']);

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ExecutiveSummarySchema = z.object({
  strategyOverview: z.string().min(1),
  keyInsight: z.string().min(1),
  primaryRecommendation: z.string().min(1),
  readingGuidance: z.string().min(1),
});

export const StrategicPillarSchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  rationale: z.string().min(1),
});

export const ActionItemSchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: PriorityLevelSchema,
  status: ActionItemStatusSchema,
});

export const AuthorityPackSchema = BaseEntitySchema.extend({
  version: z.string(),
  status: PackStatusSchema,
  executiveSummary: ExecutiveSummarySchema.nullable(),
  strategicPillars: z.array(StrategicPillarSchema),
  actionPlan: z.array(ActionItemSchema),
});

export const PackNoteSchema = BaseEntitySchema.extend({
  packId: z.string().uuid(),
  sectionId: z.string(),
  content: z.string(),
});

export const PackBookmarkSchema = BaseEntitySchema.extend({
  packId: z.string().uuid(),
  sectionId: z.string(),
});
