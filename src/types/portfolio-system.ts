export const PORTFOLIO_SYSTEM_STEPS = [
  'portfolio_goal',
  'asset_selection',
  'case_study_builder',
  'sample_project_builder',
  'proof_page_structure',
  'portfolio_copy_generator',
  'portfolio_checklist',
  'portfolio_report',
] as const;

export type PortfolioSystemStep = typeof PORTFOLIO_SYSTEM_STEPS[number];

export interface PortfolioGoal {
  goals: string[];
  statement: string;
}

export interface CaseStudy {
  projectTitle: string;
  clientNicheType: string;
  problem: string;
  process: string;
  deliverables: string;
  resultExpectedOutcome: string;
  toolsUsed: string;
  cta: string;
  isSampleProject: boolean;
}

export interface SampleProject {
  projectName: string;
  goal: string;
  whatToCreate: string;
  deliverables: string[];
  timeline: string;
  howToPresent: string;
}

export interface PortfolioPageStructure {
  sections: {
    id: string;
    label: string;
    description: string;
    included: boolean;
  }[];
}

export interface PortfolioCopy {
  headline: string;
  shortIntro: string;
  caseStudyIntro: string;
  processSection: string;
  cta: string;
}

export interface PortfolioChecklistItem {
  label: string;
  status: 'pending' | 'in_progress' | 'ready';
}

export interface PortfolioReport {
  goal: PortfolioGoal;
  selectedAssetTypes: string[];
  caseStudy: CaseStudy;
  sampleProject: SampleProject;
  pageStructure: PortfolioPageStructure;
  copy: PortfolioCopy;
  checklist: PortfolioChecklistItem[];
  nextActions: string[];
}

export interface PortfolioSystemState {
  phase3Service: string | null;
  phase3ServiceLabel: string | null;
  phase3Market: string | null;
  phase3Niche: string | null;
  phase3Positioning: string;
  phase3OfferName: string;
  phase3OfferType: string | null;
  phase3Deliverables: string[];
  phase3UniqueMechanism: string;
  phase3Pricing: string;
  phase3Timeline: string;
  phase3ScopeDetails: string;
  phase3AuthorityAngle: string;
  phase3ProofAssets: { title: string; type: string }[];
  phase3PortfolioAssets: { name: string }[];
  phase3TrustBuilderChecklist: { label: string; status: string }[];
  phase3ContentAssets: { title: string }[];
  phase3AuthorityProfile: {
    oneLinePositioning: string;
    shortBio: string;
    trustBullets: string[];
    ctaLine: string;
  };

  portfolioGoal: PortfolioGoal;
  selectedAssetTypes: string[];
  caseStudy: CaseStudy;
  sampleProject: SampleProject;
  pageStructure: PortfolioPageStructure;
  portfolioCopy: PortfolioCopy;
  checklist: PortfolioChecklistItem[];
  portfolioReport: PortfolioReport | null;

  currentStep: PortfolioSystemStep;
  completedSteps: PortfolioSystemStep[];

  setPhase3Context(ctx: {
    service: string | null;
    serviceLabel: string | null;
    market: string | null;
    niche: string | null;
    positioning: string;
    offerName: string;
    offerType: string | null;
    deliverables: string[];
    uniqueMechanism: string;
    pricing: string;
    timeline: string;
    scopeDetails: string;
    authorityAngle: string;
    proofAssets: { title: string; type: string }[];
    portfolioAssets: { name: string }[];
    trustBuilderChecklist: { label: string; status: string }[];
    contentAssets: { title: string }[];
    authorityProfile: {
      oneLinePositioning: string;
      shortBio: string;
      trustBullets: string[];
      ctaLine: string;
    };
  }): void;
  setPortfolioGoal(value: PortfolioGoal): void;
  setSelectedAssetTypes(value: string[]): void;
  setCaseStudy(value: CaseStudy): void;
  setSampleProject(value: SampleProject): void;
  setPageStructure(value: PortfolioPageStructure): void;
  setPortfolioCopy(value: PortfolioCopy): void;
  setChecklist(value: PortfolioChecklistItem[]): void;
  setPortfolioReport(value: PortfolioReport | null): void;
  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: PortfolioSystemStep): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: PortfolioSystemStep): number {
  return PORTFOLIO_SYSTEM_STEPS.indexOf(step);
}

export function canNavigateTo(
  target: PortfolioSystemStep,
  completedSteps: PortfolioSystemStep[],
): StepAccess {
  if (target === 'portfolio_goal') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = PORTFOLIO_SYSTEM_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return {
    unlocked: isUnlocked,
    reason: isUnlocked ? undefined : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
