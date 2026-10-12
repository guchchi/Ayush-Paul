import React, { useState } from 'react';
import {
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Terminal,
  Network,
  Shield,
  Binary,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CuratedTool {
  id: string;
  name: string;
  provider: string;
  url: string;
  stageNumber: number;
  domain: 'linux' | 'networking' | 'web' | 'cryptography' | 'reversing';
  domainLabel: string;
  accessBadge: string;
  accessColor: string;
  learningOutcome: string;
  timing: string;
  trapWarning: string;
}

const TOOLS_CATALOG: CuratedTool[] = [
  {
    id: 'otw-bandit',
    name: 'OverTheWire: Bandit Wargame',
    provider: 'OverTheWire Community',
    url: 'https://overthewire.org/wargames/bandit/',
    stageNumber: 1,
    domain: 'linux',
    domainLabel: 'Linux CLI & Terminal',
    accessBadge: 'Free · No Account Needed · Pure SSH',
    accessColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    learningOutcome: 'Command-line fluency, Linux filesystem navigation, file permissions (chmod/chown), pipes, and text filtering (grep, find, base64).',
    timing: 'Use during Stage 1. Solve Levels 0 through 15 before moving to networking.',
    trapWarning: 'Stop at Level 15. Do not get trapped spending weeks on advanced privilege escalation levels before mastering networking basics.',
  },
  {
    id: 'portswigger-academy',
    name: 'PortSwigger Web Security Academy',
    provider: 'PortSwigger (Burp Suite)',
    url: 'https://portswigger.net/web-security',
    stageNumber: 2,
    domain: 'web',
    domainLabel: 'Web & API Security',
    accessBadge: 'Free · Free Account Required · Browser Labs',
    accessColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    learningOutcome: 'Hands-on exploitation and defense of SQL Injection, Cross-Site Scripting (XSS), and Authentication flaws on safe live sandboxes.',
    timing: 'Use during Stage 2 after basic HTTP requests/responses and browser DevTools are understood.',
    trapWarning: 'Stick to the "Apprentice" tier labs first. Practicing Practitioner/Expert labs without cryptography fundamentals will cause burnout.',
  },
  {
    id: 'wireshark-captures',
    name: 'Wireshark Sample Captures Repository',
    provider: 'Wireshark Foundation',
    url: 'https://wiki.wireshark.org/SampleCaptures',
    stageNumber: 1,
    domain: 'networking',
    domainLabel: 'Packet Analysis & TCP/IP',
    accessBadge: 'Free · Local Software Install · PCAP Files',
    accessColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    learningOutcome: 'Dissecting live network protocol streams: TCP 3-way handshakes, DNS resolution queries, HTTP requests, and ARP broadcasts.',
    timing: 'Use during Stage 1 alongside Beej\'s networking guide.',
    trapWarning: 'Do not just stare at packet lists. Apply display filters (e.g. `http`, `dns`, `tcp.flags.syn==1`) and reconstruct the stream logic.',
  },
  {
    id: 'picoctf-gym',
    name: 'PicoCTF Practice Gymnasium',
    provider: 'Carnegie Mellon University (CMU)',
    url: 'https://picoctf.org/',
    stageNumber: 3,
    domain: 'reversing',
    domainLabel: 'Forensics & Reverse Engineering',
    accessBadge: 'Free · Free Account Required · Browser & CLI',
    accessColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    learningOutcome: 'Hands-on practice with binary headers, string extraction, basic assembly, file carving, and methodical tournament flag hunting.',
    timing: 'Use during Stage 3 for practicing introductory forensics and reverse engineering.',
    trapWarning: 'Resist looking at writeups immediately. Set a 45-minute timer to struggle and search documentation before checking hints.',
  },
  {
    id: 'beej-network',
    name: 'Beej\'s Guide to Network Programming',
    provider: 'Brian "Beej Jorgensen" Hall',
    url: 'https://beej.us/guide/bgnet/',
    stageNumber: 1,
    domain: 'networking',
    domainLabel: 'Socket Programming',
    accessBadge: 'Free · No Account Needed · Web Guide',
    accessColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    learningOutcome: 'Low-level socket programming fundamentals in C/Python, IP addressing, byte ordering (endianness), and message framing.',
    timing: 'Use during Stage 1 to understand what happens beneath the browser abstraction.',
    trapWarning: 'Read Chapters 1 through 6 only. Advanced non-blocking multiplexing (epoll) is not required for foundational readiness.',
  },
  {
    id: 'cyberchef',
    name: 'CyberChef (The Cyber Swiss Army Knife)',
    provider: 'GCHQ (Open Source)',
    url: 'https://gchq.github.io/CyberChef/',
    stageNumber: 2,
    domain: 'cryptography',
    domainLabel: 'Encoding & Cryptography',
    accessBadge: 'Free · No Account Needed · Pure Client-Side Web',
    accessColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    learningOutcome: 'Rapid multi-recipe transformations: Hex, Base64, URL encoding, XOR deciphering, hashing (MD5/SHA), and entropy analysis.',
    timing: 'Use during Stage 2 and Stage 3 for decoding nested data formats.',
    trapWarning: 'CyberChef is an analysis tool, not an exploit. Always understand the mathematical logic behind the cipher recipe you run.',
  },
  {
    id: 'tryhackme-presec',
    name: 'TryHackMe: Pre-Security Path',
    provider: 'TryHackMe',
    url: 'https://tryhackme.com/path/outline/pre-security',
    stageNumber: 0,
    domain: 'linux',
    domainLabel: 'Interactive Foundations',
    accessBadge: 'Freemium · Free Tier Available · Account Required',
    accessColor: 'bg-amber-50 text-amber-800 border-amber-200',
    learningOutcome: 'Interactive browser-based virtual machines introducing fundamental networking, web protocols, and terminal basics visually.',
    timing: 'Use during Stage 0 if you prefer visual interactive guided tours before pure command-line wargames.',
    trapWarning: 'Do not pay for premium subscriptions upfront. The free rooms and wargames like Bandit are more than sufficient for core foundations.',
  },
  {
    id: 'cutter-ghidra',
    name: 'Cutter / Rizin Disassembler',
    provider: 'Rizin Community',
    url: 'https://cutter.re/',
    stageNumber: 3,
    domain: 'reversing',
    domainLabel: 'Binary Disassembly',
    accessBadge: 'Free & Open Source · Local Install · No Account',
    accessColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    learningOutcome: 'Inspecting compiled binary control flow graphs, cross-references (xrefs), function decompilation, and hardcoded logic.',
    timing: 'Use during Stage 3 when starting crackme challenges.',
    trapWarning: 'Do not try to decompile 50MB commercial applications. Start with 10-line compiled C programs you wrote yourself.',
  },
];

export function BCyberResourceDirectory() {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS_CATALOG.filter((tool) => {
    if (selectedDomain !== 'all' && tool.domain !== selectedDomain) return false;
    if (selectedStage !== 'all' && tool.stageNumber !== parseInt(selectedStage, 10)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.provider.toLowerCase().includes(q) ||
        tool.learningOutcome.toLowerCase().includes(q) ||
        tool.domainLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Curated Resource Library ({filteredTools.length} Resources)
            </h3>
            <p className="text-xs text-slate-500">
              Every resource includes transparent access conditions, learning outcomes, and trap warnings.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Domain:
          </span>

          {[
            { id: 'all', label: 'All Domains' },
            { id: 'linux', label: 'Linux CLI' },
            { id: 'networking', label: 'Networking' },
            { id: 'web', label: 'Web Security' },
            { id: 'cryptography', label: 'Cryptography' },
            { id: 'reversing', label: 'Reversing & OSINT' },
          ].map((dom) => (
            <button
              key={dom.id}
              type="button"
              onClick={() => setSelectedDomain(dom.id)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                selectedDomain === dom.id
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {dom.label}
            </button>
          ))}

          <span className="text-slate-300 mx-1 hidden sm:inline">|</span>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Stage:
          </span>

          {[
            { id: 'all', label: 'All Stages' },
            { id: '0', label: 'Stage 0' },
            { id: '1', label: 'Stage 1' },
            { id: '2', label: 'Stage 2' },
            { id: '3', label: 'Stage 3' },
          ].map((stg) => (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedStage(stg.id)}
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                selectedStage === stg.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {stg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Stage {tool.stageNumber} · {tool.domainLabel}
                </span>

                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', tool.accessColor)}>
                  {tool.accessBadge}
                </span>
              </div>

              {/* Title & Provider */}
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center justify-between group">
                  <span>{tool.name}</span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-brand-primary p-1 transition-colors"
                    title={`Open ${tool.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h4>
                <span className="text-xs text-slate-400">Provider: {tool.provider}</span>
              </div>

              {/* What You Will Learn */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Isse kya seekhoge?</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{tool.learningOutcome}</p>
              </div>

              {/* When To Use */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Kab use karna hai?</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{tool.timing}</p>
              </div>

              {/* Trap Warning Callout */}
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Trap:</strong> {tool.trapWarning}
                </p>
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Independent educational tool</span>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-primary hover:underline inline-flex items-center gap-1 text-xs"
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
