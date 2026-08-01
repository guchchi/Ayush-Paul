import { IGraphRepository } from '../repositories/interface';
import { IContentRepository } from '../content/loader';
import { GraphQueryApi } from '../services/query';
import { NodeNavigationViewModel, SidebarItem, NavigationBreadcrumb } from './interface';

export class NavigationGenerator {
  private query: GraphQueryApi;

  constructor(private repo: IGraphRepository, private contentRepo?: IContentRepository) {
    this.query = new GraphQueryApi(repo);
  }

  async generateNavigation(nodeId: string, currentProductId?: string): Promise<NodeNavigationViewModel> {
    const node = await this.query.getNode(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // 1. Breadcrumbs
    const breadcrumbNodes = await this.query.getBreadcrumbs(nodeId);
    const breadcrumbs: NavigationBreadcrumb[] = breadcrumbNodes.map(n => ({
      title: n.title.en,
      slug: n.slug.en,
      nodeId: n.nodeId,
      type: n.nodeType
    }));

    // 2. Locate Product Root
    const productNode = breadcrumbNodes.find(n => n.nodeType === 'PRODUCT') || 
      (currentProductId ? await this.query.getNode(currentProductId) : null);

    // 3. Sidebar Generation
    let sidebar: SidebarItem[] = [];
    let totalSteps = 0;
    let previousStepNode: any = null;
    let nextStepNode: any = null;
    let foundCurrentStep = false;

    if (productNode) {
      const modules = await this.query.getChildren(productNode.nodeId);
      const sortedModules = modules.sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0));

      for (const mod of sortedModules) {
        const steps = await this.query.getChildren(mod.nodeId);
        const sortedSteps = steps.sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0));
        totalSteps += sortedSteps.length;

        const stepItems: SidebarItem[] = [];
        for (const step of sortedSteps) {
          const isCurrent = step.nodeId === nodeId;
          if (isCurrent) {
            foundCurrentStep = true;
          } else if (!foundCurrentStep) {
            previousStepNode = step;
          } else if (foundCurrentStep && !nextStepNode) {
            nextStepNode = step;
          }

          stepItems.push({
            nodeId: step.nodeId,
            title: step.title.en,
            slug: step.slug.en,
            type: step.nodeType,
            order: step.properties.order,
            isActive: isCurrent
          });
        }

        sidebar.push({
          nodeId: mod.nodeId,
          title: mod.title.en,
          slug: mod.slug.en,
          type: mod.nodeType,
          order: mod.properties.order,
          isActive: mod.nodeId === nodeId,
          children: stepItems
        });
      }
    }

    // 4. Prerequisites
    const prereqNodes = await this.query.getRelated(nodeId, 'REQUIRES');
    const prerequisites = prereqNodes.map(n => ({
      title: n.title.en,
      slug: n.slug.en,
      nodeId: n.nodeId
    }));

    // 5. Related Assets (Studio tools, prompts, templates)
    const assetNodes = await this.query.getAssets(nodeId);
    const relatedAssets = assetNodes.map(n => ({
      title: n.title.en,
      slug: n.slug.en,
      nodeId: n.nodeId,
      type: n.nodeType
    }));

    // 6. Metrics & Content Reading Time
    let readingTimeMinutes = 1;
    if (this.contentRepo && node.properties.contentId) {
      const doc = await this.contentRepo.getContent(node.properties.contentId);
      if (doc) {
        readingTimeMinutes = doc.readingTimeMinutes;
      }
    }

    return {
      breadcrumbs,
      sidebar,
      previous: previousStepNode ? { title: previousStepNode.title.en, slug: previousStepNode.slug.en, nodeId: previousStepNode.nodeId } : undefined,
      next: nextStepNode ? { title: nextStepNode.title.en, slug: nextStepNode.slug.en, nodeId: nextStepNode.nodeId } : undefined,
      prerequisites,
      relatedAssets,
      metrics: {
        readingTimeMinutes,
        totalSteps,
        completedSteps: 0,
        assetCount: relatedAssets.length
      }
    };
  }
}
