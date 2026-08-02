import { IGraphRepository } from '../repositories/interface';
import { GraphQueryApi } from '../services/query';
import { GraphCache } from '../services/cache';

export interface BlogPostViewModel {
  nodeId: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  coverImageUrl?: string;
  bodyMarkdown?: string;
  canonicalUrl: string;
  seoTitle: string;
}

export interface BlogViewModel {
  title: string;
  description: string;
  posts: BlogPostViewModel[];
  totalPostsCount: number;
  categories: string[];
}

export class BlogProjection {
  private repository: IGraphRepository;
  private queryApi: GraphQueryApi;
  private cache: GraphCache;

  constructor(repository: IGraphRepository) {
    this.repository = repository;
    this.queryApi = new GraphQueryApi(repository);
    this.cache = GraphCache.getInstance();
  }

  async getBlogViewModel(locale: 'en' = 'en'): Promise<BlogViewModel> {
    const cacheKey = `blog_viewmodel_${locale}`;
    const cached = this.cache.getProjection<BlogViewModel>(cacheKey);
    if (cached) return cached;

    const allNodes = await this.repository.getAllNodes();
    const blogNodes = allNodes.filter(n => n.nodeType === 'BLOG');

    const posts: BlogPostViewModel[] = await Promise.all(
      blogNodes.map(node => this.getBlogPostViewModel(node.slug[locale] || node.slug.en, locale))
    );

    const validPosts = posts.filter((p): p is BlogPostViewModel => Boolean(p));
    const categories = Array.from(new Set(validPosts.map(p => p.category)));

    const result: BlogViewModel = {
      title: 'Engineering & Business Architecture Insights',
      description: 'In-depth essays, technical postmortems, and execution guides on software architecture, AI subagents, and client acquisition.',
      posts: validPosts,
      totalPostsCount: validPosts.length,
      categories
    };

    this.cache.setProjection(cacheKey, result);
    return result;
  }

  async getBlogPostViewModel(slug: string, locale: 'en' = 'en'): Promise<BlogPostViewModel | null> {
    const cacheKey = `blog_post_viewmodel_${slug}_${locale}`;
    const cached = this.cache.getProjection<BlogPostViewModel>(cacheKey);
    if (cached) return cached;

    const blogNode = await this.repository.getNodeBySlug(slug, locale);
    if (!blogNode || blogNode.nodeType !== 'BLOG') return null;

    const contentNodes = await this.queryApi.getRelated(blogNode.nodeId, 'HAS_CONTENT');
    const contentNode = contentNodes[0] || null;

    const bSlug = blogNode.slug[locale] || blogNode.slug.en;
    const result: BlogPostViewModel = {
      nodeId: blogNode.nodeId,
      title: blogNode.title[locale] || blogNode.title.en,
      slug: bSlug,
      description: blogNode.description?.[locale] || blogNode.description?.en || '',
      author: (blogNode.properties.author as string) || 'Ayush Paul',
      publishedAt: (blogNode.properties.publishedAt as string) || new Date().toISOString(),
      category: (blogNode.properties.category as string) || 'Engineering',
      tags: (blogNode.properties.tags as string[]) || [],
      readingTimeMinutes: Number(blogNode.properties.readingTimeMinutes || 5),
      coverImageUrl: (blogNode.properties.coverImageUrl as string) || undefined,
      bodyMarkdown: (contentNode?.properties.bodyMarkdown as string) || undefined,
      canonicalUrl: `https://ayushpaul.in/blog/${bSlug}`,
      seoTitle: `${blogNode.title[locale] || blogNode.title.en} | Ayush Paul Blog`
    };

    this.cache.setProjection(cacheKey, result);
    return result;
  }
}
