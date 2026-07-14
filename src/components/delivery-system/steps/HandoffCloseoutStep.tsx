import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  FileText,
  Download,
  MessageSquare,
  Star,
  Share2,
  RefreshCw,
  HelpCircle,
  ClipboardList,
  Lock,
  DollarSign,
  Mail,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import {
  composeQaChecks,
  composeHandoffItems,
  composeCloseout,
  compileDeliveryPack,
} from '../../../lib/delivery-system/composer';
import { getQAHelperText, getHandoffHelperText } from '../../../lib/delivery-system/personalized-content';
import { cn } from '../../../lib/utils';

export function HandoffCloseoutStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const qaChecks = useDeliverySystemStore((s) => s.qaChecks);
  const handoffItems = useDeliverySystemStore((s) => s.handoffItems);
  const closeout = useDeliverySystemStore((s) => s.closeout);
  const projectContext = useDeliverySystemStore((s) => s.projectContext);
  const communicationPlan = useDeliverySystemStore((s) => s.communicationPlan);
  const setQaChecks = useDeliverySystemStore((s) => s.setQaChecks);
  const updateQaCheck = useDeliverySystemStore((s) => s.updateQaCheck);
  const setHandoffItems = useDeliverySystemStore((s) => s.setHandoffItems);
  const updateHandoffItem = useDeliverySystemStore((s) => s.updateHandoffItem);
  const setCloseout = useDeliverySystemStore((s) => s.setCloseout);
  const setDeliveryPack = useDeliverySystemStore((s) => s.setDeliveryPack);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('handoff_closeout');

  const [generated, setGenerated] = useState(false);

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const qaHelper = useMemo(() => {
    if (!profile) return '';
    return getQAHelperText(profile);
  }, [profile]);

  const handoffHelper = useMemo(() => {
    if (!profile) return '';
    return getHandoffHelperText(profile);
  }, [profile]);

  const handleGenerate = () => {
    if (!upstream || !profile) return;
    const qaComposed = composeQaChecks(profile);
    const handoffComposed = composeHandoffItems(profile);
    const closeoutComposed = composeCloseout(upstream);
    setQaChecks(qaComposed);
    setHandoffItems(handoffComposed);
    setCloseout({
      ...closeout,
      deliveryMessage: closeoutComposed.deliveryMessage,
      repeatWorkPathway: closeoutComposed.repeatWorkPathway,
      finalPaymentStatus: projectContext.paymentStatus,
      completionConfirmed: false,
      testimonialRequested: false,
      testimonialStatus: 'pending',
      referralRequested: false,
      referralStatus: 'pending',
      isCloseoutCustom: false,
    });
    setGenerated(true);
  };

  const handleConfirm = () => {
    if (!closeout.completionConfirmed) return;
    const state = useDeliverySystemStore.getState();
    const pack = compileDeliveryPack(state);
    setDeliveryPack(pack);
    confirmStep();
    nextStep();
  };

  const toggleQaStatus = (id: string) => {
    const c = qaChecks.find((qc) => qc.id === id);
    if (!c) return;
    const next: Record<string, 'pending' | 'in_progress' | 'ready'> = {
      pending: 'in_progress',
      in_progress: 'ready',
      ready: 'pending',
    };
    updateQaCheck(id, { status: next[c.status] });
  };

  const toggleHandoffStatus = (id: string) => {
    const h = handoffItems.find((hi) => hi.id === id);
    if (!h) return;
    const next: Record<string, 'pending' | 'in_progress' | 'ready'> = {
      pending: 'in_progress',
      in_progress: 'ready',
      ready: 'pending',
    };
    updateHandoffItem(id, { status: next[h.status] });
  };

  const qaProgress = useMemo(() => {
    const total = qaChecks.length;
    const ready = qaChecks.filter((c) => c.status === 'ready').length;
    return { total, ready };
  }, [qaChecks]);

  const handoffProgress = useMemo(() => {
    const total = handoffItems.length;
    const ready = handoffItems.filter((h) => h.status === 'ready').length;
    return { total, ready };
  }, [handoffItems]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 7 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          QA, Final Handoff & Closeout
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">
          Complete quality checks, prepare deliverables, and finalise the project handoff.
        </p>
      </div>

      {!generated ? (
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} />
          Generate QA & Handoff Checklist
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">QA Checks Passed</p>
              <p className="text-2xl font-bold text-[#0058be] mt-1">
                {qaProgress.ready}/{qaProgress.total}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Handoff Items Ready</p>
              <p className="text-2xl font-bold text-[#0058be] mt-1">
                {handoffProgress.ready}/{handoffProgress.total}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <ClipboardList size={14} className="text-[#0058be]" />
              QA Checklist
            </h3>
            <p className="text-[11px] text-zinc-500">{qaHelper}</p>
            <div className="space-y-2">
              {qaChecks.map((qc) => (
                <div
                  key={qc.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-colors cursor-pointer',
                    qc.status === 'ready'
                      ? 'bg-emerald-50 border-emerald-200'
                      : qc.status === 'in_progress'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-zinc-200 hover:border-zinc-300',
                  )}
                  onClick={() => toggleQaStatus(qc.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0',
                        qc.status === 'ready'
                          ? 'bg-emerald-500 text-white'
                          : qc.status === 'in_progress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-200 text-zinc-500',
                      )}
                    >
                      {qc.status === 'ready' ? <Check size={12} /> : qc.status === 'in_progress' ? '~' : '·'}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-800">{qc.check}</p>
                      <span className="text-[10px] text-zinc-400 uppercase">{qc.category}</span>
                    </div>
                  </div>
                  <textarea
                    value={qc.notes}
                    onChange={(e) => updateQaCheck(qc.id, { notes: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Notes..."
                    rows={1}
                    className="w-36 ml-3 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <Download size={14} className="text-[#0058be]" />
              Final Delivery Checklist
            </h3>
            <p className="text-[11px] text-zinc-500">{handoffHelper}</p>
            <div className="space-y-2">
              {handoffItems.map((hi) => (
                <div
                  key={hi.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-colors cursor-pointer',
                    hi.status === 'ready'
                      ? 'bg-emerald-50 border-emerald-200'
                      : hi.status === 'in_progress'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-zinc-200 hover:border-zinc-300',
                  )}
                  onClick={() => toggleHandoffStatus(hi.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0',
                        hi.status === 'ready'
                          ? 'bg-emerald-500 text-white'
                          : hi.status === 'in_progress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-200 text-zinc-500',
                      )}
                    >
                      {hi.status === 'ready' ? <Check size={12} /> : hi.status === 'in_progress' ? '~' : '·'}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-800">{hi.item}</p>
                      <span
                        className={cn(
                          'text-[9px] font-medium uppercase px-1.5 py-0.5 rounded',
                          hi.type === 'file'
                            ? 'bg-blue-50 text-blue-700'
                            : hi.type === 'access'
                              ? 'bg-amber-50 text-amber-700'
                              : hi.type === 'credential'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-purple-50 text-purple-700',
                        )}
                      >
                        {hi.type}
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={hi.notes}
                    onChange={(e) => updateHandoffItem(hi.id, { notes: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Notes..."
                    rows={1}
                    className="w-36 ml-3 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <FileText size={14} className="text-[#0058be]" />
              Documentation & Usage Notes
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <textarea
                value={handoffItems
                  .filter((h) => h.type === 'documentation')
                  .map((h) => `${h.item}: ${h.notes || 'See attached'}`)
                  .join('\n')}
                onChange={() => {}}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <MessageSquare size={14} className="text-[#0058be]" />
              Final Delivery Message
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <textarea
                value={closeout.deliveryMessage}
                onChange={(e) => setCloseout({ ...closeout, deliveryMessage: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Payment Status</span>
              </div>
              <select
                value={closeout.finalPaymentStatus}
                onChange={(e) => setCloseout({ ...closeout, finalPaymentStatus: e.target.value as any })}
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              >
                <option value="not_recorded">Not Recorded</option>
                <option value="deposit_pending">Deposit Pending</option>
                <option value="deposit_received">Deposit Received</option>
                <option value="final_payment_pending">Final Payment Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Testimonial Request</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeout.testimonialRequested}
                  onChange={(e) => setCloseout({ ...closeout, testimonialRequested: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#0058be]"
                />
                <span className="text-xs text-zinc-700">Request testimonial</span>
              </label>
              {closeout.testimonialRequested && (
                <select
                  value={closeout.testimonialStatus}
                  onChange={(e) => setCloseout({ ...closeout, testimonialStatus: e.target.value as any })}
                  className="w-full h-8 px-2 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-600 focus:outline-none focus:border-[#0058be]"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="declined">Declined</option>
                  <option value="not_appropriate">Not Appropriate</option>
                </select>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Share2 size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Referral Request</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeout.referralRequested}
                  onChange={(e) => setCloseout({ ...closeout, referralRequested: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#0058be]"
                />
                <span className="text-xs text-zinc-700">Request referral</span>
              </label>
              {closeout.referralRequested && (
                <select
                  value={closeout.referralStatus}
                  onChange={(e) => setCloseout({ ...closeout, referralStatus: e.target.value as any })}
                  className="w-full h-8 px-2 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-600 focus:outline-none focus:border-[#0058be]"
                >
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                  <option value="not_appropriate">Not Appropriate</option>
                </select>
              )}
            </div>
          </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          <RefreshCw size={14} className="text-[#0058be]" />
          Repeat Work Pathway
        </h3>
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <textarea
            value={closeout.repeatWorkPathway}
            onChange={(e) => setCloseout({ ...closeout, repeatWorkPathway: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          <Mail size={14} className="text-[#0058be]" />
          Closeout Message Templates
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {(['msg-final-approval', 'msg-final-delivery', 'msg-payment-reminder', 'msg-testimonial', 'msg-referral', 'msg-repeat-work'] as const).map((id) => {
            const t = (communicationPlan?.templateLibrary ?? []).find((x) => x.id === id);
            if (!t) return null;
            return (
              <div key={id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <p className="text-[11px] font-bold text-zinc-800 mb-1">{t.label}</p>
                <p className="text-[10px] text-zinc-500 truncate">{t.subject}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <Check size={14} className="text-[#0058be]" />
              Completion Confirmation
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeout.completionConfirmed}
                  onChange={(e) => setCloseout({ ...closeout, completionConfirmed: e.target.checked })}
                  className="w-4 h-4 accent-[#0058be] mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-800">I confirm the project is complete</p>
                  <p className="text-[11px] text-zinc-500">
                    All deliverables have been reviewed by QA and the handoff checklist is ready. No pending revisions or blockers remain unresolved.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Project completed and delivered</span>
              </div>
            ) : (
              <motion.button
                onClick={handleConfirm}
                disabled={!closeout.completionConfirmed}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
                  closeout.completionConfirmed
                    ? 'bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm'
                    : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
                )}
              >
                <Check size={14} />
                Complete Project & Generate Delivery Pack
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
