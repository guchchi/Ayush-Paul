import { AuthorityPackSchema } from '../schemas/packSchema';
import { AuthorityPackDomain } from '../types';

export class AuthorityPackValidator {
  /**
   * Validates structure against Zod schemas
   */
  static validateSchema(data: unknown): AuthorityPackDomain {
    const result = AuthorityPackSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Schema validation failed: ${result.error.message}`);
    }
    return result.data as AuthorityPackDomain;
  }

  /**
   * Validates business rules for the domain model before persistence
   */
  static validateBusinessRules(pack: AuthorityPackDomain): void {
    if (pack.status === 'ready' && !pack.executiveSummary) {
      throw new Error('A ready pack must have an executive summary.');
    }
    if (pack.strategicPillars.length === 0) {
      throw new Error('Pack must contain at least one strategic pillar.');
    }
    // Additional business logic validations...
  }
}
