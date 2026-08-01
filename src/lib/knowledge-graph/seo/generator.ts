import { BaseNode } from '../core/types';
import { IGraphRepository } from '../repositories/interface';
import { GraphQueryApi } from '../services/query';

export interface SeoMetadataViewModel {
  title: string;
  description: string;
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
  };
  jsonLd: Record<string, any>[];
}

export class SeoProjectionService {
  private query: GraphQueryApi;

  constructor(private repo: IGraphRepository, private baseUrl: string = 'https://thepaulx.com') {
    this.query = new GraphQueryApi(repo);
  }

  async generateSeoMetadata(nodeId: string, lang: 'en' | 'es' | 'hi' = 'en'): Promise<SeoMetadataViewModel | null> {
    const node = await this.repo.getNode(nodeId);
    if (!node) return null;

    const title = `${node.title[lang]} | ThePaulX`;
    const description = node.description?.[lang] || `Learn ${node.title[lang]} on ThePaulX`;
    const slug = node.slug[lang];
    
    let path = `/${slug}`;
    if (node.nodeType === 'PRODUCT') path = `/blueprints/${slug}`;
    else if (node.nodeType === 'STEP') path = `/blueprints/steps/${slug}`;
    else if (node.nodeType === 'TOOL') path = `/studio/tools/${slug}`;
    else if (node.nodeType === 'BLOG') path = `/blog/${slug}`;

    const canonicalUrl = `${this.baseUrl}${path}`;

    // Generate Breadcrumb Schema
    const breadcrumbs = await this.query.getBreadcrumbs(nodeId);
    const breadcrumbListSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': b.title[lang],
        'item': `${this.baseUrl}/${b.slug[lang]}`
      }))
    };

    // Generate Specific Schema based on NodeType
    const jsonLd: Record<string, any>[] = [breadcrumbListSchema];

    if (node.nodeType === 'PRODUCT') {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': node.title[lang],
        'description': description,
        'provider': {
          '@type': 'Organization',
          'name': 'ThePaulX',
          'sameAs': this.baseUrl
        }
      });
    } else if (node.nodeType === 'STEP') {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': node.title[lang],
        'description': description,
        'url': canonicalUrl
      });
    }

    return {
      title,
      description,
      canonicalUrl,
      openGraph: {
        title,
        description,
        type: node.nodeType === 'BLOG' ? 'article' : 'website',
        url: canonicalUrl
      },
      jsonLd
    };
  }
}
