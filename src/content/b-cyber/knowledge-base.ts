/**
 * B.Cyber Master Knowledge Base
 * Sourced directly from official IIT Kanpur WSAIS portal (https://iitk.ac.in/wsais/b-cyber.php),
 * Senate ordinances, and IIT Madras official launch notifications.
 */

export interface OfficialFAQ {
  id: number;
  question: string;
  answer: string;
  category: 'admissions' | 'curriculum' | 'internship_careers' | 'eligibility_rules';
  anchor: string;
  sourceUrl: string;
  highlights?: string[];
}

export interface CurriculumCourse {
  name: string;
  credits: number;
  type: 'core' | 'lab' | 'humanities' | 'elective';
  focus: string;
}

export interface CurriculumSemester {
  semesterNumber: number;
  title: string;
  phase: 'campus_foundations' | 'field_internship';
  totalCredits: string;
  description: string;
  courses: CurriculumCourse[];
}

export interface HackathonDomain {
  id: string;
  title: string;
  iconName: string;
  tagline: string;
  evaluatedSkills: string[];
  sampleChallenge: string;
  recommendedTools: string[];
  evaluationCriterion: string;
}

export interface ProofOfWorkItem {
  id: string;
  category: string;
  approvedPattern: {
    title: string;
    description: string;
    examples: string[];
  };
  rejectionPattern: {
    title: string;
    description: string;
    examples: string[];
  };
}

export const INSTITUTIONAL_CREDENTIALS = {
  degreeName: 'Bachelor of Cybersecurity (B.Cyber.)',
  institutions: [
    {
      name: 'IIT Kanpur',
      department: 'Wadhwani School of AI and Intelligent Systems (WSAIS) & C3iHub',
      portalUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
      conferredDegree: 'B.Cyber Degree & Alumni Status from IIT Kanpur',
    },
    {
      name: 'IIT Madras',
      department: 'Department of Computer Science & Engineering',
      portalUrl: 'https://iitk.ac.in/wsais/data/BCyber_IITM.pdf',
      conferredDegree: 'B.Cyber Degree & Alumni Status from IIT Madras',
    },
  ],
  ordinanceStatus: 'Approved by IIT Kanpur Senate',
  duration: '4 Years (Maximum 6 Years under Senate Ordinances)',
  academicStructure: '2 Years On-Campus Coursework + 2 Years Practical Internship',
};

export const PARADIGM_SHIFT_COMPARISON = [
  {
    parameter: 'Preliminary Screening Gate',
    cycle2026: 'Best JEE Main percentile (2025 or 2026) + FAQ 22 evidence of prior work.',
    cycle2027: 'JEE Main is officially DISCONTINUED (FAQ 23). A separate dedicated entrance test will be conducted.',
    isShift: true,
  },
  {
    parameter: 'Entrance Examination Format',
    cycle2026: 'No preliminary written test; direct shortlisting to on-campus hackathon.',
    cycle2027: 'Dedicated Entrance Examination to be announced by IIT Kanpur. Expected 5-stage selection funnel.',
    isShift: true,
  },
  {
    parameter: 'Entrance Syllabus Status',
    cycle2026: 'Relied on JEE Main NTA syllabus for PCM shortlisting.',
    cycle2027: 'Official syllabus details pending announcement by WSAIS. Coaching rumors of "leaked syllabus" are unfounded.',
    isShift: true,
  },
  {
    parameter: 'Role of Evidence of Prior Work (FAQ 22)',
    cycle2026: 'Used by the admissions committee alongside JEE score to select hackathon attendees.',
    cycle2027: 'Continues to be a mandatory component for verifiable proof-of-work and technical shortlisting.',
    isShift: false,
  },
  {
    parameter: 'Hands-on Hackathon Round',
    cycle2026: '6-Hour In-Person practical challenge at New Core Lab, IIT Kanpur campus.',
    cycle2027: 'Expected to remain the definitive in-person practical evaluation filter at IIT Kanpur.',
    isShift: false,
  },
  {
    parameter: 'Participating Institutes',
    cycle2026: 'IIT Kanpur & IIT Madras (admitted via joint 5th July test).',
    cycle2027: 'IIT Kanpur, IIT Madras, with active discussions on additional IITs joining the program.',
    isShift: true,
  },
];

export const CURRICULUM_DATA: CurriculumSemester[] = [
  {
    semesterNumber: 1,
    title: 'Semester 1: Foundations & Systems Primer',
    phase: 'campus_foundations',
    totalCredits: '51 Credits',
    description: 'Hardware abstractions, basic programming, data engineering, and hands-on malware inspection.',
    courses: [
      { name: 'Introduction to Electronics', credits: 14, type: 'core', focus: 'Circuit theory, logic gates, semiconductor fundamentals' },
      { name: 'Fundamentals of Computing', credits: 14, type: 'core', focus: 'Procedural programming, memory addressing, pointers in C' },
      { name: 'Fundamentals of Data Engineering (Data)', credits: 12, type: 'core', focus: 'Data pipelines, relational schemas, storage mechanics' },
      { name: 'Lab: Malware Analysis', credits: 8, type: 'lab', focus: 'Static and dynamic triage of malicious executables, sandboxing' },
      { name: 'Practical Ethics', credits: 3, type: 'humanities', focus: 'Cyber law, ethics of offensive research, responsible disclosure' },
    ],
  },
  {
    semesterNumber: 2,
    title: 'Semester 2: Cryptographic Foundations & Forensics',
    phase: 'campus_foundations',
    totalCredits: '50–54 Credits',
    description: 'Algorithmic problem-solving, mathematical ciphers, computer hardware, and digital forensics.',
    courses: [
      { name: 'Applied Cryptography', credits: 9, type: 'core', focus: 'Symmetric & asymmetric encryption, hashing, RSA/ECC, modular math' },
      { name: 'Data Structures and Algorithms (DSA)', credits: 12, type: 'core', focus: 'Asymptotic complexity, trees, graphs, sorting, memory layout' },
      { name: 'Computer Organization', credits: 12, type: 'core', focus: 'Assembly language, CPU registers, instruction sets, stack frames' },
      { name: 'Lab: Digital Forensics', credits: 8, type: 'lab', focus: 'Disk imaging, memory dump triage, file carvers, evidence chain of custody' },
      { name: 'Course from Predefined List', credits: 11, type: 'elective', focus: 'Approved mathematics or computing elective' },
    ],
  },
  {
    semesterNumber: 3,
    title: 'Semester 3: Operating Systems, Cloud & VAPT',
    phase: 'campus_foundations',
    totalCredits: '50 Credits',
    description: 'Kernel internals, systems operations, enterprise penetration testing, and cloud environments.',
    courses: [
      { name: 'Operating Systems', credits: 13, type: 'core', focus: 'Process management, concurrency, virtual memory, file system internals' },
      { name: 'Fundamentals of Data Engineering (Ops)', credits: 12, type: 'core', focus: 'Containerization, orchestration, stream pipelines, infrastructure ops' },
      { name: 'Lab: Cloud Computing & Security', credits: 8, type: 'lab', focus: 'IAM hardening, container escape vectors, cloud network security' },
      { name: 'Lab: Vulnerability Assessment & Pen Testing (VAPT)', credits: 8, type: 'lab', focus: 'Offensive web/network assessment, exploitation chains, reporting' },
      { name: 'Departmental Elective', credits: 9, type: 'elective', focus: 'Advanced security or computing elective course' },
    ],
  },
  {
    semesterNumber: 4,
    title: 'Semester 4: Network Architecture & Human Cognition',
    phase: 'campus_foundations',
    totalCredits: '48 Credits',
    description: 'Network protocols, web application vulnerabilities, and psychological factors in social engineering.',
    courses: [
      { name: 'Introduction to Psychology', credits: 11, type: 'humanities', focus: 'Cognitive biases, persuasion mechanisms, social engineering vectors' },
      { name: 'Computer Networks', credits: 9, type: 'core', focus: 'TCP/IP stack, routing protocols, DNS, TLS handshake, packet flow' },
      { name: 'Lab: Network & Web Application Security', credits: 8, type: 'lab', focus: 'Burp Suite intercept, OWASP Top 10, SQLi, XSS, SSRF, packet dissection' },
      { name: 'Two Courses from Predefined List', credits: 18, type: 'elective', focus: 'Specialized security domains and advanced electives (9 + 9 credits)' },
    ],
  },
  {
    semesterNumber: 5,
    title: 'Semesters 5 to 8: Field Deployment & Practical Internship',
    phase: 'field_internship',
    totalCredits: '216 Credits (54 Credits / Semester)',
    description: 'Two full years stationed at selected government organizations, defense units, CERT-In, NCIIPC, or mission-critical infrastructure.',
    courses: [
      { name: 'Semester 5 Practical Internship', credits: 54, type: 'core', focus: 'Full-time field deployment with host organization' },
      { name: 'Semester 6 Practical Internship', credits: 54, type: 'core', focus: 'Full-time field deployment with host organization' },
      { name: 'Semester 7 Practical Internship', credits: 54, type: 'core', focus: 'Full-time field deployment with host organization' },
      { name: 'Semester 8 Practical Internship', credits: 54, type: 'core', focus: 'Full-time field deployment with host organization' },
    ],
  },
];

export const SENATE_EXIT_OPTIONS = [
  {
    creditsRequired: 150,
    title: 'Certificate in Cybersecurity',
    description: 'Permitted early exit upon successful completion of 150 approved Senate credits.',
    status: 'Official Senate Ordinance',
  },
  {
    creditsRequired: 200,
    title: 'Diploma in Cybersecurity',
    description: 'Permitted early exit upon successful completion of 200 approved Senate credits.',
    status: 'Official Senate Ordinance',
  },
  {
    creditsRequired: 365,
    title: 'Bachelor of Cybersecurity (B.Cyber.) Degree',
    description: 'Conferred upon successful completion of all 4 years (coursework + 2-year field internship).',
    status: 'Full Undergraduate Degree',
  },
];

export const HACKATHON_DOMAINS: HackathonDomain[] = [
  {
    id: 'crypto',
    title: 'Applied Cryptography',
    iconName: 'KeyRound',
    tagline: 'Modular arithmetic, XOR ciphers, and key exchange mechanics',
    evaluatedSkills: ['Mathematical pattern recognition', 'Classical & modern cipher breakdown', 'Entropy analysis', 'Bitwise XOR operations'],
    sampleChallenge: 'Decrypt an encrypted communications dump by recovering the XOR key stream through frequency and byte repetition analysis.',
    recommendedTools: ['Python (PyCryptodome)', 'CyberChef', 'Hashcat'],
    evaluationCriterion: 'Analytical deduction without guessing. Understanding math behind encryption primitives.',
  },
  {
    id: 'web_sec',
    title: 'Web Application Security',
    iconName: 'Globe',
    tagline: 'Client-server trust boundaries and input sanitization bypasses',
    evaluatedSkills: ['OWASP Top 10 vectors', 'SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Server-Side Request Forgery (SSRF)'],
    sampleChallenge: 'Bypass a strict authentication portal by exploiting an unfiltered parameter vulnerability and exfiltrate database records.',
    recommendedTools: ['Burp Suite Community', 'Browser DevTools', 'curl', 'Postman'],
    evaluationCriterion: 'Ability to dissect HTTP requests, inspect headers, and trace data flow across application boundaries.',
  },
  {
    id: 'api_sec',
    title: 'API Security',
    iconName: 'Server',
    tagline: 'Broken object authorization and token manipulation',
    evaluatedSkills: ['BOLA / IDOR detection', 'JWT signature tampering', 'Rate limit bypasses', 'REST endpoint exploration'],
    sampleChallenge: 'Modify an insecure object identifier in a private REST endpoint to view another tenant’s sensitive security telemetry.',
    recommendedTools: ['Postman', 'Burp Suite', 'jwt.io', 'Python requests'],
    evaluationCriterion: 'Discipline in testing access-control logic rather than blindly firing automated payloads.',
  },
  {
    id: 'network_sec',
    title: 'Network Security & Packet Triage',
    iconName: 'Network',
    tagline: 'Deep packet inspection and protocol anomaly identification',
    evaluatedSkills: ['TCP 3-way handshake dissection', 'DNS tunneling recognition', 'ARP spoofing detection', 'Wireshark filter mastery'],
    sampleChallenge: 'Analyze a 50MB PCAP file to identify an exfiltrated sensitive file hidden within DNS queries over an untrusted link.',
    recommendedTools: ['Wireshark', 'tshark', 'tcpdump', 'Scapy'],
    evaluationCriterion: 'Command over low-level protocols (IP, TCP, UDP, ICMP) and rapid filtering under time pressure.',
  },
  {
    id: 'reverse_eng',
    title: 'Reverse Engineering',
    iconName: 'Binary',
    tagline: 'Decompilation, binary triage, and control-flow tracing',
    evaluatedSkills: ['x86/x64 assembly reading', 'GDB breakpoint management', 'ELF / PE header triage', 'Decompilation in Ghidra'],
    sampleChallenge: 'Inspect a stripped Linux binary, locate the hardcoded validation logic, and reverse-engineer the correct passkey.',
    recommendedTools: ['GDB (with GEF/pwndbg)', 'Ghidra', 'strings', 'objdump', 'radare2'],
    evaluationCriterion: 'Patience and methodical disassembly reading rather than getting intimidated by assembly instructions.',
  },
  {
    id: 'osint',
    title: 'OSINT (Open-Source Intelligence)',
    iconName: 'Search',
    tagline: 'Digital footprint correlation and public metadata discovery',
    evaluatedSkills: ['Domain infrastructure mapping', 'Certificate transparency log searching', 'Metadata extraction', 'Correlating indicators'],
    sampleChallenge: 'Discover the hidden staging IP address of an adversary infrastructure from public SSL certificate history and DNS trails.',
    recommendedTools: ['crt.sh', 'whois', 'dig', 'ExifTool', 'Wayback Machine'],
    evaluationCriterion: 'Deductive reasoning and verifying information from multiple public data sources.',
  },
  {
    id: 'os_internals',
    title: 'Operating Systems (Linux & Windows)',
    iconName: 'Terminal',
    tagline: 'Kernel fundamentals, permissions, and process introspection',
    evaluatedSkills: ['Linux terminal fluency', 'File descriptor permissions', 'Cron job inspection', 'Windows Event Log analysis'],
    sampleChallenge: 'Navigate a heavily restricted Linux terminal environment, locate misconfigured SUID binaries, and inspect sensitive files.',
    recommendedTools: ['Bash', 'PowerShell', 'find', 'lsof', 'strace'],
    evaluationCriterion: 'Confidence inside a pure terminal environment without reliance on graphical user interfaces.',
  },
  {
    id: 'malware_threat',
    title: 'Malware & Threat Analysis',
    iconName: 'ShieldAlert',
    tagline: 'Static signature detection and behavioral sandbox heuristics',
    evaluatedSkills: ['String extraction & decoding', 'PE section inspection', 'Indicators of Compromise (IoC) extraction', 'Basic behavioral analysis'],
    sampleChallenge: 'Triage a suspicious executable, extract its command-and-control server domains, and classify its persistence mechanism.',
    recommendedTools: ['PE-bear', 'FLOSS', 'YARA', 'Procmon', 'CyberChef'],
    evaluationCriterion: 'Safety awareness in handling artifacts and identifying malicious signatures methodically.',
  },
];

export const PROOF_OF_WORK_STANDARDS: ProofOfWorkItem[] = [
  {
    id: 'vuln_disclosure',
    category: 'Vulnerability Disclosures & Bug Bounties',
    approvedPattern: {
      title: 'Responsible Disclosures & Hall of Fame Acknowledgments',
      description: 'Public or private security disclosures made through established responsible disclosure programs (NCIIPC, Bugcrowd, HackerOne, or academic platforms).',
      examples: [
        'Documented advisory URL or Hall of Fame acknowledgment link',
        'Concise technical writeup explaining root-cause vulnerability logic (e.g. IDOR, SSRF)',
        'Redacted sensitive domain details respecting responsible disclosure policies',
      ],
    },
    rejectionPattern: {
      title: 'Automated Scanner Spam & Low-Impact Header Flags',
      description: 'Submitting unauthenticated automated vulnerability scanner outputs claiming low-impact findings as critical bugs.',
      examples: [
        'Reporting missing X-Frame-Options or HSTS security headers',
        'Reporting SSL ciphers without practical exploitable impact',
        'Publicly leaking unpatched vulnerabilities violating ethics',
      ],
    },
  },
  {
    id: 'tools_code',
    category: 'Original Security Tools & Mini-Utilities',
    approvedPattern: {
      title: 'Original Git Repositories with Active Commit History',
      description: 'Functional utilities written in Python, C, or Go solving concrete networking, packet parsing, or cryptographic tasks.',
      examples: [
        'Public GitHub/GitLab link with multi-month active commit history',
        'Comprehensive README.md detailing architecture, setup steps, and test outputs',
        'Clean, commented code demonstrating grasp of sockets, threads, or raw packet parsing',
      ],
    },
    rejectionPattern: {
      title: 'Cloned Tools with Cosmetic Readme Changes',
      description: 'Forking popular open-source tools (like sqlmap, nmap, or john) and making minor changes.',
      examples: [
        'Single-commit repository uploading copied code from internet blogs',
        'Massive bloated web templates where security is just an afterthought',
        'Non-functional code snippets without execution instructions',
      ],
    },
  },
  {
    id: 'oss_contributions',
    category: 'Open-Source Project Contributions',
    approvedPattern: {
      title: 'Merged Pull Requests in Recognized Security Projects',
      description: 'Verifiable contributions that fixed bugs, improved performance, or added features to open-source tools.',
      examples: [
        'Direct link to merged Pull Request on GitHub/GitLab',
        'Discussion thread showing constructive technical review interaction',
        'Demonstrated grasp of version control workflows and project testing standards',
      ],
    },
    rejectionPattern: {
      title: 'Trivial Typo Edits purely to inflate commit numbers',
      description: 'Submitting single-character README typo fixes to claim open-source security expertise.',
      examples: [
        'Unmerged, closed, or rejected pull requests',
        'Automated bot-generated contributions',
        'Cosmetic whitespace formatting pull requests',
      ],
    },
  },
  {
    id: 'ctf_writeups',
    category: 'Methodical CTF & Lab Writeups',
    approvedPattern: {
      title: 'Deep Problem-Solving Notes with Hypothesis Testing',
      description: 'Original technical writeups breaking down non-trivial CTF challenges, showing initial hypotheses, terminal logs, and lessons learned.',
      examples: [
        'Documenting failed attempts, why they failed, and the breakthrough logic',
        'Including Wireshark packet snippets or terminal command logs',
        'Explaining the underlying vulnerability concept, not just copy-pasting the flag string',
      ],
    },
    rejectionPattern: {
      title: 'Generic Certificates of Completion & Flag Dumps',
      description: 'Submitting paid video course certificates (Coursera, Udemy) or flag lists without technical reasoning.',
      examples: [
        'Course completion certificates from commercial tutorial websites',
        'Copy-pasting walkthrough text from Google search results',
        'Providing flag strings without any code or explanation',
      ],
    },
  },
];

export const OFFICIAL_FAQS: OfficialFAQ[] = [
  {
    id: 1,
    question: 'What is the Bachelors in Cybersecurity (B.Cyber.) program?',
    answer: 'The Bachelor of Cybersecurity (B.Cyber.) is a 4-year practice-oriented undergraduate degree program initiated by the Wadhwani School of AI and Intelligent Systems (WSAIS) at IIT Kanpur, focusing on deep, practical cybersecurity capabilities.',
    category: 'admissions',
    anchor: 'faqCollapse1',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 2,
    question: 'Why has IIT Kanpur introduced this program?',
    answer: 'To build high-consequence national capability in defending critical digital infrastructure, cyber forensics, secure AI systems, and national cyber defense. (See the Director’s Address for the full institutional vision).',
    category: 'admissions',
    anchor: 'faqCollapse2',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 3,
    question: 'What is the eligibility criteria?',
    answer: 'Class 12th or equivalent with Physics, Chemistry, and Mathematics (PCM); minimum 5 subjects. Born on or after October 1, 2001 (5-year relaxation for SC/ST/PwD: October 1, 1996). Indian nationals only. Maximum 2 consecutive attempts. Candidates from NIOS are eligible.',
    category: 'eligibility_rules',
    anchor: 'faqCollapse3',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 4,
    question: 'What is the curriculum of the program?',
    answer: 'The program comprises 2 years of intensive coursework and laboratory training at IIT Kanpur, followed by 2 years of field deployment/internship primarily at selected government organizations.',
    category: 'curriculum',
    anchor: 'faqCollapse4',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 5,
    question: 'Is the curriculum approved by the IIT Kanpur Senate?',
    answer: 'Yes. The B.Cyber curriculum and degree ordinances are officially approved by the IIT Kanpur Senate.',
    category: 'curriculum',
    anchor: 'faqCollapse5',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 6,
    question: 'How are the faculty members in WSAIS?',
    answer: 'WSAIS has a highly qualified faculty with expertise spanning cybersecurity, artificial intelligence, machine learning, algorithms, robotics, control systems, optimisation, computer vision, data science, and intelligent decision-making.',
    category: 'curriculum',
    anchor: 'faqCollapse6',
    sourceUrl: 'https://iitk.ac.in/wsais/faculty.php',
  },
  {
    id: 7,
    question: 'What kind of learning experience can students expect?',
    answer: 'Students will receive rigorous academic training through courses in computing, data engineering, operating systems, cloud computing, cybersecurity, and related areas. The program also includes extensive hands-on laboratory work and a two-year internship component.',
    category: 'curriculum',
    anchor: 'faqCollapse7',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 8,
    question: 'How will placements compare with other undergraduate programs at IIT Kanpur?',
    answer: 'It is premature to comment on this at this stage. However, we expect that good students from the program will get hired in relevant industries and government organizations working in high-impact cybersecurity.',
    category: 'internship_careers',
    anchor: 'faqCollapse8',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 9,
    question: 'What opportunities are available for higher studies?',
    answer: 'The B.Cyber degree will be equivalent to any regular 4-year degree of the institute, and hence students can certainly go for higher studies anywhere, including applying for Masters/PhD programs at IIT Kanpur or international universities.',
    category: 'internship_careers',
    anchor: 'faqCollapse9',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 10,
    question: 'Is there any early exit option available?',
    answer: 'Yes. Certificate in Cybersecurity: Permitted exit upon successful completion of 150 credits. Diploma in Cybersecurity: Permitted exit upon successful completion of 200 credits.',
    category: 'curriculum',
    anchor: 'faqCollapse10',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 11,
    question: 'What are the program fees?',
    answer: 'The fee structure is the same as that applicable to regular students of IIT Kanpur as published by DOSA. Standard fee waivers apply for SC/ST/PwD and economically weaker sections.',
    category: 'admissions',
    anchor: 'faqCollapse11',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 12,
    question: 'Can students change their branch?',
    answer: 'No. The entry to BTech programs is through JEE Advanced. Therefore B.Cyber students cannot change to other programs. (Even BTech students cannot enter B.Cyber program without qualifying the separate entrance test for this program).',
    category: 'eligibility_rules',
    anchor: 'faqCollapse12',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 13,
    question: 'Can students participate in placements along with students from other departments?',
    answer: 'No. Placement support will be provided by calling relevant organisations working specifically in the domain of Cybersecurity.',
    category: 'internship_careers',
    anchor: 'faqCollapse13',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 14,
    question: 'Will students receive a stipend during the internship period?',
    answer: 'Yes, most of them will get stipends. The amount may vary as per the policies of the organizations. The institute will try its best to send students to only those organizations where financial support is provided.',
    category: 'internship_careers',
    anchor: 'faqCollapse14',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 15,
    question: 'Which cybersecurity domains will students study?',
    answer: 'The curriculum spans Malware Analysis, Applied Cryptography, Digital Forensics, Operating Systems, Cloud Security, VAPT, Computer Networks, and Web Application Security.',
    category: 'curriculum',
    anchor: 'faqCollapse15',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 16,
    question: 'What degree will students receive upon successful completion of the program?',
    answer: 'Students who successfully complete all program requirements will be awarded a Bachelors in Cybersecurity (B.Cyber.) degree from IIT Kanpur (or IIT Madras if enrolled there).',
    category: 'admissions',
    anchor: 'faqCollapse16',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 17,
    question: 'Will graduates receive IIT Kanpur alumni status?',
    answer: 'Yes. Students who successfully complete the program will receive full IIT Kanpur alumni status.',
    category: 'admissions',
    anchor: 'faqCollapse17',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 18,
    question: 'Who should apply for this program?',
    answer: 'The program is designed for highly motivated students who have a strong interest in cybersecurity, ethical hacking, secure systems, digital infrastructure, and solving real-world security challenges.',
    category: 'admissions',
    anchor: 'faqCollapse18',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 19,
    question: 'Will students be considered regular IIT Kanpur students during the internship period?',
    answer: 'Yes, the students will be considered regular students of IIT Kanpur for the entire 4-year duration of their degree.',
    category: 'internship_careers',
    anchor: 'faqCollapse19',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 20,
    question: 'Will hostel accommodation be available for students enrolled in the B.Cyber program?',
    answer: 'Yes, the students of B.Cyber will be treated as any other student of IIT Kanpur with residential hostel facilities provided on campus.',
    category: 'eligibility_rules',
    anchor: 'faqCollapse20',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 21,
    question: 'Are candidates who appeared only for JEE Main Paper 2 (B.Arch/B.Planning) or candidates without Mathematics in Class XII eligible?',
    answer: 'No. Such candidates are not eligible for admission to the B.Cyber program. Class 12 Mathematics is strictly mandatory.',
    category: 'eligibility_rules',
    anchor: 'faqCollapse21',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 22,
    question: 'What qualifies as evidence of prior work in the domain of cybersecurity?',
    answer: 'This will include, but not limited to, reported vulnerabilities by candidates, cybersecurity projects/products developed by them, open-source contributions to cybersecurity projects, or other relevant accomplishments. The criticality and technical details of the vulnerabilities disclosed will be considered. The candidate will have to provide easily verifiable evidence of the work done.',
    category: 'eligibility_rules',
    anchor: 'faqCollapse22',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 23,
    question: 'Will the same admission process be followed for future admissions?',
    answer: 'JEE Mains will not be used. A separate entrance test will be announced, the details of which will be made available soon on the WSAIS portal.',
    category: 'admissions',
    anchor: 'faqCollapse23',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
    highlights: ['JEE Main Discontinued', 'Dedicated Separate Entrance Test Announced', 'Official Details Pending from IIT Kanpur'],
  },
  {
    id: 24,
    question: 'What is the syllabus of the admission test/hackathon?',
    answer: 'The hackathon/test will consist of challenges related to Web Security, API Security, OSINT, Reverse Engineering, Operating Systems (Linux and Windows), Cloud Security, Malware & Threat Analysis, and Reverse Engineering. Conducted on sanitized desktop systems monitored by IIT Kanpur experts.',
    category: 'curriculum',
    anchor: 'faqCollapse24',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 25,
    question: 'Is the application fee refundable?',
    answer: 'No. The application fee (₹3,200 for General/OBC male; ₹1,600 for Female, SC, ST, PwD) is strictly non-refundable and non-transferable under any circumstances.',
    category: 'admissions',
    anchor: 'faqCollapse25',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
  {
    id: 26,
    question: 'What should I do if I belong to EWS/OBC-NCL but do not currently have a valid certificate?',
    answer: 'Candidates who do not currently possess a valid category certificate may submit the prescribed undertaking during application. Any admission offer remains provisional until submission of the required certificate as per IIT Kanpur guidelines.',
    category: 'admissions',
    anchor: 'faqCollapse26',
    sourceUrl: 'https://iitk.ac.in/wsais/b-cyber.php',
  },
];
