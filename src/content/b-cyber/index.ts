import admissionGuideData from './admission-guide.json';
import officialUpdatesData from './official-updates.json';
import evidenceGuideData from './evidence-of-work.json';
import resourcesData from './resources.json';

import type {
  AdmissionGuideDocument,
  OfficialUpdatesDocument,
  EvidenceGuideDocument,
  ResourcesDocument,
  CuratedResource,
  AdmissionClaimItem,
} from '../../types/b-cyber-compass';

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(`[B.Cyber Content Invariant Violation] ${message}`);
    this.name = 'ContentValidationError';
  }
}

const VALID_TOPIC_CATEGORIES = [
  'linux_cli',
  'networking',
  'web_security',
  'cryptography',
  'reverse_engineering',
  'projects_and_evidence',
] as const;

const VALID_DIFFICULTIES = ['introductory', 'intermediate', 'advanced'] as const;

export function validateCuratedResource(res: any, index = 0): CuratedResource {
  if (!res || typeof res !== 'object') {
    throw new ContentValidationError(`Resource at index ${index} is not an object.`);
  }
  if (typeof res.id !== 'string' || !res.id.trim()) {
    throw new ContentValidationError(`Resource at index ${index} missing required 'id'.`);
  }
  if (typeof res.name !== 'string' || !res.name.trim()) {
    throw new ContentValidationError(`Resource '${res.id}' missing required 'name'.`);
  }
  if (typeof res.provider !== 'string' || !res.provider.trim()) {
    throw new ContentValidationError(`Resource '${res.id}' missing required 'provider'.`);
  }
  if (res.domain !== 'educational_guidance') {
    throw new ContentValidationError(`Resource '${res.id}' has domain '${res.domain}'; expected 'educational_guidance'.`);
  }
  if (res.trustLevel !== 'independent_foundational') {
    throw new ContentValidationError(`Resource '${res.id}' has trustLevel '${res.trustLevel}'; expected 'independent_foundational'.`);
  }
  // CRITICAL INVARIANT: isOfficialSyllabus MUST be strictly false (not undefined, null, or true)
  if (res.isOfficialSyllabus !== false) {
    throw new ContentValidationError(
      `CRITICAL INVARIANT FAILED: Resource '${res.id}' must have 'isOfficialSyllabus' strictly set to false. Found: ${res.isOfficialSyllabus}`
    );
  }
  if (!VALID_TOPIC_CATEGORIES.includes(res.topicCategory)) {
    throw new ContentValidationError(
      `Resource '${res.id}' has invalid topicCategory '${res.topicCategory}'. Allowed: ${VALID_TOPIC_CATEGORIES.join(', ')}`
    );
  }
  if (!VALID_DIFFICULTIES.includes(res.difficulty)) {
    throw new ContentValidationError(
      `Resource '${res.id}' has invalid difficulty '${res.difficulty}'. Allowed: ${VALID_DIFFICULTIES.join(', ')}`
    );
  }
  if (typeof res.url !== 'string' || !res.url.startsWith('https://')) {
    throw new ContentValidationError(`Resource '${res.id}' must have a valid HTTPS url. Found: '${res.url}'`);
  }
  if (typeof res.estimatedHours !== 'number' || res.estimatedHours <= 0 || !Number.isFinite(res.estimatedHours)) {
    throw new ContentValidationError(`Resource '${res.id}' must have positive finite estimatedHours. Found: ${res.estimatedHours}`);
  }
  if (!Array.isArray(res.prerequisites) || res.prerequisites.length === 0 || !res.prerequisites.every((p: any) => typeof p === 'string')) {
    throw new ContentValidationError(`Resource '${res.id}' prerequisites must be a non-empty array of strings.`);
  }
  if (typeof res.handsOnTask !== 'string' || !res.handsOnTask.trim()) {
    throw new ContentValidationError(`Resource '${res.id}' missing required 'handsOnTask'.`);
  }
  if (typeof res.learningOutcome !== 'string' || !res.learningOutcome.trim()) {
    throw new ContentValidationError(`Resource '${res.id}' missing required 'learningOutcome'.`);
  }
  if (typeof res.disclaimer !== 'string' || !res.disclaimer.trim()) {
    throw new ContentValidationError(`Resource '${res.id}' missing required 'disclaimer'.`);
  }
  if (typeof res.verifiedDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(res.verifiedDate)) {
    throw new ContentValidationError(`Resource '${res.id}' verifiedDate must be YYYY-MM-DD format. Found: '${res.verifiedDate}'`);
  }

  // Construct validated object explicitly without substituting type assertions for runtime validation
  return {
    id: res.id,
    name: res.name,
    url: res.url,
    provider: res.provider,
    domain: 'educational_guidance',
    trustLevel: 'independent_foundational',
    topicCategory: res.topicCategory,
    difficulty: res.difficulty,
    estimatedHours: res.estimatedHours,
    prerequisites: [...res.prerequisites],
    handsOnTask: res.handsOnTask,
    learningOutcome: res.learningOutcome,
    isOfficialSyllabus: false,
    disclaimer: res.disclaimer,
    verifiedDate: res.verifiedDate,
  };
}

function validateResourcesDocument(data: any): ResourcesDocument {
  if (!data || typeof data !== 'object') {
    throw new ContentValidationError('resources.json root is not an object.');
  }
  if (!Array.isArray(data.resources) || data.resources.length === 0) {
    throw new ContentValidationError('resources.json must contain a non-empty resources array.');
  }
  const validatedResources = data.resources.map((r: any, idx: number) => validateCuratedResource(r, idx));
  return {
    version: String(data.version || ''),
    lastUpdated: String(data.lastUpdated || ''),
    disclaimer: String(data.disclaimer || ''),
    resources: validatedResources,
  };
}

function validateAdmissionClaim(claim: any, index: number): AdmissionClaimItem {
  if (!claim || typeof claim !== 'object') {
    throw new ContentValidationError(`Admission claim at index ${index} is not an object.`);
  }
  if (typeof claim.id !== 'string' || !claim.id.trim()) {
    throw new ContentValidationError(`Admission claim at index ${index} missing 'id'.`);
  }
  if (claim.domain !== 'admission_policy') {
    throw new ContentValidationError(`Claim '${claim.id}' must have domain 'admission_policy'. Found: '${claim.domain}'.`);
  }
  const validTrust = ['official_fact', 'observed_precedent_2026', 'pending_official_notice'];
  if (!validTrust.includes(claim.trustLevel)) {
    throw new ContentValidationError(`Claim '${claim.id}' has invalid trustLevel '${claim.trustLevel}'.`);
  }
  if (!Array.isArray(claim.sources) || claim.sources.length === 0) {
    throw new ContentValidationError(`Claim '${claim.id}' must have at least one source citation.`);
  }
  for (const src of claim.sources) {
    if (typeof src.url !== 'string' || !src.url.startsWith('http')) {
      throw new ContentValidationError(`Claim '${claim.id}' source has invalid url: '${src.url}'.`);
    }
    if (typeof src.verifiedDate !== 'string' || !src.verifiedDate.trim()) {
      throw new ContentValidationError(`Claim '${claim.id}' source missing verifiedDate.`);
    }
  }
  return claim as AdmissionClaimItem;
}

function validateAdmissionGuideDocument(data: any): AdmissionGuideDocument {
  if (!data || typeof data !== 'object') {
    throw new ContentValidationError('admission-guide.json root is not an object.');
  }
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    throw new ContentValidationError('admission-guide.json must contain a non-empty sections array.');
  }
  for (const sec of data.sections) {
    if (!Array.isArray(sec.claims)) {
      throw new ContentValidationError(`Section '${sec.id}' claims must be an array.`);
    }
    sec.claims.forEach((c: any, idx: number) => validateAdmissionClaim(c, idx));
  }
  return data as AdmissionGuideDocument;
}

function validateOfficialUpdatesDocument(data: any): OfficialUpdatesDocument {
  if (!data || typeof data !== 'object') {
    throw new ContentValidationError('official-updates.json root is not an object.');
  }
  if (!Array.isArray(data.updates) || data.updates.length === 0) {
    throw new ContentValidationError('official-updates.json must contain a non-empty updates array.');
  }
  for (const upd of data.updates) {
    if (typeof upd.id !== 'string' || !upd.id.trim()) {
      throw new ContentValidationError('Update item missing required id.');
    }
    if (upd.domain !== 'admission_policy') {
      throw new ContentValidationError(`Update '${upd.id}' must have domain 'admission_policy'.`);
    }
    if (!upd.officialSource || typeof upd.officialSource.url !== 'string' || !upd.officialSource.url.startsWith('http')) {
      throw new ContentValidationError(`Update '${upd.id}' has invalid officialSource url.`);
    }
  }
  return data as OfficialUpdatesDocument;
}

function validateEvidenceGuideDocument(data: any): EvidenceGuideDocument {
  if (!data || typeof data !== 'object') {
    throw new ContentValidationError('evidence-of-work.json root is not an object.');
  }
  if (!Array.isArray(data.standards) || data.standards.length === 0) {
    throw new ContentValidationError('evidence-of-work.json must contain non-empty standards array.');
  }
  for (const std of data.standards) {
    if (typeof std.id !== 'string' || !std.id.trim()) {
      throw new ContentValidationError('Evidence standard missing id.');
    }
    if (!std.officialReference || typeof std.officialReference.url !== 'string') {
      throw new ContentValidationError(`Evidence standard '${std.id}' missing officialReference url.`);
    }
  }
  return data as EvidenceGuideDocument;
}

// Runtime validated exports — fails loudly on module load if any invariant is violated
export const admissionGuide: AdmissionGuideDocument = validateAdmissionGuideDocument(admissionGuideData);
export const officialUpdates: OfficialUpdatesDocument = validateOfficialUpdatesDocument(officialUpdatesData);
export const evidenceGuide: EvidenceGuideDocument = validateEvidenceGuideDocument(evidenceGuideData);
export const resourcesCatalog: ResourcesDocument = validateResourcesDocument(resourcesData);
