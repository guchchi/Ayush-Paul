import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Target,
  TrendingUp,
  Zap,
  Users,
  Rocket,
  BarChart3,
  Package,
  DollarSign,
} from 'lucide-react';
import {
  useOpportunityMapStore,
  generateOpportunityReport,
} from '../../lib/opportunity-map';
import type { OpportunityMapState } from '../../types/opportunity-map';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

/* ── Score ring SVG ── */

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const strokeWidth = size * 0.06;

  const color =
    score >= 70 ? '#22c55e' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="drop-shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: EASING.PREMIUM, delay: 0.2 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 - 4}
        textAnchor="middle"
        fill="white"
        fontSize={size * 0.22}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.1}
        textAnchor="middle"
        fill="rgba(255,255,255,0.35)"
        fontSize={size * 0.065}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        letterSpacing="0.15em"
      >
        SCORE
      </text>
    </svg>
  );
}

/* ── Breakdown bar ── */

function BreakdownBar({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.FC<{ size?: number; className?: string }>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 tabular-nums">{value}/10</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 1, ease: EASING.PREMIUM, delay: 0.4 }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Difficulty badge ── */

const BADGE_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'Fast Traction': {
    label: 'Fast Traction',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
  },
  Balanced: {
    label: 'Balanced',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
  },
  'Niche Play': {
    label: 'Niche Play',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
  },
  'Heavy Lift': {
    label: 'Heavy Lift',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
  },
};

/* ── Path chip ── */

function PathChip({ label, isLast }: { label: string; isLast?: boolean }) {
  return (
    <>
      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400 truncate max-w-[160px]">
        {label}
      </span>
      {!isLast && <span className="text-[9px] text-zinc-600 shrink-0">/</span>}
    </>
  );
}

/* ── Action plan item ── */

function ActionItem({ step, action }: { step: number; action: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.5 + step * 0.1 }}
      className="flex items-start gap-4 group"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/10 text-[9px] font-bold text-white/70 shrink-0 mt-0.5">
        {step}
      </span>
      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-white/70 transition-colors duration-200">{action}</p>
    </motion.div>
  );
}

/* ── Client source card ── */

const CHANNEL_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  cold_outreach: Zap,
  referral: Users,
  platform: BarChart3,
  community: Users,
  content: Target,
  partnership: Rocket,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function OpportunityReportView() {
  const state = useOpportunityMapStore();
  const previousStep = state.previousStep;
  const fullState = {
    tracks: state.tracks,
    careerTrackId: state.careerTrackId,
    serviceId: state.serviceId,
    marketId: state.marketId,
    nicheId: state.nicheId,
    offerId: state.offerId,
    positioning: state.positioning,
    completedSteps: state.completedSteps,
    currentStep: state.currentStep,
  };

  const report = useMemo(
    () => generateOpportunityReport(fullState as unknown as OpportunityMapState),
    [
      fullState.tracks,
      fullState.careerTrackId,
      fullState.serviceId,
      fullState.marketId,
      fullState.nicheId,
      fullState.offerId,
      fullState.positioning,
      fullState.completedSteps,
      fullState.currentStep,
    ],
  );

  if (!report || !report.offer) {
    return (
      <div className="p-10 bg-red-900/20 border border-red-500 text-white">
        <h2 className="text-xl font-bold mb-4">CRITICAL DATA MISSING</h2>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-auto">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    );
  }

  const scoreData = report.opportunityScore;
  const ratingStyle = scoreData ? BADGE_STYLES[scoreData.rating] : null;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={previousStep}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={14} className="text-zinc-400" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/70">
            <Check size={10} className="inline -mt-px mr-1" />
            Complete
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Opportunity Analysis</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Your complete opportunity map is ready. Here&rsquo;s the full breakdown.
        </p>
      </div>

      <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-1.5">
            <Target size={11} className="text-white/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Positioning Statement</span>
          </div>
          <p className="text-base md:text-lg text-white/95 font-medium leading-relaxed tracking-tight">
            &ldquo;{report.positioningTemplate}&rdquo;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 rounded-xl bg-white/[0.02] border border-white/5">
          <ScoreRing score={scoreData?.score ?? 0} />
          {ratingStyle && (
            <span
              className={cn(
                'mt-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.12em] border',
                ratingStyle.color,
                ratingStyle.bg,
                ratingStyle.border,
              )}
            >
              {ratingStyle.label}
            </span>
          )}
        </div>

        <div className="md:col-span-3 p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-5">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Score Breakdown</h3>
          <div className="space-y-4">
            <BreakdownBar
              label="Demand"
              value={scoreData?.breakdown.demand ?? 0}
              color="#22c55e"
              icon={TrendingUp}
            />
            <BreakdownBar
              label="Execution Speed"
              value={scoreData?.breakdown.execution_speed ?? 0}
              color="#3b82f6"
              icon={Zap}
            />
            <BreakdownBar
              label="Competition"
              value={scoreData?.breakdown.competition ?? 0}
              color="#f59e0b"
              icon={BarChart3}
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Your Path</h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {report.careerTrack && <PathChip label={report.careerTrack.label} />}
          {report.service && <PathChip label={report.service.label} />}
          {report.market && <PathChip label={report.market.label} />}
          {report.niche && <PathChip label={report.niche.label} />}
          {report.offer && <PathChip label={report.offer.label} isLast />}
        </div>

        {report.offer && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <DollarSign size={10} className="text-emerald-400/70" />
              <span className="text-[9px] font-bold text-zinc-400">{report.offer.priceRange}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <Package size={10} className="text-white/40" />
              <span className="text-[9px] font-bold text-zinc-400">{report.offer.deliveryFormat}</span>
            </div>
          </div>
        )}
      </div>

      {report.clientSources.length > 0 && (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Recommended Client Sources ({report.clientSources.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.clientSources.map((source, i) => {
              const ChannelIcon = CHANNEL_ICONS[source.channel] ?? Zap;
              const diffColor = DIFFICULTY_COLORS[source.difficulty];
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/5 shrink-0">
                    <ChannelIcon size={13} className="text-zinc-400" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 truncate">{source.label}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-[0.1em] border shrink-0',
                    diffColor,
                  )}>
                    {source.difficulty}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {report.actionPlan.length > 0 && (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-5">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Action Plan</h3>
          <div className="space-y-4">
            {report.actionPlan.map((item) => (
              <ActionItem key={item.step} step={item.step} action={item.action} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
