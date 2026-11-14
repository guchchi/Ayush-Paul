import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CreditCard,
  DollarSign,
  BookOpen,
  Award,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface PublicSponsorInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

export const PublicSponsorInteractiveSimulation: React.FC<PublicSponsorInteractiveSimulationProps> = ({
  onCompleted,
  onOpenLearnModal,
}) => {
  const { targetUsername, isBadgeOwned, runScan } = useGitGlowStore();
  const isAlreadyEarned = isBadgeOwned('public-sponsor');
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  const curatedSponsorTargets = [
    {
      name: 'Daniel Stenberg (@bagder)',
      role: 'Founder & Lead Maintainer of curl',
      minTier: '$1 one-time',
      url: 'https://github.com/sponsors/bagder',
      avatar: 'https://avatars.githubusercontent.com/u/177011?v=4',
      description: 'curl powers billions of devices worldwide. Daniel maintains it full-time.',
    },
    {
      name: 'Evan You (@yyx990803)',
      role: 'Creator of Vue.js & Vite',
      minTier: '$2 / month',
      url: 'https://github.com/sponsors/yyx990803',
      avatar: 'https://avatars.githubusercontent.com/u/499550?v=4',
      description: 'Built the modern frontend ecosystem tools that power millions of apps.',
    },
    {
      name: 'Rich Harris (@Rich-Harris)',
      role: 'Creator of Svelte & Rollup',
      minTier: '$1 / month',
      url: 'https://github.com/sponsors/Rich-Harris',
      avatar: 'https://avatars.githubusercontent.com/u/1162160?v=4',
      description: 'Pioneered compiled web reactivity and modern ESM bundling.',
    },
    {
      name: 'Sindre Sorhus (@sindresorhus)',
      role: 'Maintainer of 1,000+ Open Source Packages',
      minTier: '$1 / month',
      url: 'https://github.com/sponsors/sindresorhus',
      avatar: 'https://avatars.githubusercontent.com/u/170270?v=4',
      description: 'His packages are downloaded billions of times every month across npm.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. ACTIVE BADGE BANNER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FCE7F3] border border-[#FBCFE8] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/public-sponsor.png"
                alt="Public Sponsor Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">Public Sponsor</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#BE185D] border border-[#FBCFE8] text-[10px] font-bold">
                  $1 Minimum Public Sponsorship
                </span>
              </div>
              <p className="text-xs text-[#65666A] mt-0.5">
                Awarded when you sponsor an open source developer or organization via GitHub Sponsors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLearnModal && (
              <button
                onClick={onOpenLearnModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BookOpen size={13} className="text-[#84CC16]" />
                <span>Sponsor Playbook</span>
              </button>
            )}
            <a
              href="https://github.com/sponsors/explore"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Explore Sponsors</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Real Ground Truth Verification Rule */}
        <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] text-xs text-[#9D174D] space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <Heart size={16} className="text-[#EC4899] fill-[#EC4899]" />
            <span>The Ground Truth Rule for Public Sponsor</span>
          </div>
          <p className="text-[11px] text-[#BE185D] leading-relaxed">
            The sponsorship <strong>must be public</strong>. If you check &quot;Sponsor anonymously / privately&quot;, GitHub will <strong>not</strong> display the badge on your profile. Even a <strong>$1 one-time sponsorship</strong> to any open-source creator qualifies and unlocks the badge permanently!
          </p>
        </div>
      </div>

      {/* ── 2. 3-STEP QUALIFICATION CHECKLIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: '1',
            title: 'Choose a Creator',
            desc: 'Pick any open source developer or tool you use (Curl, Vite, Svelte, etc.).',
          },
          {
            step: '2',
            title: 'Select $1 Tier',
            desc: 'Select a custom $1 one-time payment or monthly tier on their sponsor page.',
          },
          {
            step: '3',
            title: 'Set Public Visibility',
            desc: 'Make sure your sponsorship is set to PUBLIC so GitHub awards the profile achievement.',
          },
        ].map((item) => (
          <div
            key={item.step}
            className="p-5 rounded-2xl bg-white border border-[#E5E3DA] space-y-2 shadow-xs"
          >
            <div className="w-7 h-7 rounded-full bg-[#101114] text-white flex items-center justify-center text-xs font-mono font-bold">
              {item.step}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">{item.title}</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── 3. VERIFIED 1-CLICK SPONSOR DIRECTORY ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard size={18} className="text-[#EC4899]" />
            <div>
              <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                Verified Open-Source Maintainers ($1 Tier Available)
              </h4>
              <p className="text-[11px] text-[#65666A]">
                Clicking any maintainer opens their official GitHub Sponsors checkout directly:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {curatedSponsorTargets.map((target) => (
            <div
              key={target.name}
              className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#EC4899] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={target.avatar}
                    alt={target.name}
                    className="w-10 h-10 rounded-full border border-[#E5E3DA]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#101114]">{target.name}</div>
                    <div className="text-[10px] font-mono text-[#65666A]">{target.role}</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#65666A] leading-relaxed">{target.description}</p>
              </div>

              <div className="pt-2 border-t border-[#ECEAE1] flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#BE185D]">
                  From {target.minTier}
                </span>

                <a
                  href={target.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-3 rounded-xl bg-white hover:bg-[#EC4899] text-[#101114] hover:text-white border border-[#E5E3DA] hover:border-[#EC4899] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Heart size={12} className="fill-current" />
                  <span>Sponsor on GitHub</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. RE-SCAN / VERIFICATION ── */}
      <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-[#E5E3DA] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h5 className="text-xs font-bold text-[#101114]">Completed your public sponsorship?</h5>
          <p className="text-[11px] text-[#65666A] mt-0.5">
            Click &quot;Re-scan GitHub Profile&quot; to verify your Public Sponsor badge on your achievements tab.
          </p>
        </div>

        <button
          onClick={() => runScan(targetUsername)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          Re-scan GitHub Achievements Tab
        </button>
      </div>

      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="Public Sponsor"
        badgeIcon="/images/badges/public-sponsor.png"
        username={targetUsername}
        durationSeconds={30}
        issueNumber={1}
        itemType="pr"
        repoFullName="github/sponsors"
        stat1Label="Sponsorship"
        stat1Value="$1 Minimum"
        stat1Sub="One-Time or Monthly"
        stat2Label="Visibility"
        stat2Value="Public"
        stat2Sub="Verified on Profile"
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
