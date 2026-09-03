/**
 * social-identity-pdf.ts — Executive Social Identity Dossier PDF Generator
 * 
 * Generates an executive-grade, beautifully styled PDF document containing:
 *  1. Executive Title Block & Identity Metadata
 *  2. Section 01: Core Positioning Thesis (Headline, Proof, Unique Mechanism)
 *  3. Section 02: Measurable Authority Audit & 4-Dimension Transformation
 *  4. Section 03: Multi-Platform Master Copy Vault (LinkedIn, Twitter, Instagram, YouTube, etc.)
 *  5. Section 04: Brand Continuity & Deployment Protocol
 *  6. Multi-page pagination, running headers, and footers
 */

import jsPDF from 'jspdf';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import { PLATFORM_REGISTRY } from './platformRegistry';

export interface AuthorityScoreData {
  total: number;
  baseline: number;
  improvement: number;
  improvementPct: number;
  positioningClarity: { score: number; maxScore: number; baseline?: number };
  platformCompleteness: { score: number; maxScore: number; baseline?: number };
  toneConsistency: { score: number; maxScore: number; baseline?: number };
  ctaPresence: { score: number; maxScore: number; baseline?: number };
}

export interface SocialIdentityPdfData {
  userName: string;
  userHandle: string;
  positioningHeadline: string;
  proofLine: string;
  uniqueMechanism: string;
  activeTone: string;
  authorityScore: AuthorityScoreData;
  profileSystem: ProfileSystemAsset[];
}

/* ── Layout Constants (A4 in mm) ── */
const PW = 210;
const PH = 297;
const M = 16;
const CW = PW - M * 2; // 178 mm
const FOOTER_TOP = 284;
const SAFE = FOOTER_TOP - 8;

/* ── Color Palette ── */
const C = {
  navyDark: '#061b4f',
  navySlate: '#0b1c30',
  cobalt: '#0058be',
  cobaltLight: '#e8f1fd',
  emerald: '#059669',
  emeraldLight: '#ecfdf5',
  cardBg: '#ffffff',
  pageBg: '#f8fafc',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  textMain: '#0f172a',
  textBody: '#334155',
  textMuted: '#64748b',
  textLight: '#94a3b8',
};

/* ── Helpers ── */
function wrap(doc: jsPDF, text: string, width: number, size = 9): string[] {
  doc.setFontSize(size);
  return doc.splitTextToSize(text || '', width);
}

function ensure(doc: jsPDF, y: number, need: number, data: SocialIdentityPdfData): number {
  if (y + need > SAFE) {
    doc.addPage();
    drawPageBackground(doc);
    drawContinuationHeader(doc, data);
    return 24;
  }
  return y;
}

function drawPageBackground(doc: jsPDF) {
  doc.setFillColor(C.pageBg);
  doc.rect(0, 0, PW, PH, 'F');
}

function drawContinuationHeader(doc: jsPDF, data: SocialIdentityPdfData) {
  doc.setFillColor(C.cardBg);
  doc.rect(M, 8, CW, 9, 'F');
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.3);
  doc.line(M, 17, PW - M, 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.cobalt);
  doc.text('SOCIAL PROFILE IDENTITY DOSSIER', M + 2, 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.textMuted);
  const userTag = `${data.userName || 'Authority Consultant'} (@${data.userHandle || 'expert'})`;
  doc.text(userTag, PW - M - 2, 13, { align: 'right' });
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.4);
  doc.line(M, FOOTER_TOP - 2, PW - M, FOOTER_TOP - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(C.textLight);
  doc.text(
    'Ayush Paul Authority Architecture System · Level 01: Social Profile Identity Studio',
    M,
    FOOTER_TOP + 3
  );

  doc.text(
    `Page ${pageNum} of ${totalPages}`,
    PW - M,
    FOOTER_TOP + 3,
    { align: 'right' }
  );
}

function cleanDisplayCopy(val: string): string {
  if (!val) return '';
  return val
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([(\[{])\s+/g, '$1')
    .replace(/\s+([)\]}])/g, '$1')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*\|\s*/g, ' | ')
    .trim();
}

/* ── Section Block Header Helper ── */
function drawSectionBadge(doc: jsPDF, y: number, stepNumber: string, title: string, subtitle?: string): number {
  doc.setFillColor(C.cobaltLight);
  doc.setDrawColor(C.cobalt);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, 14, 6, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C.cobalt);
  doc.text(stepNumber, M + 7, y + 4.2, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(C.navyDark);
  doc.text(title, M + 18, y + 4.8);

  let curY = y + 8;
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(C.textMuted);
    doc.text(subtitle, M + 18, curY);
    curY += 4;
  }
  return curY;
}

/* ── Main Export Engine ── */
export function generateSocialIdentityPdf(data: SocialIdentityPdfData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  drawPageBackground(doc);

  let y = M;

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. EXECUTIVE TITLE BLOCK / HERO HEADER
  // ═════════════════════════════════════════════════════════════════════════════
  doc.setFillColor(C.navySlate);
  doc.roundedRect(M, y, CW, 34, 3, 3, 'F');

  // Top Accent Bar
  doc.setFillColor(C.cobalt);
  doc.rect(M, y, CW, 2.5, 'F');

  // Eyebrow Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor('#38bdf8'); // Sky accent
  doc.text('AYUSH PAUL AUTHORITY SYSTEMS · LEVEL 01 CERTIFIED', M + 6, y + 8);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor('#ffffff');
  doc.text('Social Profile Identity & Authority Dossier', M + 6, y + 15);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#cbd5e1');
  doc.text('Cross-Channel Executive Positioning, Verified Deliverables & Conversion Copy Vault', M + 6, y + 21);

  // Bottom Metadata Strip inside hero
  doc.setFillColor('#061426');
  doc.rect(M, y + 25, CW, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#94a3b8');
  doc.text('OPERATOR:', M + 6, y + 31);
  doc.setTextColor('#ffffff');
  doc.text(`${data.userName || 'Executive Consultant'} (@${data.userHandle || 'expert'})`, M + 23, y + 31);

  doc.setTextColor('#94a3b8');
  doc.text('TONE:', M + 80, y + 31);
  doc.setTextColor('#ffffff');
  doc.text((data.activeTone || 'Executive').toUpperCase(), M + 91, y + 31);

  doc.setTextColor('#94a3b8');
  doc.text('DATE:', M + 120, y + 31);
  doc.setTextColor('#ffffff');
  doc.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), M + 130, y + 31);

  y += 39;

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. SECTION 01: CORE POSITIONING THESIS
  // ═════════════════════════════════════════════════════════════════════════════
  y = drawSectionBadge(doc, y, '01', 'Core Positioning Thesis', 'The singular high-ticket promise calibrated from Module 1 & 2');

  const headlineText = cleanDisplayCopy(data.positioningHeadline) || 'Executive High-Ticket Specialist';
  const proofText = cleanDisplayCopy(data.proofLine) || 'Proven results delivered across enterprise client engagements.';
  const mechText = cleanDisplayCopy(data.uniqueMechanism) || 'Systematic Authority Architecture';

  const wrappedHeadline = wrap(doc, headlineText, CW - 20, 9.5);
  const wrappedProof = wrap(doc, proofText, CW - 20, 8.5);
  const cardHeight = Math.max(wrappedHeadline.length * 4.8 + wrappedProof.length * 4.2 + 22, 38);

  doc.setFillColor(C.cardBg);
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, cardHeight, 2.5, 2.5, 'FD');

  // Left vertical accent bar
  doc.setFillColor(C.cobalt);
  doc.rect(M, y + 2, 2, cardHeight - 4, 'F');

  let cardY = y + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C.cobalt);
  doc.text('MASTER POSITIONING HEADLINE', M + 8, cardY);
  cardY += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(C.textMain);
  for (const line of wrappedHeadline) {
    doc.text(line, M + 8, cardY);
    cardY += 4.5;
  }

  cardY += 1.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.textMuted);
  doc.text('PROOF STATEMENT & EVIDENCE ANCHOR', M + 8, cardY);
  cardY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(C.textBody);
  for (const line of wrappedProof) {
    doc.text(line, M + 8, cardY);
    cardY += 4;
  }

  // Proprietary Mechanism Tag
  cardY += 1;
  doc.setFillColor(C.cobaltLight);
  doc.roundedRect(M + 8, cardY - 2.5, CW - 16, 6, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.cobalt);
  doc.text(`PROPRIETARY MECHANISM: ${mechText}`, M + 11, cardY + 1.5);

  y += cardHeight + 6;

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. SECTION 02: MEASURABLE AUTHORITY AUDIT & TRANSFORMATION
  // ═════════════════════════════════════════════════════════════════════════════
  y = ensure(doc, y, 46, data);
  y = drawSectionBadge(doc, y, '02', 'Authority Transformation Audit', 'Measurable gain vs. uncalibrated freelancer benchmark');

  const scoreData = data.authorityScore;
  const baseline = scoreData?.baseline || 38;
  const optimized = scoreData?.total || 90;
  const gain = scoreData?.improvement || Math.max(0, optimized - baseline);
  const gainPct = scoreData?.improvementPct || Math.round((gain / baseline) * 100);

  // Score comparison banner
  doc.setFillColor(C.cardBg);
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, 26, 2.5, 2.5, 'FD');

  // Baseline box
  const colW = (CW - 8) / 3;
  doc.setFillColor('#f1f5f9');
  doc.roundedRect(M + 2, y + 2, colW, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.textMuted);
  doc.text('BASELINE BENCHMARK', M + 2 + colW / 2, y + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(C.textMain);
  doc.text(`${baseline}`, M + 2 + colW / 2, y + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(C.textLight);
  doc.text('/ 100 · Pre-Optimization', M + 2 + colW / 2, y + 19, { align: 'center' });

  // Gain Box
  doc.setFillColor(C.emeraldLight);
  doc.roundedRect(M + 4 + colW, y + 2, colW, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.emerald);
  doc.text('NET AUTHORITY GAIN', M + 4 + colW + colW / 2, y + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(C.emerald);
  doc.text(`+${gain} PTS`, M + 4 + colW + colW / 2, y + 14, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(`+${gainPct}% Gain vs. Baseline`, M + 4 + colW + colW / 2, y + 19, { align: 'center' });

  // Optimized Box
  doc.setFillColor(C.cobaltLight);
  doc.roundedRect(M + 6 + colW * 2, y + 2, colW, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C.cobalt);
  doc.text('OPTIMIZED SCORE', M + 6 + colW * 2 + colW / 2, y + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(C.cobalt);
  doc.text(`${optimized}`, M + 6 + colW * 2 + colW / 2, y + 14, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('/ 100 · Top 5% Performer', M + 6 + colW * 2 + colW / 2, y + 19, { align: 'center' });

  y += 29;

  // 4 Dimensions Breakdown Bar
  const dimensions = [
    { label: 'Positioning Clarity', score: scoreData?.positioningClarity?.score || 23, baseline: scoreData?.positioningClarity?.baseline, max: 25 },
    { label: 'Platform Completeness', score: scoreData?.platformCompleteness?.score || 22, baseline: scoreData?.platformCompleteness?.baseline, max: 25 },
    { label: 'Tone & Proof Consistency', score: scoreData?.toneConsistency?.score || 23, baseline: scoreData?.toneConsistency?.baseline, max: 25 },
    { label: 'Action & CTA Signals', score: scoreData?.ctaPresence?.score || 22, baseline: scoreData?.ctaPresence?.baseline, max: 25 },
  ];

  const dimW = (CW - 6) / 4;
  for (let i = 0; i < dimensions.length; i++) {
    const dim = dimensions[i];
    const dx = M + i * (dimW + 2);
    doc.setFillColor(C.cardBg);
    doc.setDrawColor(C.border);
    doc.roundedRect(dx, y, dimW, 11, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(C.textMuted);
    doc.text(dim.label, dx + 2.5, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(C.navyDark);
    if (dim.baseline !== undefined) {
      doc.text(`${dim.baseline} -> ${dim.score} / ${dim.max}`, dx + 2.5, y + 8.8);
    } else {
      doc.text(`${dim.score} / ${dim.max}`, dx + 2.5, y + 8.8);
    }

    // Mini progress bar
    doc.setFillColor('#e2e8f0');
    doc.rect(dx + dimW - 14, y + 5.5, 11, 2, 'F');
    doc.setFillColor(C.cobalt);
    doc.rect(dx + dimW - 14, y + 5.5, Math.min(11 * (dim.score / dim.max), 11), 2, 'F');
  }

  y += 16;

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. SECTION 03: MULTI-PLATFORM MASTER COPY VAULT
  // ═════════════════════════════════════════════════════════════════════════════
  y = ensure(doc, y, 40, data);
  y = drawSectionBadge(doc, y, '03', 'Multi-Platform Master Copy Vault', 'Full calibrated deliverables formatted for 1-click deployment');

  const platforms = data.profileSystem || [];

  for (let pIdx = 0; pIdx < platforms.length; pIdx++) {
    const p = platforms[pIdx];
    const meta = PLATFORM_REGISTRY[p.platform] || {
      name: p.platform.toUpperCase(),
      brandColor: 'bg-neutral-800',
    };

    y = ensure(doc, y, 30, data);

    // Platform Header Bar
    doc.setFillColor(C.navySlate);
    doc.roundedRect(M, y, CW, 7.5, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor('#ffffff');
    doc.text(meta.name.toUpperCase(), M + 5, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor('#94a3b8');
    doc.text(`${p.fields.length} Deliverables Generated`, PW - M - 5, y + 5, { align: 'right' });

    y += 9.5;

    // Fields inside this platform
    for (let fIdx = 0; fIdx < p.fields.length; fIdx++) {
      const field = p.fields[fIdx];
      const cleanVal = cleanDisplayCopy(field.value);
      if (!cleanVal) continue;

      const wrappedVal = wrap(doc, cleanVal, CW - 12, 8);
      const fieldCardHeight = wrappedVal.length * 3.8 + 10;

      y = ensure(doc, y, fieldCardHeight + 3, data);

      doc.setFillColor(C.cardBg);
      doc.setDrawColor(C.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, y, CW, fieldCardHeight, 1.5, 1.5, 'FD');

      // Field Label chip
      const labelText = field.label.toUpperCase();
      doc.setFillColor(C.cobaltLight);
      doc.roundedRect(M + 3, y + 2.2, Math.min(labelText.length * 2 + 6, 60), 4.2, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(C.cobalt);
      doc.text(labelText, M + 5, y + 5.2);

      // Field Copy Content
      let fY = y + 9.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(C.textMain);

      for (const line of wrappedVal) {
        doc.text(line, M + 5, fY);
        fY += 3.8;
      }

      y += fieldCardHeight + 2.5;
    }

    y += 3.5;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. SECTION 04: BRAND CONTINUITY & DEPLOYMENT PROTOCOL
  // ═════════════════════════════════════════════════════════════════════════════
  y = ensure(doc, y, 48, data);
  y = drawSectionBadge(doc, y, '04', 'Deployment & Continuity Protocol', 'Operational rules to guarantee message continuity across public surfaces');

  const rules = [
    {
      num: 'A',
      title: 'Synchronized Launch Window',
      desc: 'Deploy updated bios across all channels simultaneously within 24 hours to prevent fragmented client perception during discovery audits.',
    },
    {
      num: 'B',
      title: 'Conversion Anchor Uniformity',
      desc: 'Route all public CTAs to the exact same lead asset (e.g. Master Blueprint or Case Study Teardown) to concentrate inbound intent.',
    },
    {
      num: 'C',
      title: 'Zero-Drift Execution',
      desc: 'Maintain the calibrated Executive tone in all direct message outreach and comment interactions to reinforce high-ticket authority.',
    },
  ];

  for (const rule of rules) {
    y = ensure(doc, y, 15, data);

    doc.setFillColor(C.cardBg);
    doc.setDrawColor(C.border);
    doc.roundedRect(M, y, CW, 13.5, 1.5, 1.5, 'FD');

    // Number circle
    doc.setFillColor(C.cobaltLight);
    doc.circle(M + 6.5, y + 6.5, 3.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(C.cobalt);
    doc.text(rule.num, M + 6.5, y + 8, { align: 'center' });

    // Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(C.navyDark);
    doc.text(rule.title, M + 13, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C.textBody);
    const descWrapped = wrap(doc, rule.desc, CW - 18, 7);
    let rY = y + 8.5;
    for (const dLine of descWrapped) {
      doc.text(dLine, M + 13, rY);
      rY += 3.2;
    }

    y += 15;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // FOOTER & CONTINUATION HEADERS (All Pages)
  // ═════════════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      drawContinuationHeader(doc, data);
    }
    drawFooter(doc, i, totalPages);
  }

  return doc;
}

/**
 * Triggers browser download of the generated PDF dossier.
 */
export function downloadSocialIdentityPdf(data: SocialIdentityPdfData) {
  const doc = generateSocialIdentityPdf(data);
  const cleanName = (data.userName || 'Authority-Profile').replace(/[^a-zA-Z0-9_-]/g, '-');
  doc.save(`Social-Identity-Dossier-${cleanName}.pdf`);
}
