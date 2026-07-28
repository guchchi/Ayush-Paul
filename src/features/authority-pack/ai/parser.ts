
import { AuthorityPackValidator } from '../validators';
import { AuthorityPackDomain } from '../types';
import { AIValidationError } from '../../../lib/ai/errors';

/**
 * Parses raw objects and enforces strict validation.
 */
export class AuthorityPackParser {
  static parseAndValidate(raw: any): AuthorityPackDomain {
    try {
      // 1. Schema Validation via Zod
      const domain = AuthorityPackValidator.validateSchema(raw);
      
      // 2. Business Validation
      AuthorityPackValidator.validateBusinessRules(domain);
      
      return domain;
    } catch (error: any) {
      // Wrap in AI ValidationError to prevent retries for malformed schema
      throw new AIValidationError(error.message);
    }
  }
}
