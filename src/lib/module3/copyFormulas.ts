/**
 * Copywriting Formula Templates for Module 3 Authority Positioning
 * Generates deterministic, high-converting copy variants without LLM latency.
 */

export interface FormulaContext {
  market: string;
  service: string;
  mechanism: string;
  positioning: string;
}

export interface CopyFormula {
  id: 'proof' | 'problem' | 'contrarian';
  label: string;
  description: string;
  generateHeadline: (ctx: FormulaContext) => string;
  generateBio: (ctx: FormulaContext) => string;
}

export const COPY_FORMULAS: CopyFormula[] = [
  {
    id: 'proof',
    label: 'Proof-First',
    description: 'Leads directly with quantifiable metrics and verifiable impact',
    generateHeadline: ({ market, mechanism }) =>
      `I help ${market || 'companies'} scale → Measurable value | Creator of ${mechanism || 'our proven methodology'} | Book a call 👇`,
    generateBio: ({ market, service, mechanism, positioning }) =>
      `Over the past years, I've consistently delivered verifiable results for ${market || 'clients'}. If you need a ${positioning || 'Specialist'} who eliminates risk and guarantees delivery for ${service || 'systems'}, let's talk.\n\nKey Result: Proven impact using ${mechanism || 'our framework'}.`,
  },
  {
    id: 'problem',
    label: 'Problem-Solution',
    description: 'Pinpoints client operational bottlenecks and risk elimination',
    generateHeadline: ({ market, service }) =>
      `Tired of generic ${service || 'solutions'}? I build custom systems for ${market || 'teams'} so you can scale safely.`,
    generateBio: ({ market, mechanism }) =>
      `Most ${market || 'teams'} struggle with unpredictable execution and high operational friction.\n\nI solve this by implementing ${mechanism || 'our streamlined methodology'}. The outcome? Predictable growth without the usual headaches.`,
  },
  {
    id: 'contrarian',
    label: 'Contrarian',
    description: 'High-status, category-defining perspective that rejects low-ROI industry norms',
    generateHeadline: ({ market, service }) =>
      `Unpopular opinion: Traditional ${service || 'consulting'} is dead. I do the exact opposite for ${market || 'clients'}.`,
    generateBio: ({ mechanism }) =>
      `Everyone says you need more pitch decks and endless meetings. They're wrong.\n\nI build ${mechanism || 'execution systems'} that ignore the noise and focus purely on verifiable proof, risk reversal, and client retention.`,
  },
];

export function applyCopyFormula(
  formulaId: string,
  fieldKey: string,
  ctx: FormulaContext
): string {
  const formula = COPY_FORMULAS.find(f => f.id === formulaId) || COPY_FORMULAS[0];
  if (fieldKey.includes('headline') || fieldKey.includes('hero') || fieldKey.includes('tagline')) {
    return formula.generateHeadline(ctx);
  }
  return formula.generateBio(ctx);
}
