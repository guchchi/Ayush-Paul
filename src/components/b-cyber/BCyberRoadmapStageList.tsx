import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileCheck,
  Terminal,
  Network,
  Shield,
  Search,
  FolderGit2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useBCyberPlannerStore } from '../../lib/b-cyber-compass/store';
import { cn } from '../../lib/utils';

export interface StageItem {
  id: string;
  stageNumber: number;
  anchorId: string;
  title: string;
  subtitle: string;
  estimatedHours: string;
  colorClass: string;
  icon: React.ElementType;
  objective: string;
  prerequisites: string;
  deliverable: string;
  antiTrap: string;
  tasks: { id: string; label: string; detail: string }[];
}

const STAGES: StageItem[] = [
  {
    id: 'stage-0',
    stageNumber: 0,
    anchorId: 'stage-0',
    title: 'Baseline: Setup & Safe Practice',
    subtitle: 'Command-line readiness, virtualized lab setup & legal boundaries',
    estimatedHours: '10–15 Hours',
    colorClass: 'border-slate-300 bg-slate-50/60 text-slate-800',
    icon: Terminal,
    objective: 'Establish a safe, isolated Linux working environment without getting stuck in configuration rabbit holes.',
    prerequisites: 'Basic computer literacy (installing software, running a terminal).',
    deliverable: 'Functional local Linux environment (WSL2 or VirtualBox Ubuntu) + configured SSH client.',
    antiTrap: 'Setup Paralysis: Do not spend 3 weeks customizing Linux desktop themes or rice setups. Install standard Ubuntu and start typing commands.',
    tasks: [
      {
        id: 's0-t1',
        label: 'Deploy WSL2 (Windows) or VirtualBox Linux VM',
        detail: 'Set up an isolated Ubuntu 22.04/24.04 LTS instance with sudo privileges.',
      },
      {
        id: 's0-t2',
        label: 'Configure Command-Line Shell & Core Packages',
        detail: 'Install git, curl, wget, build-essential, and set up your preferred text editor (nano/vim/VS Code).',
      },
      {
        id: 's0-t3',
        label: 'Study Safe Testing & Indian Legal Boundaries (IT Act 2000)',
        detail: 'Understand unauthorized access rules, laboratory containment, and strict ethics before touching any testing tool.',
      },
      {
        id: 's0-t4',
        label: 'Create Personal Local Notes Repository',
        detail: 'Initialize a local git directory to record every command and cheatsheet from day one.',
      },
    ],
  },
  {
    id: 'stage-1',
    stageNumber: 1,
    anchorId: 'stage-1',
    title: 'Foundations: Linux, OS & Networking',
    subtitle: 'Terminal fluency, process lifecycle, TCP/IP & packet inspection',
    estimatedHours: '30–45 Hours',
    colorClass: 'border-blue-200 bg-blue-50/40 text-blue-900',
    icon: Network,
    objective: 'Master low-level operating system permissions and inspect live computer network packets using Wireshark.',
    prerequisites: 'Stage 0 setup completed.',
    deliverable: 'Complete OverTheWire Bandit Levels 0–15 + annotated raw HTTP/DNS PCAP file in Wireshark.',
    antiTrap: 'Pure Theory Trap: Do not read a 1000-page networking textbook end-to-end. Learn the TCP 3-way handshake, then immediately capture it in Wireshark.',
    tasks: [
      {
        id: 's1-t1',
        label: 'Solve OverTheWire: Bandit Levels 0 through 15',
        detail: 'Operate in pure SSH. Practice grep, find, cat, base64, file permissions (chmod/chown), and standard I/O redirection.',
      },
      {
        id: 's1-t2',
        label: 'Understand Linux Process Architecture & Sockets',
        detail: 'Inspect processes with ps, top, kill; understand file descriptors and standard signals.',
      },
      {
        id: 's1-t3',
        label: 'TCP/IP 3-Way Handshake & Protocol Dissection',
        detail: 'Inspect SYN, SYN-ACK, ACK sequence numbers, flags, and window sizing on real captures.',
      },
      {
        id: 's1-t4',
        label: 'Packet Analysis with Wireshark & tcpdump',
        detail: 'Capture local DNS queries and unencrypted HTTP traffic. Follow TCP streams and write basic display filters.',
      },
    ],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    anchorId: 'stage-2',
    title: 'Security Fundamentals: Web/API & Cryptography',
    subtitle: 'OWASP vulnerabilities, session tokens, hashing & cipher primitives',
    estimatedHours: '40–50 Hours',
    colorClass: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    icon: Shield,
    objective: 'Deconstruct modern web and API applications, discover classic injection vectors, and understand core crypto primitives.',
    prerequisites: 'Stage 1 Linux CLI & basic HTTP knowledge.',
    deliverable: 'Solve PortSwigger Apprentice labs for SQLi/XSS + write a Python Caesar/Vigenère/AES demo script.',
    antiTrap: 'Vulnerability Scanner Trap: Do not run automated scanners (e.g. Nessus/Acunetix) and claim you found bugs. Learn manual request tampering via Burp Suite.',
    tasks: [
      {
        id: 's2-t1',
        label: 'Configure Burp Suite Community & Browser Proxy',
        detail: 'Intercept, inspect, and modify HTTP GET and POST requests in real-time.',
      },
      {
        id: 's2-t2',
        label: 'PortSwigger Web Security Academy: Apprentice Labs',
        detail: 'Complete interactive hands-on labs for SQL Injection, Cross-Site Scripting (XSS), and Authentication bypass.',
      },
      {
        id: 's2-t3',
        label: 'Symmetric vs. Asymmetric Cryptography Fundamentals',
        detail: 'Understand AES, RSA, Diffie-Hellman key exchange, and public key infrastructure (PKI) certificates.',
      },
      {
        id: 's2-t4',
        label: 'Hashing vs. Encryption & Encoding in CyberChef',
        detail: 'Differentiate Base64 (encoding), SHA-256 (hashing), and AES (encryption). Practice byte-level transforms in CyberChef.',
      },
    ],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    anchorId: 'stage-3',
    title: 'Investigation: OSINT, Reversing & Threat Analysis',
    subtitle: 'Structured intelligence, binary anatomy, Ghidra & threat modeling',
    estimatedHours: '35–45 Hours',
    colorClass: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
    icon: Search,
    objective: 'Investigate open-source digital trails, inspect compiled ELF/PE binary structures, and model attacker techniques.',
    prerequisites: 'Stage 1 Linux & Stage 2 fundamental security knowledge.',
    deliverable: 'Write 2 reproducible technical writeups (1 Forensics/OSINT + 1 Reverse Engineering) on personal GitHub.',
    antiTrap: 'Copy-Paste Writeup Trap: Reading online CTF writeups without attempting the problem yourself yields zero transferable intuition. Struggle for at least 60 minutes before checking hints.',
    tasks: [
      {
        id: 's3-t1',
        label: 'Executable Anatomy (ELF & PE Header Fundamentals)',
        detail: 'Inspect binary sections (.text, .data, .rodata) using readelf, objdump, and strings.',
      },
      {
        id: 's3-t2',
        label: 'Introductory Disassembly with Ghidra or Cutter',
        detail: 'Open a simple crackme binary. Identify string references, follow conditional jumps (je/jne), and find the hardcoded key.',
      },
      {
        id: 's3-t3',
        label: 'Structured Open-Source Intelligence (OSINT)',
        detail: 'Learn passive domain recon, whois inspection, DNS certificate transparency logs, and Google dorking.',
      },
      {
        id: 's3-t4',
        label: 'Solve PicoCTF Forensics & Reverse Engineering Gym',
        detail: 'Complete 5 introductory binary challenges and document your logical steps in clean Markdown.',
      },
    ],
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    anchorId: 'stage-4',
    title: 'Application: Integrated Challenges & Evidence',
    subtitle: 'Multi-topic challenges, defensive reasoning & GitHub portfolio dossier',
    estimatedHours: '30–40 Hours',
    colorClass: 'border-purple-200 bg-purple-50/40 text-purple-900',
    icon: FolderGit2,
    objective: 'Synthesize cross-domain skills into verifiable public evidence of work aligned with FAQ 22 expectations.',
    prerequisites: 'Stages 0 through 3 completed.',
    deliverable: 'Documented GitHub repository containing 3 high-signal technical artifacts with reproducible commands.',
    antiTrap: 'Certificate Collector Trap: Generic course completion badges (Coursera/Udemy) carry near-zero signal. Verifiable code repositories and reproducible lab writeups are what evaluators inspect.',
    tasks: [
      {
        id: 's4-t1',
        label: 'Synthesize Multi-Domain CTF Challenges',
        detail: 'Solve comprehensive challenges linking network packet forensics with web exploitation or cryptography.',
      },
      {
        id: 's4-t2',
        label: 'Build a Practical Technical Utility in Python',
        detail: 'Create an automated tool (e.g. customized port scanner, PCAP credential extractor, or log anomaly detector).',
      },
      {
        id: 's4-t3',
        label: 'Document Technical Artifacts with Clear Readmes',
        detail: 'Include prerequisites, exact setup commands, example input/output snippets, and security remediation advice.',
      },
      {
        id: 's4-t4',
        label: 'Peer Review & Clarity Check ("I Can Explain This")',
        detail: 'Record a concise 3-minute video walkthrough or write an essay explaining your exploit/defense reasoning.',
      },
    ],
  },
];

export function BCyberRoadmapStageList() {
  const { completedTaskIds, toggleTaskCompletion } = useBCyberPlannerStore();
  const [expandedStageIds, setExpandedStageIds] = useState<Record<string, boolean>>({
    'stage-0': true,
    'stage-1': true,
    'stage-2': false,
    'stage-3': false,
    'stage-4': false,
  });

  const toggleExpand = (stageId: string) => {
    setExpandedStageIds((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stage Explanatory Banner */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Universal 5-Stage Tech Pipeline
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Free Actionable Learning Syllabus (Stages 0 to 4)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive checklists persist in your local browser storage. Complete checkpoints progressively.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
          Completed: <strong className="text-brand-primary">{completedTaskIds.length}</strong> / 20 tasks
        </div>
      </div>

      {/* Accordion Stages List */}
      <div className="space-y-4">
        {STAGES.map((stage) => {
          const isExpanded = !!expandedStageIds[stage.id];
          const Icon = stage.icon;
          const stageCompletedCount = stage.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
          const isAllCompleted = stageCompletedCount === stage.tasks.length;

          return (
            <div
              key={stage.id}
              id={stage.anchorId}
              className={cn(
                'rounded-2xl border transition-all scroll-mt-28 bg-white overflow-hidden shadow-xs',
                isExpanded ? 'border-slate-300 ring-1 ring-slate-200/70' : 'border-slate-200/80 hover:border-slate-300'
              )}
            >
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => toggleExpand(stage.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5',
                      stage.colorClass
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-brand-primary uppercase tracking-wider">
                        Stage {stage.stageNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">{stage.estimatedHours}</span>
                      {isAllCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Complete</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900">{stage.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{stage.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {stageCompletedCount}/{stage.tasks.length}
                  </span>
                  <div className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6">
                  {/* Strategic Specs Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        Objective
                      </span>
                      <p className="text-slate-800 leading-relaxed">{stage.objective}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        Prerequisites
                      </span>
                      <p className="text-slate-800 leading-relaxed">{stage.prerequisites}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 space-y-1">
                      <span className="font-bold text-brand-primary uppercase tracking-wider text-[10px] block flex items-center gap-1">
                        <FileCheck className="w-3 h-3" />
                        <span>Core Deliverable</span>
                      </span>
                      <p className="text-slate-900 font-medium leading-relaxed">{stage.deliverable}</p>
                    </div>
                  </div>

                  {/* Anti-Trap Warning Callout */}
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-950 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-amber-900">Anti-Trap Warning: </strong>
                      <span className="text-amber-900/90 leading-relaxed">{stage.antiTrap}</span>
                    </div>
                  </div>

                  {/* Actionable Checkpoints Task List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Hands-On Tasks &amp; Milestones ({stage.tasks.length} Checkpoints)
                    </span>
                    <div className="space-y-2">
                      {stage.tasks.map((task) => {
                        const isDone = completedTaskIds.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={cn(
                              'p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none',
                              isDone
                                ? 'bg-emerald-50/40 border-emerald-200/80'
                                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/40'
                            )}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-brand-primary"
                              aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                              )}
                            </button>

                            <div className="space-y-0.5">
                              <div
                                className={cn(
                                  'text-xs font-bold transition-colors',
                                  isDone ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                                )}
                              >
                                {task.label}
                              </div>
                              <p
                                className={cn(
                                  'text-[11px] leading-relaxed transition-colors',
                                  isDone ? 'text-emerald-800/70' : 'text-slate-500'
                                )}
                              >
                                {task.detail}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
