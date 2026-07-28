import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Star,
  ChevronRight,
  FileText,
  Play,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Zap,
  Users,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Module1IntroPageProps {
  trackId: string | null;
  marketId: string | null;
  nicheId: string | null;
  statement: string;
  isSaved: boolean;
  onStart: () => void;
  onBackToBlueprint: () => void;
  onSaveForLater?: () => void;
}

export function Module1IntroPage({
  trackId,
  marketId,
  nicheId,
  statement,
  isSaved,
  onStart,
  onBackToBlueprint,
  onSaveForLater,
}: Module1IntroPageProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  // Calculate progress based on the 5-step UI
  const completedStepsCount = [
    Boolean(trackId),
    Boolean(marketId),
    Boolean(nicheId),
    Boolean(statement && statement.trim()),
    Boolean(isSaved),
  ].filter(Boolean).length;

  const currentProgress = Math.round((completedStepsCount / 5) * 100);
  const alreadyStarted = completedStepsCount > 0;

  // Set up step status states for visual roadmap
  const stepsData = [
    {
      num: 1,
      title: 'Choose Your Track',
      desc: 'Pick the skill you want to use to help clients.',
      isCompleted: Boolean(trackId),
      isActive: !trackId,
    },
    {
      num: 2,
      title: 'Choose Your Market',
      desc: 'Select the broad group of people or businesses you want to serve.',
      isCompleted: Boolean(marketId),
      isActive: Boolean(trackId) && !marketId,
    },
    {
      num: 3,
      title: 'Choose Your Niche',
      desc: 'Narrow your market into a specific audience.',
      isCompleted: Boolean(nicheId),
      isActive: Boolean(marketId) && !nicheId,
    },
    {
      num: 4,
      title: 'Create Your Direction Statement',
      desc: 'Turn your choices into one clear sentence.',
      isCompleted: Boolean(statement && statement.trim()),
      isActive: Boolean(nicheId) && !statement,
    },
    {
      num: 5,
      title: 'Save Your Result',
      desc: 'Review and save your final Module 1 output.',
      isCompleted: Boolean(isSaved),
      isActive: Boolean(statement && statement.trim()) && !isSaved,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden">
      {/* Upper Navigation / Back link */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        <button
          onClick={onBackToBlueprint}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1.5"
          aria-label="Back to Blueprint page"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Blueprint
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Hero & Module at a glance Layout */}
          <div className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-12 md:mb-20">
            
            {/* Left side: Hero Details */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
                <Zap size={12} className="text-[#0058be]" aria-hidden="true" /> Module 1
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.1]">
                Choose Your <br />
                <span className="text-[#0058be]">Direction</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
                Before you build an offer or try to get clients, you need one clear direction. In this module, you will choose your skill, market, niche, and create your first direction statement.
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Module details">
                {[
                  { icon: <Clock size={14} className="text-neutral-500" aria-hidden="true" />, label: '20–30 min' },
                  { icon: <Star size={14} className="text-neutral-500" aria-hidden="true" />, label: 'Beginner Friendly' },
                  { icon: <ChevronRight size={14} className="text-neutral-500" aria-hidden="true" />, label: '5 Steps' },
                  { icon: <FileText size={14} className="text-[#0b1c30]" aria-hidden="true" />, label: 'Output: Direction Statement', accent: true },
                ].map((chip, i) => (
                  <div
                    key={i}
                    role="listitem"
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border select-none transition-all',
                      chip.accent
                        ? 'bg-[#d1f34d] border-[#d1f34d]/40 text-[#0b1c30] shadow-sm shadow-[#d1f34d]/20'
                        : 'bg-white border-neutral-200 text-neutral-600',
                    )}
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <motion.button
                  onClick={onStart}
                  whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,88,190,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-colors shadow-[0_8px_24px_rgba(0,88,190,0.2)] focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
                >
                  {alreadyStarted ? 'Continue Module 1' : 'Start Module 1'}
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.button>

                {onSaveForLater && (
                  <button
                    onClick={onSaveForLater}
                    className="flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-200 bg-white text-[#0b1c30] hover:bg-neutral-50 font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  >
                    Save for Later
                  </button>
                )}
              </div>

              <p className="text-xs text-neutral-400 font-medium">
                {`Helper note: You are not choosing your forever niche. You are choosing a clear starting point to test and improve.`}
              </p>
            </div>

            {/* Right side: Premium glance card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
                Module 1 at a glance
              </h2>

              {/* Progress Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0b1c30]">Progress</span>
                  <span className="text-sm font-extrabold text-[#0058be]">{currentProgress}% Complete</span>
                </div>
                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden relative">
                  <div
                    className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(currentProgress, 3)}%` }}
                  />
                  {currentProgress > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 animate-[pulse_2s_infinite]" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 font-semibold">
                  {completedStepsCount} of 5 steps completed
                </p>
              </div>

              {/* Final Output Preview */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-neutral-100 space-y-2.5">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Final Output
                </h3>
                <p className="text-sm font-bold text-[#0b1c30] leading-relaxed italic">
                  {statement ? statement : 'I help [who] get [result] using [method].'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                  <FileText size={12} />
                  <span>Generated in Step 4</span>
                </div>
              </div>

              {/* Next Unlock Preview */}
              <div className="space-y-1 pt-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  After this module
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  You will use this direction to build your offer in Module 2.
                </p>
              </div>
            </div>
          </div>

          {/* Intro Video Section */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 md:mb-20 space-y-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">Watch Before Starting</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                A short introduction to help you understand how Module 1 works and what you will create.
              </p>
            </div>

            {/* Navy Video Container */}
            <div className="relative w-full aspect-video md:aspect-[2.4/1] rounded-2xl bg-[#0b1c30] overflow-hidden group shadow-2xl flex flex-col justify-between p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/30 via-transparent to-[#d1f34d]/10 pointer-events-none" />
              
              {/* Top Row inside Video */}
              <div className="z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Module Introduction
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-xs font-bold text-white">
                  01:00
                </span>
              </div>

              {/* Middle Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStart}
                  className="w-16 h-16 rounded-full bg-[#d1f34d] hover:bg-[#c2e240] flex items-center justify-center shadow-xl text-[#0b1c30] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
                  aria-label="Play introduction video"
                >
                  <Play size={22} className="ml-1" fill="currentColor" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Bottom Row inside Video */}
              <div className="z-10 mt-auto">
                <p className="text-lg font-bold text-white tracking-tight drop-shadow-md">
                  Choose Your Direction
                </p>
              </div>
            </div>

            {/* Transcript Toggle */}
            <div className="border-t border-neutral-100 pt-4">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0058be] hover:text-[#0047a0] transition-colors focus:outline-none"
              >
                {showTranscript ? (
                  <>
                    <span>Hide Video Transcript</span>
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>Read Video Transcript</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>

              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-5 rounded-2xl bg-[#f8f9ff] border border-neutral-100 text-xs sm:text-sm text-neutral-600 space-y-3 leading-relaxed max-w-3xl">
                      <p className="font-bold text-[#0b1c30]">Welcome to Module One.</p>
                      <p>In this module, you will choose your direction.</p>
                      <p>Before you make an offer, send messages, or look for clients, you need to be clear.</p>
                      <p>You need to know three things:</p>
                      <ul className="list-disc pl-5 space-y-1 font-semibold text-[#0b1c30]">
                        <li>What skill will you use?</li>
                        <li>Who will you help?</li>
                        <li>What result will you help them get?</li>
                      </ul>
                      <p>Many beginners try to help everyone. That makes their message weak. In this module, we will make it simple.</p>
                      <p>First, you will choose your skill. Then, you will choose your market. After that, you will choose your niche. At the end, you will create one clear sentence.</p>
                      <p>That sentence will explain who you help, what result you give, and how you help them. For example: <span className="italic font-medium text-[#0058be]">“I help fitness coaches get more leads with better website design.”</span></p>
                      <p>This sentence will help you in the next modules. You will use it to build your offer, your message, and your client system.</p>
                      <p>Do not overthink this step. You are not choosing forever. You are choosing a clear starting point. Start with clarity. Then take action. Let’s begin Module One.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Step Roadmap Timeline Section */}
          <div className="space-y-6 mb-12 md:mb-20">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">What You’ll Complete</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Module 1 is divided into five simple steps. Each step creates one part of your direction.
              </p>
            </div>

            {/* Roadmap layout */}
            <div className="grid gap-4 md:grid-cols-5">
              {stepsData.map((step) => {
                const statusText = step.isCompleted
                  ? 'Completed'
                  : step.isActive
                  ? 'Start here'
                  : 'Locked';

                return (
                  <div
                    key={step.num}
                    className={cn(
                      'relative p-6 rounded-2xl border transition-all',
                      step.isCompleted
                        ? 'bg-white border-[#0058be]/20 shadow-sm'
                        : step.isActive
                        ? 'bg-white border-[#0058be] shadow-md ring-1 ring-[#0058be]'
                        : 'bg-neutral-50/50 border-neutral-100 opacity-60',
                    )}
                  >
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs',
                          step.isCompleted
                            ? 'bg-[#0058be]/8 text-[#0058be]'
                            : step.isActive
                            ? 'bg-[#0058be] text-white'
                            : 'bg-neutral-200 text-neutral-500',
                        )}
                      >
                        {step.num}
                      </div>

                      <span
                        className={cn(
                          'text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md',
                          step.isCompleted
                            ? 'bg-emerald-50 text-emerald-600'
                            : step.isActive
                            ? 'bg-[#d1f34d] text-[#0b1c30]'
                            : 'bg-neutral-100 text-neutral-400',
                        )}
                      >
                        {statusText}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        'text-sm font-bold mb-1.5 leading-snug',
                        step.isActive ? 'text-[#0058be]' : 'text-[#0b1c30]',
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcome Section */}
          <div className="bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl p-6 sm:p-8 mb-12 md:mb-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">What You’ll Have After This Module</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                By completing these steps, you build the core pillars for launching your client pipeline.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Compass className="text-[#0058be]" size={20} />,
                  title: 'Clear Skill Direction',
                  text: 'You will know which skill path you are using for this blueprint.',
                },
                {
                  icon: <Users className="text-[#0058be]" size={20} />,
                  title: 'Defined Audience',
                  text: 'You will choose the market and niche you want to focus on first.',
                },
                {
                  icon: <FileText className="text-[#0058be]" size={20} />,
                  title: 'Direction Statement',
                  text: 'You will create a simple statement that explains who you help and how.',
                },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white border border-neutral-100 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0b1c30] mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Bottom CTA card */}
          <div className="relative rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/25 via-transparent to-[#d1f34d]/5 pointer-events-none" />
            
            <div className="space-y-2 text-center md:text-left z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Ready to choose your direction?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Start Module 1 and create the foundation for your offer, message, and client system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 z-10">
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0b1c30] font-bold text-sm sm:text-base transition-colors focus:outline-none"
              >
                {alreadyStarted ? 'Continue Module 1' : 'Start Module 1'}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onBackToBlueprint}
                className="flex items-center justify-center px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base transition-colors border border-white/10 focus:outline-none"
              >
                Back to Blueprint
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
