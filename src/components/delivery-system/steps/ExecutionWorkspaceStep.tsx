import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  Plus,
  X,
  FileText,
  Eye,
  ClipboardList,
  Wrench,
  Play,
  HelpCircle,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import { composeExecutionTasks } from '../../../lib/delivery-system/composer';
import { getExecutionHelperText } from '../../../lib/delivery-system/personalized-content';
import { cn } from '../../../lib/utils';
import type { ProjectBlocker } from '../../../types/delivery-system';

const CATEGORY_LABELS: Record<string, string> = {
  setup: 'Setup',
  execution: 'Execution',
  review: 'Review',
  qa: 'QA',
  delivery: 'Delivery',
};

const CATEGORY_COLORS: Record<string, string> = {
  setup: 'bg-blue-50 border-blue-200 text-blue-700',
  execution: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  review: 'bg-amber-50 border-amber-200 text-amber-700',
  qa: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  delivery: 'bg-purple-50 border-purple-200 text-purple-700',
};

export function ExecutionWorkspaceStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const executionTasks = useDeliverySystemStore((s) => s.executionTasks);
  const blockers = useDeliverySystemStore((s) => s.blockers);
  const setExecutionTasks = useDeliverySystemStore((s) => s.setExecutionTasks);
  const updateExecutionTask = useDeliverySystemStore((s) => s.updateExecutionTask);
  const addBlocker = useDeliverySystemStore((s) => s.addBlocker);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('execution_workspace');

  const [generated, setGenerated] = useState(false);
  const [showBlockerForm, setShowBlockerForm] = useState(false);
  const [blockerDesc, setBlockerDesc] = useState('');
  const [blockerImpact, setBlockerImpact] = useState('');
  const [blockerResolution, setBlockerResolution] = useState('');

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const helperText = useMemo(() => {
    if (!profile) return '';
    return getExecutionHelperText(profile);
  }, [profile]);

  const handleGenerate = () => {
    if (!upstream || !profile) return;
    const composed = composeExecutionTasks(upstream, profile);
    setExecutionTasks(composed);
    setGenerated(true);
  };

  const handleConfirm = () => {
    confirmStep();
    nextStep();
  };

  const toggleTaskStatus = (id: string) => {
    const t = executionTasks.find((task) => task.id === id);
    if (!t) return;
    const next: Record<string, 'pending' | 'in_progress' | 'ready'> = {
      pending: 'in_progress',
      in_progress: 'ready',
      ready: 'pending',
    };
    updateExecutionTask(id, { status: next[t.status] });
  };

  const handleAddBlocker = () => {
    if (!blockerDesc.trim()) return;
    const blocker: ProjectBlocker = {
      id: `blocker-${Date.now()}`,
      description: blockerDesc.trim(),
      impact: blockerImpact.trim(),
      resolution: blockerResolution.trim(),
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    addBlocker(blocker);
    setBlockerDesc('');
    setBlockerImpact('');
    setBlockerResolution('');
    setShowBlockerForm(false);
  };

  const tasksByCategory = useMemo(() => {
    const grouped: Record<string, typeof executionTasks> = {};
    for (const t of executionTasks) {
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    }
    return grouped;
  }, [executionTasks]);

  const progressSummary = useMemo(() => {
    const total = executionTasks.length;
    const ready = executionTasks.filter((t) => t.status === 'ready').length;
    const inProgress = executionTasks.filter((t) => t.status === 'in_progress').length;
    return { total, ready, inProgress };
  }, [executionTasks]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 4 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Execution Workspace
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">{helperText}</p>
      </div>

      {!generated ? (
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} />
          Generate Execution Tasks
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-bold text-[#0058be] mt-1">{progressSummary.total}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{progressSummary.inProgress}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Ready</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{progressSummary.ready}</p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(tasksByCategory).map(([category, tasks]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                  {category === 'setup' && <Wrench size={14} className="text-[#0058be]" />}
                  {category === 'execution' && <Play size={14} className="text-[#0058be]" />}
                  {category === 'review' && <Eye size={14} className="text-[#0058be]" />}
                  {category === 'qa' && <ClipboardList size={14} className="text-[#0058be]" />}
                  {category === 'delivery' && <FileText size={14} className="text-[#0058be]" />}
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-colors cursor-pointer',
                        t.status === 'ready'
                          ? 'bg-emerald-50 border-emerald-200'
                          : t.status === 'in_progress'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-zinc-200 hover:border-zinc-300',
                      )}
                      onClick={() => toggleTaskStatus(t.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          className={cn(
                            'flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0',
                            t.status === 'ready'
                              ? 'bg-emerald-500 text-white'
                              : t.status === 'in_progress'
                                ? 'bg-amber-500 text-white'
                                : 'bg-zinc-200 text-zinc-500',
                          )}
                        >
                          {t.status === 'ready' ? <Check size={12} /> : t.status === 'in_progress' ? '~' : '·'}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={t.task}
                            onChange={(e) => updateExecutionTask(t.id, { task: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full text-xs text-zinc-800 bg-transparent border-none focus:outline-none"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                'text-[9px] font-medium uppercase px-1.5 py-0.5 rounded',
                                CATEGORY_COLORS[t.category] || 'bg-zinc-100 text-zinc-500',
                              )}
                            >
                              {CATEGORY_LABELS[t.category] || t.category}
                            </span>
                            {t.serviceSpecific && (
                              <span className="text-[9px] text-[#0058be] font-medium">Service-specific</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <textarea
                        value={t.notes}
                        onChange={(e) => updateExecutionTask(t.id, { notes: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Notes..."
                        rows={1}
                        className="w-40 ml-3 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#0058be]" />
                Blockers ({blockers.length})
              </h3>
              <button
                onClick={() => setShowBlockerForm(!showBlockerForm)}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] text-[11px] font-medium hover:bg-[#0058be]/20 transition-all cursor-pointer"
              >
                <Plus size={12} />
                Add Blocker
              </button>
            </div>

            {showBlockerForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={blockerDesc}
                    onChange={(e) => setBlockerDesc(e.target.value)}
                    rows={2}
                    placeholder="What is blocking progress?"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Impact</label>
                  <textarea
                    value={blockerImpact}
                    onChange={(e) => setBlockerImpact(e.target.value)}
                    rows={1}
                    placeholder="How does this affect the timeline?"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Proposed Resolution</label>
                  <textarea
                    value={blockerResolution}
                    onChange={(e) => setBlockerResolution(e.target.value)}
                    rows={1}
                    placeholder="How do you plan to resolve this?"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <motion.button
                    onClick={handleAddBlocker}
                    whileTap={{ scale: 0.97 }}
                    disabled={!blockerDesc.trim()}
                    className={cn(
                      'px-4 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      blockerDesc.trim()
                        ? 'bg-[#0058be] text-white'
                        : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
                    )}
                  >
                    Add Blocker
                  </motion.button>
                  <button
                    onClick={() => setShowBlockerForm(false)}
                    className="px-4 h-8 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {blockers.length > 0 && (
              <div className="space-y-2">
                {blockers.map((b) => (
                  <div
                    key={b.id}
                    className={cn(
                      'p-4 rounded-2xl border shadow-sm',
                      b.status === 'resolved'
                        ? 'bg-emerald-50 border-emerald-200'
                        : b.status === 'mitigated'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-red-200',
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-medium text-zinc-800">{b.description}</p>
                        {b.impact && <p className="text-[11px] text-zinc-500">Impact: {b.impact}</p>}
                        {b.resolution && <p className="text-[11px] text-zinc-500">Resolution: {b.resolution}</p>}
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase px-2 py-1 rounded-lg shrink-0 ml-3',
                          b.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : b.status === 'mitigated'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700',
                        )}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2">Created: {b.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Execution workspace reviewed</span>
              </div>
            ) : (
              <motion.button
                onClick={handleConfirm}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Check size={14} />
                Confirm Execution & Proceed
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
