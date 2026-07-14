import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { composeCommunicationPlan } from '../../../lib/delivery-system/composer';
import { getCommunicationHelperText } from '../../../lib/delivery-system/personalized-content';

export function CommunicationUpdatesStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const communicationPlan = useDeliverySystemStore((s) => s.communicationPlan);
  const setCommunicationPlan = useDeliverySystemStore((s) => s.setCommunicationPlan);
  const updateMessageTemplate = useDeliverySystemStore((s) => s.updateMessageTemplate);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('communication_updates');

  const [generated, setGenerated] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const helperText = useMemo(() => {
    if (!upstream) return '';
    return getCommunicationHelperText(upstream);
  }, [upstream]);

  const handleGenerate = () => {
    if (!upstream) return;
    const composed = composeCommunicationPlan(upstream);
    setCommunicationPlan(composed);
    setGenerated(true);
  };

  const handleConfirm = () => {
    confirmStep();
    nextStep();
  };

  const step5Templates = useMemo(() => {
    return (communicationPlan.templateLibrary ?? []).filter((t) =>
      ['msg-kickoff', 'msg-asset-request', 'msg-missing-info', 'msg-progress', 'msg-clarification', 'msg-delay', 'msg-action-reminder'].includes(t.id)
    );
  }, [communicationPlan.templateLibrary]);

  const getTemplateById = (id: string) => {
    return (communicationPlan.templateLibrary ?? []).find((t) => t.id === id);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 5 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Communication & Progress Updates
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
          Generate Communication Plan
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Update Frequency</span>
              </div>
              <input
                type="text"
                value={communicationPlan.updateFrequency}
                onChange={(e) =>
                  setCommunicationPlan({ ...communicationPlan, updateFrequency: e.target.value, cadence: `Updates ${e.target.value.toLowerCase()}` })
                }
                className="w-full text-sm font-bold text-zinc-800 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Preferred Channel</span>
              </div>
              <input
                type="text"
                value={communicationPlan.preferredChannel}
                onChange={(e) =>
                  setCommunicationPlan({ ...communicationPlan, preferredChannel: e.target.value })
                }
                className="w-full text-sm font-bold text-zinc-800 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Phone size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Escalation Contact</span>
              </div>
              <input
                type="text"
                value={communicationPlan.escalationContact}
                onChange={(e) =>
                  setCommunicationPlan({ ...communicationPlan, escalationContact: e.target.value })
                }
                className="w-full text-sm font-bold text-zinc-800 bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Communication Cadence</label>
            <input
              type="text"
              value={communicationPlan.cadence}
              onChange={(e) => setCommunicationPlan({ ...communicationPlan, cadence: e.target.value })}
              className="w-full h-9 px-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <Mail size={14} className="text-[#0058be]" />
              Message Templates
            </h3>
            <div className="space-y-3">
              {step5Templates.map((template) => {
                const isExpanded = expandedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                      className="w-full flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs font-bold text-zinc-800">{template.label}</span>
                      <span className="text-[10px] text-zinc-400">{isExpanded ? 'Collapse' : 'Expand'}</span>
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 mt-4 pt-4 border-t border-zinc-100"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Channel</label>
                          <input
                            type="text"
                            value={template.channel}
                            onChange={(e) => updateMessageTemplate(template.id, { channel: e.target.value })}
                            className="w-full h-8 px-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Subject</label>
                          <input
                            type="text"
                            value={template.subject}
                            onChange={(e) => updateMessageTemplate(template.id, { subject: e.target.value })}
                            className="w-full h-8 px-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Body</label>
                          <textarea
                            value={template.body}
                            onChange={(e) => updateMessageTemplate(template.id, { body: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none font-mono"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <HelpCircle size={14} className="text-[#0058be]" />
              Communication Boundaries
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <textarea
                value={`Preferred channel: ${communicationPlan.preferredChannel}\nUpdate frequency: ${communicationPlan.updateFrequency}\nEscalation contact: ${communicationPlan.escalationContact}\nResponse time expectation: Within 24 hours on business days`}
                onChange={() => {}}
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Communication plan confirmed</span>
              </div>
            ) : (
              <motion.button
                onClick={handleConfirm}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Check size={14} />
                Confirm Communication & Proceed
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
