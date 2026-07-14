import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ArrowRight,
  Plus,
  MessageSquare,
  GitBranch,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  FileEdit,
  Mail,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import { cn } from '../../../lib/utils';
import type {
  FeedbackRequest,
  RevisionRequest,
  ScopeChangeDecision,
  RevisionClassification,
  RevisionStatus,
  MessageTemplate,
} from '../../../types/delivery-system';

export function FeedbackRevisionStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const feedbackRequests = useDeliverySystemStore((s) => s.feedbackRequests);
  const revisionRecords = useDeliverySystemStore((s) => s.revisionRecords);
  const scopeChangeDecisions = useDeliverySystemStore((s) => s.scopeChangeDecisions);
  const addFeedbackRequest = useDeliverySystemStore((s) => s.addFeedbackRequest);
  const updateFeedbackRequest = useDeliverySystemStore((s) => s.updateFeedbackRequest);
  const addRevisionRecord = useDeliverySystemStore((s) => s.addRevisionRecord);
  const updateRevisionRecord = useDeliverySystemStore((s) => s.updateRevisionRecord);
  const addScopeChangeDecision = useDeliverySystemStore((s) => s.addScopeChangeDecision);
  const updateScopeChangeDecision = useDeliverySystemStore((s) => s.updateScopeChangeDecision);
  const communicationPlan = useDeliverySystemStore((s) => s.communicationPlan);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('feedback_revision');

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showScopeForm, setShowScopeForm] = useState(false);

  const [feedbackFocus, setFeedbackFocus] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState('');
  const [feedbackDeadline, setFeedbackDeadline] = useState('');

  const [revisionDesc, setRevisionDesc] = useState('');
  const [revisionClassification, setRevisionClassification] = useState<RevisionClassification>('included');

  const [scopeChange, setScopeChange] = useState('');
  const [scopeImpact, setScopeImpact] = useState('');

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const revisionWorkflow = useMemo(() => {
    if (!profile) return [];
    return profile.revisionWorkflow || [];
  }, [profile]);

  const handleAddFeedback = () => {
    if (!feedbackFocus.trim()) return;
    const request: FeedbackRequest = {
      id: `feedback-${Date.now()}`,
      requestedAt: new Date().toISOString().split('T')[0],
      focusArea: feedbackFocus.trim(),
      specificQuestions: feedbackQuestions.split('\n').filter(Boolean),
      deadline: feedbackDeadline,
      status: 'pending',
      isCustom: true,
    };
    addFeedbackRequest(request);
    setFeedbackFocus('');
    setFeedbackQuestions('');
    setFeedbackDeadline('');
    setShowFeedbackForm(false);
  };

  const handleAddRevision = () => {
    if (!revisionDesc.trim()) return;
    const record: RevisionRequest = {
      id: `revision-${Date.now()}`,
      description: revisionDesc.trim(),
      classification: revisionClassification,
      status: 'requested',
      response: '',
      completedAt: '',
      isCustom: true,
    };
    addRevisionRecord(record);
    setRevisionDesc('');
    setRevisionClassification('included');
    setShowRevisionForm(false);
  };

  const handleAddScopeChange = () => {
    if (!scopeChange.trim()) return;
    const decision: ScopeChangeDecision = {
      id: `scope-${Date.now()}`,
      requestedChange: scopeChange.trim(),
      impact: scopeImpact.trim(),
      decision: 'pending',
      responseNotes: '',
      isCustom: true,
    };
    addScopeChangeDecision(decision);
    setScopeChange('');
    setScopeImpact('');
    setShowScopeForm(false);
  };

  const updateRevisionClassification = (id: string, classification: RevisionClassification) => {
    updateRevisionRecord(id, { classification });
  };

  const updateRevisionStatus = (id: string, status: RevisionStatus) => {
    updateRevisionRecord(id, { status });
  };

  const updateScopeDecision = (id: string, decision: 'approved' | 'declined' | 'pending') => {
    updateScopeChangeDecision(id, { decision });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 6 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Feedback & Revision Control
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">
          Track feedback requests, revision records, and scope change decisions throughout the project.
        </p>
      </div>

      {revisionWorkflow.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <GitBranch size={16} className="text-[#0058be] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-zinc-800 font-medium">Revision Workflow Guidance</p>
            <ul className="space-y-0.5">
              {revisionWorkflow.map((step, i) => (
                <li key={i} className="text-[11px] text-zinc-500 flex items-start gap-2">
                  <span className="text-[#0058be] font-bold shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <MessageSquare size={14} className="text-[#0058be]" />
            Feedback Requests ({feedbackRequests.length})
          </h3>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] text-[11px] font-medium hover:bg-[#0058be]/20 transition-all cursor-pointer"
          >
            <Plus size={12} />
            Add Feedback Request
          </button>
        </div>

        {showFeedbackForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Focus Area</label>
              <input
                type="text"
                value={feedbackFocus}
                onChange={(e) => setFeedbackFocus(e.target.value)}
                placeholder="e.g. Visual style, pacing, tone"
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Specific Questions (one per line)</label>
              <textarea
                value={feedbackQuestions}
                onChange={(e) => setFeedbackQuestions(e.target.value)}
                rows={3}
                placeholder="What specific feedback do you need?"
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Deadline</label>
              <input
                type="date"
                value={feedbackDeadline}
                onChange={(e) => setFeedbackDeadline(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <motion.button
                onClick={handleAddFeedback}
                whileTap={{ scale: 0.97 }}
                disabled={!feedbackFocus.trim()}
                className={cn(
                  'px-4 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  feedbackFocus.trim()
                    ? 'bg-[#0058be] text-white'
                    : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
                )}
              >
                Add Request
              </motion.button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 h-8 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {feedbackRequests.length > 0 && (
          <div className="space-y-2">
            {feedbackRequests.map((fr) => (
              <div
                key={fr.id}
                className={cn(
                  'p-4 rounded-2xl border shadow-sm',
                  fr.status === 'reviewed'
                    ? 'bg-emerald-50 border-emerald-200'
                    : fr.status === 'received'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-white border-zinc-200',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-bold text-zinc-800">{fr.focusArea}</p>
                    {fr.specificQuestions.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-zinc-500">
                        {fr.specificQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-[10px] text-zinc-400">Requested: {fr.requestedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {fr.deadline && (
                      <span className="text-[10px] text-zinc-400">Due: {fr.deadline}</span>
                    )}
                    <select
                      value={fr.status}
                      onChange={(e) => updateFeedbackRequest(fr.id, { status: e.target.value as any })}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-600 focus:outline-none focus:border-[#0058be]"
                    >
                      <option value="pending">Pending</option>
                      <option value="received">Received</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <FileEdit size={14} className="text-[#0058be]" />
            Revision Records ({revisionRecords.length})
          </h3>
          <button
            onClick={() => setShowRevisionForm(!showRevisionForm)}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] text-[11px] font-medium hover:bg-[#0058be]/20 transition-all cursor-pointer"
          >
            <Plus size={12} />
            Add Revision
          </button>
        </div>

        {showRevisionForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Description</label>
              <textarea
                value={revisionDesc}
                onChange={(e) => setRevisionDesc(e.target.value)}
                rows={2}
                placeholder="Describe the requested revision"
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Classification</label>
              <div className="flex flex-wrap gap-3">
                {(['included', 'out_of_scope', 'clarification'] as RevisionClassification[]).map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="revisionClass"
                      value={c}
                      checked={revisionClassification === c}
                      onChange={() => setRevisionClassification(c)}
                      className="w-3.5 h-3.5 accent-[#0058be]"
                    />
                    <span className="text-xs text-zinc-700">
                      {c === 'included' ? 'Included' : c === 'out_of_scope' ? 'Out of Scope' : 'Clarification'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <motion.button
                onClick={handleAddRevision}
                whileTap={{ scale: 0.97 }}
                disabled={!revisionDesc.trim()}
                className={cn(
                  'px-4 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  revisionDesc.trim()
                    ? 'bg-[#0058be] text-white'
                    : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
                )}
              >
                Add Revision
              </motion.button>
              <button
                onClick={() => setShowRevisionForm(false)}
                className="px-4 h-8 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {revisionRecords.length > 0 && (
          <div className="space-y-2">
            {revisionRecords.map((rr) => (
              <div
                key={rr.id}
                className={cn(
                  'p-4 rounded-2xl border shadow-sm',
                  rr.status === 'accepted'
                    ? 'bg-emerald-50 border-emerald-200'
                    : rr.status === 'rejected'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-zinc-200',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <textarea
                      value={rr.description}
                      onChange={(e) => updateRevisionRecord(rr.id, { description: e.target.value })}
                      rows={1}
                      className="w-full text-xs font-medium text-zinc-800 bg-transparent border-none focus:outline-none resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={rr.classification}
                        onChange={(e) => updateRevisionClassification(rr.id, e.target.value as RevisionClassification)}
                        className="text-[10px] px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600 focus:outline-none focus:border-[#0058be]"
                      >
                        <option value="included">Included</option>
                        <option value="out_of_scope">Out of Scope</option>
                        <option value="clarification">Clarification</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <select
                      value={rr.status}
                      onChange={(e) => updateRevisionStatus(rr.id, e.target.value as RevisionStatus)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-600 focus:outline-none focus:border-[#0058be]"
                    >
                      <option value="requested">Requested</option>
                      <option value="in_review">In Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={rr.response}
                  onChange={(e) => updateRevisionRecord(rr.id, { response: e.target.value })}
                  placeholder="Response notes..."
                  rows={1}
                  className="w-full mt-2 text-[11px] text-zinc-500 bg-transparent border-none focus:outline-none resize-none placeholder:text-zinc-400"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <GitBranch size={14} className="text-[#0058be]" />
            Scope Change Decisions ({scopeChangeDecisions.length})
          </h3>
          <button
            onClick={() => setShowScopeForm(!showScopeForm)}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] text-[11px] font-medium hover:bg-[#0058be]/20 transition-all cursor-pointer"
          >
            <Plus size={12} />
            Add Scope Change
          </button>
        </div>

        {showScopeForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Requested Change</label>
              <textarea
                value={scopeChange}
                onChange={(e) => setScopeChange(e.target.value)}
                rows={2}
                placeholder="Describe the requested scope change"
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Impact</label>
              <textarea
                value={scopeImpact}
                onChange={(e) => setScopeImpact(e.target.value)}
                rows={2}
                placeholder="Timeline, cost, or resource impact"
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <motion.button
                onClick={handleAddScopeChange}
                whileTap={{ scale: 0.97 }}
                disabled={!scopeChange.trim()}
                className={cn(
                  'px-4 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  scopeChange.trim()
                    ? 'bg-[#0058be] text-white'
                    : 'bg-zinc-200 text-zinc-500 cursor-not-allowed',
                )}
              >
                Add Decision
              </motion.button>
              <button
                onClick={() => setShowScopeForm(false)}
                className="px-4 h-8 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {scopeChangeDecisions.length > 0 && (
          <div className="space-y-2">
            {scopeChangeDecisions.map((sc) => (
              <div
                key={sc.id}
                className={cn(
                  'p-4 rounded-2xl border shadow-sm',
                  sc.decision === 'approved'
                    ? 'bg-emerald-50 border-emerald-200'
                    : sc.decision === 'declined'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-zinc-200',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-medium text-zinc-800">{sc.requestedChange}</p>
                    {sc.impact && <p className="text-[11px] text-zinc-500">Impact: {sc.impact}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {sc.decision === 'approved' && <ThumbsUp size={12} className="text-emerald-600" />}
                    {sc.decision === 'declined' && <ThumbsDown size={12} className="text-red-600" />}
                    {sc.decision === 'pending' && <AlertTriangle size={12} className="text-amber-600" />}
                    <select
                      value={sc.decision}
                      onChange={(e) => updateScopeChangeDecision(sc.id, { decision: e.target.value as 'approved' | 'declined' | 'pending' })}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-600 focus:outline-none focus:border-[#0058be]"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={sc.responseNotes}
                  onChange={(e) => updateScopeChangeDecision(sc.id, { responseNotes: e.target.value })}
                  placeholder="Response notes..."
                  rows={1}
                  className="w-full mt-2 text-[11px] text-zinc-500 bg-transparent border-none focus:outline-none resize-none placeholder:text-zinc-400"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          <Mail size={14} className="text-[#0058be]" />
          Relevant Message Templates
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {(['msg-milestone-review', 'msg-feedback-request', 'msg-revision-confirmation', 'msg-out-of-scope', 'msg-timeline-confirmation'] as const).map((id) => {
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

      <div className="flex items-center gap-3">
        {isCompleted ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <Check size={14} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Feedback & revisions tracked</span>
          </div>
        ) : (
          <motion.button
            onClick={() => { confirmStep(); nextStep(); }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Check size={14} />
            Confirm Revisions & Proceed
            <ArrowRight size={14} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
