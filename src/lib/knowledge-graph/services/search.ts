import { IGraphRepository } from '../repositories/interface';
import { BaseNode } from '../core/types';

export interface SearchHit {
  node: BaseNode;
  score: number;
  snippet: string;
  targetUrl: string;
}

export class UnifiedSearchEngine {
  constructor(private repo: IGraphRepository, private baseUrl: string = '') {}

  async search(query: string, lang: 'en' | 'es' | 'hi' = 'en'): Promise<SearchHit[]> {
    if (!query.trim()) return [];

    const nodes = await this.repo.getAllNodes();
    const q = query.toLowerCase().trim();
    const hits: SearchHit[] = [];

    for (const node of nodes) {
      let score = 0;
      const title = node.title[lang]?.toLowerCase() || '';
      const description = node.description?.[lang]?.toLowerCase() || '';
      const slug = node.slug[lang]?.toLowerCase() || '';

      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 50;
      else if (title.includes(q)) score += 30;

      if (slug.includes(q)) score += 20;
      if (description.includes(q)) score += 10;

      if (score > 0) {
        let targetUrl = `/${slug}`;
        if (node.nodeType === 'PRODUCT') targetUrl = `/blueprints/${slug}`;
        else if (node.nodeType === 'STEP') targetUrl = `/blueprints/steps/${slug}`;
        else if (node.nodeType === 'TOOL') targetUrl = `/studio/tools/${slug}`;
        else if (node.nodeType === 'TEMPLATE') targetUrl = `/studio/templates/${slug}`;
        else if (node.nodeType === 'BLOG') targetUrl = `/blog/${slug}`;
        else if (node.nodeType === 'ENTITY') targetUrl = `/entities/${slug}`;

        hits.push({
          node,
          score,
          snippet: node.description?.[lang] || node.title[lang],
          targetUrl
        });
      }
    }

    return hits.sort((a, b) => b.score - a.score);
  }
}
