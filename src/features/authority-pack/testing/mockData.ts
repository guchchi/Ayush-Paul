import type { AuthorityPackDomain } from '../types';

// eslint-disable-next-line no-restricted-syntax
export const MOCK_AUTHORITY_PACK: AuthorityPackDomain = {
  id: 'mock-pack-123',
  version: '1.0',
  status: 'ready',
  createdAt: '2026-07-01T10:00:00.000Z',
  updatedAt: '2026-07-01T10:00:00.000Z',
  executiveSummary: {
    strategyOverview: 'Positioning as the premier expert in AI-driven operational efficiency.',
    keyInsight: 'Your audience struggles with implementation, not ideation.',
    primaryRecommendation: 'Shift content from theoretical frameworks to practical, reproducible blueprints.',
    readingGuidance: 'Review the Strategic Pillars first to understand the core narrative shift.'
  },
  strategicPillars: [
    {
      id: 'pillar-1',
      title: 'The Implementation Gap',
      description: 'Focus on bridging the gap between AI theory and daily business operations.',
      rationale: 'Most competitors sell the dream; you sell the mechanics.',
      createdAt: '2026-07-01T10:00:00.000Z',
      updatedAt: '2026-07-01T10:00:00.000Z'
    }
  ],
  actionPlan: [
    {
      id: 'action-1',
      title: 'Publish Blueprint Repository',
      description: 'Release 3 comprehensive operational blueprints on your primary channel.',
      priority: 'high',
      status: 'pending',
      createdAt: '2026-07-01T10:00:00.000Z',
      updatedAt: '2026-07-01T10:00:00.000Z'
    }
  ]
};
