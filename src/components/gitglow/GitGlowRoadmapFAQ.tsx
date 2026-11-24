import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Is this allowed by GitHub?',
    answer: 'Yes. GitGlow performs genuine, standard git operations (creating branches, staging RFC commit trailers, and merging pull requests) via official GitHub APIs. GitHub’s automated achievement backend evaluates the resulting public git events and awards the badge autonomously. GitGlow does not use exploit vectors, private endpoints, or bot spam.',
  },
  {
    question: 'Could my GitHub account get flagged or banned?',
    answer: 'No. The operations performed by GitGlow are standard developer workflows that occur millions of times a day on GitHub. GitGlow operates strictly inside an isolated personal sandbox repository. It never touches your production repositories, organizations, or private code.',
  },
  {
    question: 'How long until the badge appears on my profile?',
    answer: 'GitHub’s achievement backend operates on an asynchronous batch indexing queue. While GitGlow completes the git operations in ~2 minutes, GitHub usually updates and renders the trophy on your profile within a few hours to 2–3 business days.',
  },
  {
    question: 'What GitHub OAuth permissions do you ask for?',
    answer: 'We only request the minimal public repository management scope needed to create the sandbox repository and merge the achievement pull request. We never ask for account credentials, organization admin access, or read access to private code. You can revoke access anytime in your GitHub Settings.',
  },
  {
    question: 'Can I unlock these achievements manually without the bot?',
    answer: 'Absolutely! Every badge page on GitGlow includes the exact CLI terminal recipes (git and gh commands) so you can run the steps manually on your own machine without connecting OAuth.',
  },
  {
    question: 'Does GitGlow generate fake commits, fake streaks, or bot stars?',
    answer: 'Strictly NO. We reject all deceptive profile padding tools. GitGlow is designed to help students and developers understand real git collaboration standards (RFC trailers, branch management, issue triage) to build authentic developer credibility.',
  },
  {
    question: 'What should I do if a badge does not appear after 5 days?',
    answer: 'Check our troubleshooting checklist: 1) Ensure you did not delete the sandbox repository immediately (GitHub requires it to stay alive for indexing), 2) Check that your GitHub email matches the commit author email, and 3) Verify that private contributions are enabled in your GitHub profile settings if applicable.',
  },
];

const UPCOMING_BADGES = [
  {
    name: 'Heart On Sleeve',
    icon: '💜',
    category: 'Community Reaction',
    difficulty: 'Easy',
    status: 'In Development',
    description: 'React with a heart emoji to an issue, PR, or commit comment.',
  },
  {
    name: 'Public Sponsor',
    icon: '💖',
    category: 'Open Source',
    difficulty: 'Special',
    status: 'In Development',
    description: 'Sponsor an open-source contributor or organization through GitHub Sponsors.',
  },
  {
    name: 'Open Sourcerer',
    icon: '🧙',
    category: 'Ecosystem',
    difficulty: 'Hard',
    status: 'Planned',
    description: 'Contribute accepted pull requests to top-tier open source public projects.',
  },
];

export const GitGlowRoadmapFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [notifiedBadges, setNotifiedBadges] = useState<Record<string, boolean>>({});

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleNotify = (name: string) => {
    setNotifiedBadges(prev => ({ ...prev, [name]: true }));
  };

  return (
    <section className="py-16 md:py-24 bg-[#0D1117] text-[#E6EDF3] border-t border-[#30363D]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-20">
        
        {/* ─── Part 1: Coming Soon Roadmap (Only Achievable Badges) ─── */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-bold text-[#388BFD] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expansion Roadmap</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#E6EDF3]">
              Upcoming Verified Tracks
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#8B949E]">
              We only build automation for truly achievable GitHub badges. No archived trophies or artificial star trades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UPCOMING_BADGES.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] flex flex-col justify-between space-y-4 hover:border-[#388BFD]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0D1117] border border-[#30363D] text-[10px] font-bold text-[#388BFD]">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#E6EDF3] font-heading">{item.name}</h4>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">{item.category} • {item.difficulty}</div>
                  <p className="text-xs text-[#8B949E] mt-3 leading-relaxed">{item.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNotify(item.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    notifiedBadges[item.name]
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{notifiedBadges[item.name] ? 'We’ll Notify You! ✓' : 'Notify Me When Ready'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Part 2: Honest FAQ (Objection Busters) ─── */}
        <div id="faq" className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-bold text-[#D7FF36] uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>Honest Answers</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#E6EDF3]">
              Frequently Asked Questions
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#8B949E]">
              Zero marketing fluff. Direct, transparent answers to every technical and security doubt.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#161B22] border border-[#30363D] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#21262D]/50 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#E6EDF3] font-heading">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-lg bg-[#0D1117] text-[#8B949E] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8B949E] leading-relaxed border-t border-[#30363D]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
