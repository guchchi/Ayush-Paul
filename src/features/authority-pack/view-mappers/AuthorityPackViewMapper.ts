import { AuthorityPackDomain } from '../types';
import { ViewModel } from '../../../lib/rendering/types';

function formatSnakeCaseWords(text?: string | null): string {
  if (!text) return '';
  return text.replace(/\b[a-z0-9]+_[a-z0-9_]+\b/gi, (match) => {
    return match
      .split('_')
      .map(word => {
        const w = word.toLowerCase();
        if (w === 'youtube') return 'YouTube';
        if (w === 'b2b') return 'B2B';
        if (w === 'ux') return 'UX';
        if (w === 'ai') return 'AI';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  });
}

export class AuthorityPackViewMapper {
  /**
   * Transforms an AuthorityPackDomain model into a flat array of ViewModels
   * suitable for the ContentRenderer, ensuring all snake_case identifiers
   * are cleanly formatted into human-readable titles.
   */
  static mapToBlocks(domain: AuthorityPackDomain): ViewModel[] {
    const blocks: ViewModel[] = [];

    // 1. Executive Summary Block
    if (domain.executiveSummary) {
      blocks.push({
        id: `summary-${domain.id}`,
        type: 'authority-pack.executive-summary',
        overview: formatSnakeCaseWords(domain.executiveSummary.strategyOverview),
        insight: formatSnakeCaseWords(domain.executiveSummary.keyInsight),
        recommendation: formatSnakeCaseWords(domain.executiveSummary.primaryRecommendation),
        guidance: formatSnakeCaseWords(domain.executiveSummary.readingGuidance)
      });
    }

    // 2. Strategic Pillar Blocks
    if (domain.strategicPillars && domain.strategicPillars.length > 0) {
      domain.strategicPillars.forEach(pillar => {
        blocks.push({
          id: `pillar-${pillar.id}`,
          type: 'authority-pack.strategic-pillar',
          title: formatSnakeCaseWords(pillar.title),
          description: formatSnakeCaseWords(pillar.description),
          rationale: formatSnakeCaseWords(pillar.rationale)
        });
      });
    }

    // 3. Action Plan Blocks
    if (domain.actionPlan && domain.actionPlan.length > 0) {
      domain.actionPlan.forEach(action => {
        blocks.push({
          id: `action-${action.id}`,
          type: 'authority-pack.action-item',
          title: formatSnakeCaseWords(action.title),
          description: formatSnakeCaseWords(action.description),
          priority: action.priority,
          status: action.status
        });
      });
    }

    return blocks;
  }
}
