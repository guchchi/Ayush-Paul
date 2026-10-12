import React, { useState } from 'react';
import {
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Terminal,
  Network,
  Shield,
  Code2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PracticeExercise {
  id: string;
  stageBadge: string;
  title: string;
  prompt: string;
  hints: string[];
  solution: string;
  explanation: string;
  explainCheck: string;
}

const EXERCISES: PracticeExercise[] = [
  {
    id: 'ex-1',
    stageBadge: 'Stage 1 · Linux CLI',
    title: 'Challenge 01: SUID & Hidden File Discovery',
    prompt: 'You have SSH access to a system. Locate a file owned by user `bandit15`, with a size between 1KB and 2KB, having permissions that allow execution, while suppressing permission-denied errors on stdout.',
    hints: [
      'Hint 1: Use the `find` command starting from root `/` or `/var`.',
      'Hint 2: Redirect stderr using `2>/dev/null` to filter out noisy permission errors.',
    ],
    solution: 'find / -user bandit15 -size +1k -size -2k -perm /u=x 2>/dev/null',
    explanation: 'The `-user` flag restricts owner matching, `-size` checks boundaries, and `2>/dev/null` discards error streams from unauthorized directories without cluttering your output.',
    explainCheck: 'I can explain the difference between file descriptors 1 (stdout) and 2 (stderr) and why redirecting stderr is necessary.',
  },
  {
    id: 'ex-2',
    stageBadge: 'Stage 1 · Networking',
    title: 'Challenge 02: Extract Plaintext HTTP Credentials from PCAP',
    prompt: 'Given a Wireshark capture file `capture.pcapng` containing hundreds of packets, how do you quickly isolate user authentication attempts submitted over cleartext HTTP POST requests?',
    hints: [
      'Hint 1: Filter by protocol first using display filters.',
      'Hint 2: Filter by HTTP request method using `http.request.method == "POST"`.',
    ],
    solution: 'Filter: http.request.method == "POST" ➔ Right-click packet ➔ Follow ➔ TCP Stream',
    explanation: 'Unencrypted HTTP sends payload data in cleartext inside the body of POST requests (often formatted as `application/x-www-form-urlencoded`). Following the TCP stream reconstructs the complete client-server dialog.',
    explainCheck: 'I can explain why TLS/HTTPS encryption prevents passive network observers from reading the HTTP request body and URL query strings.',
  },
  {
    id: 'ex-3',
    stageBadge: 'Stage 2 · Web Security',
    title: 'Challenge 03: Client-Side Input Bypass via DevTools',
    prompt: 'A web store checkout form contains a disabled "Submit Order" button when cart quantity is 0, and a coupon code input that restricts length to 5 characters via `maxlength="5"`. How can an attacker bypass these restrictions without modifying the backend?',
    hints: [
      'Hint 1: The browser enforces client-side restrictions in HTML DOM, which the user fully controls.',
      'Hint 2: Open Browser DevTools (F12) ➔ Inspect the `<input>` element.',
    ],
    solution: 'Remove the `disabled` attribute from the `<button>` and remove or increase `maxlength="5"` in the DOM inspector, or submit raw POST request directly via Burp Suite.',
    explanation: 'Client-side validations (HTML attributes, JavaScript `disabled`, or form submit events) exist solely for user experience. The backend server must independently re-validate every single parameter, price, and coupon logic.',
    explainCheck: 'I can explain the core web security principle: "Never trust user input, and never rely on client-side controls as a security perimeter."',
  },
  {
    id: 'ex-4',
    stageBadge: 'Stage 2 · Cryptography / Logic',
    title: 'Challenge 04: SQL Injection Parameter Logic Flaw',
    prompt: 'An insecure login endpoint constructs a database query with: `SELECT * FROM users WHERE username = \'$input_user\' AND password = \'$input_pass\'`. What input payload guarantees that the query evaluates to TRUE for all rows?',
    hints: [
      'Hint 1: SQL uses quotes to delineate string literals. An apostrophe `\'` terminates the string.',
      'Hint 2: A comment marker (`-- ` or `/*`) causes the database engine to ignore everything following it.',
    ],
    solution: 'Username payload: admin\' OR 1=1-- ',
    explanation: 'The constructed query becomes: `SELECT * FROM users WHERE username = \'admin\' OR 1=1-- \' AND password = \'...\'`. Since `1=1` is always true and `-- ` comments out the rest, the password check is entirely skipped.',
    explainCheck: 'I can explain why parameterized queries (Prepared Statements) completely eliminate this vulnerability by treating inputs as literal data rather than executable SQL code.',
  },
];

export function BCyberPracticeExercises() {
  const [openHints, setOpenHints] = useState<Record<string, number>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [checkedVerifications, setCheckedVerifications] = useState<Record<string, boolean>>({});

  const toggleHint = (exerciseId: string, hintIndex: number) => {
    setOpenHints((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId] === hintIndex ? 0 : hintIndex,
    }));
  };

  const toggleSolution = (exerciseId: string) => {
    setOpenSolutions((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const toggleCheck = (exerciseId: string) => {
    setCheckedVerifications((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Exercise Notice */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Section 08 · Active Recall
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Starter Hands-On Challenge Set (4 Mini Tasks)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your transferable problem-solving intuition with progressive hints before viewing solutions.
          </p>
        </div>

        <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
          Full timed mock tests reserved until official test syllabus is announced.
        </div>
      </div>

      {/* 4 Exercises Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXERCISES.map((ex) => {
          const currentHint = openHints[ex.id] || 0;
          const isSolutionOpen = !!openSolutions[ex.id];
          const isExplained = !!checkedVerifications[ex.id];

          return (
            <div
              key={ex.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                    {ex.stageBadge}
                  </span>

                  {isExplained && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900">{ex.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                  {ex.prompt}
                </p>

                {/* Progressive Hints Accordion */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    {ex.hints.map((_, hIdx) => {
                      const hintNumber = hIdx + 1;
                      const isActive = currentHint >= hintNumber;

                      return (
                        <button
                          key={hIdx}
                          type="button"
                          onClick={() => toggleHint(ex.id, hintNumber)}
                          className={cn(
                            'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1',
                            isActive
                              ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          <span>Hint {hintNumber}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => toggleSolution(ex.id)}
                      className="ml-auto px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {isSolutionOpen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isSolutionOpen ? 'Hide Solution' : 'Show Solution'}</span>
                    </button>
                  </div>

                  {/* Active Hint Output */}
                  {currentHint > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
                      <strong className="block text-amber-900">Hint {currentHint}:</strong>
                      <p>{ex.hints[currentHint - 1]}</p>
                    </div>
                  )}

                  {/* Solution Output */}
                  {isSolutionOpen && (
                    <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-2 border border-slate-800">
                      <div className="font-mono text-emerald-400 font-bold text-[11px] bg-slate-950 p-2 rounded border border-slate-800 overflow-x-auto">
                        $ {ex.solution}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        <strong>Why it works:</strong> {ex.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* "I Can Explain This" Self-Verification */}
              <div
                onClick={() => toggleCheck(ex.id)}
                className={cn(
                  'p-3 rounded-xl border text-xs cursor-pointer transition-all select-none flex items-start gap-2.5 pt-3 mt-2',
                  isExplained
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300'
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {isExplained ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                  )}
                </div>
                <div className="text-[11px] leading-snug">
                  <strong>I Can Explain This:</strong> {ex.explainCheck}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
