import { AuthorityPackDomain } from '../../types';
import { ViewModel } from '../../../lib/rendering/types';

export class AuthorityPackViewMapper {
  /**
   * Transforms an AuthorityPackDomain model into a flat array of ViewModels
   * suitable for the ContentRenderer.
   */
  static mapToBlocks(domain: AuthorityPackDomain): ViewModel[] {
    const blocks: ViewModel[] = [];

    // 1. Executive Summary Block
    if (domain.executiveSummary) {
      blocks.push({
        id: `summary-${domain.id}`,
        type: 'authority-pack.executive-summary',
        overview: domain.executiveSummary.strategyOverview,
        insight: domain.executiveSummary.keyInsight,
        recommendation: domain.executiveSummary.primaryRecommendation,
        guidance: domain.executiveSummary.readingGuidance
      });
    }

    // 2. Strategic Pillar Blocks
    if (domain.strategicPillars && domain.strategicPillars.length > 0) {
      domain.strategicPillars.forEach(pillar => {
        blocks.push({
          id: `pillar-${pillar.id}`,
          type: 'authority-pack.strategic-pillar',
          title: pillar.title,
          description: pillar.description,
          rationale: pillar.rationale
        });
      });
    }

    // 3. Action Plan Blocks
    if (domain.actionPlan && domain.actionPlan.length > 0) {
      domain.actionPlan.forEach(action => {
        blocks.push({
          id: `action-${action.id}`,
          type: 'authority-pack.action-item',
          title: action.title,
          description: action.description,
          priority: action.priority,
          status: action.status
        });
      });
    }

    return blocks;
  }
}
