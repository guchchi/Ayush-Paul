import { IProjection, NodeNavigationViewModel } from './interface';
import { BaseNode } from '../core/types';
import { IGraphRepository } from '../repositories/interface';
import { IContentRepository, ContentDoc } from '../content/loader';
import { NavigationGenerator } from './navigation';

export interface StepPageViewModel {
  node: BaseNode;
  contentNode: BaseNode | null;
  contentDoc: ContentDoc | null;
  navigation: NodeNavigationViewModel;
}

export class StepProjection implements IProjection<StepPageViewModel> {
  async project(nodeId: string, repo: IGraphRepository, contentRepo?: IContentRepository): Promise<StepPageViewModel | null> {
    const node = await repo.getNode(nodeId);
    if (!node || node.nodeType !== 'STEP') return null;

    // Fetch CONTENT node via HAS_CONTENT edge
    const edges = await repo.getEdgesForNode(nodeId, 'OUTGOING');
    const contentEdge = edges.find(e => e.relationType === 'HAS_CONTENT');
    
    let contentNode: BaseNode | null = null;
    let contentDoc: ContentDoc | null = null;

    if (contentEdge) {
      contentNode = await repo.getNode(contentEdge.targetId);
      if (contentNode && contentNode.properties.bodyMarkdown) {
        contentDoc = {
          contentId: contentNode.nodeId,
          markdown: contentNode.properties.bodyMarkdown,
          frontmatter: {},
          readingTimeMinutes: contentNode.properties.readingTimeMinutes || 2
        };
      }
    }

    const navGen = new NavigationGenerator(repo, contentRepo);
    const navigation = await navGen.generateNavigation(nodeId);

    return {
      node,
      contentNode,
      contentDoc,
      navigation
    };
  }
}

export interface BlueprintPageViewModel {
  productNode: BaseNode;
  contentNode: BaseNode | null;
  contentDoc: ContentDoc | null;
  modules: {
    moduleNode: BaseNode;
    steps: BaseNode[];
  }[];
  navigation: NodeNavigationViewModel;
}

export class BlueprintProjection implements IProjection<BlueprintPageViewModel> {
  async project(nodeId: string, repo: IGraphRepository, contentRepo?: IContentRepository): Promise<BlueprintPageViewModel | null> {
    const productNode = await repo.getNode(nodeId);
    if (!productNode || productNode.nodeType !== 'PRODUCT') return null;

    // Fetch CONTENT node via HAS_CONTENT edge
    const edges = await repo.getEdgesForNode(nodeId, 'OUTGOING');
    const contentEdge = edges.find(e => e.relationType === 'HAS_CONTENT');
    
    let contentNode: BaseNode | null = null;
    let contentDoc: ContentDoc | null = null;

    if (contentEdge) {
      contentNode = await repo.getNode(contentEdge.targetId);
      if (contentNode && contentNode.properties.bodyMarkdown) {
        contentDoc = {
          contentId: contentNode.nodeId,
          markdown: contentNode.properties.bodyMarkdown,
          frontmatter: {},
          readingTimeMinutes: contentNode.properties.readingTimeMinutes || 2
        };
      }
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
      contentNode,
      contentDoc,
      modules,
      navigation
    };
  }
}
