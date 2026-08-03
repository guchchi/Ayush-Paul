/**
 * Connected Knowledge Graph Engine for Module 3
 * Maps upstream parameters to downstream generated assets.
 * Handles dependency tracking & selective recalculation.
 */

export interface GraphNode {
  id: string;
  label: string;
  type: 'parameter' | 'asset';
  category: 'audience' | 'offer' | 'positioning' | 'messaging' | 'website' | 'profiles' | 'content' | 'outreach' | 'score';
  dependencies: string[];
}

export const KNOWLEDGE_GRAPH_NODES: Record<string, GraphNode> = {
  // Upstream Parameters
  target_audience: {
    id: 'target_audience',
    label: 'Target Audience / Niche',
    type: 'parameter',
    category: 'audience',
    dependencies: [],
  },
  service_offer: {
    id: 'service_offer',
    label: 'Service Offer & Deliverables',
    type: 'parameter',
    category: 'offer',
    dependencies: ['target_audience'],
  },
  authority_position: {
    id: 'authority_position',
    label: 'Authority Position (Builder / Auditor / etc.)',
    type: 'parameter',
    category: 'positioning',
    dependencies: ['target_audience', 'service_offer'],
  },

  // Downstream Generated Assets
  positioning_statement: {
    id: 'positioning_statement',
    label: 'Core Positioning Statement',
    type: 'asset',
    category: 'positioning',
    dependencies: ['target_audience', 'service_offer', 'authority_position'],
  },
  value_proposition: {
    id: 'value_proposition',
    label: 'Quantified Value Proposition',
    type: 'asset',
    category: 'messaging',
    dependencies: ['target_audience', 'service_offer', 'positioning_statement'],
  },
  website_hero: {
    id: 'website_hero',
    label: 'Website Hero Copy',
    type: 'asset',
    category: 'website',
    dependencies: ['positioning_statement', 'value_proposition'],
  },
  linkedin_profile: {
    id: 'linkedin_profile',
    label: 'LinkedIn Headline & About',
    type: 'asset',
    category: 'profiles',
    dependencies: ['positioning_statement', 'value_proposition'],
  },
  content_strategy: {
    id: 'content_strategy',
    label: '30-Day Authority Content Matrix',
    type: 'asset',
    category: 'content',
    dependencies: ['positioning_statement', 'target_audience'],
  },
  outreach_scripts: {
    id: 'outreach_scripts',
    label: 'Outbound Client Acquisition Scripts',
    type: 'asset',
    category: 'outreach',
    dependencies: ['target_audience', 'service_offer', 'value_proposition'],
  },
  authority_score: {
    id: 'authority_score',
    label: 'Dynamic Authority Score',
    type: 'asset',
    category: 'score',
    dependencies: [
      'positioning_statement',
      'value_proposition',
      'website_hero',
      'linkedin_profile',
      'content_strategy',
      'outreach_scripts',
    ],
  },
};

export class KnowledgeGraphEngine {
  /**
   * Returns all downstream asset IDs affected by an upstream node change.
   */
  static getAffectedDownstreamNodes(changedNodeId: string): string[] {
    const affected = new Set<string>();
    const queue = [changedNodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      for (const [nodeId, node] of Object.entries(KNOWLEDGE_GRAPH_NODES)) {
        if (node.dependencies.includes(currentId) && !affected.has(nodeId)) {
          affected.add(nodeId);
          queue.push(nodeId);
        }
      }
    }

    return Array.from(affected);
  }
}
