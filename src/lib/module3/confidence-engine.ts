import { Step3PromptContext } from '../../services/ai/prompts/module3/step3-prompt';
import { BlueprintConfidence, ConfidenceFactor } from '../../types/module3';

export function calculateBlueprintConfidence(context: Step3PromptContext): BlueprintConfidence {
  const factors: ConfidenceFactor[] = [];
  let score = 0;
  let totalPossible = 0;

  const addFactor = (condition: boolean, label: string, positiveImpact: string, negativeImpact: string) => {
    totalPossible += 1;
    if (condition) {
      score += 1;
      factors.push({ label, isMet: true, impact: positiveImpact });
    } else {
      factors.push({ label, isMet: false, impact: negativeImpact });
    }
  };

  // Evaluate Module 1: Market & Niche clarity
  const hasSpecificNiche = Boolean(context.module1.niche && context.module1.niche !== 'General');
  addFactor(
    hasSpecificNiche,
    'Target Audience Specificity',
    'Clear niche allows for highly targeted platform and content strategies.',
    'Generic audience makes it harder to tailor content effectively.'
  );

  // Evaluate Module 2: Offer & Promise clarity
  const hasStrongPromise = Boolean(context.module2.promise && context.module2.promise !== 'Great results');
  addFactor(
    hasStrongPromise,
    'Value Proposition',
    'A strong core promise provides a clear angle for your authority profile.',
    'A weak promise requires the strategy to lean heavily on generic industry best practices.'
  );

  const hasSpecificPrice = Boolean(context.module2.pricePoint && context.module2.pricePoint !== 'TBD');
  addFactor(
    hasSpecificPrice,
    'Pricing Confidence',
    'Defined pricing helps tailor the portfolio style to the correct premium tier.',
    'Without pricing, the portfolio style is less accurately matched to buyer expectations.'
  );

  // Evaluate Module 3: Authority Profile completeness
  const hasTrustPromise = Boolean(context.authorityProfile.coreTrustPromise && context.authorityProfile.coreTrustPromise.length > 5);
  addFactor(
    hasTrustPromise,
    'Core Trust Promise',
    'Defined trust promise guarantees a highly personalized brand positioning.',
    'Missing trust promise leads to a more generic brand positioning.'
  );

  // Calculate final level
  const percentage = score / totalPossible;
  let level: 'Strong' | 'Moderate' | 'Limited' = 'Limited';
  if (percentage >= 0.75) {
    level = 'Strong';
  } else if (percentage >= 0.5) {
    level = 'Moderate';
  }

  const numericScore = Math.round(percentage * 100);

  return {
    level,
    score: numericScore,
    factors
  };
}
