import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  GitBranch,
  Eye,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import { composeDeliveryMilestones } from '../../../lib/delivery-system/composer';
import { getMilestoneHelperText } from '../../../lib/delivery-system/personalized-content';
import { cn } from '../../../lib/utils';

export function DeliveryPlanStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const milestones = useDeliverySystemStore((s) => s.milestones);
  const projectContext = useDeliverySystemStore((s) => s.projectContext);
  const setMilestones = useDeliverySystemStore((s) => s.setMilestones);
  const updateMilestone = useDeliverySystemStore((s) => s.updateMilestone);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('delivery_plan');

  const [generated, setGenerated] = useState(false);

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const helperText = useMemo(() => {
    if (!profile) return '';
    return getMilestoneHelperText(profile);
  }, [profile]);

  const handleGenerate = () => {
    if (!upstream || !profile) return;
    const composed = composeDeliveryMilestones(upstream, profile);
    setMilestones(composed);
    setGenerated(true);
  };

  const handleConfirm = () => {
    confirmStep();
    nextStep();
  };

  const toggleMilestoneStatus = (id: string) => {
    const m = milestones.find((ms) => ms.id === id);
    if (!m) return;
    const next: Record<string, 'pending' | 'in_progress' | 'ready'> = {
      pending: 'in_progress',
      in_progress: 'ready',
      ready: 'pending',
    };
    updateMilestone(id, { status: next[m.status] });
  };

  const riskFlags = useMemo(() => {
    const flags: string[] = [];
    if (!projectContext.startDate || !projectContext.targetDeadline) {
      flags.push('Start date or deadline not set — timeline cannot be verified');
    }
    if (milestones.length === 0) flags.push('No milestones defined');
    const clientDeps = milestones.filter((m) => m.clientActionDeadline);
    if (clientDeps.length > 0) {
      flags.push(`${clientDeps.length} milestone(s) require client action — ensure deadlines are communicated`);
    }
    return flags;
  }, [milestones, projectContext]);

  const stageSummary = useMemo(() => {
    if (!profile) return [];
    return profile.executionStages || [];
  }, [profile]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 3 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Delivery Plan & Milestones
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">{helperText}</p>
      </div>

      {stageSummary.length > 0 && generated && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <HelpCircle size={16} className="text-[#0058be] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-zinc-800 font-medium">Service Execution Stages</p>
            <ul className="space-y-1">
              {stageSummary.map((s, i) => (
                <li key={i} className="text-[11px] text-zinc-500 flex items-start gap-2">
                  <span className="text-[#0058be] font-bold shrink-0">{s.stage}:</span>
                  <span>{s.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!generated ? (
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} />
          Generate Milestones
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Start Date</p>
              <p className="text-sm font-bold text-zinc-800 mt-1">
                {projectContext.startDate || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Target Deadline</p>
              <p className="text-sm font-bold text-zinc-800 mt-1">
                {projectContext.targetDeadline || 'Not set'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <Calendar size={14} className="text-[#0058be]" />
              Milestones
            </h3>
            {milestones.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  'p-5 rounded-2xl border shadow-sm transition-colors cursor-pointer',
                  m.status === 'ready'
                    ? 'bg-emerald-50 border-emerald-200'
                    : m.status === 'in_progress'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-white border-zinc-200 hover:border-zinc-300',
                )}
                onClick={() => toggleMilestoneStatus(m.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0',
                        m.status === 'ready'
                          ? 'bg-emerald-500 text-white'
                          : m.status === 'in_progress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-200 text-zinc-500',
                      )}
                    >
                      {m.status === 'ready' ? <Check size={12} /> : m.status === 'in_progress' ? '~' : i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{m.milestone}</p>
                      <p className="text-[11px] text-zinc-500">{m.stage}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase px-2 py-1 rounded-lg',
                      m.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-700'
                        : m.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-zinc-100 text-zinc-500',
                    )}
                  >
                    {m.status === 'ready' ? 'Ready' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-zinc-400" />
                    <span className="text-[11px] text-zinc-600">{m.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-zinc-400" />
                    <span className="text-[11px] text-zinc-600">{m.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch size={12} className="text-zinc-400" />
                    <span className="text-[11px] text-zinc-600">
                      {m.dependencies.length > 0 ? m.dependencies.join(', ') : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={12} className="text-zinc-400" />
                    <span className="text-[11px] text-zinc-600">{m.reviewPoint}</span>
                  </div>
                </div>

                {m.clientActionDeadline && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertCircle size={12} className="text-amber-600" />
                    <span className="text-[11px] text-amber-700">
                      Client action required by: {m.clientActionDeadline}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Timeline Feasibility</p>
              <p className="text-xs text-zinc-700 mt-1">
                {projectContext.startDate && projectContext.targetDeadline
                  ? `${milestones.length} milestones planned between ${projectContext.startDate} and ${projectContext.targetDeadline}`
                  : 'Set start date and deadline to assess feasibility'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Total Milestones</p>
              <p className="text-2xl font-bold text-[#0058be] mt-1">{milestones.length}</p>
            </div>
          </div>

          {riskFlags.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-800">Risk Flags</span>
              </div>
              <ul className="space-y-1">
                {riskFlags.map((f, i) => (
                  <li key={i} className="text-[11px] text-amber-700 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Milestones reviewed</span>
              </div>
            ) : (
              <motion.button
                onClick={handleConfirm}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Check size={14} />
                Confirm Milestones & Proceed
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
