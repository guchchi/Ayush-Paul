import { AuthorityPackDomain } from '../../authority-pack/types';
import { IExportValidator, ExportValidationResult } from '../types';

export class AuthorityPackExportValidator implements IExportValidator<AuthorityPackDomain> {
  validate(domain: AuthorityPackDomain): ExportValidationResult {
    const errors: string[] = [];

    if (domain.status !== 'ready') {
      errors.push('Authority Pack must be in "ready" status to export.');
    }

    if (!domain.executiveSummary) {
      errors.push('Executive Summary is missing.');
    }

    if (!domain.strategicPillars || domain.strategicPillars.length === 0) {
      errors.push('At least one Strategic Pillar is required.');
    }

    const seenIds = new Set<string>();

    domain.strategicPillars?.forEach(pillar => {
      if (seenIds.has(pillar.id)) {
        errors.push(`Duplicate ID found in Strategic Pillars: ${pillar.id}`);
      }
      seenIds.add(pillar.id);
    });

    domain.actionPlan?.forEach(action => {
      if (seenIds.has(action.id)) {
        errors.push(`Duplicate ID found across domain entities: ${action.id}`);
      }
      seenIds.add(action.id);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
