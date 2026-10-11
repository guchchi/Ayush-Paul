/**
 * B.Cyber Compass — Dynamic Preparation Planner Rule Engine (v2.3)
 *
 * Implements deterministic generation of personalised preparation plans based on:
 * - Selected Pathway (admission_prep vs. skill_dev vs. both)
 * - Academic Stage & Technical Baseline
 * - Available Weekly Hours (3 to 25 hours; no arbitrary minimum failures)
 * - Target Timeline (3, 6, 12 months)
 *
 * Strict Architectural Invariants:
 * 1. Zero fixed 50/50 splits: weekly scheduling is dynamically duration-packed.
 * 2. In admission-only plans, OverTheWire Bandit is strictly excluded.
 * 3. In admission-only plans, tasks are strictly categorized into:
 *    - confirmed_admission_requirement
 *    - independent_provisional_prep
 *    - published_evidence_alignment
 * 4. Explicit non-guarantee and provisional disclaimers attached to all tasks and plans.
 * 5. Pure deterministic TypeScript functions with zero external API calls or payment hooks.
 */

import type {
  DiagnosticInputs,
  GeneratedPlan,
  PlanPhase,
  PlanTaskItem,
  WeeklyScheduleSlot,
  ScheduledTaskSlot,
  PlanItemCategory,
} from '../../types/b-cyber-compass';

// =============================================================================
// Task Catalog Templates
// =============================================================================

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  category: PlanItemCategory;
  domain: 'admission_policy' | 'educational_guidance';
  trustLevel:
    | 'official_fact'
    | 'observed_precedent_2026'
    | 'pending_official_notice'
    | 'independent_foundational'
    | 'practical_heuristic';
  prerequisites: string[];
  whyRecommended: string;
  resourceIds?: string[];
  disclaimer?: string;
  applicablePathways: Array<'admission_prep' | 'skill_dev' | 'both'>;
  minBaseline?: 'zero_terminal' | 'basic_programming' | 'intermediate_scripting_networking';
}

const ADMISSION_CONFIRMED_TASKS: TaskTemplate[] = [
  {
    id: "adm-req-eligibility-check",
    title: "Official Eligibility & Regulation Verification",
    description: "Verify Class 12 PCM completion or ongoing study, check maximum attempt rules, and note the strict institutional degree-awarding structure (IIT Kanpur degree for IITK students; IIT Madras degree for IITM students).",
    estimatedHours: 2,
    category: "confirmed_admission_requirement",
    domain: "admission_policy",
    trustLevel: "official_fact",
    prerequisites: ["None"],
    whyRecommended: "Ensures you are compliant with confirmed institutional criteria before investing preparation effort.",
    disclaimer: "Based on confirmed IIT Kanpur Senate policies and published 2026 guidelines. Future eligibility criteria for 2027 are subject to official notification.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-req-jee-discontinuation-tracking",
    title: "Official Notification & Test Portal Monitoring",
    description: "Establish a weekly routine to monitor the official IIT Kanpur WSAIS portal (iitk.ac.in/wsais/b-cyber.php). Remember that JEE Main is officially discontinued for future B.Cyber admissions per FAQ 23.",
    estimatedHours: 1.5,
    category: "confirmed_admission_requirement",
    domain: "admission_policy",
    trustLevel: "official_fact",
    prerequisites: ["Internet access"],
    whyRecommended: "IIT Kanpur has officially stated that a separate entrance test will be announced. Staying alert to official portal updates avoids reliance on unverified rumors.",
    disclaimer: "Official Fact: JEE Main will not be used for future admissions. Format and date of the replacement test remain unannounced.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-req-academic-records-organization",
    title: "Academic Transcript & Identification Dossier Assembly",
    description: "Collate official Class 10 and Class 12 mark sheets, government identification, and caste/category certificates (if applicable) in verifiable digital format.",
    estimatedHours: 2.5,
    category: "confirmed_admission_requirement",
    domain: "admission_policy",
    trustLevel: "official_fact",
    prerequisites: ["Academic mark sheets"],
    whyRecommended: "Institutional admission screening requires prompt submission of verified identity and academic credentials.",
    disclaimer: "Required institutional documentation for admission verification.",
    applicablePathways: ["admission_prep", "both"],
  },
];

const ADMISSION_PROVISIONAL_PREP_TASKS: TaskTemplate[] = [
  {
    id: "adm-prov-discrete-logic",
    title: "Independent Foundational Logic & Discrete Problem Solving",
    description: "Practice formal propositional logic, set theory, truth tables, and Boolean algebra through standard mathematical logic textbooks or open academic lecture notes.",
    estimatedHours: 8,
    category: "independent_provisional_prep",
    domain: "educational_guidance",
    trustLevel: "practical_heuristic",
    prerequisites: ["Basic high-school mathematics"],
    whyRecommended: "Builds rigorous analytical and structured deductive reasoning valuable for computing systems.",
    disclaimer: "Provisional Foundational Guidance — Recommended by B.Cyber Compass as general problem-solving preparation. IIT Kanpur has NOT announced the official test syllabus. This module does not represent or guarantee test content.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-prov-computing-architecture-basics",
    title: "Foundational Computing Architecture & Binary Arithmetic",
    description: "Study positional number systems (binary, octal, hexadecimal), bitwise operations (AND, OR, XOR, shifts), and von Neumann architecture principles.",
    estimatedHours: 6,
    category: "independent_provisional_prep",
    domain: "educational_guidance",
    trustLevel: "practical_heuristic",
    prerequisites: ["High-school mathematics"],
    whyRecommended: "Computing architecture fundamentals provide the cognitive foundation needed to understand low-level security concepts.",
    disclaimer: "Provisional Foundational Guidance — Recommended by B.Cyber Compass as general problem-solving preparation. IIT Kanpur has NOT announced the official test syllabus. This module does not represent or guarantee test content.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-prov-algorithmic-thinking",
    title: "Algorithmic Problem Decomposition & Pseudocode Reasoning",
    description: "Practice decomposing algorithmic problems into sequential steps, loop invariants, sorting methods, and recursion traces using pen and paper.",
    estimatedHours: 7,
    category: "independent_provisional_prep",
    domain: "educational_guidance",
    trustLevel: "practical_heuristic",
    prerequisites: ["Basic logic"],
    whyRecommended: "Sharpens systematic problem decomposition without tying preparation to any specific programming language.",
    disclaimer: "Provisional Foundational Guidance — Recommended by B.Cyber Compass as general problem-solving preparation. IIT Kanpur has NOT announced the official test syllabus. This module does not represent or guarantee test content.",
    applicablePathways: ["admission_prep", "both"],
  },
];

const ADMISSION_EVIDENCE_ALIGNMENT_TASKS: TaskTemplate[] = [
  {
    id: "adm-evid-faq22-standards-audit",
    title: "Evidence of Prior Work Audit (FAQ 22 Alignment)",
    description: "Review your existing technical work against official FAQ 22 standards: reported vulnerabilities, developed tools/products, open-source commits, or verifiable technical writeups. Eliminate certificate hoarding.",
    estimatedHours: 3,
    category: "published_evidence_alignment",
    domain: "admission_policy",
    trustLevel: "official_fact",
    prerequisites: ["Any prior technical artifacts"],
    whyRecommended: "IIT Kanpur explicitly evaluates 'evidence of any prior work done in the domain of cybersecurity' during screening.",
    disclaimer: "Preparation aligned with IIT Kanpur's published criteria for verifiable prior work (FAQ 22). Does NOT guarantee eligibility, shortlisting, or admission.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-evid-portfolio-repo-scaffolding",
    title: "Verifiable Public Portfolio Repository Structuring",
    description: "Create a clean, well-documented public GitHub repository containing reproducible code, explicit licensing, architecture diagrams, and comprehensive README documentation.",
    estimatedHours: 5,
    category: "published_evidence_alignment",
    domain: "educational_guidance",
    trustLevel: "practical_heuristic",
    prerequisites: ["Basic Git knowledge or GitHub web interface"],
    whyRecommended: "Academic evaluation panels prioritize work that can be quickly independently inspected and executed.",
    disclaimer: "Preparation aligned with IIT Kanpur's published criteria for verifiable prior work (FAQ 22). Does NOT guarantee eligibility, shortlisting, or admission.",
    applicablePathways: ["admission_prep", "both"],
  },
  {
    id: "adm-evid-technical-writeup-curation",
    title: "Deep Technical Writeup & Incident Breakdown Documentation",
    description: "Draft a clear, rigorous markdown writeup explaining the root cause, exploit mechanism, mitigation, and remediation of a specific technical challenge or vulnerability.",
    estimatedHours: 6,
    category: "published_evidence_alignment",
    domain: "educational_guidance",
    trustLevel: "practical_heuristic",
    prerequisites: ["Analysis of a security challenge or project"],
    whyRecommended: "Demonstrates clear technical communication, systematic root-cause diagnosis, and intellectual honesty.",
    disclaimer: "Preparation aligned with IIT Kanpur's published criteria for verifiable prior work (FAQ 22). Does NOT guarantee eligibility, shortlisting, or admission.",
    applicablePathways: ["admission_prep", "both"],
  },
];

const SKILL_DEV_TASKS: TaskTemplate[] = [
  {
    id: "sk-bandit-linux-cli",
    title: "Linux Command Line Foundations (OverTheWire Bandit)",
    description: "Solve Levels 0 through 15 of OverTheWire Bandit using SSH, standard input/output streams, file permissions, pipes, and text processing utilities (grep, find, cut, tr).",
    estimatedHours: 10,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Basic terminal access (SSH client)"],
    whyRecommended: "Operating system fluency is the cornerstone of cybersecurity. Terminal navigation must be second nature.",
    resourceIds: ["res-otw-bandit"],
    disclaimer: "Independent educational wargame. Not part of any official entrance test syllabus.",
    applicablePathways: ["skill_dev", "both"],
  },
  {
    id: "sk-networking-beej-sockets",
    title: "Low-Level Network Protocols & Socket Programming",
    description: "Work through Chapters 1-6 of Beej's Guide to Network Programming. Implement basic TCP client-server communications and observe network frames with packet analyzers.",
    estimatedHours: 12,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Basic Python or C programming"],
    whyRecommended: "Security vulnerabilities often stem from misunderstandings of protocol boundaries, byte endianness, and socket buffers.",
    resourceIds: ["res-beej-network"],
    disclaimer: "Independent technical programming guide. Not part of any official entrance test syllabus.",
    applicablePathways: ["skill_dev", "both"],
  },
  {
    id: "sk-web-portswigger-apprentice",
    title: "Web Security Fundamentals (PortSwigger Academy)",
    description: "Complete the Apprentice labs for SQL Injection, Cross-Site Scripting (XSS), and Authentication mechanisms using Burp Suite community edition.",
    estimatedHours: 15,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Understanding of HTTP request/response flow"],
    whyRecommended: "Web applications represent the most accessible and prevalent attack surface in practical software engineering.",
    resourceIds: ["res-portswigger-academy"],
    disclaimer: "Independent interactive learning academy. Not part of any official entrance test syllabus.",
    applicablePathways: ["skill_dev", "both"],
  },
  {
    id: "sk-crypto-cyberchef-analysis",
    title: "Encoding, Hashing & Applied Cryptography (CyberChef)",
    description: "Explore cryptographic transformations, modular arithmetic, symmetric block ciphers, and hash functions using CyberChef recipes.",
    estimatedHours: 6,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Basic binary arithmetic"],
    whyRecommended: "Essential for data integrity verification and decoding obscured network payloads.",
    resourceIds: ["res-cyberchef"],
    disclaimer: "Independent open-source utility. Not part of any official entrance test syllabus.",
    applicablePathways: ["skill_dev", "both"],
  },
  {
    id: "sk-picoctf-problem-solving",
    title: "Hands-on CTF Problem Solving (PicoCTF Practice)",
    description: "Solve 10 diverse challenge problems in PicoCTF across Forensics, Cryptography, and General Skills. Write reproducible solution scripts for each.",
    estimatedHours: 12,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Command-line familiarity", "Basic scripting"],
    whyRecommended: "Cultivates tenacity, out-of-the-box thinking, and reverse engineering intuition.",
    resourceIds: ["res-picoctf"],
    disclaimer: "Independent academic CTF training platform. Not part of any official entrance test syllabus.",
    applicablePathways: ["skill_dev", "both"],
  },
  {
    id: "sk-original-security-tool",
    title: "Original Security Tool or Automation Script Project",
    description: "Design and implement a standalone utility in Python or Go (e.g., custom sub-domain monitor, port scanner with banner grabbing, or log parsing engine) with unit tests and clear documentation.",
    estimatedHours: 16,
    category: "technical_skill_development",
    domain: "educational_guidance",
    trustLevel: "independent_foundational",
    prerequisites: ["Python or Go scripting", "Networking basics"],
    whyRecommended: "Building original software provides undeniable proof of engineering competence and satisfies evidence-of-work standards.",
    disclaimer: "Independent project guidance. Demonstrates engineering capability; does not guarantee admission.",
    applicablePathways: ["skill_dev", "both"],
  },
];

// =============================================================================
// Schedule Packing & Phase Generation Helpers
// =============================================================================

function selectTasksForInputs(inputs: DiagnosticInputs): PlanTaskItem[] {
  const selected: PlanTaskItem[] = [];

  const mapToPlanTask = (t: TaskTemplate): PlanTaskItem => ({
    id: t.id,
    title: t.title,
    description: t.description,
    estimatedHours: t.estimatedHours,
    category: t.category,
    domain: t.domain,
    trustLevel: t.trustLevel,
    prerequisites: t.prerequisites,
    whyRecommended: t.whyRecommended,
    resourceIds: t.resourceIds,
    disclaimer: t.disclaimer,
  });

  if (inputs.selectedPathway === 'admission_prep') {
    // STRICT INVARIANT: No Bandit or external hands-on labs in admission-only plans!
    ADMISSION_CONFIRMED_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
    ADMISSION_PROVISIONAL_PREP_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
    ADMISSION_EVIDENCE_ALIGNMENT_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
  } else if (inputs.selectedPathway === 'skill_dev') {
    // Skill development pathway: hands-on labs
    SKILL_DEV_TASKS.forEach(t => {
      // If user is already intermediate, we might trim introductory bandit or reduce its priority
      if (inputs.technicalBaseline === 'intermediate_scripting_networking' && t.id === 'sk-bandit-linux-cli') {
        selected.push({
          ...mapToPlanTask(t),
          title: "Advanced Linux Systems & Shell Scripting Review",
          description: "Review advanced bash scripting, process management, and permissions auditing in OverTheWire Bandit Levels 15-34.",
          estimatedHours: 6,
        });
      } else {
        selected.push(mapToPlanTask(t));
      }
    });
    // Add portfolio structuring so they can package their skills
    ADMISSION_EVIDENCE_ALIGNMENT_TASKS.forEach(t => {
      if (t.id === 'adm-evid-portfolio-repo-scaffolding') {
        selected.push(mapToPlanTask(t));
      }
    });
  } else {
    // Both pathways: Combined roadmap with dynamic balancing based on primary goal
    ADMISSION_CONFIRMED_TASKS.forEach(t => selected.push(mapToPlanTask(t)));

    if (inputs.primaryGoal === 'bcyber_admission') {
      // Prioritize admission requirements and evidence
      ADMISSION_PROVISIONAL_PREP_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
      ADMISSION_EVIDENCE_ALIGNMENT_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
      // Add foundational skill labs
      SKILL_DEV_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
    } else {
      // Prioritize technical skills first
      SKILL_DEV_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
      ADMISSION_EVIDENCE_ALIGNMENT_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
      ADMISSION_PROVISIONAL_PREP_TASKS.forEach(t => selected.push(mapToPlanTask(t)));
    }
  }

  return selected;
}

function organizePhases(
  tasks: PlanTaskItem[],
  totalWeeks: number,
  pathway: DiagnosticInputs['selectedPathway']
): PlanPhase[] {
  const phaseCount = totalWeeks <= 12 ? 3 : 4;
  const weeksPerPhase = Math.floor(totalWeeks / phaseCount);

  const phases: PlanPhase[] = [];

  if (phaseCount === 3) {
    // 3-Phase Structure
    const p1Tasks = tasks.filter(t =>
      t.category === 'confirmed_admission_requirement' ||
      t.id.includes('bandit') ||
      t.id.includes('logic') ||
      t.id.includes('eligibility')
    );
    const p2Tasks = tasks.filter(t =>
      (t.category === 'technical_skill_development' && !t.id.includes('bandit')) ||
      t.id.includes('computing') ||
      t.id.includes('algorithmic')
    );
    const p3Tasks = tasks.filter(t =>
      t.category === 'published_evidence_alignment' ||
      t.id.includes('portfolio') ||
      t.id.includes('writeup') ||
      t.id.includes('original-security-tool')
    );

    phases.push({
      id: 'phase-1',
      phaseNumber: 1,
      title: pathway === 'skill_dev' ? 'Foundational CLI & Systems Setup' : 'Baseline Compliance & Foundations',
      weekRange: [1, weeksPerPhase],
      focusArea: 'Establish verified baseline, regulatory understanding, and core reasoning tools.',
      tasks: p1Tasks.length > 0 ? p1Tasks : tasks.slice(0, 3),
      milestoneDefinitionOfDone: 'All prerequisite documentation verified; core logical/terminal baseline certified.',
    });

    phases.push({
      id: 'phase-2',
      phaseNumber: 2,
      title: pathway === 'admission_prep' ? 'Structured Analytical Reasoning' : 'Core Protocol & Application Security',
      weekRange: [weeksPerPhase + 1, weeksPerPhase * 2],
      focusArea: 'Deepen core competencies in networking, web mechanics, and systematic analysis.',
      tasks: p2Tasks.length > 0 ? p2Tasks : tasks.slice(3, 6),
      milestoneDefinitionOfDone: 'Completed hands-on labs and analytical modules with documented solution notes.',
    });

    phases.push({
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Evidence Assembly & Portfolio Curation',
      weekRange: [weeksPerPhase * 2 + 1, totalWeeks],
      focusArea: 'Synthesize learning into verifiable public evidence of prior work (FAQ 22 standards).',
      tasks: p3Tasks.length > 0 ? p3Tasks : tasks.slice(6),
      milestoneDefinitionOfDone: 'Public repository published with clear technical writeup and verifiable demonstrations.',
    });
  } else {
    // 4-Phase Structure (24 or 48 weeks)
    const chunkSize = Math.ceil(tasks.length / 4);
    const p1 = tasks.slice(0, chunkSize);
    const p2 = tasks.slice(chunkSize, chunkSize * 2);
    const p3 = tasks.slice(chunkSize * 2, chunkSize * 3);
    const p4 = tasks.slice(chunkSize * 3);

    phases.push({
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Institutional Baseline & Systems Orientation',
      weekRange: [1, weeksPerPhase],
      focusArea: 'Policy grounding, system requirements check, and fundamental operational tools.',
      tasks: p1,
      milestoneDefinitionOfDone: 'Baseline criteria verified and foundational environment ready.',
    });
    phases.push({
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Deep Protocol & Security Mechanics',
      weekRange: [weeksPerPhase + 1, weeksPerPhase * 2],
      focusArea: 'Networking models, protocol boundaries, and structured problem solving.',
      tasks: p2,
      milestoneDefinitionOfDone: 'Intermediate technical challenges solved and documented.',
    });
    phases.push({
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Advanced Technical Labs & Tool Development',
      weekRange: [weeksPerPhase * 2 + 1, weeksPerPhase * 3],
      focusArea: 'Application vulnerabilities, cryptography exploration, and tool creation.',
      tasks: p3,
      milestoneDefinitionOfDone: 'Original tool or deep analysis published in personal repository.',
    });
    phases.push({
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Evidence-of-Work Dossier & Final Audit',
      weekRange: [weeksPerPhase * 3 + 1, totalWeeks],
      focusArea: 'Comprehensive review against FAQ 22 standards and technical communication polish.',
      tasks: p4,
      milestoneDefinitionOfDone: 'Verifiable evidence package complete and ready for academic submission.',
    });
  }

  return phases;
}

function buildWeeklySchedule(
  tasks: PlanTaskItem[],
  totalWeeks: number,
  weeklyHours: number
): { schedule: WeeklyScheduleSlot[]; tradeOffs: string[] } {
  const schedule: WeeklyScheduleSlot[] = [];
  const tradeOffs: string[] = [];

  // Duration packing across weeks
  let currentTaskIdx = 0;
  let remainingTaskHours = tasks[0]?.estimatedHours || 0;

  for (let week = 1; week <= totalWeeks; week++) {
    let weekCapacity = weeklyHours;
    const weekSlots: ScheduledTaskSlot[] = [];

    while (weekCapacity > 0.5 && currentTaskIdx < tasks.length) {
      const task = tasks[currentTaskIdx];
      const hoursToAlloc = Math.min(weekCapacity, remainingTaskHours);

      if (hoursToAlloc > 0) {
        weekSlots.push({
          taskId: task.id,
          title: task.title,
          allocatedHours: Math.round(hoursToAlloc * 10) / 10,
          category: task.category,
        });
        weekCapacity -= hoursToAlloc;
        remainingTaskHours -= hoursToAlloc;
      }

      if (remainingTaskHours <= 0.2) {
        currentTaskIdx++;
        if (currentTaskIdx < tasks.length) {
          remainingTaskHours = tasks[currentTaskIdx].estimatedHours;
        }
      }
    }

    let capacityExplanation: string | undefined;
    if (weekCapacity > 1.5 && currentTaskIdx >= tasks.length) {
      capacityExplanation = `You have ${Math.round(weekCapacity * 10) / 10} hours of buffer time this week for revision or deep exploration.`;
    }

    schedule.push({
      week,
      tasks: weekSlots,
      totalAllocatedHours: Math.round((weeklyHours - Math.max(0, weekCapacity)) * 10) / 10,
      capacityExplanation,
    });
  }

  // Generate capacity trade-off explanations
  if (currentTaskIdx < tasks.length) {
    const unallocatedTasks = tasks.slice(currentTaskIdx);
    const unallocatedHours = unallocatedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    tradeOffs.push(
      `At ${weeklyHours} hours/week over ${totalWeeks} weeks (total ${weeklyHours * totalWeeks}h capacity), ${unallocatedTasks.length} advanced tasks (approx. ${unallocatedHours}h) could not be fully scheduled. To include them, consider increasing weekly hours or extending the timeline.`
    );
  } else {
    tradeOffs.push(
      `All ${tasks.length} core planned modules fit comfortably within your ${weeklyHours}h/week budget over ${totalWeeks} weeks, allowing focused depth without burnout.`
    );
  }

  if (weeklyHours < 6) {
    tradeOffs.push(
      `With ${weeklyHours} hours/week, preparation focuses tightly on essentials. Complex labs and deep tool development are paced slowly across multiple weeks.`
    );
  } else if (weeklyHours >= 15) {
    tradeOffs.push(
      `With ${weeklyHours} hours/week, your schedule enables accelerated pace and comprehensive coverage of both theoretical foundations and hands-on laboratory exercises.`
    );
  }

  return { schedule, tradeOffs };
}

// =============================================================================
// Main Deterministic Generator
// =============================================================================

export function generatePreparationPlan(inputs: DiagnosticInputs): GeneratedPlan {
  // Constrain weekly hours between 3 and 25
  const weeklyHours = Math.max(3, Math.min(25, inputs.availableWeeklyHours || 6));

  const totalWeeksMap: Record<DiagnosticInputs['targetTimelineMonths'], number> = {
    '3_months': 12,
    '6_months': 24,
    '12_months': 48,
  };
  const totalWeeks = totalWeeksMap[inputs.targetTimelineMonths] || 12;

  // 1. Select appropriate tasks
  const tasks = selectTasksForInputs(inputs);

  // 2. Organize tasks into coherent phases
  const phases = organizePhases(tasks, totalWeeks, inputs.selectedPathway);

  // 3. Dynamically pack weekly slots respecting available hours
  const { schedule, tradeOffs } = buildWeeklySchedule(tasks, totalWeeks, weeklyHours);

  // 4. Assemble mandatory disclaimers
  const disclaimers = [
    "B.Cyber Compass is an independent student-led research and planning tool. It is NOT affiliated with, sponsored by, or endorsed by IIT Kanpur or IIT Madras.",
    "No Admission Guarantee: Completion of this preparation plan or evidence-of-work guidance does NOT guarantee shortlisting, entrance-test success, or admission to the B.Cyber program.",
    "Discontinuation of JEE Main: Per official IIT Kanpur FAQ 23, JEE Main will not be used for future admissions. A separate entrance test will be announced. Details of test format, dates, and syllabus remain unconfirmed until official notification.",
    "Independent Educational Content: All wargames, programming guides, and practice platforms are independent third-party resources and do NOT constitute an official syllabus.",
    "Local Storage Notice: This plan is saved locally in your current browser. It does not sync across devices and will be reset if you clear your browser data or cookies.",
  ];

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    generatedAt: new Date().toISOString(),
    inputs: {
      ...inputs,
      availableWeeklyHours: weeklyHours,
    },
    phases,
    weeklySchedule: schedule,
    tradeOffExplanations: tradeOffs,
    disclaimers,
  };
}
