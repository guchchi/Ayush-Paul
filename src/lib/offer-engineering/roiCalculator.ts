/**
 * Quantitative ROI & Value Multiplier Engine
 * Computes deterministic business metrics, payback period, and efficiency multiples
 * for Module 2 Value Amplifiers & Offer Blueprints.
 */

export interface ROIInputs {
  projectPrice: number;
  clientHourlyCost?: number;
  monthlyHoursSaved?: number;
  expectedMonthlyRevenueGain?: number;
}

export interface ROIProjection {
  annualizedSavings: number;
  annualizedRevenueGain: number;
  totalAnnualValue: number;
  paybackPeriodMonths: number;
  roiMultiple: number;
  executiveSummary: string;
}

export function calculateROIProjection(inputs: ROIInputs): ROIProjection {
  const price = Math.max(1, inputs.projectPrice || 3500);
  const hourlyCost = inputs.clientHourlyCost || 120;
  const hoursSaved = inputs.monthlyHoursSaved || 25;
  const monthlyRevenueGain = inputs.expectedMonthlyRevenueGain || 1500;

  const monthlySavings = hoursSaved * hourlyCost;
  const annualizedSavings = monthlySavings * 12;
  const annualizedRevenueGain = monthlyRevenueGain * 12;
  const totalAnnualValue = annualizedSavings + annualizedRevenueGain;

  const monthlyCombinedBenefit = monthlySavings + monthlyRevenueGain;
  const paybackPeriodMonths = monthlyCombinedBenefit > 0
    ? Number((price / monthlyCombinedBenefit).toFixed(1))
    : 12;

  const roiMultiple = Number((totalAnnualValue / price).toFixed(1));

  const executiveSummary = `By investing $${price.toLocaleString()}, the client projects ~$${Math.round(totalAnnualValue).toLocaleString()} in first-year value (${roiMultiple}x ROI), breaking even in approximately ${paybackPeriodMonths} month${paybackPeriodMonths === 1 ? '' : 's'}.`;

  return {
    annualizedSavings: Math.round(annualizedSavings),
    annualizedRevenueGain: Math.round(annualizedRevenueGain),
    totalAnnualValue: Math.round(totalAnnualValue),
    paybackPeriodMonths,
    roiMultiple,
    executiveSummary,
  };
}
