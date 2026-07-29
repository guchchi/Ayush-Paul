import { AuthorityPackDomain, ActionItem } from '../../authority-pack/types';
import { ExportDTO, ExportBlock, IExportMapper } from '../types';

export class AuthorityPackExportMapper implements IExportMapper<AuthorityPackDomain> {
  mapToDTO(domain: AuthorityPackDomain): ExportDTO {
    const blocks: ExportBlock[] = [];

    // Title
    blocks.push({
      id: `heading-main`,
      type: 'heading',
      content: 'Authority Pack',
      level: 1,
    });

    // Executive Summary
    if (domain.executiveSummary) {
      blocks.push({
        id: `heading-exec`,
        type: 'heading',
        content: 'Executive Summary',
        level: 2,
      });

      blocks.push({
        id: `exec-overview`,
        type: 'paragraph',
        content: `Overview: ${domain.executiveSummary.strategyOverview}`,
      });

      blocks.push({
        id: `exec-insight`,
        type: 'paragraph',
        content: `Key Insight: ${domain.executiveSummary.keyInsight}`,
      });

      blocks.push({
        id: `exec-recommendation`,
        type: 'quote',
        content: `Primary Recommendation: ${domain.executiveSummary.primaryRecommendation}`,
      });
      
      blocks.push({
        id: `exec-guidance`,
        type: 'paragraph',
        content: `Guidance: ${domain.executiveSummary.readingGuidance}`,
      });
    }

    // Strategic Pillars
    if (domain.strategicPillars.length > 0) {
      blocks.push({
        id: `heading-pillars`,
        type: 'heading',
        content: 'Strategic Pillars',
        level: 2,
      });

      domain.strategicPillars.forEach((pillar, i) => {
        blocks.push({
          id: `heading-pillar-${i}`,
          type: 'heading',
          content: pillar.title,
          level: 3,
        });
        blocks.push({
          id: `pillar-desc-${i}`,
          type: 'paragraph',
          content: pillar.description,
        });
        blocks.push({
          id: `pillar-rationale-${i}`,
          type: 'paragraph',
          content: `Rationale: ${pillar.rationale}`,
        });
      });
    }

    // Action Plan
    if (domain.actionPlan.length > 0) {
      blocks.push({
        id: `heading-action-plan`,
        type: 'heading',
        content: 'Action Plan',
        level: 2,
      });

      const listItems = domain.actionPlan.map(item => 
        `[${item.status === 'completed' ? 'x' : ' '}] [${item.priority.toUpperCase()}] ${item.title}: ${item.description}`
      );

      blocks.push({
        id: `action-list`,
        type: 'list',
        content: listItems,
      });
    }

    return {
      title: 'Authority Pack',
      metadata: {
        generatedAt: new Date().toISOString(),
        version: domain.version,
        status: domain.status,
        exportSchemaVersion: 'v1',
      },
      blocks,
    };
  }
}
