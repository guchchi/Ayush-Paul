import jsPDF from 'jspdf';
import type { OfferBlueprint } from '../../types/offer-engineering';

/* ── Layout Constants ── */
const PW = 210;
const PH = 297;
const M = 18;
const CW = PW - M * 2;
const FOOTER_TOP = 282;
const SAFE = FOOTER_TOP - 4;

/* ── Helpers ── */
function wrap(doc: jsPDF, t: string, w: number, sz?: number): string[] {
  doc.setFontSize(sz ?? 9);
  return doc.splitTextToSize(t, w);
}

function ensure(doc: jsPDF, y: number, need: number): boolean {
  if (y + need > SAFE) { doc.addPage(); bg(doc); return true; }
  return false;
}

function bg(doc: jsPDF) {
  doc.setFillColor('#f8f9ff');
  doc.rect(0, 0, PW, PH, 'F');
}

/* ── Hero Visuals ── */
function heroGaming(doc: jsPDF, x: number, y: number) {
  const w = 62, h = 54;

  // panel bg
  doc.setFillColor('#ffffff');
  doc.setDrawColor('#e5e7eb');
  doc.rect(x, y, w, h, 'FD');

  // play triangle
  doc.setFillColor('#0058be');
  doc.triangle(x + 16, y + 14, x + 16, y + 40, x + 38, y + 27, 'F');

  // screen frame
  doc.setDrawColor('#d1d5db');
  doc.setLineWidth(0.5);
  doc.rect(x + 24, y + 8, 28, 18, 'S');
  doc.setFillColor('#f3f4f6');
  doc.rect(x + 26, y + 10, 24, 14, 'F');

  // controller dots
  doc.setFillColor('#061b4f');
  doc.circle(x + 44, y + 34, 2.5, 'F');
  doc.circle(x + 50, y + 34, 2.5, 'F');

  // trend arrow
  doc.setDrawColor('#0058be');
  doc.setLineWidth(1.2);
  doc.line(x + 8, y + 46, x + 18, y + 36);
  doc.line(x + 18, y + 36, x + 18, y + 40);
  doc.line(x + 18, y + 36, x + 22, y + 36);
  doc.line(x + 18, y + 36, x + 28, y + 42);
  doc.line(x + 28, y + 42, x + 38, y + 38);
}

function heroWeb(doc: jsPDF, x: number, y: number) {
  const w = 62, h = 54;
  doc.setFillColor('#ffffff');
  doc.setDrawColor('#e5e7eb');
  doc.rect(x, y, w, h, 'FD');

  // browser window
  doc.setDrawColor('#d1d5db');
  doc.rect(x + 8, y + 8, 46, 16, 'S');
  doc.setFillColor('#f3f4f6');
  doc.rect(x + 9, y + 9, 44, 14, 'F');
  // browser dots
  doc.setFillColor('#ef4444');
  doc.circle(x + 13, y + 12, 1.5, 'F');
  doc.setFillColor('#f59e0b');
  doc.circle(x + 17, y + 12, 1.5, 'F');
  doc.setFillColor('#22c55e');
  doc.circle(x + 21, y + 12, 1.5, 'F');
  // address bar
  doc.setFillColor('#e5e7eb');
  doc.rect(x + 26, y + 10.5, 24, 3, 'F');

  // code lines
  doc.setDrawColor('#d1d5db');
  doc.setLineWidth(0.4);
  doc.line(x + 12, y + 30, x + 38, y + 30);
  doc.line(x + 12, y + 32, x + 44, y + 32);
  doc.line(x + 12, y + 34, x + 32, y + 34);

  // cursor
  doc.setDrawColor('#061b4f');
  doc.setLineWidth(0.8);
  doc.line(x + 48, y + 28, x + 52, y + 42);
  doc.line(x + 52, y + 42, x + 48, y + 46);
  doc.line(x + 48, y + 46, x + 48, y + 28);

  // growth arrow
  doc.setDrawColor('#0058be');
  doc.setLineWidth(1);
  doc.line(x + 10, y + 42, x + 22, y + 42);
  doc.line(x + 30, y + 42, x + 50, y + 38);
  doc.setFillColor('#0058be');
  doc.triangle(x + 50, y + 38, x + 46, y + 40, x + 48, y + 36, 'F');
}

function heroDesign(doc: jsPDF, x: number, y: number) {
  const w = 62, h = 54;
  doc.setFillColor('#ffffff');
  doc.setDrawColor('#e5e7eb');
  doc.rect(x, y, w, h, 'FD');

  // grid lines
  doc.setDrawColor('#e5e7eb');
  doc.setLineWidth(0.3);
  doc.line(x + 10, y + 12, x + 50, y + 12);
  doc.line(x + 10, y + 24, x + 50, y + 24);
  doc.line(x + 10, y + 36, x + 50, y + 36);
  doc.line(x + 22, y + 8, x + 22, y + 42);
  doc.line(x + 36, y + 8, x + 36, y + 42);

  // selection frame
  doc.setDrawColor('#0058be');
  doc.setLineWidth(0.6);
  doc.rect(x + 14, y + 14, 20, 18, 'S');

  // circles
  doc.setFillColor('#061b4f');
  doc.circle(x + 42, y + 18, 3, 'F');
  doc.setFillColor('#0058be');
  doc.circle(x + 46, y + 30, 2, 'F');

  // cursor arrow
  doc.setDrawColor('#061b4f');
  doc.setLineWidth(0.7);
  doc.line(x + 10, y + 44, x + 16, y + 44);
  doc.line(x + 20, y + 42, x + 34, y + 42);
  doc.setFillColor('#061b4f');
  doc.triangle(x + 34, y + 42, x + 30, y + 44, x + 32, y + 40, 'F');
}

function heroGeneric(doc: jsPDF, x: number, y: number) {
  const w = 62, h = 54;
  doc.setFillColor('#ffffff');
  doc.setDrawColor('#e5e7eb');
  doc.rect(x, y, w, h, 'FD');

  // growth arrow (large)
  doc.setDrawColor('#0058be');
  doc.setLineWidth(1.5);
  doc.line(x + 10, y + 44, x + 26, y + 28);
  doc.line(x + 26, y + 28, x + 26, y + 34);
  doc.line(x + 26, y + 28, x + 32, y + 28);
  doc.line(x + 26, y + 28, x + 40, y + 36);

  // target circles
  doc.setDrawColor('#d1d5db');
  doc.setLineWidth(0.5);
  doc.circle(x + 46, y + 16, 10, 'S');
  doc.circle(x + 46, y + 16, 6, 'S');
  doc.setFillColor('#0058be');
  doc.circle(x + 46, y + 16, 2.5, 'F');

  // document card
  doc.setFillColor('#f3f4f6');
  doc.setDrawColor('#d1d5db');
  doc.rect(x + 14, y + 12, 18, 14, 'FD');
  doc.setFillColor('#e5e7eb');
  doc.rect(x + 17, y + 15, 12, 2, 'F');
  doc.rect(x + 17, y + 19, 8, 2, 'F');

  // spark dots
  doc.setFillColor('#061b4f');
  doc.circle(x + 48, y + 38, 1.5, 'F');
  doc.circle(x + 52, y + 42, 1, 'F');
  doc.circle(x + 44, y + 44, 1, 'F');
}

function pickHero(doc: jsPDF, x: number, y: number, sid?: string | null, nic?: string | null) {
  const s = (sid ?? '').toLowerCase();
  const n = (nic ?? '').toLowerCase();
  if (s.includes('short_form') || n.includes('gaming') || n.includes('video') || n.includes('clip')) return heroGaming(doc, x, y);
  if (s.includes('wordpress') || s.includes('web') || n.includes('website') || n.includes('dev')) return heroWeb(doc, x, y);
  if (s.includes('ui') || s.includes('ux') || s.includes('design') || n.includes('design')) return heroDesign(doc, x, y);
  return heroGeneric(doc, x, y);
}

/* ── Card Drawing ── */
function cardBG(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setFillColor('#ffffff');
  doc.rect(x, y, w, h, 'F');
  doc.setDrawColor('#e5e7eb');
  doc.rect(x, y, w, h, 'S');
}

function badge(doc: jsPDF, x: number, y: number, num: string) {
  const bw = 10, bh = 10;
  doc.setFillColor('#061b4f');
  doc.rect(x, y, bw, bh, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#ffffff');
  doc.text(num, x + bw / 2, y + bh / 2 + 1.5, { align: 'center' });
}

/* ── Section Card ── */
function sectionCard(
  doc: jsPDF,
  y: number,
  num: string,
  title: string,
  body: string[][],
  opts?: { bodySz?: number; lineH?: number; after?: number; badgeX?: number },
): number {
  const bsz = opts?.bodySz ?? 9;
  const lh = opts?.lineH ?? 4.2;
  const ag = opts?.after ?? 6;
  const bx = opts?.badgeX ?? (M + 10);

  let totalLn = 0;
  for (const arr of body) totalLn += arr.length;
  const bodyH = totalLn * lh + 3;
  const cardH = 16 + bodyH + 4;

  if (ensure(doc, y, cardH + ag)) y = M + 8;

  cardBG(doc, M, y, CW, cardH);
  badge(doc, bx, y + 6, num);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor('#061b4f');
  doc.text(title, bx + 14, y + 6 + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bsz);
  doc.setTextColor('#333');
  let by = y + 18;
  for (const arr of body) {
    for (const l of arr) {
      if (by + lh > SAFE) { doc.addPage(); bg(doc); by = M + 8; }
      doc.text(l, bx + 14, by);
      by += lh;
    }
  }

  return Math.max(y + cardH, by + 2) + ag;
}

/* ── Meta Cards ── */
function metaCards(doc: jsPDF, y: number, items: { label: string; value: string }[]): number {
  const gap = 3;
  const n = items.length;
  const cw = (CW - gap * (n - 1)) / n;

  // calculate max rows across all cards for height
  let maxRows = 1;
  const allVals: string[][] = [];
  for (const it of items) {
    const vl = wrap(doc, it.value, cw - 10, 7.5);
    allVals.push(vl);
    if (vl.length > maxRows) maxRows = vl.length;
  }
  const cardH = 19 + (maxRows - 1) * 3.5;

  if (ensure(doc, y, cardH + 6)) y = M + 8;

  for (let i = 0; i < n; i++) {
    const cx = M + i * (cw + gap);
    cardBG(doc, cx, y, cw, cardH);
    // indicator dot
    doc.setFillColor(i === 3 ? '#0058be' : '#061b4f');
    doc.circle(cx + 5, y + 5, 2, 'F');
    // label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor('#6b7280');
    doc.text(items[i].label.toUpperCase(), cx + 9, y + 5.5);
    // value
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor('#111827');
    let vy = y + 9;
    for (const vl of allVals[i]) {
      if (vy + 3 > SAFE) { doc.addPage(); bg(doc); vy = M + 8; }
      doc.text(vl, cx + 8, vy);
      vy += 3.5;
    }
  }
  return y + cardH + 6;
}

/* ── Polished Title Generation ── */
export function polishedOfferTitle(bp: OfferBlueprint, sid?: string | null, nic?: string | null): string {
  const raw = bp.offerName;
  const rawSuffixes = ['One-Time Project', 'Retainer', 'Milestone Based'];
  const isAuto = rawSuffixes.some((s) => raw.includes(s));
  if (!isAuto) return raw;

  const n = (nic ?? '').toLowerCase();
  const s = (sid ?? '').toLowerCase();

  if (s.includes('wordpress') || s.includes('theme')) {
    if (n.includes('ai') || n.includes('startup')) {
      return 'AI Startup Website Launch Proposal';
    }
    return 'Custom WordPress Theme Proposal';
  }
  if (n.includes('gaming') || n.includes('shorts') || n.includes('clip') || n.includes('video') || s.includes('short')) {
    if (raw.includes('Retainer')) return 'Gaming Shorts Growth Retainer';
    if (raw.includes('Milestone')) return 'Stream-to-Shorts Growth Package';
    return 'Gaming Shorts Growth Proposal';
  }
  if (s.includes('web') || s.includes('dev') || n.includes('website') || n.includes('dev')) {
    return 'Website Launch Proposal';
  }
  if (s.includes('design') || s.includes('ui') || s.includes('ux')) {
    return 'Design Services Proposal';
  }
  return raw.replace(/One-Time Project/, 'Proposal').replace(/Milestone Based/, 'Package').replace(/Retainer/, 'Retainer Proposal').trim();
}

/* ── Continuation Header (Page 2+) ── */
function drawContinuationHeader(doc: jsPDF, bp: OfferBlueprint, sid?: string | null, nic?: string | null) {
  const title = polishedOfferTitle(bp, sid, nic);
  const y = M + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#061b4f');
  doc.text(title, M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor('#9ca3af');
  doc.text('Offer Engineering Proposal · Continued', M, y + 3.5);
  // subtle separator
  doc.setDrawColor('#e5e7eb');
  doc.setLineWidth(0.3);
  doc.line(M, y + 5.5, PW - M, y + 5.5);
}

/* ── Header / Hero Block ── */
function drawHeader(doc: jsPDF, y: number, bp: OfferBlueprint, sid?: string | null, nic?: string | null): number {
  // Brand line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor('#0058be');
  doc.text('CLIENT ACQUISITION SYSTEM', M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor('#9ca3af');
  doc.text('· AyushPaul.in', M + doc.getTextWidth('CLIENT ACQUISITION SYSTEM') + 1.5, y);
  y += 8;

  // Prepared Proposal label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#0058be');
  doc.text('Prepared Proposal', M, y);
  y += 8;

  // Main heading: CLIENT PROPOSAL
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor('#061b4f');
  doc.text('CLIENT PROPOSAL', M, y);
  y += 7;

  // Hero visual (right side, aligned with main heading)
  pickHero(doc, PW - M - 62, y - 4, sid, nic);

  // Offer title (polished via helper)
  const title = polishedOfferTitle(bp, sid, nic);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#111827');
  const tl = wrap(doc, title, CW - 72);
  for (const l of tl) { doc.text(l, M, y); y += 7; }
  y += 2;

  // Subtitle (no truncation — wraps naturally via splitTextToSize)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#6b7280');
  const sl = wrap(doc, bp.whoItIsFor, CW - 72);
  for (const l of sl) { doc.text(l, M, y); y += 4.5; }
  y += 4;

  // Accent line
  doc.setDrawColor('#0058be');
  doc.setLineWidth(0.6);
  doc.line(M, y, M + 32, y);
  y += 8;

  return y;
}

/* ── Footer ── */
function footer(doc: jsPDF, page: number) {
  const y = FOOTER_TOP;
  doc.setDrawColor('#e5e7eb');
  doc.setLineWidth(0.3);
  doc.line(M, y, PW - M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor('#9ca3af');
  doc.text('Client Acquisition System · AyushPaul.in · PDF TEMPLATE v4', M, y + 4);
  doc.text(`${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, PW - M, y + 4, { align: 'right' });
}

/* ── CTA Band (navy full-width) ── */
function ctaBand(doc: jsPDF, y: number, bp: OfferBlueprint): number {
  // calculate needed height
  const bodyW = CW - 32;
  const subLines = wrap(doc, bp.nextStepCTA, bodyW, 9);
  const bandH = 30 + subLines.length * 4.2 + 4;

  if (ensure(doc, y, bandH + 6)) y = M + 8;

  // navy band
  doc.setFillColor('#061b4f');
  doc.rect(M, y, CW, bandH, 'F');

  // "Next Step" heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor('#ffffff');
  doc.text('NEXT STEP', M + 14, y + 10);

  // CTA button text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor('#ffffff');
  doc.text("Let's Get Started", M + 14, y + 18);

  // body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#d1d5db');
  let by = y + 25;
  for (const l of subLines) {
    if (by + 4.2 > SAFE) { doc.addPage(); bg(doc); by = M + 8; }
    doc.text(l, M + 14, by);
    by += 4.2;
  }

  return y + bandH + 8;
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════ */

export async function exportBlueprintPDF(
  bp: OfferBlueprint,
  serviceId?: string | null,
  market?: string | null,
  niche?: string | null,
): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'a4');
  bg(doc);

  let y = M + 6;

  // ── Header / Hero ──
  y = drawHeader(doc, y, bp, serviceId, niche);
  // bg intentionally NOT re-applied here — it would overwrite the header content

  // ── Meta Cards ──
  const meta = [
    { label: 'Service', value: bp.productizedService || bp.offerName },
    { label: 'Market', value: market || '—' },
    { label: 'Niche', value: niche || '—' },
    { label: 'Pricing', value: bp.pricingStructure },
    { label: 'Timeline', value: bp.timeline },
  ];
  y = metaCards(doc, y, meta);
  y += 2;

  // ── 01 Client Profile ──
  y = sectionCard(doc, y, '01', 'Client Profile', [wrap(doc, bp.whoItIsFor, CW - 36)]);

  // ── 02 Problem ──
  y = sectionCard(doc, y, '02', 'Problem', [wrap(doc, bp.problemItSolves, CW - 36)]);

  // ── 03 Core Promise ──
  y = sectionCard(doc, y, '03', 'Core Promise', [wrap(doc, bp.corePromise, CW - 36)]);

  // ── 04 Deliverables ──
  if (bp.deliverables.length > 0) {
    const dBullets = bp.deliverables.map((d) => `•  ${d}`);
    const dWrapped: string[][] = [];
    for (const b of dBullets) dWrapped.push(wrap(doc, b, CW - 40));
    y = sectionCard(doc, y, '04', 'Deliverables', dWrapped);
  } else {
    y = sectionCard(doc, y, '04', 'Deliverables', [['—']]);
  }

  // ── 05 Unique Mechanism ──
  y = sectionCard(doc, y, '05', 'Unique Mechanism', [wrap(doc, bp.uniqueMechanism, CW - 36)]);

  // ── 06 Timeline & Scope ──
  const scopeRows: { label: string; value: string | number }[] = [
    { label: 'Timeline', value: bp.timeline },
    { label: 'Revisions', value: bp.scopeLimits.revisionCount },
    { label: 'Feedback Rounds', value: bp.scopeLimits.includedRounds },
    { label: 'Response Time', value: bp.scopeLimits.responseTime },
    { label: 'Communication', value: bp.scopeLimits.communicationMethod },
  ];
  // render as label: value lines
  const sLines = scopeRows.map((r) => `${r.label}:  ${String(r.value)}`);
  const sWrapped: string[][] = [];
  for (const s of sLines) sWrapped.push(wrap(doc, s, CW - 40));
  y = sectionCard(doc, y, '06', 'Timeline & Scope', sWrapped, { lineH: 4.5 });

  // ── 07 Value Amplifier ──
  y = sectionCard(doc, y, '07', 'Value Amplifier', [wrap(doc, bp.valueAmplifier, CW - 36)]);

  // ── 08 Pricing ──
  const priceLines: string[][] = [];
  priceLines.push(wrap(doc, bp.pricingStructure, CW - 36));
  if (bp.pricingModel === 'tiered') {
    const t = [
      `Starter:  $${bp.tieredPricing.starterPrice ?? '—'}`,
      `Pro:  $${bp.tieredPricing.proPrice ?? '—'}`,
      `Premium:  $${bp.tieredPricing.premiumPrice ?? '—'}`,
    ];
    for (const r of t) priceLines.push(wrap(doc, r, CW - 40));
  } else if (bp.pricingModel === 'value_based') {
    priceLines.push(wrap(doc, `Estimated Client Value:  $${bp.valueBasedPricing.estimatedClientValue ?? '—'}`, CW - 40));
    if (bp.valueBasedPricing.impactLevel) {
      priceLines.push(wrap(doc, `Impact Level:  ${bp.valueBasedPricing.impactLevel}`, CW - 40));
    }
  }
  y = sectionCard(doc, y, '08', 'Pricing', priceLines, { after: 10 });

  // ── 09 Why This Works ──
  y = sectionCard(doc, y, '09', 'Why This Works', [wrap(doc, bp.whyThisWorks, CW - 36)]);

  // ── 10 Next Step CTA ──
  ctaBand(doc, y, bp);

  // ── Footer + continuation header on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) drawContinuationHeader(doc, bp, serviceId, niche);
    footer(doc, i);
  }

  return doc.output('blob');
}
