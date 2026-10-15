import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  MapPin,
  CalendarCheck,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Terminal,
  BookOpen,
  FileCheck,
  HelpCircle,
  AlertTriangle,
  Layers,
  Award,
  Info,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Scale,
  Sparkles,
  Cpu,
  Network,
  KeyRound,
  ShieldAlert,
  Users2,
  Shuffle,
  Globe,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

// --- Curriculum Semester Data (Official Senate Published) ---
interface SemesterSubject {
  name: string;
  credits: number;
  isLab?: boolean;
  type: string;
}

interface SemesterData {
  semNumber: number;
  totalCredits: number;
  title: string;
  focus: string;
  subjects: SemesterSubject[];
}

const CURRICULUM_SEMESTERS: SemesterData[] = [
  {
    semNumber: 1,
    totalCredits: 51,
    title: 'Semester 1: Computing & Security Foundations',
    focus: 'Core programming logic, low-level hardware, and first static/dynamic malware inspection lab.',
    subjects: [
      { name: 'Fundamentals of Computing', credits: 14, type: 'Core Theory' },
      { name: 'Introduction to Electronics', credits: 14, type: 'Core Theory' },
      { name: 'Fundamentals of Data Engineering (Data)', credits: 12, type: 'Core Theory' },
      { name: 'Malware Analysis Lab', credits: 8, isLab: true, type: 'Security Lab' },
      { name: 'Practical Ethics', credits: 3, type: 'Humanities' },
    ],
  },
  {
    semNumber: 2,
    totalCredits: 52,
    title: 'Semester 2: Cryptography & Forensic Artifacts',
    focus: 'Mathematical ciphers, data structures, and hands-on digital memory and disk forensics.',
    subjects: [
      { name: 'Data Structures and Algorithms (DSA)', credits: 12, type: 'Core Theory' },
      { name: 'Computer Organization', credits: 12, type: 'Core Theory' },
      { name: 'Applied Cryptography', credits: 9, type: 'Security Core' },
      { name: 'Digital Forensics Lab', credits: 8, isLab: true, type: 'Security Lab' },
      { name: 'Course from Predefined Elective List', credits: 11, type: 'Elective' },
    ],
  },
  {
    semNumber: 3,
    totalCredits: 50,
    title: 'Semester 3: Operating Systems & Offensive/Defensive Labs',
    focus: 'Kernel concepts, operations engineering, cloud security, and ethical vulnerability testing.',
    subjects: [
      { name: 'Operating Systems', credits: 13, type: 'Core Systems' },
      { name: 'Fundamentals of Data Engineering (Ops)', credits: 12, type: 'Core Theory' },
      { name: 'Cloud Computing and Security Lab', credits: 8, isLab: true, type: 'Security Lab' },
      { name: 'Vulnerability Assessment & Penetration Testing (VAPT) Lab', credits: 8, isLab: true, type: 'Security Lab' },
      { name: 'Departmental Elective', credits: 9, type: 'Elective' },
    ],
  },
  {
    semNumber: 4,
    totalCredits: 48,
    title: 'Semester 4: Networks, Psychology & Web Security',
    focus: 'Protocol mechanics, social engineering cognition, and live web application vulnerabilities.',
    subjects: [
      { name: 'Introduction to Psychology (Human Factors)', credits: 11, type: 'Cognitive Science' },
      { name: 'Computer Networks', credits: 9, type: 'Core Systems' },
      { name: 'Network and Web Application Security Lab', credits: 8, isLab: true, type: 'Security Lab' },
      { name: 'Predefined Elective Course A', credits: 9, type: 'Elective' },
      { name: 'Predefined Elective Course B', credits: 9, type: 'Elective' },
    ],
  },
];

// --- 5 Focus Areas ---
interface FocusArea {
  title: string;
  desc: string;
  courses: string[];
  icon: React.ElementType;
}

const FOCUS_AREAS: FocusArea[] = [
  {
    title: 'Foundations & Low-Level Computing',
    desc: 'Understanding machine architecture, memory layout, pointers, and how hardware interacts with software logic.',
    courses: ['Computing Fundamentals', 'Electronics', 'Computer Organization'],
    icon: Cpu,
  },
  {
    title: 'Systems & Network Engineering',
    desc: 'Operating system kernels, system calls, process monitoring, TCP/IP handshakes, packet capture, and network routing.',
    courses: ['Operating Systems', 'Computer Networks', 'Data Ops'],
    icon: Network,
  },
  {
    title: 'Applied Cryptography',
    desc: 'Mathematical foundations of ciphers, public-key infrastructure, AES/RSA implementation logic, entropy, and hashing.',
    courses: ['Applied Cryptography', 'Mathematical Security'],
    icon: KeyRound,
  },
  {
    title: 'Offensive & Defensive Security Labs',
    desc: 'Static/dynamic malware inspection, memory artifact forensics, cloud configuration audits, and penetration testing.',
    courses: ['Malware Lab', 'Digital Forensics Lab', 'VAPT Lab', 'Cloud Security Lab'],
    icon: ShieldAlert,
  },
  {
    title: 'Human Cognition & Application Security',
    desc: 'Psychology of social engineering, insider threat vectors, along with Web/API vulnerabilities (SQLi, XSS, SSRF).',
    courses: ['Introduction to Psychology', 'Web & Network Security Lab'],
    icon: Users2,
  },
];

// --- Degree Comparison Rows ---
const COMPARISON_ROWS = [
  {
    parameter: 'Primary Orientation',
    bcyber: 'Cybersecurity-focused 4-year undergraduate degree',
    conventional: 'Generalist computing engineering curriculum',
  },
  {
    parameter: 'Academic Structure',
    bcyber: '2 Years On-Campus Coursework + 2 Years Practical Internship',
    conventional: '4 Years primarily on-campus coursework with standard 8-week summer intern',
  },
  {
    parameter: 'Technical Labs',
    bcyber: 'Specialized security labs every semester (Malware, Forensics, VAPT, Cloud)',
    conventional: 'General computing labs (DSA, DBMS, OS, Compilers)',
  },
  {
    parameter: 'Field Exposure',
    bcyber: 'Full-time field deployment in selected government organizations & cyber defense units',
    conventional: 'Corporate summer internship (typically 2 months between 3rd & 4th year)',
  },
  {
    parameter: 'Degree & Alumni Award',
    bcyber: 'Bachelor of Cybersecurity (B.Cyber.) from IIT Kanpur/Madras with full alumni status',
    conventional: 'Bachelor of Technology (B.Tech) in CSE with full alumni status',
  },
  {
    parameter: 'Branch Change Options',
    bcyber: 'Strictly prohibited (no transfer to regular B.Tech allowed under Senate rules)',
    conventional: 'Branch change allowed within B.Tech disciplines based on 1st-year CGPA',
  },
  {
    parameter: 'Higher Studies Parity',
    bcyber: '100% equivalent to regular 4-year degree for global MS/Ph.D. admissions (FAQ 9)',
    conventional: 'Fully recognized 4-year undergraduate engineering degree',
  },
  {
    parameter: 'Historical Salary / Placement Data',
    bcyber: 'No historical graduate statistics exist yet (inaugural batch launched July 2026)',
    conventional: 'Decades of historical placement and median salary track records',
  },
];

// --- 5 Misconceptions ---
const MISCONCEPTIONS = [
  {
    category: 'curriculum',
    topic: 'Curriculum & Engineering Focus',
    ref: 'Senate Curriculum Guide',
    myth: 'Cybersecurity is just ethical hacking and running Kali Linux tools.',
    fact: 'The official Senate curriculum is grounded in deep computer science: computing fundamentals, electronics, operating systems, data engineering, and cryptography. Script-kiddie tools without fundamentals are not the focus.',
  },
  {
    category: 'internship',
    topic: 'Practicum Deployment & Employment',
    ref: 'WSAIS FAQ 14 & Senate Ord. §4',
    myth: 'The two-year internship structure means a guaranteed permanent job.',
    fact: 'The internship component is an academic degree requirement hosted primarily in selected government agencies. Permanent post-degree employment depends on organizational policies and individual selection.',
  },
  {
    category: 'placement',
    topic: 'Placement Assistance vs Guarantees',
    ref: 'Institutional Placement Policy',
    myth: 'Placement support is identical to a guaranteed salary package.',
    fact: 'Official documentation states placement assistance is provided to successful completers via a dedicated cybersecurity channel. However, no specific starting salary or outcome can be guaranteed.',
  },
  {
    category: 'admission',
    topic: 'Admission Gateway & 2027 Testing Shift',
    ref: 'WSAIS FAQ 23',
    myth: 'The 2026 JEE Main admission conditions will automatically apply to 2027.',
    fact: 'WSAIS FAQ 23 confirmed that JEE Main is discontinued for future intakes; a separate dedicated entrance test will be conducted. Each admission cycle requires independent verification.',
  },
  {
    category: 'degree',
    topic: 'Degree Identity & Branch Boundaries',
    ref: 'Senate Ordinance §12',
    myth: 'B.Cyber is interchangeable with a standard B.Tech Computer Science degree.',
    fact: 'B.Cyber has a dedicated Senate ordinance, distinct 2+2 model, zero branch-transfer privileges into regular B.Tech, and specialized security curricula tailored for national cyber defense.',
  },
];

// --- 8 Organic FAQs ---
const FAQS = [
  {
    q: 'What is IIT Kanpur B.Cyber?',
    a: 'B.Cyber stands for Bachelor of Cybersecurity. It is a premier four-year undergraduate program launched by IIT Kanpur through the Wadhwani School of AI and Intelligent Systems (WSAIS) in partnership with C3iHub, and offered jointly with IIT Madras.',
  },
  {
    q: 'Is IIT Kanpur B.Cyber a four-year degree?',
    a: 'Yes. B.Cyber is a full-time four-year undergraduate degree program approved by the IIT Kanpur Senate. The maximum permissible duration to complete all requirements under Senate rules is six years.',
  },
  {
    q: 'What is the B.Cyber 2+2 model?',
    a: 'The program comprises two years of intensive on-campus coursework and specialized security labs at IIT Kanpur (Semesters 1 to 4), followed by two years of full-time practical field deployment/internship (Semesters 5 to 8) primarily in selected government organizations and critical national infrastructure.',
  },
  {
    q: 'What degree and alumni status do students receive?',
    a: 'Students who successfully complete all academic and internship requirements receive the official Bachelor of Cybersecurity (B.Cyber.) degree from IIT Kanpur (or IIT Madras, depending on enrollment) and full regular IIT alumni status with identical institutional standing.',
  },
  {
    q: 'What subjects are taught during the campus coursework?',
    a: 'The curriculum includes computing fundamentals, electronics, operating systems, computer networks, applied cryptography, data engineering, and five hands-on laboratories: Malware Analysis Lab, Digital Forensics Lab, Cloud Computing & Security Lab, VAPT Lab, and Network & Web Security Lab.',
  },
  {
    q: 'Is the internship component guaranteed to be paid?',
    a: 'Host organizations determine stipend arrangements according to their institutional policies. While IIT Kanpur prioritizes placements offering financial support, published documentation states stipend arrangements depend on the individual host organization.',
  },
  {
    q: 'Can students switch to regular B.Tech Computer Science after admission?',
    a: 'No. Branch change is strictly prohibited under Senate ordinances (FAQ 12). B.Cyber students cannot transfer to regular B.Tech, and regular B.Tech students cannot enter B.Cyber without qualifying the dedicated entrance selection.',
  },
  {
    q: 'How does admission work for the next cycle?',
    a: 'For the inaugural 2026 cycle, JEE Main and prior technical evidence were used for shortlisting to an in-person 6-hour hackathon. However, official WSAIS FAQ 23 confirms that JEE Main will NOT be used for subsequent intakes; a dedicated separate entrance examination will be conducted.',
  },
];

export function BCyberHomePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber');

  useSEO({
    title: 'IIT Kanpur B.Cyber: Degree, 2+2 Model & Curriculum Explained',
    description:
      'IIT Kanpur B.Cyber explained: understand the four-year degree, 2+2 structure, curriculum, internship component, alumni status, and career realities. Independent guide based on official records.',
    keywords:
      'IIT Kanpur B.Cyber, Bachelor of Cybersecurity, B.Cyber curriculum, B.Cyber 2+2 model, WSAIS IIT Kanpur, cybersecurity degree India, C3iHub IIT Kanpur, B.Cyber alumni status',
    url: canonical,
  });

  // State for active semester tab in Section 4
  const [activeSemIndex, setActiveSemIndex] = useState(0);

  // State for interactive 3-question self-reflection in Section 7
  const [reflectionChecks, setReflectionChecks] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });

  // State for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleReflection = (index: number) => {
    setReflectionChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const reflectionCount = Object.values(reflectionChecks).filter(Boolean).length;

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0b1c30]">
      {/* Global Spacing for Fixed Main Navigation */}
      <div className="pt-20 sm:pt-24" />

      {/* Contextual Sub-Navigation Layer */}
      <BCyberNav />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24">
        
        {/* =========================================================================
            SECTION 0: HERO (First Impression & Fast-Track Route Jump)
        ========================================================================= */}
        <section aria-labelledby="hero-heading" className="space-y-6 pt-4 text-center flex flex-col items-center">
          {/* Trust Stamp Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Independent Guide · Based on Official IIT Kanpur Senate &amp; WSAIS Records</span>
          </div>

          {/* H1 Heading - Crisp 2-Line Architecture */}
          <h1 id="hero-heading" className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0b1c30] tracking-tight max-w-4xl leading-[1.12]">
            What Is IIT Kanpur B.Cyber?
            <span className="text-brand-primary text-xl sm:text-3xl lg:text-[32px] block mt-2 font-bold tracking-tight">
              Degree Structure, Curriculum &amp; Ground Truth
            </span>
          </h1>

          {/* Subtitle - Concise & High-Signal */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
            India&apos;s premier practice-oriented undergraduate degree. Verified Senate ordinances, the distinctive 2+2 model, and official IITK WSAIS data.
          </p>
          {/* Executive Key Facts Strip */}
          <div className="w-full max-w-4xl pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {/* Metric 1: Entrance Hook */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  ENTRANCE
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  No JEE Advanced Req
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Separate Test · 12th PCM
                </span>
              </div>

              {/* Metric 2: Prestige Hook */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  CREDENTIAL
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  IIT Alumni Status
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Official 4-Year B.Cyber Degree
                </span>
              </div>

              {/* Metric 3: Structure & Practicum Hook */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  ARCHITECTURE
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  2-Yr Field Practicum
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Critical Cyber &amp; Defense Units
                </span>
              </div>

              {/* Metric 4: Hands-on Cyber Labs */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  LAB TRAINING
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  5 Live Cyber Labs
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Sem 1 Malware &amp; Exploit Dev
                </span>
              </div>
            </div>

            {/* Streamlined Pillar Navigation CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Primary CTA: Pillar 3 Preparation Roadmap */}
              <Link
                to="/blueprints/b-cyber/roadmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1c30] text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs group"
              >
                <span>Free Preparation Roadmap (Pillar 3)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#d1f34d]" />
              </Link>

              {/* Secondary CTA: Pillar 2 Admission & Eligibility Guide */}
              <Link
                to="/blueprints/b-cyber/admission"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary group-hover:scale-105 transition-transform" />
                <span>Admission &amp; 2027 Shift (Pillar 2)</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: B.CYBER IN 30 SECONDS (Executive Direct Answer Card)
        ========================================================================= */}
        <section id="quick-answer" aria-labelledby="section-30sec-heading" className="scroll-mt-28">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                  Direct Answer First
                </span>
                <span className="text-xs text-slate-400">• Official Institutional Summary</span>
              </div>

              <h2 id="section-30sec-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                What is IIT Kanpur B.Cyber?
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                IIT Kanpur&apos;s <strong>B.Cyber (Bachelor of Cybersecurity)</strong> is a four-year undergraduate degree program administered by the Wadhwani School of AI and Intelligent Systems (WSAIS). Approved under dedicated Senate ordinances, its structure comprises <strong>two years of intensive on-campus coursework</strong> at IIT Kanpur followed by a <strong>two-year practical field deployment</strong> in key national defense and cybersecurity agencies. Students who successfully complete the program receive the official B.Cyber degree and regular IIT Kanpur alumni status.
              </p>

              {/* 3 Executive High-Speed Specs Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Award &amp; Standing
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      Official 4-Yr Degree &amp; IIT Alumni
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Curriculum Model
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      2 Yrs Campus + 2 Yrs Field Practicum
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Ecosystem Host
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      WSAIS &amp; C3iHub · Joint with IITM
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
                  <span>IIT Kanpur WSAIS B.Cyber Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: PROGRAM AT A GLANCE (Verified Key Facts Matrix)
        ========================================================================= */}
        <section aria-labelledby="facts-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Verified Data
            </span>
            <h2 id="facts-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              IIT Kanpur B.Cyber: Key Facts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Published program parameters verified against official IIT Kanpur Senate records.
            </p>
          </div>

          {/* Balanced 2x2 Grid of All 4 Key Fact Cards (Clean, Permanent, Zero Filter Clutter) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: DEGREE & ALUMNI */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200 cursor-default flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                {/* Card Top Row with Index & Category */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-primary border border-blue-200/70 flex items-center justify-center font-bold text-xs">
                      01
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Award className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Degree Award</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Regular IIT Alumni</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  Bachelor of Cybersecurity (B.Cyber.)
                </h3>

                {/* Structured Micro-Rows (No plain bullets) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Alumni Standing:</strong> Full regular IIT alumni status with identical convocation rights and alumni association membership.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Global Parity:</strong> 100% recognized equivalence for international MS and Ph.D. admissions worldwide (WSAIS FAQ 9).
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Senate Award:</strong> Four-year undergraduate degree conferred under official IIT Kanpur Senate regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: 2+2 PEDAGOGY */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200 cursor-default flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                {/* Card Top Row with Index & Category */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-primary border border-blue-200/70 flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Layers className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Pedagogical Model</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-primary border border-blue-200/80 text-[11px] font-bold">
                    <Clock className="w-3 h-3 text-brand-primary" />
                    <span>2+2 Architecture</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  2 Yrs Campus Labs + 2 Yrs Field Practicum
                </h3>

                {/* Structured Micro-Rows (No plain bullets) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Campus Phase:</strong> Semesters 1–4 deliver intensive theory and 5 hands-on live security labs (Malware, VAPT, Forensics) at IITK.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Field Deployment:</strong> Semesters 5–8 practical placement in defense intelligence agencies and critical national infrastructure.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                      <Clock size={12} className="text-amber-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Branch Lock:</strong> Transfer into regular B.Tech is strictly prohibited by Senate ordinances (WSAIS FAQ 12).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: GOVERNANCE & HOST */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200 cursor-default flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                {/* Card Top Row with Index & Category */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-primary border border-blue-200/70 flex items-center justify-center font-bold text-xs">
                      03
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Host Ecosystem</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-brand-primary" />
                    <span>Apex MoE Centers</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  WSAIS &amp; C3iHub National Hub
                </h3>

                {/* Structured Micro-Rows (No plain bullets) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Host School:</strong> Anchored at the Wadhwani School of AI and Intelligent Systems (WSAIS) at IIT Kanpur.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Apex Cyber Hub:</strong> Technically supported by C3iHub — India&apos;s apex Cybersecurity Innovation Hub.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Joint Offering:</strong> Offered in close partnership with IIT Madras sharing identical academic curriculum and rigor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: PLACEMENT REALITY */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-200 cursor-default flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                {/* Card Top Row with Index & Category */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-primary border border-blue-200/70 flex items-center justify-center font-bold text-xs">
                      04
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Scale className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Career Reality</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] font-bold">
                    <CalendarCheck className="w-3 h-3 text-slate-700" />
                    <span>First Passout: 2030</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
                  Zero Historical Salary Statistics
                </h3>

                {/* Structured Micro-Rows (No plain bullets) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Cohort Timeline:</strong> Inaugural cohort enrolled in July 2026; the very first graduating class will pass out in 2030.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                      <Scale size={12} className="text-amber-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Fact Check:</strong> Beware coaching claims — any past packages or median CTC figures quoted online are fictional.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 group-hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Career Support:</strong> Dedicated WSAIS career assistance channel is provided to all program completers (WSAIS FAQ 14).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: THE 4-YEAR, 2+2 MODEL (Visual Stepper & Timeline)
        ========================================================================= */}
        <section aria-labelledby="model-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Academic Architecture
            </span>
            <h2 id="model-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Does the IIT Kanpur B.Cyber 2+2 Model Work?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The four years are divided into two distinct pedagogical phases approved by the Senate.
            </p>
          </div>

          {/* Visual Progression Stepper Indicator */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
              
              {/* STAGE 1: ON-CAMPUS (Left Pillar) */}
              <div className="flex-1 flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100/90">
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-brand-primary flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-2xs">
                  01
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                      Phase 1: 2 Yrs On-Campus
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-brand-primary border border-blue-200/60 shrink-0">
                      Sem 1–4
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                    IIT Kanpur Campus · Core Computing + 5 Live Labs
                  </p>
                </div>
              </div>

              {/* CENTER PROGRESSION GATE CONNECTOR */}
              <div className="flex md:flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs shrink-0 self-center">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  Milestone Gate
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span>200 Cr Clearance</span>
                  <ArrowRight size={13} className="text-brand-primary" />
                </div>
              </div>

              {/* STAGE 2: FIELD PRACTICUM (Right Pillar) */}
              <div className="flex-1 flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100/90">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-2xs">
                  02
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                      Phase 2: 2 Yrs Field Deployment
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 shrink-0">
                      Sem 5–8
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                    CERT-In &amp; Defense Hubs · Live Threat Operations
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase 1 Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Card Top Row with Badge & Credit Pill */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
                    Years 01 – 02 (Semesters 1 to 4)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] font-bold">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>200 Campus Credits</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                  On-Campus Coursework &amp; Deep Security Labs
                </h3>

                {/* Structured Micro-Rows (Symmetrical to Phase 2) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Campus Residency:</strong> In-person residential study on campus at IIT Kanpur (or IIT Madras cohort) across Semesters 1–4.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <Layers size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Rigorous Foundations:</strong> Foundational computing, electronics, data structures, operating systems, and computer networks.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <ShieldCheck size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">5 Live Cyber Labs:</strong> Hands-on lab courses in Malware Analysis, Digital Forensics, Cloud Security, VAPT, and Network Defense.
                    </p>
                  </div>
                </div>

                {/* Symmetrical Context Callout Box */}
                <div className="rounded-2xl bg-blue-50/60 border border-blue-200/70 p-3.5 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-brand-primary font-bold">Academic Gate:</strong> Full clearance of all 200 campus credits with requisite Senate CPI is mandatory before advancing to Phase 2 field deployment.
                </div>
              </div>

              {/* Card Footer Location Strip */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Building2 size={14} className="text-slate-500 shrink-0" />
                <span>Host Campus: IIT Kanpur Campus Labs &amp; Residential Hostels</span>
              </div>
            </div>

            {/* Phase 2 Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Card Top Row with Badge & Credit Pill */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
                    Years 03 – 04 (Semesters 5 to 8)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] font-bold">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>216 Field Credits (54/sem)</span>
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                  Full-Time Practical Field Deployment / Internship
                </h3>

                {/* Structured Micro-Rows (Symmetrical to Phase 1) */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                      <ShieldCheck size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Defense &amp; Cyber Hubs:</strong> Deployed in CERT-In, NCIIPC, defense intelligence agencies, and critical infrastructure units.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Live Incident Operations:</strong> Practical experience solving live cyber threat missions, vulnerability research, and sovereign defense.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
                      <Scale size={12} className="text-slate-600" />
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      <strong className="text-slate-950 font-bold">Registered IIT Status:</strong> Students remain registered IIT students under continuous faculty evaluation and Senate oversight.
                    </p>
                  </div>
                </div>

                {/* Symmetrical Context Callout Box */}
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/70 p-3.5 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-amber-900 font-bold">Stipend &amp; Role Terms:</strong> Field deployment functions as an accredited internship component; host organizations determine stipend arrangements.
                </div>
              </div>

              {/* Card Footer Location Strip */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck size={14} className="text-slate-500 shrink-0" />
                <span>Placement Hub: Government Defense &amp; Critical Infrastructure Units</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: CURRICULUM AND SUBJECTS (Official Semester Courses)
        ========================================================================= */}
        <section aria-labelledby="curriculum-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Syllabus Deep-Dive
            </span>
            <h2 id="curriculum-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Do Students Study in IIT Kanpur B.Cyber?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Official course titles and Senate credit weights for the on-campus semesters.
            </p>
          </div>

          {/* Accessible Semester Tab Navigation + Phase Scope Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Semesters">
              {CURRICULUM_SEMESTERS.map((sem, idx) => (
                <button
                  key={sem.semNumber}
                  role="tab"
                  aria-selected={activeSemIndex === idx}
                  aria-controls={`sem-panel-${sem.semNumber}`}
                  id={`sem-tab-${sem.semNumber}`}
                  onClick={() => setActiveSemIndex(idx)}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary shadow-2xs',
                    activeSemIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span>Semester {sem.semNumber}</span>
                  <span className={cn('ml-1.5 text-[11px] font-mono', activeSemIndex === idx ? 'text-white/80' : 'text-slate-400')}>
                    ({sem.totalCredits} Cr)
                  </span>
                </button>
              ))}
            </div>

            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Phase 1 On-Campus Curricula (200 Total Credits)</span>
            </div>
          </div>

          {/* Active Semester Panel */}
          {(() => {
            const currentSem = CURRICULUM_SEMESTERS[activeSemIndex];
            const labCount = currentSem.subjects.filter((s) => s.isLab).length;

            const getSubjectVisual = (sub: SemesterSubject) => {
              if (sub.isLab) {
                return {
                  icon: Terminal,
                  iconContainer: 'bg-blue-50 text-brand-primary border-blue-200/80 group-hover:bg-brand-primary group-hover:text-white',
                  badge: (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-brand-primary border border-blue-200/80 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      Hands-on Lab
                    </span>
                  ),
                  creditBadge: 'bg-blue-50/70 border-blue-200/80 text-brand-primary',
                  cardBorder: 'border-blue-200/90 hover:border-blue-300',
                };
              }
              if (sub.type === 'Cognitive Science' || sub.type === 'Humanities') {
                return {
                  icon: Scale,
                  iconContainer: 'bg-amber-50 text-amber-700 border-amber-200/80',
                  badge: (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 uppercase tracking-wider">
                      {sub.type}
                    </span>
                  ),
                  creditBadge: 'bg-slate-50 border-slate-200/80 text-slate-800',
                  cardBorder: 'border-slate-200/80 hover:border-slate-300',
                };
              }
              if (sub.type === 'Elective') {
                return {
                  icon: Layers,
                  iconContainer: 'bg-purple-50 text-purple-700 border-purple-200/80',
                  badge: (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/70 uppercase tracking-wider">
                      Elective
                    </span>
                  ),
                  creditBadge: 'bg-slate-50 border-slate-200/80 text-slate-800',
                  cardBorder: 'border-slate-200/80 hover:border-slate-300',
                };
              }
              if (sub.type === 'Core Systems' || sub.type === 'Security Core') {
                return {
                  icon: Cpu,
                  iconContainer: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
                  badge: (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/70 uppercase tracking-wider">
                      {sub.type}
                    </span>
                  ),
                  creditBadge: 'bg-slate-50 border-slate-200/80 text-slate-800',
                  cardBorder: 'border-slate-200/80 hover:border-slate-300',
                };
              }
              // Default: Core Theory
              return {
                icon: BookOpen,
                iconContainer: 'bg-slate-100 text-slate-700 border-slate-200/80',
                badge: (
                  <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70 uppercase tracking-wider">
                    {sub.type}
                  </span>
                ),
                creditBadge: 'bg-slate-50 border-slate-200/80 text-slate-800',
                cardBorder: 'border-slate-200/80 hover:border-slate-300',
              };
            };

            return (
              <div
                role="tabpanel"
                id={`sem-panel-${currentSem.semNumber}`}
                aria-labelledby={`sem-tab-${currentSem.semNumber}`}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5"
              >
                {/* Panel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {currentSem.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {currentSem.focus}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                      {currentSem.totalCredits} Total Credits
                    </span>
                    {labCount > 0 && (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-brand-primary border border-blue-200/80 shadow-2xs">
                        {labCount} Live Lab{labCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Symmetrical Consistent Subject Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {currentSem.subjects.map((sub, i) => {
                    const isLastOdd = i === currentSem.subjects.length - 1 && currentSem.subjects.length % 2 !== 0;
                    const visual = getSubjectVisual(sub);
                    const IconComponent = visual.icon;

                    return (
                      <div
                        key={i}
                        className={cn(
                          'p-4 rounded-2xl border bg-white shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-between gap-3 group',
                          isLastOdd ? 'sm:col-span-2' : '',
                          visual.cardBorder
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-colors',
                              visual.iconContainer
                            )}
                          >
                            <IconComponent size={15} />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <span className="font-bold text-slate-900 text-xs sm:text-[13px] block truncate group-hover:text-brand-primary transition-colors">
                              {sub.name}
                            </span>
                            <div>
                              {visual.badge}
                            </div>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shrink-0 font-mono text-xs font-bold shadow-2xs transition-colors',
                            visual.creditBadge
                          )}
                        >
                          <span>{sub.credits}</span>
                          <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">
                            Cr
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Practicum Transition Hint */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-brand-primary shrink-0" />
                    <span>
                      Course syllabus &amp; credit weights verified against official Senate Ordinance §8.
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700 shrink-0">
                    <span>Semesters 5–8: Full-Time Field Practicum (216 Credits)</span>
                    <ArrowRight size={12} className="text-brand-primary" />
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* =========================================================================
            SECTION 5: BEYOND HACKING: WHAT CYBERSECURITY ACTUALLY COVERS
        ========================================================================= */}
        <section aria-labelledby="domains-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Conceptual Domains
            </span>
            <h2 id="domains-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Beyond Hacking: What Does Cybersecurity Actually Cover?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Cybersecurity is an engineering discipline, not merely running automated tools.
            </p>
          </div>

          {/* Balanced 5-Card Layout: Row 1 has 3 items, Row 2 has 2 items spanning equal width (Zero empty space) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {FOCUS_AREAS.map((area, idx) => {
              const AreaIcon = area.icon;
              const spanClass = idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3';

              return (
                <div
                  key={idx}
                  className={cn(
                    'rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4 group',
                    spanClass
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-800 group-hover:text-brand-primary border border-slate-200/70 group-hover:border-blue-200/80 flex items-center justify-center font-bold text-xs transition-colors shrink-0">
                        <AreaIcon size={15} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors tracking-tight">
                      {area.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {area.desc}
                    </p>
                  </div>

                  {/* Course Link Tag Pills */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Curriculum Anchor
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {area.courses.map((c, ci) => (
                        <span
                          key={ci}
                          className="px-2 py-0.5 rounded-md bg-slate-100/90 border border-slate-200/70 text-[11px] font-medium text-slate-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: BALANCED DEGREE COMPARISON
        ========================================================================= */}
        <section aria-labelledby="comparison-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Objective Comparison
            </span>
            <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Is B.Cyber Different from a Conventional Computing Degree?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare differences factually without unsupported marketing claims.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-3.5 sm:p-4">Comparison Parameter</th>
                    <th className="p-3.5 sm:p-4 text-brand-primary">IIT Kanpur B.Cyber</th>
                    <th className="p-3.5 sm:p-4">Conventional B.Tech CSE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-semibold text-slate-700 align-top">
                        {row.parameter}
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-900 font-medium align-top bg-brand-primary/5">
                        {row.bcyber}
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-600 align-top">
                        {row.conventional}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: IS B.CYBER RIGHT FOR YOU? (Fit & Profile Assessment)
        ========================================================================= */}
        <section aria-labelledby="fit-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Fit &amp; Profile Assessment
            </span>
            <h2 id="fit-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Who Should Consider IIT Kanpur B.Cyber?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Assess your genuine technical interest and mindset before committing to a specialized 4-year degree.
            </p>
          </div>

          {/* Dual Profile Archetype Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* COLUMN 1: STRONG ALIGNMENT */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Strong Alignment</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    High Retention
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-950 transition-colors">
                    Ideal Candidate Archetype
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Students with innate curiosity for low-level computing, protocol dissection, and disciplined defense engineering.
                  </p>
                </div>

                {/* 4 Structured Criteria Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Low-Level Systems Curiosity
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Fascinated by computer networks, TCP/IP handshakes, Linux OS internals, and memory architectures rather than just high-level UI apps.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Reverse-Engineering Grit
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Enjoys patiently investigating edge-case bugs, reading disassembled binary flows, and uncovering why software components fail.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        2-Year Practical Field Readiness
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Eager to spend Semesters 5–8 deployed on-site in critical national infrastructure, defense intelligence, or national cyber defense units.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Strict Ethical &amp; Legal Framework
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Committed to practicing defense research strictly within legally authorized boundaries, institutional rules, and cyber law standards.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Profile Match
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-2xs">
                  Systems &amp; Defense Track
                </span>
              </div>
            </div>

            {/* COLUMN 2: THINK CAREFULLY / MISALIGNMENT */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>High Caution</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Friction Risks
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-amber-950 transition-colors">
                    Common Misalignment Factors
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Key expectation traps and assumptions that lead to dissatisfaction or academic friction in this program.
                  </p>
                </div>

                {/* 4 Structured Criteria Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        &quot;IIT Brand Tag&quot; Speculation
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Selecting the degree purely for the prestige label while lacking genuine interest in terminal-driven, low-level systems engineering.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        &quot;Script-Kiddie&quot; Tool Illusion
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Assuming cybersecurity is clicking pre-packaged hacking tools or running Kali scripts without mastering deep computer science foundations.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Branch-Transfer Expectation
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Planning to switch into regular B.Tech Computer Science (strictly barred under official IIT Kanpur Senate Ordinances, FAQ 12).
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Instant Big-Tech Salary Assumptions
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Expecting guaranteed private corporate packages instead of recognizing the inaugural 2026 defense cohort timeline where graduates pass out in 2030.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Senate Advisory
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs">
                  Zero Branch Change
                </span>
              </div>
            </div>
          </div>

          {/* Interactive 3-Question Self-Reflection Diagnostic Box */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Readiness Self-Assessment
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Is this degree worth exploring for you?
                </h3>
              </div>

              {/* Alignment Progress Counter */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">
                    Alignment Score: {reflectionCount}/3
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {reflectionCount === 3 ? '100% Confirmed' : reflectionCount === 2 ? '66% Confirmed' : reflectionCount === 1 ? '33% Confirmed' : '0% Confirmed'}
                  </span>
                </div>
                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      reflectionCount === 3 ? 'bg-emerald-500 w-full' : reflectionCount === 2 ? 'bg-amber-500 w-2/3' : reflectionCount === 1 ? 'bg-brand-primary w-1/3' : 'w-0'
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {[
                {
                  title: 'Two-Year Off-Campus Field Practicum',
                  desc: 'I am willing to spend 2 full years away from campus deployed on practical field assignments in government or critical infrastructure.',
                },
                {
                  title: 'Low-Level Systems Engineering Focus',
                  desc: 'I am interested in low-level systems (Linux kernel, C, networks, applied cryptography) rather than solely standard consumer web apps.',
                },
                {
                  title: 'Evidence-Based Technical Selection',
                  desc: 'I understand that admission selection evaluates verifiable prior work and practical technical aptitude alongside academic criteria.',
                },
              ].map((item, idx) => {
                const isChecked = !!reflectionChecks[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleReflection(idx)}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 group',
                      isChecked
                        ? 'border-brand-primary/40 bg-brand-primary/5 shadow-2xs'
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-brand-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      )}
                    </span>
                    <div className="flex-1">
                      <span className={cn('text-xs sm:text-[13px] font-bold block', isChecked ? 'text-slate-900' : 'text-slate-800')}>
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Result Banner */}
            <div className="pt-2">
              {reflectionCount === 3 ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>High Curricular Alignment: Your expectations match official Senate regulations and the 2+2 model.</span>
                  </div>
                  <Link
                    to="/blueprints/b-cyber/roadmap"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b1c30] text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs shrink-0"
                  >
                    <span>View Preparation Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d1f34d]" />
                  </Link>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    {reflectionCount} of 3 prompts confirmed. Check all three conditions to verify your complete alignment.
                  </span>
                  <Link
                    to="/blueprints/b-cyber/curriculum"
                    className="font-semibold text-brand-primary hover:underline shrink-0 ml-3"
                  >
                    Inspect Curriculum &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: DEGREE, RECOGNITION & ALUMNI STATUS
        ========================================================================= */}
        <section aria-labelledby="degree-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Credential Parity
            </span>
            <h2 id="degree-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Degree Do You Get After B.Cyber?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Official institutional standing and global higher-education equivalence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Students who successfully complete all program requirements are awarded the official <strong>Bachelor of Cybersecurity (B.Cyber.)</strong> degree from IIT Kanpur. IIT Kanpur&apos;s published program information explicitly states that successful graduates receive <strong>IIT Kanpur alumni status</strong> upon successful graduation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Degree Award</span>
                <span className="text-slate-600">Bachelor of Cybersecurity (B.Cyber.)</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Alumni Status</span>
                <span className="text-slate-600">Full IIT Kanpur / IIT Madras Alumni Status</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Higher Studies (FAQ 9)</span>
                <span className="text-slate-600">100% eligible for MS, M.Tech &amp; Ph.D. globally</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Info size={14} className="text-slate-400 shrink-0" />
              <span>
                Note: Alumni status is granted upon successful degree completion, not immediately upon joining the field internship.
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: INTERNSHIP, STIPEND & PLACEMENT REALITY
        ========================================================================= */}
        <section aria-labelledby="internship-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Career &amp; Deployment Truth
            </span>
            <h2 id="internship-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What Does the Internship and Career Picture Actually Look Like?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Separating published institutional provisions from unverified marketing assumptions.
            </p>
          </div>

          {/* Dual Verification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* COLUMN 1: PUBLISHED PROVISIONS / INSTITUTIONAL FACTS */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Published Provisions</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Institutional Facts
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-950 transition-colors">
                    What the Published Information Confirms
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Stipulated mandates established in official IIT Kanpur Senate ordinances, WSAIS admission brochures, and curriculum guidelines.
                  </p>
                </div>

                {/* 4 Structured Criteria Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Mandatory 2-Year Practical Practicum
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Years three and four (Semesters 5–8) constitute the compulsory full-time field practicum (216 credits), fully replacing standard on-campus classroom lectures.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Apex Host Organizations
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Host entities are primarily selected government organizations, national defense establishments, and specialized institutional research incubators.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Stipends Governed by Host Policy
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Financial stipends during the 24-month practical deployment are arranged and disbursed based on individual host organization policies.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Dedicated Placement Facilitation
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Career placement assistance is formally provided to successful program completers via specialized cybersecurity institutional channels.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Documented Mandate
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-2xs">
                  WSAIS FAQ 14 &amp; Senate Ord. §4
                </span>
              </div>
            </div>

            {/* COLUMN 2: WHAT THIS DOES NOT ESTABLISH / HYPE SEPARATION */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Clarified Boundaries</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Hype Separation
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-amber-950 transition-colors">
                    What This Does NOT Establish
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Critical reality checks to separate commercial coaching promises from contractually guaranteed outcomes.
                  </p>
                </div>

                {/* 4 Structured Criteria Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        No Uniform Fixed Stipend Guarantee
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Official institutional documentation establishes no single guaranteed or standardized monthly stipend amount across all hosts.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        No Automatic Permanent Government Post
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Field deployment within a government agency does not confer an automatic civil service job offer or permanent absorption post-graduation.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Zero Historical Placement Precedent
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Because the inaugural cohort commenced in July 2026 and graduates in 2030, no prior placement statistics, batch averages, or recruitment metrics exist.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        No Pre-Graduation Package Promises
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                        Any specific corporate salary package or multinational CTC figures claimed prior to cohort graduation are unverified marketing claims.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Academic Reality
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs">
                  Practicum ≠ Guaranteed Placement
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Deployment Guidance Advisory */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-primary border border-blue-200/60 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Candidate Deployment Advisory</span>
                <span className="text-slate-600">Candidates should approach Years 3–4 as an intensive experiential engineering practicum rather than an automated corporate placement shortcut.</span>
              </div>
            </div>
            <a
              href="#faq-heading"
              className="inline-flex items-center gap-1.5 font-bold text-brand-primary hover:text-brand-dark transition-colors shrink-0 text-xs py-1"
            >
              <span>Explore Deployment FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: COMMON MISCONCEPTIONS (Myth vs Fact 2-Column Grid)
        ========================================================================= */}
        <section aria-labelledby="myths-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Hype Filter
            </span>
            <h2 id="myths-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What You Should Know Before Choosing B.Cyber
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Frequent internet assumptions compared with authentic official reality.
            </p>
          </div>

          {/* Balanced 2-Column Responsive Card Grid (All 6 Cards Displayed Together) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MISCONCEPTIONS.map((item, idx) => (
              <div
                key={item.category}
                className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header Meta */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      0{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                      {item.topic}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {item.ref}
                  </span>
                </div>

                {/* Vertical Stack: Assumption Quote on Top */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 space-y-1.5 border-l-2 border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
                    <HelpCircle size={12} className="text-slate-400" />
                    Common Assumption
                  </span>
                  <p className="text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed italic">
                    &ldquo;{item.myth}&rdquo;
                  </p>
                </div>

                {/* Vertical Stack: Verified Reality Below (Full natural width, no empty whitespace) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider text-emerald-950 inline-flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 size={12} className="text-emerald-700" />
                      Official Institutional Fact
                    </span>
                    <p className="text-xs sm:text-[13px] text-slate-700 font-normal leading-relaxed">
                      {item.fact}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* 6th Card: Verification Directory Anchor (ensures 3x2 grid balance) */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-brand-primary flex items-center justify-center font-bold text-[10px]">
                    06
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    Institutional Inquiries &amp; Verification
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  Senate Ordinances
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
                  <Info size={12} className="text-slate-400" />
                  Additional Inquiries
                </span>
                <p className="text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                  Have an unlisted query or need to verify admissions, academic credits, or official contact desks?
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  All 26 Senate regulations, official admission circulars, and primary contact emails are indexed in our transparent FAQ directory.
                </p>
                <a
                  href="#faq-heading"
                  className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0b1c30] text-white hover:bg-slate-800 transition-colors text-xs font-bold"
                >
                  <span>Browse All 8 FAQs</span>
                  <ArrowRight size={14} className="text-[#d1f34d]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: FREQUENTLY ASKED QUESTIONS (Concise Direct Answers)
        ========================================================================= */}
        <section aria-labelledby="faq-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Direct Answers
            </span>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear, direct answers to common student and family questions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: SOURCES, VERIFICATION & EDITORIAL TRANSPARENCY
        ========================================================================= */}
        <section aria-labelledby="sources-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Transparency
            </span>
            <h2 id="sources-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sources, Verification and Editorial Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              All information is cross-referenced with primary institute publications.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-900">Primary Program Sources:</span>
              <a
                href="https://iitk.ac.in/wsais/b-cyber.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>IIT Kanpur WSAIS B.Cyber Portal</span>
                <ExternalLink size={12} />
              </a>
              <span>•</span>
              <a
                href="https://iitk.ac.in/new-ug-program-in-cybersecurity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Official Program Announcement</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>Last verified against primary records: <strong>12 October 2026</strong></span>
              <span>Published by: <strong>B.Cyber Compass Independent Research</strong></span>
            </div>

            <DisclaimerBanner variant="compact" />
          </div>
        </section>

        {/* =========================================================================
            SECTION 13: FINAL NEXT STEP DECISION GATEWAY (P2 / P3 Dual CTA)
        ========================================================================= */}
        <section aria-labelledby="next-step-heading" className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-8 sm:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d1f34d] block">
                Next Decision
              </span>
              <h2 id="next-step-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Now That You Understand B.Cyber, What&apos;s Next?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Check whether you satisfy official admission eligibility, or jump directly to the preparation roadmap to build verifiable proof of work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/blueprints/b-cyber/admission"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d1f34d] text-slate-950 text-xs font-bold hover:bg-[#c0e045] transition-all shadow-sm group"
              >
                <span>Check Admission &amp; Eligibility</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/blueprints/b-cyber/roadmap"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all text-center border border-white/15"
              >
                <span>Explore Preparation Roadmap</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
