/**
 * B.Cyber Compass — Core Type Definitions & Data Contracts (v2.3)
 *
 * Implements the 2-Dimensional Content & Trust Taxonomy:
 * - Axis 1: Content Domain (admission_policy vs. educational_guidance)
 * - Axis 2: Trust / Evidence Status (official_fact, observed_precedent_2026, pending_official_notice, independent_foundational)
 *
 * Strict Non-Negotiable Rules:
 * 1. Zero unverified 2027 admission requirements classified as official facts.
 * 2. JEE Main explicitly marked as discontinued for future admissions per official IIT Kanpur FAQ 23.
 * 3. Independent educational labs carry `isOfficialSyllabus: false`.
 * 4. Portfolio guidance carries non-guarantee disclaimers.
 */

// -----------------------------------------------------------------------------
// 1. 2-Dimensional Content & Trust Taxonomy
// -----------------------------------------------------------------------------

/**
 * Axis 1: Content Domain
 */
export type ContentDomain = 'admission_policy' | 'educational_guidance';

/**
 * Axis 2 (Domain A): Trust status for institutional admissions policies
 */
export type AdmissionTrustLevel =
  | 'official_fact'           // Confirmed by published IIT Kanpur / IIT Madras notices or ordinances
  | 'observed_precedent_2026' // Documented from the inaugural 2026 admission cycle
  | 'pending_official_notice';// Awaiting future official notification (e.g., 2027 test format/syllabus)

/**
 * Axis 2 (Domain B): Status for independent educational roadmaps and labs
 */
export type GuidanceTrustLevel =
  | 'independent_foundational' // Reputable 3rd-party learning labs (Bandit, PortSwigger, PicoCTF, etc.)
  | 'practical_heuristic';    // Practical problem-solving or portfolio assembly heuristics

/**
 * Combined Trust Level representation across the platform
 */
export type TrustLevel = AdmissionTrustLevel | GuidanceTrustLevel;

/**
 * Cycle scope for claims and policies
 */
export type AdmissionYearScope = 2026 | 2027 | 'ongoing';

/**
 * Manual verification state
 */
export type VerificationStatus = 'verified' | 'requires_manual_check';

// -----------------------------------------------------------------------------
// 2. Source Attribution & Citation Contract
// -----------------------------------------------------------------------------

export interface SourceCitation {
  title: string;
  url: string;
  sectionAnchor?: string;
  sourceType: 'official_portal' | 'official_pdf' | 'senate_rule' | 'press_release' | 'independent_platform';
  publishedDate?: string;    // YYYY-MM-DD
  verifiedDate: string;       // YYYY-MM-DD (Date verified by B.Cyber Compass)
  verbatimQuote?: string;     // Exact official text quotation
}

// -----------------------------------------------------------------------------
// 3. Admission Intelligence Data Contracts
// -----------------------------------------------------------------------------

export interface AdmissionClaimItem {
  id: string;
  claim: string;
  domain: 'admission_policy';
  trustLevel: AdmissionTrustLevel;
  applicableYear: AdmissionYearScope;
  verificationStatus: VerificationStatus;
  sources: SourceCitation[];
  qualificationsOrLimitations?: string;
  historicalContext?: string;
}

export interface AdmissionGuideSection {
  id: string;
  title: string;
  summary: string;
  applicableYear: AdmissionYearScope;
  trustLevel: AdmissionTrustLevel;
  claims: AdmissionClaimItem[];
}

export interface AdmissionGuideDocument {
  version: string;
  lastUpdated: string;
  disclaimer: string;
  sections: AdmissionGuideSection[];
}

// -----------------------------------------------------------------------------
// 4. Official Updates Timeline Contracts
// -----------------------------------------------------------------------------

export interface OfficialUpdateEntry {
  id: string;
  date: string;               // YYYY-MM-DD
  title: string;
  summary: string;
  domain: 'admission_policy';
  trustLevel: AdmissionTrustLevel;
  applicableYear: AdmissionYearScope;
  category: 'policy_change' | 'eligibility' | 'timeline' | 'curriculum';
  officialSource: SourceCitation;
  implicationsForStudents: string;
}

export interface OfficialUpdatesDocument {
  version: string;
  lastUpdated: string;
  updates: OfficialUpdateEntry[];
}

// -----------------------------------------------------------------------------
// 5. Evidence of Prior Work (FAQ 22 Alignment) Contracts
// -----------------------------------------------------------------------------

export type EvidenceItemType =
  | 'vulnerability_disclosure'
  | 'original_tool'
  | 'opensource_contribution'
  | 'technical_writeup'
  | 'video_walkthrough';

export interface EvidenceStandardItem {
  id: string;
  type: EvidenceItemType;
  title: string;
  description: string;
  officialReference: SourceCitation;
  verificationCriteria: string[];
  recommendedArtifactFormat: string;
  antiPatternsToAvoid: string[];
}

export interface EvidenceGuideDocument {
  version: string;
  lastUpdated: string;
  officialDisclaimer: string;
  standards: EvidenceStandardItem[];
}

// -----------------------------------------------------------------------------
// 6. Educational Guidance & Technical Resources Contracts
// -----------------------------------------------------------------------------

export type ResourceTopicDomain =
  | 'linux_cli'
  | 'networking'
  | 'web_security'
  | 'cryptography'
  | 'reverse_engineering'
  | 'projects_and_evidence';

export interface CuratedResource {
  id: string;
  name: string;
  url: string;
  provider: string;
  domain: 'educational_guidance';
  trustLevel: 'independent_foundational';
  topicCategory: ResourceTopicDomain;
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  estimatedHours: number;
  prerequisites: string[];
  handsOnTask: string;
  learningOutcome: string;
  isOfficialSyllabus: false; // Explicit compiler guarantee: never true
  disclaimer: string;
  verifiedDate: string;
}

export interface ResourcesDocument {
  version: string;
  lastUpdated: string;
  disclaimer: string;
  resources: CuratedResource[];
}

// -----------------------------------------------------------------------------
// 7. Personalised Preparation Planner Contracts (Diagnostic & Rule Engine)
// -----------------------------------------------------------------------------

export type PrepPathway = 'admission_prep' | 'skill_dev' | 'both';
export type AcademicStage = 'class_11_12' | 'dropper' | 'college_year_1' | 'college_year_2_plus';
export type TechnicalBaseline = 'zero_terminal' | 'basic_programming' | 'intermediate_scripting_networking';
export type PrimaryGoal = 'bcyber_admission' | 'cyber_foundations' | 'practical_portfolio' | 'career_shift';
export type TargetTimeline = '3_months' | '6_months' | '12_months';

export interface DiagnosticInputs {
  selectedPathway: PrepPathway;
  academicStage: AcademicStage;
  technicalBaseline: TechnicalBaseline;
  availableWeeklyHours: number; // Constrained between 3 and 25
  primaryGoal: PrimaryGoal;
  targetTimelineMonths: TargetTimeline;
}

/**
 * Strict Tripartite Plan Item Categories (Enforces Section 3 of Plan v2.3)
 */
export type PlanItemCategory =
  | 'confirmed_admission_requirement' // Category A: Official rules published by IITK
  | 'independent_provisional_prep'    // Category B: Foundational logic/math (NOT official test syllabus)
  | 'published_evidence_alignment'    // Category C: Portfolio tasks aligned with FAQ 22 standards
  | 'technical_skill_development';    // Pathway B: External technical labs (Bandit, PortSwigger, etc.)

export interface PlanTaskItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  category: PlanItemCategory;
  domain: ContentDomain;
  trustLevel: TrustLevel;
  prerequisites: string[];
  whyRecommended: string;
  resourceIds?: string[];
  disclaimer?: string;
}

export interface PlanPhase {
  id: string;
  phaseNumber: number;
  title: string;
  weekRange: [number, number];
  focusArea: string;
  tasks: PlanTaskItem[];
  milestoneDefinitionOfDone: string;
}

export interface ScheduledTaskSlot {
  taskId: string;
  title: string;
  allocatedHours: number;
  category: PlanItemCategory;
}

export interface WeeklyScheduleSlot {
  week: number;
  tasks: ScheduledTaskSlot[];
  totalAllocatedHours: number;
  capacityExplanation?: string;
}

export interface GeneratedPlan {
  id: string;
  generatedAt: string;
  inputs: DiagnosticInputs;
  phases: PlanPhase[];
  weeklySchedule: WeeklyScheduleSlot[];
  tradeOffExplanations: string[];
  disclaimers: string[];
}
