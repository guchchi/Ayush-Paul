import { IGraphRepository } from '../repositories/interface';
import { BaseNode, BaseEdge, NodeId, LanguageCode } from '../core/types';
import { ThePaulXRelationType } from '../domain/constants';

export class GraphQueryApi {
  constructor(private repo: IGraphRepository) {}

  async getNode(id: NodeId): Promise<BaseNode | null> {
    return this.repo.getNode(id);
  }

  async getChildren(id: NodeId): Promise<BaseNode[]> {
    const edges = await this.repo.getEdgesForNode(id, 'OUTGOING');
    const childEdges = edges.filter(e => e.relationType === 'HAS_CHILD');
    const children = await Promise.all(childEdges.map(e => this.repo.getNode(e.targetId)));
    return children.filter((n): n is BaseNode => n !== null);
  }

  async getParents(id: NodeId): Promise<BaseNode[]> {
    const edges = await this.repo.getEdgesForNode(id, 'OUTGOING');
    const parentEdges = edges.filter(e => e.relationType === 'HAS_PARENT');
    const parents = await Promise.all(parentEdges.map(e => this.repo.getNode(e.targetId)));
    return parents.filter((n): n is BaseNode => n !== null);
  }

  async getRelated(id: NodeId, relationType?: ThePaulXRelationType): Promise<BaseNode[]> {
    const edges = await this.repo.getEdgesForNode(id, 'BOTH');
    const filteredEdges = relationType ? edges.filter(e => e.relationType === relationType) : edges;
    const targetIds = filteredEdges.map(e => (e.sourceId === id ? e.targetId : e.sourceId));
    const related = await Promise.all(targetIds.map(targetId => this.repo.getNode(targetId)));
    return related.filter((n): n is BaseNode => n !== null);
  }

  async getLearningPath(productId: NodeId): Promise<BaseNode[]> {
    const product = await this.repo.getNode(productId);
    if (!product) return [];

    const modules = await this.getChildren(productId);
    const sortedModules = modules.sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0));

    const fullPath: BaseNode[] = [product];
    for (const mod of sortedModules) {
      fullPath.push(mod);
      const steps = await this.getChildren(mod.nodeId);
      const sortedSteps = steps.sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0));
      fullPath.push(...sortedSteps);
    }

    return fullPath;
  }

  async getAssets(stepId: NodeId): Promise<BaseNode[]> {
    const edges = await this.repo.getEdgesForNode(stepId, 'OUTGOING');
    const assetEdges = edges.filter(e => e.relationType === 'IMPLEMENTS');
    const assets = await Promise.all(assetEdges.map(e => this.repo.getNode(e.targetId)));
    return assets.filter((n): n is BaseNode => n !== null);
  }

  async getBreadcrumbs(nodeId: NodeId): Promise<BaseNode[]> {
    const breadcrumbs: BaseNode[] = [];
    let currentId: NodeId | null = nodeId;

    while (currentId) {
      const node: BaseNode | null = await this.repo.getNode(currentId);
      if (!node) break;
      breadcrumbs.unshift(node);
      const parents = await this.getParents(currentId);
      currentId = parents.length > 0 ? parents[0].nodeId : null;
    }

    return breadcrumbs;
  }

  async searchNodes(query: string, lang: LanguageCode = 'en'): Promise<BaseNode[]> {
    const allNodes = await this.repo.getAllNodes();
    const q = query.toLowerCase();

    return allNodes.filter(node => {
      const title = node.title[lang]?.toLowerCase() || '';
      const description = node.description?.[lang]?.toLowerCase() || '';
      const slug = node.slug[lang]?.toLowerCase() || '';
      return title.includes(q) || description.includes(q) || slug.includes(q);
    });
  }
}
