import { IGraphRepository } from '../repositories/interface';
import { GraphQueryApi } from '../services/query';
import { GraphCache } from '../services/cache';

export interface StudioAssetViewModel {
  nodeId: string;
  title: string;
  slug: string;
  description: string;
  assetType: 'TOOL' | 'TEMPLATE' | 'WORKSHEET' | 'PROMPT' | 'WORKFLOW' | 'AUTOMATION' | 'AI_AGENT';
  category: string;
  isInteractive: boolean;
  format?: string;
  targetStepSlug?: string;
  targetProductSlug?: string;
  canonicalUrl: string;
  seoTitle: string;
}

export interface StudioCategoryGroup {
  category: string;
  assets: StudioAssetViewModel[];
}

export interface StudioViewModel {
  title: string;
  description: string;
  categories: StudioCategoryGroup[];
  totalAssetsCount: number;
}

export class StudioProjection {
  private repository: IGraphRepository;
  private queryApi: GraphQueryApi;
  private cache: GraphCache;

  constructor(repository: IGraphRepository) {
    this.repository = repository;
    this.queryApi = new GraphQueryApi(repository);
    this.cache = GraphCache.getInstance();
  }

  async getStudioViewModel(locale: 'en' = 'en'): Promise<StudioViewModel> {
    const cacheKey = `studio_viewmodel_${locale}`;
    const cached = this.cache.getProjection<StudioViewModel>(cacheKey);
    if (cached) return cached;

    const allNodes = await this.repository.getAllNodes();
    const studioAssetTypes = ['TOOL', 'TEMPLATE', 'WORKSHEET', 'PROMPT', 'WORKFLOW', 'AUTOMATION', 'AI_AGENT'];
    const assetNodes = allNodes.filter(n => studioAssetTypes.includes(n.nodeType));

    const mappedAssets: StudioAssetViewModel[] = assetNodes.map(node => {
      const typeStr = node.nodeType as StudioAssetViewModel['assetType'];
      const category = (node.properties?.category as string) || (typeStr.charAt(0) + typeStr.slice(1).toLowerCase());
      return {
        nodeId: node.nodeId,
        title: node.title[locale] || node.title.en,
        slug: node.slug[locale] || node.slug.en,
        description: node.description?.[locale] || node.description?.en || '',
        assetType: typeStr,
        category,
        isInteractive: Boolean(node.properties?.isInteractive),
        format: node.properties?.format as string | undefined,
        canonicalUrl: `https://ayushpaul.in/studio/${node.slug[locale] || node.slug.en}`,
        seoTitle: `${node.title[locale] || node.title.en} | Studio | Ayush Paul`
      };
    });

    const categoryMap = new Map<string, StudioAssetViewModel[]>();
    mappedAssets.forEach(asset => {
      const existing = categoryMap.get(asset.category) || [];
      existing.push(asset);
      categoryMap.set(asset.category, existing);
    });

    const categories: StudioCategoryGroup[] = Array.from(categoryMap.entries()).map(([category, assets]) => ({
      category,
      assets
    }));

    const result: StudioViewModel = {
      title: 'Studio Execution Systems & Tools',
      description: 'Interactive execution tools, templates, worksheets, and prompt engines to automate client acquisition and agency growth.',
      categories,
      totalAssetsCount: mappedAssets.length
    };

    this.cache.setProjection(cacheKey, result);
    return result;
  }
}
