import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Terminal,
  Globe,
  Check,
  X,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BadgePedagogy, KnowledgeCheckQuestion } from '../../../data/gitglow/badge-curriculum';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';

interface BadgeCurriculumViewProps {
  pedagogy: BadgePedagogy;
  onGoToExecution: () => void;
}

export const BadgeCurriculumView: React.FC<BadgeCurriculumViewProps> = ({
  pedagogy,
  onGoToExecution,
}) => {
  const { quizAnswers, answerQuizQuestion } = useGitGlowStore();
  const [activeConceptIdx, setActiveConceptIdx] = useState<number>(0);
  const [selectedExecutionMode, setSelectedExecutionMode] = useState<'cli' | 'web'>('cli');

  return (
    <div className="space-y-8 text-left">
      {/* ── 1. The Industry Context (The "Why") ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center justify-center text-[#65A30D]">
            <BookOpen size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#65A30D]">
              Chapter {pedagogy.chapterNumber} · The "Why"
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#101114]">
              {pedagogy.industryContext.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-[#48494D] leading-relaxed">
          {pedagogy.industryContext.description}
        </p>

        {/* Real-world Callout */}
        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-start gap-3">
          <Lightbulb size={18} className="text-[#84CC16] shrink-0 mt-0.5" />
          <div className="text-xs text-[#101114] leading-relaxed">
            <strong className="text-[#101114]">In Real Engineering Teams:</strong>{' '}
            <span className="text-[#65666A]">{pedagogy.industryContext.realWorldExample}</span>
          </div>
        </div>
      </div>

      {/* ── 2. The Core Concepts (The "What") ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE1]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#84CC16]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#101114]">
              Concepts You Are Learning
            </h4>
          </div>
          <span className="text-[11px] text-[#65666A]">
            {pedagogy.conceptsTaught.length} Fundamental Pillars
          </span>
        </div>

        {/* Concept Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {pedagogy.conceptsTaught.map((concept, idx) => (
            <button
              key={idx}
              onClick={() => setActiveConceptIdx(idx)}
              className={cn(
                'p-3 rounded-2xl border text-left transition-all cursor-pointer',
                activeConceptIdx === idx
                  ? 'bg-[#F7F8EF] border-[#84CC16] shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5E3DA] hover:bg-white hover:border-[#DCE89E]'
              )}
            >
              <span className="text-[10px] font-mono text-[#65A30D] block font-bold">
                Pillar 0{idx + 1}
              </span>
              <span className="text-xs font-bold text-[#101114] mt-0.5 block truncate">
                {concept.term}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Concept Deep Dive Card */}
        {pedagogy.conceptsTaught[activeConceptIdx] && (
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-3">
            <h5 className="text-sm font-bold text-[#101114]">
              {pedagogy.conceptsTaught[activeConceptIdx].term}
            </h5>
            <p className="text-xs sm:text-[13px] text-[#48494D] leading-relaxed">
              {pedagogy.conceptsTaught[activeConceptIdx].definition}
            </p>
            <div className="pt-2 border-t border-[#ECEAE1] flex items-start gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#D7FF36]/40 text-[#4D7C0F] text-[10px] font-mono font-bold uppercase shrink-0">
                Pro-Tip
              </span>
              <p className="text-[11px] font-mono text-[#65666A]">
                {pedagogy.conceptsTaught[activeConceptIdx].proTip}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Step-by-Step Blueprint Walkthrough (The "How") ── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ECEAE1]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#65A30D]">
              Execution Blueprint
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-[#101114]">
              How to complete on real GitHub
            </h4>
          </div>

          {/* CLI vs Web Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA]">
            <button
              onClick={() => setSelectedExecutionMode('cli')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                selectedExecutionMode === 'cli'
                  ? 'bg-white text-[#101114] shadow-xs border border-[#E5E3DA]'
                  : 'text-[#65666A] hover:text-[#101114]'
              )}
            >
              <Terminal size={12} />
              <span>Terminal CLI</span>
            </button>
            <button
              onClick={() => setSelectedExecutionMode('web')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                selectedExecutionMode === 'web'
                  ? 'bg-white text-[#101114] shadow-xs border border-[#E5E3DA]'
                  : 'text-[#65666A] hover:text-[#101114]'
              )}
            >
              <Globe size={12} />
              <span>GitHub Web Browser</span>
            </button>
          </div>
        </div>

        {/* Preparation Pill */}
        <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center gap-2.5 text-xs text-[#101114]">
          <Shield size={15} className="text-[#65A30D] shrink-0" />
          <span>
            <strong>Prerequisite:</strong> {pedagogy.executionBlueprint.prepStep}
          </span>
        </div>

        {/* 3 Interactive Stations */}
        <div className="space-y-4">
          {[
            pedagogy.executionBlueprint.step1,
            pedagogy.executionBlueprint.step2,
            pedagogy.executionBlueprint.step3,
          ].map((st, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#101114]">{st.title}</span>
                <span className="text-[10px] font-mono text-[#65666A]">Station 0{i + 1}</span>
              </div>

              {selectedExecutionMode === 'cli' ? (
                <>
                  <pre className="p-3 rounded-xl bg-[#101114] text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto select-all">
                    {st.codeSnippet}
                  </pre>
                  <p className="text-[11px] text-[#65666A]">{st.cliExplanation}</p>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-white border border-[#E5E3DA] text-xs text-[#101114] leading-relaxed">
                  {st.webAlternative}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Webhook Timing Notification */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E5E3DA]">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#84CC16]" />
            <span className="text-xs text-[#65666A]">
              <strong>Webhook Trigger Time:</strong> {pedagogy.executionBlueprint.webhookTriggerTime}
            </span>
          </div>
          <button
            onClick={onGoToExecution}
            className="h-9 px-4 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>Launch Engine</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── 4. Interactive Knowledge Check (Quiz) ── */}
      {pedagogy.quiz && pedagogy.quiz.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#ECEAE1]">
            <HelpCircle size={16} className="text-[#84CC16]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#101114]">
              Knowledge Check · Test Your Understanding
            </h4>
          </div>

          <div className="space-y-6">
            {pedagogy.quiz.map((q, qIdx) => {
              const selectedAnswer = quizAnswers[q.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === q.correctIndex;

              return (
                <div key={q.id} className="space-y-3">
                  <div className="text-xs font-bold text-[#101114]">
                    Q{qIdx + 1}. {q.question}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedAnswer === oIdx;
                      const isOptionCorrect = oIdx === q.correctIndex;

                      let btnStyle = 'bg-[#FAF9F5] border-[#E5E3DA] text-[#101114] hover:bg-white';
                      if (isAnswered) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => answerQuizQuestion(q.id, oIdx)}
                          className={cn(
                            'p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer',
                            btnStyle
                          )}
                        >
                          <span>{opt}</span>
                          {isAnswered && isOptionCorrect && (
                            <Check size={14} className="text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <X size={14} className="text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={cn(
                        'p-3 rounded-xl text-xs leading-relaxed',
                        isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'
                      )}
                    >
                      <strong>{isCorrect ? 'Correct!' : 'Keep Learning:'}</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

