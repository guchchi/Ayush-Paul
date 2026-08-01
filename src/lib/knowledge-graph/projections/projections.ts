import { IProjection, NodeNavigationViewModel } from './interface';
import { BaseNode } from '../core/types';
import { IGraphRepository } from '../repositories/interface';
import { IContentRepository, ContentDoc } from '../content/loader';
import { NavigationGenerator } from './navigation';

export interface StepPageViewModel {
  node: BaseNode;
  content: ContentDoc | null;
  navigation: NodeNavigationViewModel;
}

export class StepProjection implements IProjection<StepPageViewModel> {
  async project(nodeId: string, repo: IGraphRepository, contentRepo?: IContentRepository): Promise<StepPageViewModel | null> {
    const node = await repo.getNode(nodeId);
    if (!node || node.nodeType !== 'STEP') return null;

    let content: ContentDoc | null = null;
    if (contentRepo && node.properties.contentId) {
      content = await contentRepo.getContent(node.properties.contentId);
    }

    const navGen = new NavigationGenerator(repo, contentRepo);
    const navigation = await navGen.generateNavigation(nodeId);

    return {
      node,
      content,
      navigation
    };
  }
}

export interface BlueprintPageViewModel {
  productNode: BaseNode;
  modules: {
    moduleNode: BaseNode;
    steps: BaseNode[];
  }[];
  content: ContentDoc | null;
  navigation: NodeNavigationViewModel;
}

export class BlueprintProjection implements IProjection<BlueprintPageViewModel> {
  async project(nodeId: string, repo: IGraphRepository, contentRepo?: IContentRepository): Promise<BlueprintPageViewModel | null> {
    const productNode = await repo.getNode(nodeId);
    if (!productNode || productNode.nodeType !== 'PRODUCT') return null;

    let content: ContentDoc | null = null;
    if (contentRepo && productNode.properties.contentId) {
      content = await contentRepo.getContent(productNode.properties.contentId);
    }

    const navGen = new NavigationGenerator(repo, contentRepo);
    const navigation = await navGen.generateNavigation(nodeId);

    // Fetch Modules & Steps
    const moduleEdges = await repo.getEdgesForNode(nodeId, 'OUTGOING');
    const childEdges = moduleEdges.filter(e => e.relationType === 'HAS_CHILD');
    
    const modules: { moduleNode: BaseNode; steps: BaseNode[] }[] = [];
    for (const edge of childEdges) {
      const modNode = await repo.getNode(edge.targetId);
      if (modNode && modNode.nodeType === 'MODULE') {
        const stepEdges = await repo.getEdgesForNode(modNode.nodeId, 'OUTGOING');
        const stepChildEdges = stepEdges.filter(e => e.relationType === 'HAS_CHILD');
        const steps: BaseNode[] = [];
        for (const se of stepChildEdges) {
          const sNode = await repo.getNode(se.targetId);
          if (sNode) steps.push(sNode);
        }
        steps.sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0));
        modules.push({ moduleNode: modNode, steps });
      }
    }
    modules.sort((a, b) => (a.moduleNode.properties.order || 0) - (b.moduleNode.properties.order || 0));

    return {
      productNode,
      modules,
      content,
      navigation
    };
  }
}
