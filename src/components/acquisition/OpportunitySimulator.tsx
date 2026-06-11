import { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Clock, Zap, Star, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SimulatorInputs {
  serviceSelected: boolean;
  marketSelected: boolean;
  nicheDefined: boolean;
  positioningWritten: boolean;
}

interface OpportunitySimulatorProps {
  inputs: SimulatorInputs;
  track: string;
}

function calculateScore(inputs: SimulatorInputs): number {
  let score = 0;
  if (inputs.serviceSelected) score += 25;
  if (inputs.marketSelected) score += 25;
  if (inputs.nicheDefined) score += 25;
  if (inputs.positioningWritten) score += 25;
  return score;
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400' };
  if (score >= 70) return { label: 'Strong', color: 'text-emerald-400' };
  if (score >= 50) return { label: 'Developing', color: 'text-amber-400' };
  if (score >= 25) return { label: 'Getting Started', color: 'text-amber-400' };
  return { label: 'Not Started', color: 'text-red-400' };
}

export function OpportunitySimulator({ inputs, track }: OpportunitySimulatorProps) {
  const score = useMemo(() => calculateScore(inputs), [inputs]);
  const scoreConfig = getScoreLabel(score);

  const metrics = useMemo(() => [
    {
      label: 'Demand',
      value: inputs.serviceSelected ? 85 : 30,
      icon: TrendingUp,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-400',
    },
    {
      label: 'Competition',
      value: inputs.nicheDefined ? 78 : 20,
      icon: Target,
      color: 'text-blue-400',
      barColor: 'bg-blue-400',
    },
    {
      label: 'Speed To Client',
      value: inputs.positioningWritten ? 90 : 15,
      icon: Clock,
      color: 'text-amber-400',
      barColor: 'bg-amber-400',
    },
    {
      label: 'Fit Score',
      value: inputs.marketSelected ? 82 : 25,
      icon: Star,
      color: 'text-purple-400',
      barColor: 'bg-purple-400',
    },
  ], [inputs]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (!inputs.serviceSelected) recs.push('Select your primary skill to unlock demand data');
    if (!inputs.marketSelected) recs.push('Choose your market to see competitive positioning');
    if (!inputs.nicheDefined) recs.push('Define your niche to improve speed to first client');
    if (!inputs.positioningWritten) recs.push('Write your positioning statement to complete your profile');
    if (recs.length === 0) recs.push(`Your opportunity is well-defined. Start outreach on your primary platform.`);
    return recs;
  }, [inputs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-brand-primary" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Opportunity Simulator
        </p>
      </div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8 text-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-brand-primary/[0.03] blur-3xl pointer-events-none" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-4">
          Opportunity Score
        </p>

        <div className="relative">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={score}
            className={cn('text-6xl font-bold tracking-tight', scoreConfig.color)}
          >
            {score}
          </motion.span>
          <span className="text-2xl font-bold text-white/20">/100</span>
        </div>

        <p className={cn('text-sm font-semibold mt-2', scoreConfig.color)}>
          {scoreConfig.label}
          {score >= 70 && ' — Ready to proceed'}
        </p>

        {/* Mini progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[25, 50, 75, 100].map((threshold) => (
            <div
              key={threshold}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-500',
                score >= threshold ? 'bg-brand-primary' : 'bg-white/10',
              )}
            />
          ))}
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={12} className={metric.color} />
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
                  {metric.label}
                </p>
              </div>

              <div className="flex items-end justify-between mb-2">
                <span className={cn('text-lg font-bold', metric.color)}>
                  {metric.value}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  className={cn('h-full rounded-full', metric.barColor)}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended Platforms */}
      {inputs.serviceSelected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe size={12} className="text-brand-primary" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
              Recommended Platforms
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {track === 'editor' && ['Instagram', 'YouTube', 'LinkedIn', 'Fiverr', 'Upwork'].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-white/50">
                {p}
              </span>
            ))}
            {track === 'developer' && ['GitHub', 'LinkedIn', 'Portfolio Site', 'Upwork'].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-white/50">
                {p}
              </span>
            ))}
            {track === 'designer' && ['Behance', 'Dribbble', 'Instagram', 'LinkedIn'].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-white/50">
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
          Recommendations
        </p>
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
            <p className="text-xs text-white/50 leading-relaxed">{rec}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
