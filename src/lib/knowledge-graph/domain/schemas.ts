import { ThePaulXNodeType } from './constants';

export interface ProductProperties {
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedHours: number;
  priceInCents: number;
  thumbnailUrl?: string;
}

export interface ModuleProperties {
  order: number;
  summary: string;
}

export interface StepProperties {
  order: number;
  estimatedMinutes: number;
  actionItem: string;
}

export interface ContentProperties {
  bodyMarkdown: string;
  format: 'MARKDOWN' | 'MDX' | 'RICH_TEXT';
  readingTimeMinutes: number;
}

export interface ToolProperties {
  isInteractive: boolean;
  runtimeEngine: 'CLIENT_SIDE' | 'SERVER_SIDE' | 'LLM_PROMPT';
  inputSchema?: Record<string, any>;
}

export interface TemplateProperties {
  format: 'DOCX' | 'PDF' | 'MARKDOWN' | 'FIGMA' | 'NOTION';
  downloadUrl?: string;
}

export interface EntityProperties {
  canonicalName: string;
  synonyms: string[];
  category: string;
}

export interface KeywordProperties {
  searchVolume: number;
  keywordDifficulty: number;
  cpc: number;
  country: string;
}

export interface PersonaProperties {
  painPoints: string[];
  goals: string[];
  experienceLevel: string;
}

export interface NodeSpecification<T = any> {
  nodeType: ThePaulXNodeType;
  allowedOutgoingEdges: string[];
  allowedIncomingEdges: string[];
  validateProperties?: (props: T) => string[];
}

export const NODE_SPECIFICATIONS: Record<string, NodeSpecification> = {
  BRAND: {
    nodeType: 'BRAND',
    allowedOutgoingEdges: ['HAS_CHILD'],
    allowedIncomingEdges: ['BELONGS_TO', 'HAS_PARENT']
  },
  ECOSYSTEM: {
    nodeType: 'ECOSYSTEM',
    allowedOutgoingEdges: ['HAS_CHILD', 'HAS_PARENT'],
    allowedIncomingEdges: ['HAS_CHILD', 'HAS_PARENT', 'BELONGS_TO']
  },
  PRODUCT: {
    nodeType: 'PRODUCT',
    allowedOutgoingEdges: ['HAS_CHILD', 'HAS_PARENT', 'HAS_CONTENT', 'RECOMMENDS', 'REQUIRES'],
    allowedIncomingEdges: ['HAS_CHILD', 'SUPPORTS', 'SOLVES', 'UPSELLS', 'REQUIRES'],
    validateProperties: (props: ProductProperties) => {
      const errors: string[] = [];
      if (!props.difficulty) errors.push('Product missing difficulty');
      if (typeof props.estimatedHours !== 'number') errors.push('Product missing estimatedHours');
      return errors;
    }
  },
  MODULE: {
    nodeType: 'MODULE',
    allowedOutgoingEdges: ['HAS_CHILD', 'HAS_PARENT', 'HAS_CONTENT', 'NEXT_STEP', 'PREVIOUS_STEP', 'REQUIRES'],
    allowedIncomingEdges: ['HAS_CHILD', 'NEXT_STEP', 'PREVIOUS_STEP', 'REQUIRES']
  },
  STEP: {
    nodeType: 'STEP',
    allowedOutgoingEdges: ['HAS_PARENT', 'HAS_CONTENT', 'NEXT_STEP', 'PREVIOUS_STEP', 'IMPLEMENTS', 'REQUIRES'],
    allowedIncomingEdges: ['HAS_CHILD', 'NEXT_STEP', 'PREVIOUS_STEP', 'REQUIRES']
  },
  CONTENT: {
    nodeType: 'CONTENT',
    allowedOutgoingEdges: ['BELONGS_TO', 'HAS_PARENT'],
    allowedIncomingEdges: ['HAS_CONTENT']
  },
  TOOL: {
    nodeType: 'TOOL',
    allowedOutgoingEdges: ['BELONGS_TO', 'HAS_CONTENT', 'GENERATES', 'SOLVES', 'UPSELLS', 'RECOMMENDS'],
    allowedIncomingEdges: ['IMPLEMENTS', 'EXPLAINS', 'RECOMMENDS', 'IS_ALTERNATIVE_TO']
  },
  ENTITY: {
    nodeType: 'ENTITY',
    allowedOutgoingEdges: ['RELATED_TO'],
    allowedIncomingEdges: ['TARGETS', 'EXPLAINS', 'MENTIONS', 'SOLVES']
  },
  KEYWORD: {
    nodeType: 'KEYWORD',
    allowedOutgoingEdges: ['TARGETS'],
    allowedIncomingEdges: []
  }
};
