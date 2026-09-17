/**
 * Authority Score Engine
 * 
 * Calculates a REAL criteria-based authority score (0–100) for Stage 1.
 * No random numbers — every point is earned through measurable criteria.
 * 
 * 4 Scoring Dimensions (25 pts each = 100 total):
 *   1. Positioning Clarity   (25 pts) — How specific & non-generic the positioning is
 *   2. Platform Completeness (25 pts) — How many platform fields are filled with real content
 *   3. Tone Consistency      (25 pts) — Is the same tone applied across all platforms?
 *   4. CTA & Action Presence (25 pts) — Do profiles contain calls-to-action, links, proof?
 */

import type { ProfileSystemAsset } from '../../data/module3/authority-suite-engine';
import { getPlatformLabel, ALL_PLATFORM_KEYS } from './platformRegistry';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthorityScoreBreakdown {
  total: number;
  positioningClarity: DimensionScore;
  platformCompleteness: DimensionScore;
  toneConsistency: DimensionScore;
  ctaPresence: DimensionScore;
}

export interface DimensionScore {
  score: number;
  maxScore: number;
  label: string;
  reasoning: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface PlatformReadiness {
  platform: string;
  platformLabel: string;
  status: 'optimized' | 'needs_work' | 'not_started';
  filledFields: number;
  totalFields: number;
  percentComplete: number;
}

export interface AuthorityGapStatement {
  headline: string;
  description: string;
  severity: 'critical' | 'moderate' | 'minor' | 'none';
}

// ── Generic Word Blocklist (used for positioning clarity detection) ────────────

const GENERIC_WORDS = [
  'freelancer', 'developer', 'designer', 'editor', 'consultant', 'expert',
  'professional', 'specialist', 'guru', 'ninja', 'rockstar', 'passionate',
  'hard-working', 'motivated', 'results-driven', 'detail-oriented',
  'team player', 'self-starter', 'dynamic', 'innovative',
];

const AUTHORITY_SIGNALS = [
  'strategic', 'verifiable', 'proven', 'systematic', 'architecture',
  'framework', 'methodology', 'pipeline', 'system', 'engine',
  'transformation', 'authority', 'narrative', 'positioning',
  'high-ticket', 'enterprise', 'executive', 'premium',
  'eliminat', 'guarantee', 'measurable', 'predictable',
];

const CTA_SIGNALS = [
  'book', 'schedule', 'call', 'contact', 'hire', 'work with',
  'let\'s', 'dm', 'message', 'link', 'portfolio', 'website',
  'apply', 'connect', 'reach out', 'get in touch', 'consult',
  '→', '↗', 'click', 'visit', 'explore', 'discover',
];

// ── Scoring Functions ─────────────────────────────────────────────────────────

/**
 * Dimension 1: Positioning Clarity (25 pts)
 * Measures how specific, non-generic, and authority-signaling the headline is.
 */
function scorePositioningClarity(
  headline: string,
  proofLine: string,
  uniqueMechanism: string
): DimensionScore {
  let score = 0;
  const headlineLower = (headline || '').toLowerCase();
  const proofLower = (proofLine || '').toLowerCase();
  const mechLower = (uniqueMechanism || '').toLowerCase();

  // 1. Headline exists and has meaningful length (0-5 pts)
  if (headline.trim().length > 0) score += 2;
  if (headline.trim().length > 20) score += 1;
  if (headline.trim().length > 50) score += 2;

  // 2. Contains authority signal words (0-8 pts)
  const authorityHits = AUTHORITY_SIGNALS.filter(w => headlineLower.includes(w));
  score += Math.min(authorityHits.length * 2, 8);

  // 3. Avoids generic words (0-5 pts, penalty-based)
  const genericHits = GENERIC_WORDS.filter(w => headlineLower.includes(w));
  const genericPenalty = Math.min(genericHits.length * 2, 5);
  score += (5 - genericPenalty);

  // 4. Proof line exists and is specific (0-4 pts)
  if (proofLower.trim().length > 10) score += 2;
  if (proofLower.includes('help') && (proofLower.includes('achieve') || proofLower.includes('through'))) score += 2;

  // 5. Unique mechanism is defined (0-3 pts)
  if (mechLower.trim().length > 5) score += 3;

  const finalScore = Math.min(score, 25);
  
  let status: 'strong' | 'moderate' | 'weak' = 'weak';
  if (finalScore >= 18) status = 'strong';
  else if (finalScore >= 10) status = 'moderate';

  let reasoning: string;
  if (status === 'weak') reasoning = 'Your positioning headline reads as generic. Add specific methodology names and avoid commodity words.';
  else if (status === 'moderate') reasoning = 'Good positioning foundation. Strengthen with more specific authority signals and proof elements.';
  else reasoning = 'Strong authority positioning with specific, non-generic language.';

  return { score: finalScore, maxScore: 25, label: 'Positioning Clarity', reasoning, status };
}

/**
 * Dimension 2: Platform Completeness (25 pts)
 * Measures how many platform fields are filled with real, customized content.
 */
function scorePlatformCompleteness(
  profileSystem: ProfileSystemAsset[],
  userName: string,
  userHandle: string
): DimensionScore {
  if (!profileSystem || profileSystem.length === 0) {
    return {
      score: 0,
      maxScore: 25,
      label: 'Platform Completeness',
      reasoning: 'No platform profiles generated yet. Complete your identity foundation first.',
      status: 'weak',
    };
  }

  let totalFields = 0;
  let filledFields = 0;
  let customizedFields = 0;

  for (const platform of profileSystem) {
    for (const field of platform.fields) {
      totalFields++;
      const val = (field.value || '').trim();
      
      // Check if field has meaningful content (not just empty or placeholder)
      if (val.length > 5) {
        filledFields++;
      }
      
      // Check if user customized it (not just auto-generated default)
      if (field.isCustomized) {
        customizedFields++;
      }
    }
  }

  const fillRate = totalFields > 0 ? filledFields / totalFields : 0;
  const customRate = totalFields > 0 ? customizedFields / totalFields : 0;

  // Score breakdown:
  // - Platform count coverage (0-8 pts): How many platforms have content
  const platformsWithContent = profileSystem.filter(p => 
    p.fields.some(f => (f.value || '').trim().length > 5)
  ).length;
  const platformCoverage = Math.min(Math.round((platformsWithContent / 3) * 8), 8);

  // - Field fill rate (0-10 pts)
  const fieldFillScore = Math.round(fillRate * 10);

  // - Completeness & customization bonus (0-4 pts): Full platform asset generation or user customizations
  const customScore = fillRate >= 0.8 ? 4 : Math.max(Math.round(customRate * 4), 2);

  // - Identity set bonus (0-3 pts): Name and handle are provided (or default author calibrated)
  let identityScore = 1;
  if (userName && userName.trim().length >= 2) identityScore += 1;
  if (userHandle && userHandle.trim().length >= 2) identityScore += 1;

  const finalScore = Math.min(platformCoverage + fieldFillScore + customScore + identityScore, 25);

  let status: 'strong' | 'moderate' | 'weak' = 'weak';
  if (finalScore >= 18) status = 'strong';
  else if (finalScore >= 10) status = 'moderate';

  let reasoning: string;
  if (status === 'weak') reasoning = `Only ${platformsWithContent} platform(s) have content. Fill all primary channels to build trust.`;
  else if (status === 'moderate') reasoning = `${filledFields}/${totalFields} fields filled. Customize more fields to earn full marks.`;
  else reasoning = `Excellent coverage with ${platformsWithContent} platforms and ${customizedFields} customized fields.`;

  return { score: finalScore, maxScore: 25, label: 'Platform Completeness', reasoning, status };
}

/**
 * Dimension 3: Tone Consistency (25 pts)
 * Measures whether the same professional tone is applied across all platforms.
 */
function scoreToneConsistency(
  profileSystem: ProfileSystemAsset[],
  activeTone: string
): DimensionScore {
  if (!profileSystem || profileSystem.length < 2) {
    return {
      score: 5,
      maxScore: 25,
      label: 'Tone Consistency',
      reasoning: 'Need at least 2 platforms to measure consistency. Add more platforms.',
      status: 'weak',
    };
  }

  // Extract all main positioning text fields across platforms (headline, bio, banner, or tagline)
  const headlines: { platform: string; text: string }[] = [];
  for (const platform of profileSystem) {
    const headlineField = platform.fields.find(f => 
      f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline') || f.key.includes('title')
    );
    if (headlineField && headlineField.value.trim().length > 5) {
      headlines.push({ platform: platform.platform, text: headlineField.value.toLowerCase() });
      continue;
    }

    const bioField = platform.fields.find(f => f.key === 'bio' || f.key === 'banner_text');
    if (bioField && bioField.value.trim().length > 5) {
      // Use the first line of the bio for tone consistency check
      headlines.push({ platform: platform.platform, text: bioField.value.split('\n')[0].toLowerCase() });
    }
  }

  if (headlines.length < 2) {
    return {
      score: 12,
      maxScore: 25,
      label: 'Tone Consistency',
      reasoning: 'Need at least 2 active platforms to measure cross-channel tone consistency.',
      status: 'moderate',
    };
  }

  let score = 0;

  // 1. Tone is explicitly set (not default) — 5 pts
  if (activeTone && activeTone !== '') score += 5;

  // 2. Keyword overlap between headlines (0-10 pts)
  // Extract significant words from each headline and check overlap
  const extractWords = (text: string) => 
    text.split(/[\s,.|•\-→↗]+/).filter(w => w.length > 3 && !['with', 'that', 'this', 'your', 'from', 'have', 'been', 'more', 'they'].includes(w));
  
  const allWordSets = headlines.map(h => new Set(extractWords(h.text)));
  
  // Calculate pairwise overlap
  let totalOverlap = 0;
  let pairCount = 0;
  for (let i = 0; i < allWordSets.length; i++) {
    for (let j = i + 1; j < allWordSets.length; j++) {
      const intersection = [...allWordSets[i]].filter(w => allWordSets[j].has(w));
      const union = new Set([...allWordSets[i], ...allWordSets[j]]);
      if (union.size > 0) {
        totalOverlap += intersection.length / union.size;
      }
      pairCount++;
    }
  }
  const avgOverlap = pairCount > 0 ? totalOverlap / pairCount : 0;
  score += Math.round(avgOverlap * 10);

  // 3. No conflicting tone signals (0-5 pts)
  // Check if any headline has casual markers while others have formal
  const casualMarkers = ['lol', 'just', 'vibing', 'hey', 'haha', '😂', '🔥', 'btw'];
  const formalMarkers = ['strategic', 'executive', 'enterprise', 'verifiable', 'systematic'];
  
  let hasCasual = false;
  let hasFormal = false;
  for (const h of headlines) {
    if (casualMarkers.some(m => h.text.includes(m))) hasCasual = true;
    if (formalMarkers.some(m => h.text.includes(m))) hasFormal = true;
  }
  
  if (hasCasual && hasFormal) {
    // Tone conflict detected
    score += 0;
  } else {
    score += 5;
  }

  // 4. All platforms use same structural format (0-5 pts)
  // Check if headlines follow similar pattern (e.g., all use "•" separator or all use "|")
  const formatPatterns = headlines.map(h => {
    if (h.text.includes('•')) return 'bullet';
    if (h.text.includes('|')) return 'pipe';
    if (h.text.includes('—')) return 'dash';
    return 'plain';
  });
  const uniqueFormats = new Set(formatPatterns);
  if (uniqueFormats.size === 1) score += 5;
  else if (uniqueFormats.size === 2) score += 3;
  else score += 1;

  const finalScore = Math.min(score, 25);

  let status: 'strong' | 'moderate' | 'weak' = 'weak';
  if (finalScore >= 18) status = 'strong';
  else if (finalScore >= 10) status = 'moderate';

  const driftPlatforms = hasCasual && hasFormal ? 'Tone drift detected: some platforms are casual while others are formal.' : '';
  let reasoning: string;
  if (status === 'weak') reasoning = `Low consistency across platforms. ${driftPlatforms} Apply a single tone to all channels.`;
  else if (status === 'moderate') reasoning = `Decent consistency. ${driftPlatforms} Minor formatting differences across platforms.`;
  else reasoning = 'Excellent tone alignment across all platforms. Consistent professional voice.';

  return { score: finalScore, maxScore: 25, label: 'Tone Consistency', reasoning, status };
}

/**
 * Dimension 4: CTA & Action Presence (25 pts)
 * Measures whether profiles contain calls-to-action, links, and proof elements.
 */
function scoreCtaPresence(
  profileSystem: ProfileSystemAsset[]
): DimensionScore {
  if (!profileSystem || profileSystem.length === 0) {
    return {
      score: 0,
      maxScore: 25,
      label: 'CTA & Action Presence',
      reasoning: 'No platform profiles available. Generate profiles to measure CTA presence.',
      status: 'weak',
    };
  }

  let score = 0;
  let platformsWithCta = 0;
  let platformsWithProof = 0;
  let platformsWithLink = 0;

  for (const platform of profileSystem) {
    const allText = platform.fields.map(f => f.value.toLowerCase()).join(' ');
    
    // Check for CTA signals
    if (CTA_SIGNALS.some(s => allText.includes(s))) {
      platformsWithCta++;
    }
    
    // Check for proof/credibility signals
    const proofKeywords = [
      'proven', 'verified', 'case study', 'client', 'result', 'testimonial',
      'portfolio', '%', 'revenue', 'growth', 'blueprint', 'framework', 'system',
      'teardown', 'scale', 'architecture', 'audit', 'dm', 'proof', 'roi'
    ];
    if (proofKeywords.some(s => allText.includes(s))) {
      platformsWithProof++;
    }
    
    // Check for link/URL presence
    if (['http', 'www', '.com', '.io', 'link', 'site', 'portfolio'].some(s => allText.includes(s))) {
      platformsWithLink++;
    }
  }

  const totalPlatforms = profileSystem.length;

  // CTA coverage (0-10 pts)
  score += Math.min(Math.round((platformsWithCta / Math.max(totalPlatforms, 1)) * 10), 10);

  // Proof/credibility coverage (0-8 pts)
  score += Math.min(Math.round((platformsWithProof / Math.max(totalPlatforms, 1)) * 8), 8);

  // Link/portfolio coverage (0-7 pts)
  score += Math.min(Math.round((platformsWithLink / Math.max(totalPlatforms, 1)) * 7), 7);

  const finalScore = Math.min(score, 25);

  let status: 'strong' | 'moderate' | 'weak' = 'weak';
  if (finalScore >= 18) status = 'strong';
  else if (finalScore >= 10) status = 'moderate';

  let reasoning: string;
  if (status === 'weak') reasoning = `Only ${platformsWithCta}/${totalPlatforms} platforms have CTAs. Add "Book a call", "Visit portfolio" etc. to drive action.`;
  else if (status === 'moderate') reasoning = `${platformsWithCta}/${totalPlatforms} platforms have CTAs. Add proof elements and portfolio links to strengthen.`;
  else reasoning = `Strong action presence: ${platformsWithCta} CTAs, ${platformsWithProof} proof elements, ${platformsWithLink} links across platforms.`;

  return { score: finalScore, maxScore: 25, label: 'CTA & Action Presence', reasoning, status };
}

// ── Main Calculator ───────────────────────────────────────────────────────────

export function calculateAuthorityScore(params: {
  profileSystem: ProfileSystemAsset[];
  headline: string;
  proofLine: string;
  uniqueMechanism: string;
  userName: string;
  userHandle: string;
  activeTone: string;
}): AuthorityScoreBreakdown {
  const positioningClarity = scorePositioningClarity(
    params.headline,
    params.proofLine,
    params.uniqueMechanism
  );
  
  const platformCompleteness = scorePlatformCompleteness(
    params.profileSystem,
    params.userName,
    params.userHandle
  );
  
  const toneConsistency = scoreToneConsistency(
    params.profileSystem,
    params.activeTone
  );
  
  const ctaPresence = scoreCtaPresence(params.profileSystem);

  const total = positioningClarity.score + platformCompleteness.score + toneConsistency.score + ctaPresence.score;

  return {
    total,
    positioningClarity,
    platformCompleteness,
    toneConsistency,
    ctaPresence,
  };
}

// ── Platform Readiness Calculator ─────────────────────────────────────────────

export function calculatePlatformReadiness(
  profileSystem: ProfileSystemAsset[],
  recommendedPlatforms: string[]
): PlatformReadiness[] {
  const allPlatformKeys = ALL_PLATFORM_KEYS;
  
  // Show recommended platforms first, then others
  const sortedKeys = [
    ...recommendedPlatforms,
    ...allPlatformKeys.filter(k => !recommendedPlatforms.includes(k)),
  ];

  return sortedKeys.map(key => {
    const platformData = profileSystem.find(p => p.platform === key);
    const label = getPlatformLabel(key);
    
    if (!platformData || !platformData.fields.length) {
      return {
        platform: key,
        platformLabel: label,
        status: 'not_started' as const,
        filledFields: 0,
        totalFields: 2, // minimum expected
        percentComplete: 0,
      };
    }

    const totalFields = platformData.fields.length;
    const filledFields = platformData.fields.filter(f => (f.value || '').trim().length > 5).length;
    const percentComplete = Math.round((filledFields / totalFields) * 100);

    let status: 'optimized' | 'needs_work' | 'not_started' = 'not_started';
    if (percentComplete >= 80) status = 'optimized';
    else if (percentComplete > 0) status = 'needs_work';

    return {
      platform: key,
      platformLabel: label,
      status,
      filledFields,
      totalFields,
      percentComplete,
    };
  });
}

// ── Gap Statement Generator ───────────────────────────────────────────────────

export function generateGapStatement(
  score: AuthorityScoreBreakdown,
  userName: string
): AuthorityGapStatement {
  const total = score.total;
  const weakDimensions = [
    score.positioningClarity,
    score.platformCompleteness,
    score.toneConsistency,
    score.ctaPresence,
  ].filter(d => d.status === 'weak');

  if (total >= 80) {
    return {
      headline: `${userName}'s profiles are at Authority Level`,
      description: 'Your social presence communicates premium positioning. Minor optimizations remain for perfect consistency.',
      severity: 'none',
    };
  }

  if (total >= 55) {
    const weakLabel = weakDimensions[0]?.label || 'some areas';
    return {
      headline: `Strong foundation, but ${weakLabel.toLowerCase()} needs attention`,
      description: `Your profiles are above average but a high-ticket client would notice gaps in ${weakLabel.toLowerCase()}. Fix this to close $5K+ deals confidently.`,
      severity: 'moderate',
    };
  }

  if (total >= 30) {
    return {
      headline: `Your profiles currently read as a job-seeker, not a $5K+ consultant`,
      description: `${weakDimensions.length} of 4 authority dimensions are weak. Prospects checking your LinkedIn/GitHub right now would see a generic freelancer profile.`,
      severity: 'critical',
    };
  }

  return {
    headline: `Your social identity is invisible to high-ticket clients`,
    description: 'No optimized platforms, no clear positioning, no proof elements. Every prospect who checks your profile is bouncing immediately.',
    severity: 'critical',
  };
}

export interface CrossPlatformConsistencyCheck {
  isAligned: boolean;
  score: number;
  divergentPlatforms: string[];
  recommendations: string[];
}

export function diagnoseCrossPlatformConsistency(
  profileSystem: ProfileSystemAsset[],
  targetMechanism?: string
): CrossPlatformConsistencyCheck {
  if (!profileSystem || profileSystem.length === 0) {
    return {
      isAligned: true,
      score: 100,
      divergentPlatforms: [],
      recommendations: ['No platforms configured yet. Configure your primary platforms.'],
    };
  }

  const divergentPlatforms: string[] = [];
  const recommendations: string[] = [];
  let matchingCount = 0;

  const mechanismTerm = (targetMechanism || '').toLowerCase().trim();

  profileSystem.forEach((p) => {
    const combinedText = p.fields.map(f => f.value.toLowerCase()).join(' ');
    const hasAuthoritySignal = AUTHORITY_SIGNALS.some(signal => combinedText.includes(signal));
    const hasMechanism = mechanismTerm ? combinedText.includes(mechanismTerm) : true;

    if (hasAuthoritySignal && hasMechanism) {
      matchingCount++;
    } else {
      divergentPlatforms.push(p.platform);
    }
  });

  const score = Math.round((matchingCount / profileSystem.length) * 100);
  const isAligned = score >= 80;

  if (!isAligned) {
    recommendations.push(
      `Align your core value proposition across ${divergentPlatforms.join(', ')} to prevent mixed signals for inbound leads.`
    );
  } else {
    recommendations.push('Cross-platform positioning is cohesive and builds uniform client trust.');
  }

  return {
    isAligned,
    score,
    divergentPlatforms,
    recommendations,
  };
}

export function harmonizeProfilePositioning(
  profileSystem: ProfileSystemAsset[],
  referenceHeadline?: string,
  referencePromise?: string
): ProfileSystemAsset[] {
  const headline = referenceHeadline || 'Strategic Systems Architect & Product Engineer';
  const promise = referencePromise || 'Deterministic architectures that scale with measurable ROI.';

  return profileSystem.map((asset) => {
    const updatedFields = asset.fields.map((f) => {
      if (f.key === 'headline' || f.key === 'tagline' || f.key === 'title') {
        return { ...f, value: headline };
      }
      if (f.key === 'one_liner' || f.key === 'short_bio') {
        return { ...f, value: promise };
      }
      return f;
    });

    return {
      ...asset,
      fields: updatedFields,
    };
  });
}

// ── Unbiased Audit Baseline Calculator ──────────────────────────────────────────

export interface AuditBaselineParams {
  selectedPlatforms: string[];
  auditMode: 'quiz' | 'paste';
  quizAnswers: {
    headlineType: string | null;
    hasPinnedProof: boolean | null;
    hasSingleCta: boolean | null;
  };
  pastedBio?: string;
  isBioAnalyzed?: boolean;
  serviceId?: string | null;
  careerTrackId?: string | null;
}

export interface AuditBaselineDimension {
  label: string;
  score: number;
  max: number;
  desc: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface AuditBaselineResult {
  total: number;
  dimensions: {
    positioning: AuditBaselineDimension;
    platformCoverage: AuditBaselineDimension;
    proofEvidence: AuditBaselineDimension;
    conversionCta: AuditBaselineDimension;
  };
  dimensionList: AuditBaselineDimension[];
  diagnosticGaps: string[];
}

/**
 * Calculates a 100% criteria-based baseline score (0–100) directly from user audit answers.
 * Total score is strictly equal to the sum of the 4 dimensions.
 */
export function calculateAuditBaselineScore(params: AuditBaselineParams): AuditBaselineResult {
  const {
    selectedPlatforms = [],
    auditMode = 'quiz',
    quizAnswers = { headlineType: null, hasPinnedProof: null, hasSingleCta: null },
    pastedBio = '',
    serviceId,
    careerTrackId,
  } = params;

  // 1. Positioning & Headline Clarity (0–25)
  let positioningScore = 10;
  let positioningDesc = 'Baseline generalist positioning';
  let positioningStatus: 'strong' | 'moderate' | 'weak' = 'weak';

  if (auditMode === 'quiz') {
    if (quizAnswers.headlineType === 'authority') {
      positioningScore = 22;
      positioningStatus = 'strong';
      positioningDesc = 'Clear strategic authority stance with outcome-focused value proposition';
    } else if (quizAnswers.headlineType === 'skills') {
      positioningScore = 13;
      positioningStatus = 'moderate';
      positioningDesc = 'Tool & skill-listing headline. High risk of commodity pricing';
    } else if (quizAnswers.headlineType === 'generic') {
      positioningScore = 6;
      positioningStatus = 'weak';
      positioningDesc = 'Generic freelancer title. Over 80% of high-ticket visitors bounce immediately';
    }
  } else {
    const lower = (pastedBio || '').toLowerCase();
    let pScore = 6;
    if (['help', 'scale', 'engineer', 'architect', 'build for', 'grow', 'partner'].some(w => lower.includes(w))) pScore += 8;
    if (lower.length >= 40 && lower.length <= 220) pScore += 4;
    if (['enterprise', 'creator', 'founder', 'b2b', 'saas', 'startup', 'brand'].some(w => lower.includes(w))) pScore += 4;
    if (['passionate', 'aspiring', 'looking for', 'open to work', 'freelancer'].some(w => lower.includes(w))) pScore = Math.max(pScore - 4, 5);
    positioningScore = Math.min(Math.max(pScore, 5), 22);
    positioningStatus = positioningScore >= 18 ? 'strong' : positioningScore >= 12 ? 'moderate' : 'weak';
    positioningDesc = positioningScore >= 18 ? 'Strong outcome-led profile bio' : positioningScore >= 12 ? 'Decent foundation but lacks specific authority hooks' : 'Uncalibrated bio with commodity signals';
  }

  // 2. Channel Architecture & Relevance (0–25)
  const platformCount = selectedPlatforms.length;
  let platformScore =
    platformCount === 0 ? 0 :
    platformCount === 1 ? 8 :
    platformCount === 2 ? 15 :
    platformCount === 3 ? 20 : 23;

  // Alignment bonus
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();
  const isVideo = s.includes('video') || s.includes('edit') || c.includes('editor');
  const isDev = s.includes('code') || s.includes('dev') || c.includes('developer');
  const isDesigner = s.includes('design') || c.includes('designer');

  if (isVideo && (selectedPlatforms.includes('youtube') || selectedPlatforms.includes('instagram'))) platformScore = Math.min(platformScore + 2, 25);
  else if (isDev && (selectedPlatforms.includes('github') || selectedPlatforms.includes('linkedin'))) platformScore = Math.min(platformScore + 2, 25);
  else if (isDesigner && (selectedPlatforms.includes('behance') || selectedPlatforms.includes('figma') || selectedPlatforms.includes('dribbble'))) platformScore = Math.min(platformScore + 2, 25);
  else if (selectedPlatforms.includes('linkedin') || selectedPlatforms.includes('twitter')) platformScore = Math.min(platformScore + 2, 25);

  const platformStatus: 'strong' | 'moderate' | 'weak' = platformScore >= 18 ? 'strong' : platformScore >= 12 ? 'moderate' : 'weak';
  const platformDesc = platformCount === 0 ? 'No distribution channels selected' : `${platformCount} active channel(s) configured for distribution`;

  // 3. Social Proof & Evidence Placement (0–25)
  let proofScore: number;
  let proofStatus: 'strong' | 'moderate' | 'weak';
  let proofDesc: string;

  if (auditMode === 'quiz') {
    if (quizAnswers.hasPinnedProof === true) {
      proofScore = 20;
      proofStatus = 'strong';
      proofDesc = 'Pinned case studies, metrics, or portfolio teardowns present';
    } else {
      proofScore = 6;
      proofStatus = 'weak';
      proofDesc = 'Zero pinned verifiable proof assets. High client evaluation skepticism';
    }
  } else {
    const lower = (pastedBio || '').toLowerCase();
    let prScore = 6;
    if (/\d+[%xX+]|\$\d|\d+\s*(clients|projects|videos|views|subscribers|revenue)/i.test(lower)) prScore += 9;
    if (['proven', 'case study', 'client', 'result', 'roi', 'portfolio', 'metric'].some(w => lower.includes(w))) prScore += 5;
    proofScore = Math.min(Math.max(prScore, 6), 20);
    proofStatus = proofScore >= 16 ? 'strong' : proofScore >= 11 ? 'moderate' : 'weak';
    proofDesc = proofScore >= 16 ? 'Quantifiable metrics and verifiable proof detected' : 'Limited or missing quantifiable evidence in bio';
  }

  // 4. Conversion CTA & Funnel Link (0–25)
  let ctaScore: number;
  let ctaStatus: 'strong' | 'moderate' | 'weak';
  let ctaDesc: string;

  if (auditMode === 'quiz') {
    if (quizAnswers.hasSingleCta === true) {
      ctaScore = 20;
      ctaStatus = 'strong';
      ctaDesc = 'Single direct conversion path or calendar booking link';
    } else {
      ctaScore = 6;
      ctaStatus = 'weak';
      ctaDesc = 'No dedicated conversion CTA or cluttered link directory';
    }
  } else {
    const lower = (pastedBio || '').toLowerCase();
    let cScore = 6;
    if (['book', 'schedule', 'apply', 'calendly', 'dm me', 'hire', 'consult'].some(w => lower.includes(w))) cScore += 9;
    if (['http', 'www', '.com', '.io', 'link', 'site'].some(w => lower.includes(w))) cScore += 5;
    ctaScore = Math.min(Math.max(cScore, 6), 20);
    ctaStatus = ctaScore >= 16 ? 'strong' : ctaScore >= 11 ? 'moderate' : 'weak';
    ctaDesc = ctaScore >= 16 ? 'Clear call-to-action leading to conversion destination' : 'Passive or absent conversion directive';
  }

  const total = Math.min(positioningScore + platformScore + proofScore + ctaScore, 100);

  const diagnosticGaps: string[] = [];
  
  if (auditMode === 'quiz') {
    if (quizAnswers.headlineType === 'skills' || quizAnswers.headlineType === 'generic') {
      diagnosticGaps.push('Generic commodity positioning');
    }
    if (quizAnswers.hasPinnedProof === false) {
      diagnosticGaps.push('Missing verifiable proof assets');
    }
    if (quizAnswers.hasSingleCta === false) {
      diagnosticGaps.push('No clear conversion funnel or CTA');
    }
  } else {
    if (positioningStatus !== 'strong') diagnosticGaps.push('Generic commodity positioning');
    if (proofStatus !== 'strong') diagnosticGaps.push('Missing verifiable proof assets');
    if (ctaStatus !== 'strong') diagnosticGaps.push('No clear conversion funnel or CTA');
  }

  const dimensions = {
    positioning: {
      label: 'Positioning & Headline Clarity',
      score: positioningScore,
      max: 25,
      desc: positioningDesc,
      status: positioningStatus,
    },
    platformCoverage: {
      label: 'Channel Architecture & Relevance',
      score: platformScore,
      max: 25,
      desc: platformDesc,
      status: platformStatus,
    },
    proofEvidence: {
      label: 'Social Proof & Evidence Placement',
      score: proofScore,
      max: 25,
      desc: proofDesc,
      status: proofStatus,
    },
    conversionCta: {
      label: 'Conversion CTA & Funnel Link',
      score: ctaScore,
      max: 25,
      desc: ctaDesc,
      status: ctaStatus,
    },
  };

  return {
    total,
    dimensions,
    dimensionList: [
      dimensions.positioning,
      dimensions.platformCoverage,
      dimensions.proofEvidence,
      dimensions.conversionCta,
    ],
    diagnosticGaps,
  };
}


