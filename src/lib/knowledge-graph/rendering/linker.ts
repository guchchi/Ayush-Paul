import { IGraphRepository } from '../repositories/interface';
import { GraphQueryApi } from '../services/query';

export interface EntityLinkMapping {
  entityId: string;
  preferredAnchor: string;
  synonyms: string[];
  targetUrl: string;
}

export class EntityInternalLinker {
  private query: GraphQueryApi;
  private linkMappings: EntityLinkMapping[] = [];

  constructor(private repo: IGraphRepository) {
    this.query = new GraphQueryApi(repo);
  }

  async buildMappingTable(lang: 'en' | 'es' | 'hi' = 'en'): Promise<EntityLinkMapping[]> {
    const nodes = await this.repo.getAllNodes();
    const entityNodes = nodes.filter(n => n.nodeType === 'ENTITY');
    const mappings: EntityLinkMapping[] = [];

    for (const entity of entityNodes) {
      const preferredAnchor = entity.title[lang] || entity.properties.canonicalName;
      const synonyms = entity.properties.synonyms || [];
      
      // Find what product or tool solves or explains this entity
      const incomingEdges = await this.repo.getEdgesForNode(entity.nodeId, 'INCOMING');
      const targetEdge = incomingEdges.find(e => ['SOLVES', 'EXPLAINS', 'TARGETS'].includes(e.relationType));

      let targetUrl = `/entities/${entity.slug[lang]}`;
      if (targetEdge) {
        const targetNode = await this.repo.getNode(targetEdge.sourceId);
        if (targetNode) {
          if (targetNode.nodeType === 'PRODUCT') targetUrl = `/blueprints/${targetNode.slug[lang]}`;
          else if (targetNode.nodeType === 'TOOL') targetUrl = `/studio/tools/${targetNode.slug[lang]}`;
          else if (targetNode.nodeType === 'BLOG') targetUrl = `/blog/${targetNode.slug[lang]}`;
        }
      }

      mappings.push({
        entityId: entity.nodeId,
        preferredAnchor,
        synonyms,
        targetUrl
      });
    }

    this.linkMappings = mappings;
    return mappings;
  }

  injectInternalLinks(text: string, currentTargetUrl?: string): string {
    if (this.linkMappings.length === 0) return text;

    let processedText = text;
    const linkedAnchors = new Set<string>();

    for (const mapping of this.linkMappings) {
      // Don't self-link
      if (currentTargetUrl && currentTargetUrl === mapping.targetUrl) continue;

      const anchorTerms = [mapping.preferredAnchor, ...mapping.synonyms];

      for (const term of anchorTerms) {
        if (!term || term.length < 3) continue;
        const normalizedTerm = term.toLowerCase();

        // Avoid linking terms already linked
        if (linkedAnchors.has(normalizedTerm)) continue;

        // Regex matching term outside existing markdown links [text](url)
        const regex = new RegExp(`(?<!\\[)\\b(${term})\\b(?!\\]|\\([^)]*\\))`, 'gi');

        if (regex.test(processedText)) {
          processedText = processedText.replace(regex, `[$1](${mapping.targetUrl})`);
          linkedAnchors.add(normalizedTerm);
          break; // Link only first match per entity
        }
      }
    }

    return processedText;
  }
}
