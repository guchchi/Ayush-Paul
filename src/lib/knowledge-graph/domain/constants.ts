export const NODE_TYPES = [
  // Hierarchy
  'BRAND',
  'ECOSYSTEM',
  'PRODUCT',
  'MODULE',
  'STEP',
  'COURSE',
  'LESSON',
  // First-Class Content Node
  'CONTENT',
  // Studio Execution Assets
  'TOOL',
  'TEMPLATE',
  'WORKSHEET',
  'PROMPT',
  'WORKFLOW',
  'AUTOMATION',
  'AI_AGENT',
  // Content & Support
  'BLOG',
  'FAQ',
  'CASE_STUDY',
  'RESOURCE',
  // SEO & Semantic Intelligence
  'ENTITY',
  'KEYWORD',
  // Taxonomy
  'CATEGORY',
  'TAG',
  'PERSONA',
  'INDUSTRY',
  'SKILL'
] as const;

export type ThePaulXNodeType = (typeof NODE_TYPES)[number];

export const RELATION_TYPES = [
  'HAS_PARENT',
  'HAS_CHILD',
  'HAS_CONTENT',
  'BELONGS_TO',
  'NEXT_STEP',
  'PREVIOUS_STEP',
  'REQUIRES',
  'IMPLEMENTS',
  'GENERATES',
  'SOLVES',
  'SUPPORTS',
  'RECOMMENDS',
  'EXPLAINS',
  'UPSELLS',
  'IS_ALTERNATIVE_TO',
  'RELATED_TO',
  'TARGETS',
  'MENTIONS'
] as const;

export type ThePaulXRelationType = (typeof RELATION_TYPES)[number];

export interface EdgeConstraint {
  relationType: ThePaulXRelationType;
  allowedSources: ThePaulXNodeType[];
  allowedTargets: ThePaulXNodeType[];
  semanticMeaning: string;
}

export const EDGE_CONSTRAINTS: Record<ThePaulXRelationType, EdgeConstraint> = {
  HAS_PARENT: {
    relationType: 'HAS_PARENT',
    allowedSources: ['ECOSYSTEM', 'PRODUCT', 'MODULE', 'STEP', 'LESSON', 'CONTENT'],
    allowedTargets: ['BRAND', 'ECOSYSTEM', 'PRODUCT', 'MODULE', 'COURSE', 'STEP'],
    semanticMeaning: 'Child node points up to parent node in hierarchy'
  },
  HAS_CHILD: {
    relationType: 'HAS_CHILD',
    allowedSources: ['BRAND', 'ECOSYSTEM', 'PRODUCT', 'MODULE', 'COURSE', 'STEP'],
    allowedTargets: ['ECOSYSTEM', 'PRODUCT', 'MODULE', 'STEP', 'LESSON', 'CONTENT'],
    semanticMeaning: 'Parent node points down to child node'
  },
  HAS_CONTENT: {
    relationType: 'HAS_CONTENT',
    allowedSources: ['STEP', 'PRODUCT', 'MODULE', 'BLOG', 'LESSON', 'FAQ', 'TOOL', 'TEMPLATE'],
    allowedTargets: ['CONTENT'],
    semanticMeaning: 'Node links to its first-class Content node'
  },
  BELONGS_TO: {
    relationType: 'BELONGS_TO',
    allowedSources: ['TOOL', 'TEMPLATE', 'WORKSHEET', 'PROMPT', 'WORKFLOW', 'AUTOMATION', 'AI_AGENT', 'BLOG', 'FAQ', 'CASE_STUDY', 'RESOURCE', 'CONTENT'],
    allowedTargets: ['ECOSYSTEM', 'PRODUCT', 'BRAND', 'STEP'],
    semanticMeaning: 'Asset ownership relationship'
  },
  NEXT_STEP: {
    relationType: 'NEXT_STEP',
    allowedSources: ['STEP', 'MODULE', 'LESSON'],
    allowedTargets: ['STEP', 'MODULE', 'LESSON'],
    semanticMeaning: 'Linear sequence successor'
  },
  PREVIOUS_STEP: {
    relationType: 'PREVIOUS_STEP',
    allowedSources: ['STEP', 'MODULE', 'LESSON'],
    allowedTargets: ['STEP', 'MODULE', 'LESSON'],
    semanticMeaning: 'Linear sequence predecessor'
  },
  REQUIRES: {
    relationType: 'REQUIRES',
    allowedSources: ['STEP', 'MODULE', 'PRODUCT', 'COURSE'],
    allowedTargets: ['STEP', 'MODULE', 'PRODUCT', 'COURSE'],
    semanticMeaning: 'Hard prerequisite block'
  },
  IMPLEMENTS: {
    relationType: 'IMPLEMENTS',
    allowedSources: ['STEP', 'LESSON'],
    allowedTargets: ['TOOL', 'TEMPLATE', 'WORKSHEET', 'PROMPT', 'WORKFLOW', 'AUTOMATION', 'AI_AGENT'],
    semanticMeaning: 'Step executes via Studio asset'
  },
  GENERATES: {
    relationType: 'GENERATES',
    allowedSources: ['TOOL', 'WORKFLOW', 'AI_AGENT', 'PROMPT'],
    allowedTargets: ['WORKSHEET', 'TEMPLATE', 'RESOURCE'],
    semanticMeaning: 'Tool output asset mapping'
  },
  SOLVES: {
    relationType: 'SOLVES',
    allowedSources: ['TOOL', 'TEMPLATE', 'PRODUCT', 'PROMPT', 'WORKFLOW'],
    allowedTargets: ['FAQ', 'ENTITY', 'PERSONA'],
    semanticMeaning: 'Asset solves problem or answers question'
  },
  SUPPORTS: {
    relationType: 'SUPPORTS',
    allowedSources: ['CASE_STUDY', 'BLOG', 'RESOURCE', 'FAQ'],
    allowedTargets: ['PRODUCT', 'ECOSYSTEM', 'MODULE', 'STEP'],
    semanticMeaning: 'Evidence or backing content'
  },
  RECOMMENDS: {
    relationType: 'RECOMMENDS',
    allowedSources: ['PRODUCT', 'MODULE', 'STEP', 'BLOG', 'TOOL'],
    allowedTargets: ['TOOL', 'TEMPLATE', 'PROMPT', 'COURSE', 'RESOURCE', 'PRODUCT'],
    semanticMeaning: 'Soft recommendation for next action'
  },
  EXPLAINS: {
    relationType: 'EXPLAINS',
    allowedSources: ['BLOG', 'FAQ', 'LESSON'],
    allowedTargets: ['ENTITY', 'PRODUCT', 'MODULE', 'STEP', 'TOOL'],
    semanticMeaning: 'Support content deep dive'
  },
  UPSELLS: {
    relationType: 'UPSELLS',
    allowedSources: ['TOOL', 'TEMPLATE', 'BLOG', 'FREE_RESOURCE' as any],
    allowedTargets: ['PRODUCT', 'COURSE', 'MASTERY' as any],
    semanticMeaning: 'Commercial conversion bridge'
  },
  IS_ALTERNATIVE_TO: {
    relationType: 'IS_ALTERNATIVE_TO',
    allowedSources: ['TOOL', 'TEMPLATE', 'PRODUCT'],
    allowedTargets: ['TOOL', 'TEMPLATE', 'PRODUCT'],
    semanticMeaning: 'Equivalent or alternative asset'
  },
  RELATED_TO: {
    relationType: 'RELATED_TO',
    allowedSources: NODE_TYPES as any,
    allowedTargets: NODE_TYPES as any,
    semanticMeaning: 'Lateral semantic association'
  },
  TARGETS: {
    relationType: 'TARGETS',
    allowedSources: ['KEYWORD'],
    allowedTargets: ['ENTITY'],
    semanticMeaning: 'Search term targets canonical entity'
  },
  MENTIONS: {
    relationType: 'MENTIONS',
    allowedSources: ['BLOG', 'LESSON', 'CASE_STUDY', 'FAQ'],
    allowedTargets: ['ENTITY', 'PERSONA', 'SKILL', 'INDUSTRY'],
    semanticMeaning: 'Semantic reference'
  }
};
