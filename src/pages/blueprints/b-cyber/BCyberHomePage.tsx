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
const FOCUS_AREAS = [
  {
    title: 'Foundations & Low-Level Computing',
    desc: 'Understanding machine architecture, memory layout, pointers, and how hardware interacts with software logic.',
    courses: 'Computing Fundamentals, Electronics, Computer Organization',
  },
  {
    title: 'Systems & Network Engineering',
    desc: 'Operating system kernels, system calls, process monitoring, TCP/IP handshakes, packet capture, and network routing.',
    courses: 'Operating Systems, Computer Networks, Data Ops',
  },
  {
    title: 'Applied Cryptography',
    desc: 'Mathematical foundations of ciphers, public-key infrastructure, AES/RSA implementation logic, entropy, and hashing.',
    courses: 'Applied Cryptography, Mathematical Security',
  },
  {
    title: 'Offensive & Defensive Security Labs',
    desc: 'Static/dynamic malware inspection, memory artifact forensics, cloud configuration audits, and penetration testing.',
    courses: 'Malware Lab, Digital Forensics Lab, VAPT Lab, Cloud Security Lab',
  },
  {
    title: 'Human Cognition & Application Security',
    desc: 'Psychology of social engineering, insider threat vectors, along with Web/API vulnerabilities (SQLi, XSS, SSRF).',
    courses: 'Introduction to Psychology, Web & Network Security Lab',
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
    myth: 'Cybersecurity is just ethical hacking and running Kali Linux tools.',
    fact: 'The official Senate curriculum is grounded in deep computer science: computing fundamentals, electronics, operating systems, data engineering, and cryptography. Script-kiddie tools without fundamentals are not the focus.',
  },
  {
    myth: 'The two-year internship structure means a guaranteed permanent job.',
    fact: 'The internship component is an academic degree requirement hosted primarily in selected government agencies. Permanent post-degree employment depends on organizational policies and individual selection.',
  },
  {
    myth: 'Placement support is identical to a guaranteed salary package.',
    fact: 'Official documentation states placement assistance is provided to successful completers via a dedicated cybersecurity channel. However, no specific starting salary or outcome can be guaranteed.',
  },
  {
    myth: 'The 2026 JEE Main admission conditions will automatically apply to 2027.',
    fact: 'WSAIS FAQ 23 confirmed that JEE Main is discontinued for future intakes; a separate dedicated entrance test will be conducted. Each admission cycle requires independent verification.',
  },
  {
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
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  ENTRANCE
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-slate-900 block leading-tight flex items-center gap-1.5">
                  <span>NO JEE ADV REQ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
                  Separate Test · 12th PCM
                </span>
              </div>

              {/* Metric 2: Prestige Hook */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  CREDENTIAL
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-slate-900 block leading-tight">
                  IIT Alumni Status
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Official 4-Year B.Cyber Degree
                </span>
              </div>

              {/* Metric 3: Structure & Practicum Hook */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  2+2 ARCHITECTURE
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-slate-900 block leading-tight">
                  2-Yr Paid Practicum
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Work in Top Cyber Units
                </span>
              </div>

              {/* Metric 4: Hands-on Cyber Labs */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  PRACTICAL FOCUS
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-slate-900 block leading-tight">
                  5 Live Cyber Labs
                </span>
                <span className="text-[11px] text-brand-primary font-medium mt-0.5 block">
                  Sem 1 Malware &amp; Exploit Dev
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/blueprints/b-cyber/roadmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1c30] text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs group"
              >
                <span>Free Preparation Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#d1f34d]" />
              </Link>

              <a
                href="#quick-answer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
              >
                <span>30-Sec Summary</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://iitk.ac.in/wsais/b-cyber.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-slate-500 hover:text-slate-900 text-xs font-medium transition-colors"
                title="Official IIT Kanpur WSAIS portal"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: B.CYBER IN 30 SECONDS (AEO / GEO Direct Answer Card)
        ========================================================================= */}
        <section id="quick-answer" aria-labelledby="section-30sec-heading" className="scroll-mt-28">
          <div className="rounded-2xl border border-brand-primary/25 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                  Direct Answer First
                </span>
                <span className="text-xs text-slate-400">• Official Summary</span>
              </div>
              <h2 id="section-30sec-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                What is IIT Kanpur B.Cyber?
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                IIT Kanpur&apos;s <strong>B.Cyber (Bachelor of Cybersecurity)</strong> is a four-year undergraduate program run by the Wadhwani School of AI and Intelligent Systems (WSAIS). Its published academic structure comprises <strong>two years of intensive coursework at IIT Kanpur</strong> followed by a <strong>two-year practical internship component</strong> in key organizations. Students who successfully complete the program receive the official B.Cyber degree and regular IIT Kanpur alumni status.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
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

          {/* Option 2: Apple-style High-End Engineered Tech Specs Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            
            {/* Category 1: Degree & Credential */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block">
                  SPECIFICATION 01
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Degree &amp; Conferred Standing
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Official statutory award approved by the IIT Kanpur Senate.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Awarded Degree</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block">
                      Bachelor of Cybersecurity (B.Cyber.)
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Conferred by IIT Kanpur (or IIT Madras based on seat allotment).
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Alumni Standing</span>
                  <div className="sm:col-span-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-[15px] font-bold text-slate-900">
                        Full Regular IITK Alumni
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        FAQ 16
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Identical institutional standing, alumni privileges, and degree validity.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Duration &amp; Limit</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-semibold text-slate-900 block">
                      4 Academic Years (8 Semesters)
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Maximum permissible duration is 6 years under Senate undergraduate ordinances.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 2: Academic & Pedagogical Model */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-slate-50/30">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block">
                  SPECIFICATION 02
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  2+2 Pedagogical Architecture
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Split framework balancing core theory with field deployment.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Semesters 1 to 4</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block">
                      2 Years On-Campus Residency
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Coursework at IIT Kanpur including 5 specialized cyber labs (Malware, Forensics, VAPT, Cloud, Networks).
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Semesters 5 to 8</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block">
                      2 Years Practical Field Internship
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Full-time deployment hosted primarily in selected government agencies &amp; critical national units.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Branch Transfer</span>
                  <div className="sm:col-span-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-[15px] font-bold text-slate-900">
                        Strictly Prohibited
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
                        No Transfer to B.Tech
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Senate rules prohibit switching between B.Cyber and conventional B.Tech programs.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 3: Institutional Governance & Career Reality */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block">
                  SPECIFICATION 03
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Governance &amp; Career Reality
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Institutional ecosystem, administration, and ground-truth career parameters.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Ecosystem Backing</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block">
                      WSAIS &amp; C3iHub Ecosystem
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Wadhwani School of AI and Intelligent Systems, backed by IIT Kanpur&apos;s National Cybersecurity Hub.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 pb-3.5 border-b border-slate-100">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Placement Support</span>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block">
                      Dedicated WSAIS Placement Assistance
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Specific career assistance channels provided for program graduates upon successful completion.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <span className="sm:col-span-4 text-xs font-medium text-slate-500">Historical CTC Data</span>
                  <div className="sm:col-span-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900">
                        Zero Historical Placement Statistics
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                        Inaugural 2026 Batch
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Any coaching claim citing median packages is misleading; first batch graduates in 2030.
                    </span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase 1 Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">
                    Years 01 – 02 (Semesters 1 to 4)
                  </span>
                  <span className="text-xs font-semibold text-slate-400">~200 Credits</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  On-Campus Coursework &amp; Deep Security Labs
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Students study on campus at IIT Kanpur (or IIT Madras for their enrolled cohort). The curriculum delivers foundational computing, electronics, operating systems, and computer networks alongside five intensive laboratory courses: Malware Analysis, Digital Forensics, Cloud Security, VAPT, and Network/Web Security.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Building2 size={14} className="text-slate-400" />
                <span>Location: IIT Kanpur Campus Labs &amp; Residential Hostels</span>
              </div>
            </div>

            {/* Phase 2 Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                    Years 03 – 04 (Semesters 5 to 8)
                  </span>
                  <span className="text-xs font-semibold text-slate-400">216 Credits (54/sem)</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Full-Time Practical Field Deployment / Internship
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  According to official program descriptions, students spend the second two years deployed in selected government departments, defense intelligence agencies, CERT-In, NCIIPC, critical national infrastructure, and cybersecurity research incubators.
                </p>
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-900">Important Distinction:</strong> Field deployment is an academic internship component. Host organizations determine stipend arrangements; students remain registered IIT students throughout.
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} className="text-slate-400" />
                <span>Host: Government Defense &amp; Critical Infrastructure Hubs</span>
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

          {/* Accessible Semester Tab Navigation */}
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
                  'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary',
                  activeSemIndex === idx
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <span>Semester {sem.semNumber}</span>
                <span className={cn('ml-1.5 text-[10px]', activeSemIndex === idx ? 'text-white/70' : 'text-slate-400')}>
                  ({sem.totalCredits} Cr)
                </span>
              </button>
            ))}
          </div>

          {/* Active Semester Panel */}
          {(() => {
            const currentSem = CURRICULUM_SEMESTERS[activeSemIndex];
            return (
              <div
                role="tabpanel"
                id={`sem-panel-${currentSem.semNumber}`}
                aria-labelledby={`sem-tab-${currentSem.semNumber}`}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-3 border-b border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentSem.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Total Credits: {currentSem.totalCredits}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {currentSem.focus}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentSem.subjects.map((sub, i) => (
                    <div
                      key={i}
                      className={cn(
                        'p-3.5 rounded-xl border flex items-center justify-between text-xs',
                        sub.isLab
                          ? 'border-brand-primary/30 bg-brand-primary/5 text-slate-900'
                          : 'border-slate-200/80 bg-slate-50/60 text-slate-800'
                      )}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold block">{sub.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{sub.type}</span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-700 shrink-0">
                        {sub.credits} Credits
                      </span>
                    </div>
                  ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOCUS_AREAS.map((area, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{area.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{area.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Course link: </span>
                  <span>{area.courses}</span>
                </div>
              </div>
            ))}
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
            SECTION 7: IS B.CYBER RIGHT FOR YOU? (Fit & Self-Reflection)
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
              Assess your genuine interest before committing to a specialized 4-year degree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Good Fit Column */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-5 sm:p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                A Good Fit to Explore If...
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>You are genuinely fascinated by computer networks, protocols, and OS internals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>You enjoy patiently investigating edge-case bugs and dissecting disassembled binaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>You are eager to spend two full years deployed in national infrastructure and defense organizations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>You want to practice cybersecurity in a disciplined, legally authorized, ethical framework.</span>
                </li>
              </ul>
            </div>

            {/* Think Carefully Column */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/20 p-5 sm:p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Think Carefully Before Choosing If...
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>You are choosing the program purely for the &quot;IIT tag&quot; without interest in systems engineering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>You assume cybersecurity is just running pre-made hacking scripts or automated scanners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>You expect an immediate guarantee of high private corporate placement salaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>You plan to branch-change into regular B.Tech Computer Science (which is strictly prohibited).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive 3-Question Self-Reflection */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Self-Reflection Check
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Is this degree worth exploring for you?
              </h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              {[
                'I am willing to spend 2 full years away from campus deployed on practical field assignments in government or critical infrastructure.',
                'I am interested in low-level systems (Linux, C, networking, cryptography) rather than solely standard consumer web apps.',
                'I understand that admission selection evaluates verifiable prior work and practical technical aptitude alongside academic criteria.',
              ].map((prompt, idx) => {
                const isChecked = !!reflectionChecks[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleReflection(idx)}
                    className="w-full p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 flex items-start gap-2.5 text-left transition-colors cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-brand-primary shrink-0 mt-0.5" />
                    ) : (
                      <Square size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={cn('flex-1 text-xs', isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600')}>
                      {prompt}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-xs font-medium text-slate-600">
              {reflectionCount === 3 ? (
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                  ✓ Your answers suggest this specialized curriculum aligns well with your goals.
                </span>
              ) : (
                <span className="text-slate-500">
                  {reflectionCount} of 3 prompts checked. Read the full curriculum and structural requirements before deciding.
                </span>
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
            <h2 id="internship-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Does the Internship and Career Picture Actually Look Like?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Separating published institutional provisions from unverified marketing assumptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                What the Published Information Confirms
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-800 shrink-0 mt-0.5" />
                  <span>Years three and four constitute the mandatory practical internship component.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-800 shrink-0 mt-0.5" />
                  <span>Host organizations are primarily selected government organizations and research incubators.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-800 shrink-0 mt-0.5" />
                  <span>Stipends are arranged based on host organization policies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-800 shrink-0 mt-0.5" />
                  <span>Placement support is provided to successful completers via specialized cyber channels.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
                What This Does NOT Establish
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>Every internship will necessarily offer an identical, guaranteed stipend sum.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>Students receive an automatic guarantee of permanent government employment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>A proven historical placement record exists (inaugural cohort commenced July 2026).</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>Any specific corporate salary package can be promised prior to graduation.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: COMMON MISCONCEPTIONS (Myth vs Fact Rows)
        ========================================================================= */}
        <section aria-labelledby="myths-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Hype Filter
            </span>
            <h2 id="myths-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What You Should Know Before Choosing B.Cyber
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Frequent internet assumptions compared with authentic official reality.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
            {MISCONCEPTIONS.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 space-y-2">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-rose-800 font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/80 text-[10px] uppercase font-bold shrink-0">
                    Assumption
                  </span>
                  <span>&quot;{item.myth}&quot;</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-normal pl-0 sm:pl-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] uppercase font-bold shrink-0">
                    Reality
                  </span>
                  <span>{item.fact}</span>
                </div>
              </div>
            ))}
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
