import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Scale,
  LogOut,
  AlertTriangle,
  Search,
  ArrowRight,
  BookOpen,
  Filter,
  Layers,
  Building2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  Terminal,
  FileCheck,
  FileText,
  CheckSquare,
  Square,
  HelpCircle,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { BCyberEligibilityScreener } from '../../../components/b-cyber/BCyberEligibilityScreener';
import { BCyberHackathonMatrix } from '../../../components/b-cyber/BCyberHackathonMatrix';
import { BCyberProofOfWorkFilter } from '../../../components/b-cyber/BCyberProofOfWorkFilter';
import { admissionGuide } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

// --- Section 2: Cycle Status Board Data ---
interface CycleStatusRow {
  parameter: string;
  upcoming2027: string;
  historical2026: string;
  statusTag: 'announced' | 'precedent' | 'pending' | 'confirmed';
  statusLabel: string;
  source: string;
}

const CYCLE_STATUS_DATA: CycleStatusRow[] = [
  {
    parameter: 'Entrance Screening',
    upcoming2027: 'Separate dedicated entrance test to be conducted by IIT Kanpur. JEE Main permanently discontinued.',
    historical2026: 'Shortlisted based on JEE Main CRL score + FAQ 22 technical evidence dossier.',
    statusTag: 'announced',
    statusLabel: 'Officially Announced: Separate Test',
    source: 'WSAIS FAQ 23',
  },
  {
    parameter: 'Syllabus & Mode',
    upcoming2027: 'Official syllabus, question paper pattern, and test mode (CBT vs paper) are pending Senate notification.',
    historical2026: 'Pre-screening via JEE Main (Physics, Chemistry, Math) plus verifiable proof-of-work submission.',
    statusTag: 'pending',
    statusLabel: 'Not Yet Officially Confirmed',
    source: 'IITK Senate Pending',
  },
  {
    parameter: 'Practical Hackathon',
    upcoming2027: 'Hands-on practical evaluation round expected to be retained following the inaugural launch precedent.',
    historical2026: '6-hour in-person coding & security hackathon conducted inside New Core Lab, IIT Kanpur.',
    statusTag: 'precedent',
    statusLabel: 'Observed Precedent: Expected Retained',
    source: '2026 Launch Record',
  },
  {
    parameter: 'Prior Work Weight',
    upcoming2027: 'Easily verifiable evidence of prior work in computing or cybersecurity remains mandatory.',
    historical2026: 'Technical portfolio reviewed during shortlisting (GitHub repos, CTFs, CVEs, tools).',
    statusTag: 'confirmed',
    statusLabel: 'Officially Confirmed: Mandatory',
    source: 'WSAIS FAQ 22',
  },
  {
    parameter: 'Age Cutoff Date',
    upcoming2027: 'Exact cutoff date for 2027 cycle will be released in the formal admission circular.',
    historical2026: 'Born on or after October 1, 2001 (General/OBC); October 1, 1996 for SC/ST/PwD.',
    statusTag: 'pending',
    statusLabel: 'Not Yet Officially Confirmed',
    source: 'Pending 2027 Circular',
  },
];

// --- Section 4: Eligibility Rules Data ---
const ELIGIBILITY_RULES = [
  {
    id: 'rule-academics',
    index: '01',
    title: 'Academic Qualifications',
    summary: 'Class 12 or equivalent with Physics, Chemistry, and Mathematics (PCM).',
    details: 'Candidates must pass Class 12 or equivalent with Physics, Chemistry, and Mathematics across at least 5 distinct subjects. NIOS (National Institute of Open Schooling) candidates are fully eligible provided the 5-subject PCM criterion is met.',
    boundary: 'Candidates who only took JEE Main Paper 2 (B.Arch/B.Planning) or lack Class 12 Mathematics are strictly ineligible under Senate rules.',
    citation: 'IIT Kanpur WSAIS FAQ 21',
    statusTag: 'Senate Mandatory',
  },
  {
    id: 'rule-age',
    index: '02',
    title: 'Age Limit & Date of Birth',
    summary: '2026 Precedent: Born on or after Oct 1, 2001 (5-year relaxation for SC/ST/PwD).',
    details: 'In the inaugural 2026 cycle, candidates had to be born on or after October 1, 2001 (General/OBC/EWS). A 5-year relaxation applied to SC, ST, and PwD candidates (born on or after October 1, 1996).',
    boundary: 'The exact year and day threshold for the upcoming 2027 intake will be confirmed when the official 2027 admission circular is released.',
    citation: 'WSAIS FAQ 21 · 2026 Precedent',
    statusTag: 'Upcoming Cycle TBA',
  },
  {
    id: 'rule-nationality',
    index: '03',
    title: 'Nationality & Statutory Quotas',
    summary: 'Open exclusively to Indian Nationals. Standard GoI reservation categories apply.',
    details: 'The program is open only to Indian citizens. Standard Government of India statutory reservation quotas apply under Senate directives: Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (OBC-NCL), Economically Weaker Sections (EWS), and Persons with Disabilities (PwD).',
    boundary: 'OCI, PIO, and foreign national candidates were not eligible in the inaugural cycle.',
    citation: 'IIT Kanpur Senate Ordinances',
    statusTag: 'Statutory Policy',
  },
  {
    id: 'rule-restrictions',
    index: '04',
    title: 'Attempts & Prior IIT Admission',
    summary: 'Maximum 2 consecutive attempts. Candidates admitted to an IIT in 2025 are ineligible.',
    details: 'A candidate can attempt the selection process a maximum of two times in consecutive years. Furthermore, candidates who accepted admission in any IIT program under JoSAA 2025 rules are barred from applying, even if they later withdrew or dropped out.',
    boundary: 'Candidates whose admission was cancelled before reporting or who completed an IIT preparatory course for the first time in 2025 remain eligible.',
    citation: 'WSAIS FAQ 21 §3',
    statusTag: 'Strict JoSAA Boundary',
  },
];

// --- Section 8: Readiness Checklist Items ---
const READINESS_CHECKLIST_ITEMS = [
  {
    title: 'Class 12 PCM Marksheet / Passing Certificate',
    desc: 'Original or DigiLocker certified marksheet demonstrating Physics, Chemistry, and Mathematics passed across at least 5 subjects.',
  },
  {
    title: 'Central Government Category Certificate (If Applicable)',
    desc: 'OBC-NCL, EWS, SC, ST, or PwD certificate issued in the prescribed Central Government format within the valid financial year.',
  },
  {
    title: 'Verifiable Proof-of-Work Dossier (FAQ 22)',
    desc: 'Public GitHub repositories, writeups, CVE advisories, or technical demonstration code with clear reproducibility instructions.',
  },
  {
    title: 'Valid Government Photo Identity Card',
    desc: 'Aadhaar, Passport, or Voter ID for identity verification during in-person reporting at IIT Kanpur’s New Core Lab.',
  },
];

// --- Section 9: Admission FAQs ---
const ADMISSION_FAQS = [
  {
    q: 'Is NIOS (Open Schooling) accepted for admission into IIT Kanpur B.Cyber?',
    a: 'Yes. Candidates who have completed Class 12 through NIOS (National Institute of Open Schooling) are fully eligible to apply, provided they have passed Physics, Chemistry, and Mathematics across at least 5 subjects (WSAIS FAQ 21).',
  },
  {
    q: 'Will JEE Main scores be accepted for the upcoming 2027 admission intake?',
    a: 'No. IIT Kanpur WSAIS FAQ 23 explicitly confirms: "For future batches, a separate entrance test will be conducted, and JEE Mains will not be used for admission." Applicants must prepare for IIT Kanpur\'s dedicated entrance test rather than relying on JEE Main ranks.',
  },
  {
    q: 'What is the age limit for the upcoming admission cycle?',
    a: 'In the inaugural 2026 cycle, candidates had to be born on or after October 1, 2001 (General/OBC), or October 1, 1996 (SC/ST/PwD). The exact date threshold for the 2027 intake will be confirmed upon publication of the 2027 admission bulletin.',
  },
  {
    q: 'If I joined an IIT in 2025 and dropped out, can I apply for B.Cyber?',
    a: 'No. Under Senate ordinances and WSAIS FAQ 21, any candidate who accepted admission into any IIT under JoSAA 2025 rules is ineligible to apply, regardless of whether they subsequently dropped out or vacated the seat.',
  },
  {
    q: 'Can I transfer or switch branches from B.Cyber into regular B.Tech CSE after Year 1?',
    a: 'Strictly no. Branch change into or out of the B.Cyber program is completely prohibited under official IIT Kanpur Senate regulations (WSAIS FAQ 12). Students admitted to B.Cyber must complete the degree in cybersecurity.',
  },
  {
    q: 'Is the application fee refundable if I am unable to attend the hackathon?',
    a: 'No. As per official WSAIS FAQ 25, the application fee (₹1,600 for Female/SC/ST/PwD candidates; ₹3,200 for all others in 2026) is strictly non-refundable and non-transferable under all circumstances.',
  },
];

export function BCyberAdmissionGuidePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/admission');

  // State for Section 2 Cycle Status Switcher
  const [cycleFilter, setCycleFilter] = useState<'all' | '2027' | '2026'>('all');

  // State for Section 8 Readiness Checklist
  const [readinessChecks, setReadinessChecks] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  // State for Section 9 FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // State for Section 10 Verified Policy Database Search & Filters
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedClaimIds, setExpandedClaimIds] = useState<Record<string, boolean>>({});

  const toggleReadiness = (index: number) => {
    setReadinessChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const readinessCount = Object.values(readinessChecks).filter(Boolean).length;

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaimIds((prev) => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  const sections = admissionGuide.sections;

  // Filter sections and claims for the policy database
  const filteredSections = sections
    .map((sec) => {
      let matchingClaims = sec.claims;

      if (selectedTrustFilter !== 'all') {
        matchingClaims = matchingClaims.filter((c) => c.trustLevel === selectedTrustFilter);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchingClaims = matchingClaims.filter(
          (c) =>
            c.claim.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.qualificationsOrLimitations?.toLowerCase().includes(q) ||
            c.historicalContext?.toLowerCase().includes(q)
        );
      }

      return {
        ...sec,
        claims: matchingClaims,
      };
    })
    .filter((sec) => {
      if (selectedSectionId !== 'all' && sec.id !== selectedSectionId) {
        return false;
      }
      return sec.claims.length > 0;
    });

  const totalFilteredClaims = filteredSections.reduce((sum, s) => sum + s.claims.length, 0);

  // JSON-LD Structured Data Schema for SEO
  const admissionSchema = {
    '@graph': [
      {
        '@type': 'EducationalOccupationalProgram',
        '@id': `${canonical}#admission-program`,
        name: 'IIT Kanpur B.Cyber Admission Process',
        programType: 'Undergraduate Admission Selection',
        provider: {
          '@type': 'CollegeOrUniversity',
          name: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
          url: 'https://www.iitk.ac.in',
          department: {
            '@type': 'Organization',
            name: 'Wadhwani School of AI and Intelligent Systems (WSAIS)',
            url: 'https://iitk.ac.in/wsais/b-cyber.php',
          },
        },
        educationalCredentialAwarded: 'Bachelor of Cybersecurity (B.Cyber.)',
        description:
          'Comprehensive guide to IIT Kanpur B.Cyber admission: Class 12 PCM eligibility, 2026 JEE Main precedent, 2027 confirmed dedicated entrance test shift (FAQ 23), 6-hour hackathon, and FAQ 22 proof-of-work criteria.',
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: ADMISSION_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  useSEO({
    title: 'IIT Kanpur B.Cyber Admission: Eligibility, 2026 Precedent & 2027 Shift',
    description:
      'Verified guide to IIT Kanpur B.Cyber admission: eligibility baseline, JEE Main discontinuation (FAQ 23), dedicated 2027 entrance test, 6-hour hackathon format, and FAQ 22 portfolio evidence.',
    keywords:
      'IIT Kanpur B.Cyber admission, B.Cyber eligibility criteria, WSAIS FAQ 23, separate entrance test, JEE Main discontinued B.Cyber, B.Cyber hackathon format, proof of work FAQ 22',
    url: canonical,
    schema: admissionSchema,
  });

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0b1c30]">
      {/* Global Spacing for Fixed Main Navigation */}
      <div className="pt-20 sm:pt-24" />

      {/* Contextual Sub-Navigation Layer */}
      <BCyberNav />

      {/* Main Content Area — Harmonized 6xl Container Matching Pillar 1 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24">

        {/* =========================================================================
            SECTION 0: HERO — ADMISSION & ELIGIBILITY (Scope & Fast-Track Actions)
        ========================================================================= */}
        <section
          id="admission-start"
          aria-labelledby="hero-heading"
          className="space-y-6 pt-4 text-center flex flex-col items-center"
        >
          {/* Trust Stamp Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Independent Guide · Based on Official IIT Kanpur Senate &amp; WSAIS Records</span>
          </div>

          {/* H1 Heading - Crisp 2-Line Architecture */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold text-[#0b1c30] tracking-tight max-w-4xl leading-[1.12]"
          >
            How Admission to IIT Kanpur B.Cyber Works:
            <span className="text-brand-primary text-xl sm:text-3xl lg:text-[32px] block mt-2 font-bold tracking-tight">
              Eligibility, 2026 Precedent &amp; The 2027 Shift
            </span>
          </h1>

          {/* Subtitle - High Signal & Grounded */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
            An evidence-grounded decision guide to statutory eligibility, selection stages, practical hackathon evaluations, and cycle-specific requirements under official Senate ordinances.
          </p>

          {/* Executive Key Metrics Strip Matching Pillar 1 Aesthetic */}
          <div className="w-full max-w-4xl pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {/* Metric 1: Academics */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  ACADEMICS
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  12th PCM Required
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  5 Subjects · NIOS Accepted
                </span>
              </div>

              {/* Metric 2: Paradigm Shift */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  SELECTION SHIFT
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  Separate Test 2027
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  JEE Main Discontinued (FAQ 23)
                </span>
              </div>

              {/* Metric 3: Practical Lab */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  PRACTICAL LAB
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  6-Hour Hackathon
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  New Core Lab, IIT Kanpur
                </span>
              </div>

              {/* Metric 4: Proof of Work */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  EVIDENCE
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  FAQ 22 Portfolio
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Verifiable Code &amp; Repos
                </span>
              </div>
            </div>

            {/* In-Page Fast-Track Navigation Jump Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#eligibility-check"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1c30] text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs group"
              >
                <span>Check My Admission Readiness ↓</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#d1f34d]" />
              </a>

              <a
                href="#selection-process"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
              >
                <span>Understand Selection Process →</span>
              </a>

              <a
                href="#practical-assessment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
              >
                <Terminal className="w-3.5 h-3.5 text-brand-primary" />
                <span>6-Hour Hackathon Format</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: ADMISSION IN 30 SECONDS (Executive Direct Answer Card)
        ========================================================================= */}
        <section id="admission-summary" aria-labelledby="section-30sec-heading" className="scroll-mt-28">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                  Direct Answer First
                </span>
                <span className="text-xs text-slate-400">• Official Institutional Summary</span>
              </div>

              <h2 id="section-30sec-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                How Does Admission to B.Cyber Work?
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Admission to IIT Kanpur B.Cyber requires <strong>Class 12 PCM qualification (minimum 5 subjects)</strong>, <strong>Indian nationality</strong>, and passing a multi-stage selection procedure. While the inaugural 2026 batch was shortlisted using JEE Main scores and prior technical evidence for an in-person 6-hour hackathon, <strong>official WSAIS FAQ 23 confirms that JEE Main is permanently discontinued</strong> for future intakes. A separate dedicated entrance test will be conducted by IIT Kanpur.
              </p>

              {/* 3 High-Speed Sequence Specs Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    01
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Stage 1: Eligibility
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      Class 12 PCM (5 Subjects)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Indian National · NIOS accepted
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    02
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Stage 2: Entrance Screening
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      Dedicated Test (2027 Shift)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      JEE Main Discontinued (FAQ 23)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    03
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Stage 3: Practical Assessment
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      6-Hour In-Person Hackathon
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      New Core Lab, IIT Kanpur
                    </span>
                  </div>
                </div>
              </div>

              {/* Source Verification Link */}
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>Official source:</span>
                <a
                  href="https://iitk.ac.in/wsais/b-cyber.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>IIT Kanpur WSAIS Admission Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ADMISSION CYCLE STATUS BOARD (2026 vs 2027 Comparison)
        ========================================================================= */}
        <section id="cycle-status" aria-labelledby="status-heading" className="scroll-mt-28 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Cycle Intelligence
              </span>
              <h2 id="status-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admission Cycle Status Board
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Confirmed official announcements compared with observed 2026 historical precedents.
              </p>
            </div>

            {/* Cycle Filter Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCycleFilter('all')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  cycleFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                All Rules
              </button>
              <button
                type="button"
                onClick={() => setCycleFilter('2027')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  cycleFilter === '2027'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                2027 Upcoming
              </button>
              <button
                type="button"
                onClick={() => setCycleFilter('2026')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  cycleFilter === '2026'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                2026 Precedent
              </button>
            </div>
          </div>

          {/* Desktop Table (hidden md:block) */}
          <div className="hidden md:block rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Parameter</th>
                  <th className="py-4 px-5">Upcoming 2027 Cycle (Confirmed Shift)</th>
                  <th className="py-4 px-5">2026 Precedent (Historical)</th>
                  <th className="py-4 px-5">Status &amp; Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {CYCLE_STATUS_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                      {row.parameter}
                    </td>
                    <td className="py-4 px-5 leading-relaxed">
                      {row.upcoming2027}
                    </td>
                    <td className="py-4 px-5 text-slate-600 leading-relaxed">
                      {row.historical2026}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap space-y-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold block w-fit',
                          row.statusTag === 'confirmed' || row.statusTag === 'announced'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : row.statusTag === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-brand-primary border border-blue-200'
                        )}
                      >
                        {row.statusLabel}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        {row.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Dimension Stack (block md:hidden) — Eliminates horizontal scrolling */}
          <div className="block md:hidden space-y-3">
            {CYCLE_STATUS_DATA.map((row, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">{row.parameter}</span>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold',
                      row.statusTag === 'confirmed' || row.statusTag === 'announced'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : row.statusTag === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-brand-primary border border-blue-200'
                    )}
                  >
                    {row.statusTag === 'announced' ? 'Announced' : row.statusTag === 'pending' ? 'Pending' : row.statusTag === 'confirmed' ? 'Confirmed' : 'Precedent'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                      2027 Shift:
                    </span>
                    <p className="text-slate-800 mt-0.5">{row.upcoming2027}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      2026 Precedent:
                    </span>
                    <p className="text-slate-600 mt-0.5">{row.historical2026}</p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  Source: {row.source}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: INTERACTIVE CYCLE-AWARE ELIGIBILITY SCREENER
        ========================================================================= */}
        <section id="eligibility-check" aria-labelledby="screener-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Interactive Self-Assessment
            </span>
            <h2 id="screener-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Statutory Eligibility Screener
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Test your profile against published Senate ordinances. Zero registration, zero fake probability scores.
            </p>
          </div>

          <BCyberEligibilityScreener />
        </section>

        {/* =========================================================================
            SECTION 4: ELIGIBILITY RULES EXPLAINED (Permanent 4-Card Matrix)
        ========================================================================= */}
        <section id="eligibility-rules" aria-labelledby="rules-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Senate Ordinances
            </span>
            <h2 id="rules-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eligibility Rules Explained
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Legal prerequisites, age limits, reservation quotas, and candidate restrictions under IIT Kanpur Senate regulations.
            </p>
          </div>

          {/* Balanced 2x2 Grid of All 4 Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ELIGIBILITY_RULES.map((rule) => (
              <div
                key={rule.id}
                id={rule.id}
                className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200 cursor-default flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Card Top Row with Index & Status */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-primary border border-blue-200/70 flex items-center justify-center font-bold text-xs">
                        {rule.index}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {rule.title}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      {rule.statusTag}
                    </span>
                  </div>

                  {/* Summary & Details */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                      {rule.summary}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {rule.details}
                    </p>
                  </div>

                  {/* Boundary Box */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-slate-900">Institutional Boundary: </strong>
                      {rule.boundary}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Source */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">{rule.citation}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: SELECTION PROCESS — DUAL-LANE COMPARISON
        ========================================================================= */}
        <section id="selection-process" aria-labelledby="process-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Selection Architecture
            </span>
            <h2 id="process-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selection Process: 2026 Precedent vs. The 2027 Shift
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Understanding the dual-lane workflow and the confirmed transition away from JEE Main.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* LANE A: 2026 INAUGURAL CYCLE */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lane A · 2026 Historical Precedent
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                  Completed Cycle
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</span>
                  <h4 className="text-xs font-bold text-slate-900">JEE Main Score + Evidence Submission</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Online portal application with JEE Main CRL score card, academic marksheets, and FAQ 22 technical dossier.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 2</span>
                  <h4 className="text-xs font-bold text-slate-900">Merit Shortlisting (Cutoff Screening)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Institutional committee reviewed JEE score alongside verifiable proof-of-work to invite shortlisted applicants.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 3</span>
                  <h4 className="text-xs font-bold text-slate-900">6-Hour In-Person Practical Hackathon</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Shortlisted candidates reported to IIT Kanpur’s New Core Lab on July 5, 2026 for continuous hands-on evaluation.
                  </p>
                </div>
              </div>
            </div>

            {/* LANE B: 2027 UPCOMING CYCLE */}
            <div className="rounded-3xl border border-brand-primary/30 bg-blue-50/30 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Lane B · 2027 Confirmed Shift
                </span>
                <span className="text-[11px] font-mono font-bold text-brand-primary px-2 py-0.5 bg-blue-100 rounded-full">
                  WSAIS FAQ 23 Confirmed
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Step 1</span>
                  <h4 className="text-xs font-bold text-slate-900">Online Application Registration</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct registration on IIT Kanpur WSAIS portal. Application dates and window pending official circular.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Step 2</span>
                  <h4 className="text-xs font-bold text-slate-900">Dedicated Entrance Test (JEE Discontinued)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    IIT Kanpur will administer its own independent entrance examination. Detailed syllabus is pending Senate notification.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Step 3</span>
                  <h4 className="text-xs font-bold text-slate-900">Practical Evaluation / Assessment</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Expected hands-on security challenge at IIT Kanpur. Exact duration and modality to be confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Epistemic Safeguard Callout */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Consumer Caution — Fake Syllabus Scams: </strong>
              IIT Kanpur has not released an official syllabus book or coaching module for the 2027 entrance test. Avoid commercial coaching institutes claiming to sell the &ldquo;official 2027 B.Cyber entrance syllabus.&rdquo; Rely only on notices published at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">iitk.ac.in/wsais</code>.
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: PRACTICAL ASSESSMENT & 6-HOUR HACKATHON
        ========================================================================= */}
        <section id="practical-assessment" aria-labelledby="hackathon-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Laboratory Challenge
            </span>
            <h2 id="hackathon-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The 6-Hour In-Person Hackathon &amp; 8 Technical Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Practical testing environment, New Core Lab setup, and hands-on domains evaluated by C3iHub and IIT Kanpur faculty.
            </p>
          </div>

          <BCyberHackathonMatrix />
        </section>

        {/* =========================================================================
            SECTION 7: PRIOR WORK & EVIDENCE STANDARDS (FAQ 22)
        ========================================================================= */}
        <section id="prior-work" aria-labelledby="evidence-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Proof-of-Work Standards
            </span>
            <h2 id="evidence-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Evidence of Prior Work (WSAIS FAQ 22)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How to demonstrate verifiable engineering capability versus disqualifying superficial anti-patterns.
            </p>
          </div>

          <BCyberProofOfWorkFilter />
        </section>

        {/* =========================================================================
            SECTION 8: APPLICATION LOGISTICS & READINESS CHECKLIST
        ========================================================================= */}
        <section id="application-readiness" aria-labelledby="readiness-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pre-Application Triage
            </span>
            <h2 id="readiness-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Logistics &amp; Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Fees, statutory verification rules, and an in-browser checklist to confirm document readiness.
            </p>
          </div>

          {/* Dual Column: Logistics Summary Card + Interactive Browser Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Column 1: Logistics Specs */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Application Parameters (2026 Reference)</span>
                <span className="text-[11px] font-mono font-bold text-slate-400">WSAIS FAQ 25</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50/80 flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-800">Application Fee:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">₹1,600 (Female / SC / ST / PwD)</span>
                    <span className="text-slate-500 block">₹3,200 (All Other Candidates)</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50/80 flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-800">Refund Policy:</span>
                  <span className="font-bold text-rose-700 text-right">Strictly Non-Refundable (FAQ 25)</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50/80 flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-800">Attempt Limit:</span>
                  <span className="font-bold text-slate-900 text-right">Max 2 Consecutive Years</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50/80 flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-800">Reporting Venue:</span>
                  <span className="font-bold text-slate-900 text-right">New Core Lab, IIT Kanpur</span>
                </div>
              </div>
            </div>

            {/* Column 2: Interactive Browser Checklist with Progress Counter */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Document Readiness Checklist</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Stored locally in your browser</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-brand-primary block">{readinessCount}/4 Ready</span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        readinessCount === 4 ? 'bg-emerald-500 w-full' : readinessCount >= 2 ? 'bg-amber-500 w-1/2' : 'bg-brand-primary w-1/4'
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {READINESS_CHECKLIST_ITEMS.map((item, idx) => {
                  const isChecked = !!readinessChecks[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => toggleReadiness(idx)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleReadiness(idx);
                        }
                      }}
                      className={cn(
                        'w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                        isChecked
                          ? 'border-brand-primary/40 bg-brand-primary/5 shadow-2xs'
                          : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-brand-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        )}
                      </span>
                      <div className="flex-1">
                        <span className={cn('text-xs font-bold block', isChecked ? 'text-slate-900' : 'text-slate-800')}>
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: ADMISSION FAQ CENTRE (Accessible Accordion)
        ========================================================================= */}
        <section id="admission-faqs" aria-labelledby="faq-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Direct Answers
            </span>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Admission Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear, unambiguous answers addressing common candidate doubts and edge cases.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-xs divide-y divide-slate-100">
            {ADMISSION_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    'py-3.5 px-3 rounded-xl transition-all duration-200',
                    isOpen ? 'bg-slate-50/80 shadow-2xs' : 'hover:bg-slate-50/40'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`admission-faq-answer-${idx}`}
                    className="w-full flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={cn(
                        'p-1 rounded-md transition-transform duration-200 shrink-0',
                        isOpen ? 'rotate-180 text-brand-primary' : 'text-slate-400'
                      )}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      id={`admission-faq-answer-${idx}`}
                      className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 border-t border-slate-200/60 pt-2"
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: VERIFIED SOURCES & POLICY DATABASE
        ========================================================================= */}
        <section id="official-sources" aria-labelledby="sources-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Policy Traceability
            </span>
            <h2 id="sources-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Sources &amp; Senate Regulation Database
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Every documented rule is mapped to primary institute circulars and WSAIS FAQ provisions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-4">
            {/* Primary Source Quick Links */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Primary Official Repositories:</span>
              <a
                href="https://iitk.ac.in/wsais/b-cyber.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>IIT Kanpur WSAIS Portal</span>
                <ExternalLink size={12} />
              </a>
              <span>•</span>
              <a
                href="https://iitk.ac.in/wsais/data/BCyber_IITM.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>IIT Madras Joint Circular</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search policies (e.g. exit options, NIOS, credits, JoSAA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Section:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSectionId('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedSectionId === 'all'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  )}
                >
                  All ({sections.reduce((acc, s) => acc + s.claims.length, 0)})
                </button>
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
                      selectedSectionId === sec.id
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {sec.title.split(' ')[0]} ({sec.claims.length})
                  </button>
                ))}

                <select
                  value={selectedTrustFilter}
                  onChange={(e) => setSelectedTrustFilter(e.target.value)}
                  className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden focus:border-slate-900 cursor-pointer ml-auto sm:ml-0"
                >
                  <option value="all">All Trust Levels</option>
                  <option value="official_fact">Official Fact</option>
                  <option value="observed_precedent_2026">2026 Precedent</option>
                  <option value="pending_official_notice">Pending Notice</option>
                </select>
              </div>
            </div>

            {/* Claims Stream */}
            <div className="space-y-4">
              {filteredSections.map((sec) => (
                <div
                  key={sec.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-slate-900">
                        {sec.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{sec.summary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                        Cycle: {sec.applicableYear}
                      </span>
                      <TrustBadge trustLevel={sec.trustLevel} size="sm" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sec.claims.map((claim) => {
                      const isExpanded = !!expandedClaimIds[claim.id];

                      return (
                        <article
                          key={claim.id}
                          className="rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 space-y-3 shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {claim.id.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs text-slate-400 font-medium">
                                  Scope: {claim.applicableYear}
                                </span>
                              </div>
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                                {claim.claim}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                              <TrustBadge trustLevel={claim.trustLevel} size="sm" />
                              <button
                                type="button"
                                onClick={() => toggleClaimExpansion(claim.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                <span>{isExpanded ? 'Hide citations' : 'View citations'}</span>
                                {isExpanded ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          {/* Progressive Disclosure: Citations & Context */}
                          {isExpanded && (
                            <div className="pt-3 border-t border-slate-100 space-y-3">
                              {claim.qualificationsOrLimitations && (
                                <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 p-2.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-semibold">Institutional Boundary: </strong>
                                    {claim.qualificationsOrLimitations}
                                  </div>
                                </div>
                              )}

                              {claim.historicalContext && (
                                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                                  <strong className="text-slate-900">Historical Precedent Note: </strong>
                                  {claim.historicalContext}
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Official Verification Citations ({claim.sources.length})
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {claim.sources.map((src, sIdx) => (
                                    <SourceCitationCard key={sIdx} citation={src} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}

              {totalFilteredClaims === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500 font-medium">
                  No policies matched your search criteria. Try a different query or reset filters.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>Last verified against primary records: <strong>14 October 2026</strong></span>
              <span>Published by: <strong>B.Cyber Compass Independent Research</strong></span>
            </div>

            <DisclaimerBanner variant="compact" />
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: FINAL NEXT STEP DECISION GATEWAY (Pillar 3 / Pillar 1)
        ========================================================================= */}
        <section
          id="next-step"
          aria-labelledby="next-step-heading"
          className="scroll-mt-28 rounded-2xl border border-slate-900 bg-slate-900 text-white p-8 sm:p-10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d1f34d] block">
                Next Decision
              </span>
              <h2 id="next-step-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Now That You Understand Admission Rules, What&apos;s Next?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Move directly to the preparation roadmap to build verifiable proof of work and master the 8 hackathon security domains, or review the comprehensive degree overview.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/blueprints/b-cyber/roadmap#prep-start"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d1f34d] text-slate-950 text-xs font-bold hover:bg-[#c0e045] transition-all shadow-sm group"
              >
                <span>Explore Preparation Roadmap</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/blueprints/b-cyber#overview-start"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all text-center border border-white/15"
              >
                <span>Revisit Degree Overview</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
