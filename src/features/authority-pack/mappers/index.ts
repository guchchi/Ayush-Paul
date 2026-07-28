import type { AuthorityPackDomain, AuthorityPackDTO, AuthorityPackViewModel } from '../types';

export const PackMapper = {
  toDomain(dto: AuthorityPackDTO): AuthorityPackDomain {
    return {
      id: dto.id,
      version: dto.version,
      status: dto.status,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      executiveSummary: dto.executiveSummary,
      strategicPillars: dto.strategicPillars,
      actionPlan: dto.actionPlan
    };
  },

  toDTO(domain: AuthorityPackDomain): AuthorityPackDTO {
    return {
      id: domain.id,
      version: domain.version,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      executiveSummary: domain.executiveSummary,
      strategicPillars: domain.strategicPillars,
      actionPlan: domain.actionPlan
    };
  },

  toViewModel(domain: AuthorityPackDomain): AuthorityPackViewModel {
    const totalActionsCount = domain.actionPlan.length;
    const completedActionsCount = domain.actionPlan.filter(a => a.status === 'completed').length;
    
    // Fallback to 0 if no actions exist
    const progressPercentage = totalActionsCount === 0 
      ? 0 
      : Math.round((completedActionsCount / totalActionsCount) * 100);

    return {
      id: domain.id,
      displayTitle: 'Your Authority Pack',
      statusBadge: domain.status.toUpperCase(),
      lastUpdatedFormatted: new Date(domain.updatedAt).toLocaleDateString(),
      isReady: domain.status === 'ready',
      isGenerating: domain.status === 'generating',
      executiveSummary: domain.executiveSummary,
      strategicPillars: domain.strategicPillars,
      actionPlan: domain.actionPlan,
      completedActionsCount,
      totalActionsCount,
      progressPercentage
    };
  }
};
