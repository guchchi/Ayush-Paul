import { useState, useCallback } from 'react';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext } from '../../lib/outreach-engine-system/context-helper';

export default function OutreachReportStep() {
  const store = useOutreachEngineStore();
  const {
    outreachReport, prospectContext,
    generateOutreachReport, copyOutreachReport, downloadOutreachReportMarkdown,
    confirmStep, nextStep,
  } = store;

  const cleanCtx = getCleanOutreachContext(store);

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';
  const reportGenerated = outreachReport !== null;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyOutreachReport();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [copyOutreachReport]);

  function handleGenerate() {
    generateOutreachReport();
  }

  function handleDownload() {
    downloadOutreachReportMarkdown();
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Outreach Report
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Compile your complete outreach plan into one clean report.
        </p>
      </div>

      {!reportGenerated && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Outreach Report
        </button>
      )}

      {reportGenerated && outreachReport && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              Generated: {new Date(outreachReport.generatedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {copied ? 'Copied!' : 'Copy Report'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Download Markdown
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className={`rounded-lg border p-6 space-y-6 ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>Outreach Engine Report</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Generated: {new Date(outreachReport.generatedAt).toISOString().split('T')[0]}
              </p>
            </div>

            <Section title="1. Outreach Goal" isDark={isDark}>
              <Lines text={outreachReport.outreachGoalSummary} isDark={isDark} />
            </Section>

            <Section title="2. Prospect Context" isDark={isDark}>
              <Lines text={outreachReport.prospectSummary} isDark={isDark} />
            </Section>

            <Section title="3. Personalization Angle" isDark={isDark}>
              <Lines text={outreachReport.selectedAngleSummary} isDark={isDark} />
            </Section>

            <Section title="4. First Message Draft" isDark={isDark}>
              <Lines text={outreachReport.selectedMessageSummary} isDark={isDark} />
            </Section>

            <Section title="5. Follow-Up Sequence" isDark={isDark}>
              <Lines text={outreachReport.followUpSummary} isDark={isDark} />
            </Section>

            <Section title="6. Objection-Safe Reply Bank" isDark={isDark}>
              <Lines text={outreachReport.objectionReplySummary} isDark={isDark} />
            </Section>

            <Section title="7. Outreach Tracker" isDark={isDark}>
              <Lines text={outreachReport.trackerSummary} isDark={isDark} />
            </Section>

            <Section title="8. Next Actions" isDark={isDark}>
              <ol className={`list-decimal list-inside space-y-1 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                {outreachReport.nextActions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </Section>
          </div>
        </div>
      )}

      <div className={`flex justify-end pt-4 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Complete Module 6
        </button>
      </div>
    </div>
  );
}

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{title}</h4>
      {children}
    </div>
  );
}

function Lines({ text, isDark }: { text: string; isDark: boolean }) {
  if (!text) return <p className={`text-sm italic ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>No data.</p>;
  return (
    <div className={`text-sm whitespace-pre-wrap ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('> **Note:**')) {
          return (
            <p key={i} className={`mt-1 px-3 py-1.5 rounded text-xs italic border ${
              isDark ? 'text-yellow-300 bg-yellow-900/15 border-yellow-800' : 'text-yellow-700 bg-yellow-50 border-yellow-200'
            }`}>
              {line.replace('> ', '')}
            </p>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className={`font-semibold mt-1 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{line.replace(/\*\*/g, '')}</p>;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
