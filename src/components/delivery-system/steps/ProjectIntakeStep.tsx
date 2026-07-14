import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Hash,
  Globe,
  Lock,
  DollarSign,
  ClipboardList,
  HelpCircle,
  Package,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import { composeProjectIntake } from '../../../lib/delivery-system/composer';
import { getIntakeHelperText } from '../../../lib/delivery-system/personalized-content';
import { cn } from '../../../lib/utils';
import type { IntakeRequirement } from '../../../types/delivery-system';

export function ProjectIntakeStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const projectContext = useDeliverySystemStore((s) => s.projectContext);
  const projectIntake = useDeliverySystemStore((s) => s.projectIntake);
  const setProjectContext = useDeliverySystemStore((s) => s.setProjectContext);
  const setProjectIntake = useDeliverySystemStore((s) => s.setProjectIntake);
  const updateIntakeRequirement = useDeliverySystemStore((s) => s.updateIntakeRequirement);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('project_intake');

  const [generated, setGenerated] = useState(false);

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const helperText = useMemo(() => {
    if (!upstream || !profile) return null;
    return getIntakeHelperText(upstream, profile);
  }, [upstream, profile]);

  const missingWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (!projectContext.clientName.trim()) warnings.push('Client name is required');
    if (!projectContext.clientContact.trim()) warnings.push('Client contact is required');
    if (!projectContext.projectName.trim()) warnings.push('Project name is required');
    if (!projectContext.clientGoals.trim()) warnings.push('Client goals should be defined');
    if (!projectContext.agreedDeliverables.trim()) warnings.push('Deliverables must be agreed upon');
    if (!projectContext.agreedTimeline.trim()) warnings.push('Timeline is required');
    if (!projectContext.communicationChannel.trim()) warnings.push('Communication channel must be set');
    return warnings;
  }, [projectContext]);

  const readyToStart = missingWarnings.length === 0;

  const handleGenerate = () => {
    if (!upstream || !profile) return;
    const composed = composeProjectIntake(upstream, profile);
    setProjectIntake({
      kickoffQuestions: composed.kickoffQuestions,
      dependencyChecklist: composed.dependencyChecklist,
      missingInfoWarnings: missingWarnings,
      readyToStart,
      isCustom: false,
    });
    setGenerated(true);
  };

  const handleConfirm = () => {
    if (!readyToStart) return;
    confirmStep();
    nextStep();
  };

  const toggleDepStatus = (id: string) => {
    const dep = projectIntake.dependencyChecklist.find((d) => d.id === id);
    if (!dep) return;
    const next: Record<string, 'pending' | 'in_progress' | 'ready'> = {
      pending: 'in_progress',
      in_progress: 'ready',
      ready: 'pending',
    };
    updateIntakeRequirement(id, { status: next[dep.status] });
  };

  const ProjectTypeRadio = ({ value, label }: { value: string; label: string }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="projectType"
        value={value}
        checked={projectContext.projectType === value}
        onChange={(e) => setProjectContext({ projectType: e.target.value as any })}
        className="w-3.5 h-3.5 accent-[#0058be]"
      />
      <span className="text-xs text-zinc-700">{label}</span>
    </label>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 1 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Project Intake & Kickoff
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">
          {helperText?.description ?? 'Set up the project foundation and collect client information.'}
        </p>
      </div>

      {helperText && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <HelpCircle size={16} className="text-[#0058be] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-zinc-800 font-medium">{helperText.title}</p>
            <ul className="list-disc list-inside text-[11px] text-zinc-500 space-y-0.5">
              {helperText.examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <User size={14} className="text-[#0058be]" />
            Client Details
          </h3>
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Client Name</label>
              <input
                type="text"
                value={projectContext.clientName}
                onChange={(e) => setProjectContext({ clientName: e.target.value })}
                placeholder="e.g. Sarah Johnson"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Client Contact</label>
              <input
                type="text"
                value={projectContext.clientContact}
                onChange={(e) => setProjectContext({ clientContact: e.target.value })}
                placeholder="e.g. sarah@example.com"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Project Name</label>
              <input
                type="text"
                value={projectContext.projectName}
                onChange={(e) => setProjectContext({ projectName: e.target.value })}
                placeholder="e.g. YouTube Channel Rebrand"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Project Type</label>
              <div className="flex flex-wrap gap-4">
                <ProjectTypeRadio value="one_time" label="One-Time" />
                <ProjectTypeRadio value="retainer" label="Retainer" />
                <ProjectTypeRadio value="milestone" label="Milestone-Based" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Client Goals</label>
              <textarea
                value={projectContext.clientGoals}
                onChange={(e) => setProjectContext({ clientGoals: e.target.value })}
                placeholder="What does the client want to achieve?"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Agreed Deliverables</label>
              <textarea
                value={projectContext.agreedDeliverables}
                onChange={(e) => setProjectContext({ agreedDeliverables: e.target.value })}
                placeholder="List of deliverables agreed with the client"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <Calendar size={14} className="text-[#0058be]" />
            Timeline & Settings
          </h3>
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Agreed Timeline</label>
              <input
                type="text"
                value={projectContext.agreedTimeline}
                onChange={(e) => setProjectContext({ agreedTimeline: e.target.value })}
                placeholder="e.g. 2 weeks"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  value={projectContext.startDate}
                  onChange={(e) => setProjectContext({ startDate: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Target Deadline</label>
                <input
                  type="date"
                  value={projectContext.targetDeadline}
                  onChange={(e) => setProjectContext({ targetDeadline: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Agreed Revisions</label>
              <input
                type="number"
                min={0}
                max={20}
                value={projectContext.agreedRevisions}
                onChange={(e) => setProjectContext({ agreedRevisions: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Communication Channel</label>
              <input
                type="text"
                value={projectContext.communicationChannel}
                onChange={(e) => setProjectContext({ communicationChannel: e.target.value })}
                placeholder="e.g. Slack, Email"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Approval Owner</label>
              <input
                type="text"
                value={projectContext.approvalOwner}
                onChange={(e) => setProjectContext({ approvalOwner: e.target.value })}
                placeholder="e.g. Client name or stakeholder"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Client Timezone</label>
              <input
                type="text"
                value={projectContext.clientTimezone}
                onChange={(e) => setProjectContext({ clientTimezone: e.target.value })}
                placeholder="e.g. EST, GMT+2"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
          </div>

          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2 mt-4">
            <Lock size={14} className="text-[#0058be]" />
            Access & Status
          </h3>
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Required Assets</label>
              <textarea
                value={projectContext.requiredAssets}
                onChange={(e) => setProjectContext({ requiredAssets: e.target.value })}
                placeholder="What assets do you need from the client?"
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Required Access</label>
              <textarea
                value={projectContext.requiredAccess}
                onChange={(e) => setProjectContext({ requiredAccess: e.target.value })}
                placeholder="What access or credentials are needed?"
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Access Sensitivity</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accessSensitivity"
                    value="normal"
                    checked={projectContext.accessSensitivity === 'normal'}
                    onChange={(e) => setProjectContext({ accessSensitivity: e.target.value as any })}
                    className="w-3.5 h-3.5 accent-[#0058be]"
                  />
                  <span className="text-xs text-zinc-700">Normal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accessSensitivity"
                    value="sensitive"
                    checked={projectContext.accessSensitivity === 'sensitive'}
                    onChange={(e) => setProjectContext({ accessSensitivity: e.target.value as any })}
                    className="w-3.5 h-3.5 accent-[#0058be]"
                  />
                  <span className="text-xs text-zinc-700">Sensitive / NDA</span>
                </label>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Payment Status</label>
              <select
                value={projectContext.paymentStatus}
                onChange={(e) => setProjectContext({ paymentStatus: e.target.value as any })}
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              >
                <option value="not_recorded">Not Recorded</option>
                <option value="deposit_pending">Deposit Pending</option>
                <option value="deposit_received">Deposit Received</option>
                <option value="final_payment_pending">Final Payment Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Project Status</label>
              <select
                value={projectContext.projectStatus}
                onChange={(e) => setProjectContext({ projectStatus: e.target.value as any })}
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              >
                <option value="setup">Setup</option>
                <option value="waiting_for_client">Waiting for Client</option>
                <option value="ready_to_start">Ready to Start</option>
                <option value="in_progress">In Progress</option>
                <option value="client_review">Client Review</option>
                <option value="revision">Revision</option>
                <option value="qa">QA</option>
                <option value="handoff">Handoff</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {generated && projectIntake.kickoffQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <HelpCircle size={14} className="text-[#0058be]" />
              Kickoff Questions
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
              {projectIntake.kickoffQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0058be]/10 text-[9px] font-bold text-[#0058be] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <textarea
                      value={q}
                      onChange={(e) => {
                        const updated = [...projectIntake.kickoffQuestions];
                        updated[i] = e.target.value;
                        setProjectIntake({ ...projectIntake, kickoffQuestions: updated });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <ClipboardList size={14} className="text-[#0058be]" />
              Dependency Checklist
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              {projectIntake.dependencyChecklist.map((dep) => (
                <div
                  key={dep.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer',
                    dep.status === 'ready'
                      ? 'bg-emerald-50 border-emerald-200'
                      : dep.status === 'in_progress'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-zinc-200 hover:border-zinc-300',
                  )}
                  onClick={() => toggleDepStatus(dep.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0',
                        dep.status === 'ready'
                          ? 'bg-emerald-500 text-white'
                          : dep.status === 'in_progress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-200 text-zinc-500',
                      )}
                    >
                      {dep.status === 'ready' ? <Check size={10} /> : dep.status === 'in_progress' ? '~' : '·'}
                    </span>
                    <div>
                      <p className="text-xs text-zinc-800 font-medium">{dep.label}</p>
                      <span className="text-[10px] text-zinc-400 uppercase">{dep.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase">
                    {dep.status === 'ready' ? 'Ready' : dep.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {missingWarnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-800">Missing Information</span>
              </div>
              <ul className="space-y-1">
                {missingWarnings.map((w, i) => (
                  <li key={i} className="text-[11px] text-amber-700 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl border',
              readyToStart
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200',
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                readyToStart ? 'bg-emerald-500' : 'bg-amber-500',
              )}
            />
            <span
              className={cn(
                'text-xs font-medium',
                readyToStart ? 'text-emerald-700' : 'text-amber-700',
              )}
            >
              {readyToStart ? 'Ready to start — all required fields filled' : 'Not ready — resolve missing warnings above'}
            </span>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        {!generated ? (
          <motion.button
            onClick={handleGenerate}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={14} />
            Generate Intake
          </motion.button>
        ) : isCompleted ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <Check size={14} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Intake confirmed</span>
          </div>
        ) : (
          <motion.button
            onClick={handleConfirm}
            disabled={!readyToStart}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
              readyToStart
                ? 'bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm'
                : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
            )}
          >
            <Check size={14} />
            Confirm & Proceed
            <ArrowRight size={14} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
