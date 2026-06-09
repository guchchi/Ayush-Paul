import React, { useState } from 'react';
import { Video, Users, Clock, CheckCircle2, XCircle, Bell, Send, Mail, AlertTriangle, Copy } from 'lucide-react';
import { auth } from '../../../firebase';
import { cn } from '../../../lib/utils';

interface WorkshopDashboardProps {
  workshops: any[];
  workshopRegistrations: any[];
  addToast: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  onRefresh: () => void;
}

export const WorkshopDashboard: React.FC<WorkshopDashboardProps> = ({
  workshops,
  workshopRegistrations,
  addToast,
  onRefresh,
}) => {
  const [sendingWorkshop, setSendingWorkshop] = useState<string | null>(null);
  const [sendingAction, setSendingAction] = useState<string | null>(null);

  const upcomingCount = workshops.filter((w) => w.workshopStatus === 'UPCOMING').length;
  const liveCount = workshops.filter((w) => w.workshopStatus === 'LIVE').length;
  const draftCount = workshops.filter((w) => w.workshopStatus === 'DRAFT').length;
  const completedCount = workshops.filter((w) => w.workshopStatus === 'COMPLETED').length;
  const cancelledCount = workshops.filter((w) => w.workshopStatus === 'CANCELLED').length;

  const totalRegistrations = workshopRegistrations.length;
  const registeredCount = workshopRegistrations.filter((r) => r.registrationType === 'registered').length;
  const waitlistCount = workshopRegistrations.filter((r) => r.registrationType === 'waitlist').length;

  const getRegistrationsForWorkshop = (workshopId: string) =>
    workshopRegistrations.filter((r) => r.workshopId === workshopId);

  const handleSendEmail = async (workshopId: string, action: string, label: string, extra: Record<string, string> = {}) => {
    setSendingWorkshop(workshopId);
    setSendingAction(action);
    try {
      const userInstance = auth.currentUser;
      if (!userInstance) throw new Error("Not authenticated");
      const token = await userInstance.getIdToken();

      const res = await fetch("/api/workshop-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, workshopId, ...extra }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error('[WorkshopDashboard] Non-JSON response:', text);
        addToast(`Server error: ${text.slice(0, 120)}`, "error");
        return;
      }
      if (data.success) {
        addToast(`${label}: ${data.notified} registrant(s) notified.`, "success");
        onRefresh();
      } else {
        addToast(data.error || `Failed to send ${label}.`, "error");
      }
    } catch (err: any) {
      addToast(`Failed to send: ${err.message}`, "error");
    } finally {
      setSendingWorkshop(null);
      setSendingAction(null);
    }
  };

  const reminderTypes: { label: string; type: string }[] = [
    { label: 'Send 24h Reminder', type: '24h' },
    { label: 'Send 1h Reminder', type: '1h' },
    { label: 'Send 5m Reminder', type: '5m' },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      UPCOMING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      LIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
      COMPLETED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
      <span className={cn('px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border', styles[status] || 'bg-white/5 text-white/40 border-white/10')}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Video size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{workshops.length}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Workshops</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{upcomingCount}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Video size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{liveCount}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Live Now</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedCount}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle size={18} className="text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{cancelledCount}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Stats */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Registrations Overview</h3>
            <p className="text-white/40 text-xs">{totalRegistrations} total registration(s)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Total</div>
            <div className="text-2xl font-bold text-white">{totalRegistrations}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Registered (Vault)</div>
            <div className="text-2xl font-bold text-white">{registeredCount}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Waitlist</div>
            <div className="text-2xl font-bold text-white">{waitlistCount}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Drafts</div>
            <div className="text-2xl font-bold text-white">{draftCount}</div>
          </div>
        </div>
      </div>

      {/* Workshop List with Email Controls */}
      <div className="space-y-4">
        {workshops.map((workshop) => {
          const regs = getRegistrationsForWorkshop(workshop.id);
          const isLive = workshop.workshopStatus === 'LIVE';
          const isUpcoming = workshop.workshopStatus === 'UPCOMING';
          const isCompleted = workshop.workshopStatus === 'COMPLETED';
          const isCancelled = workshop.workshopStatus === 'CANCELLED';
          const hasMeetingLink = !!workshop.meetingLink;
          const hasRecording = !!workshop.recordingUrl;
          const busy = sendingWorkshop === workshop.id;

          return (
            <div
              key={workshop.id}
              className="bg-white/5 rounded-[2.5rem] border border-white/10 p-6 group hover:border-brand-primary/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {workshop.thumbnail ? (
                    <div className="w-14 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <img
                        src={workshop.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 shrink-0">
                      <Video size={18} />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-bold text-white">{workshop.title || 'Untitled'}</h4>
                      {statusBadge(workshop.workshopStatus)}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">
                      {workshop.date}{workshop.time ? ` • ${workshop.time}` : ''}
                      {workshop.meetingPlatform ? ` • ${workshop.meetingPlatform}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-lg">
                    {regs.length} reg(s)
                  </span>
                  <span className="text-[10px] font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-lg">
                    {regs.filter(r => r.registrationType === 'registered').length} vault
                  </span>
                </div>
              </div>

              {/* Email Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {isUpcoming && reminderTypes.map((rt) => (
                  <button
                    key={rt.type}
                    onClick={() => handleSendEmail(workshop.id, 'send-reminder', rt.label, { reminderType: rt.type })}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {busy && sendingAction === 'send-reminder' ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Bell size={12} />}
                    {rt.label}
                  </button>
                ))}
                {(isLive || isUpcoming) && hasMeetingLink && (
                  <button
                    onClick={() => handleSendEmail(workshop.id, 'send-live-notification', 'Live Notification')}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {busy && sendingAction === 'send-live-notification' ? <div className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <Send size={12} />}
                    Send Live Now
                  </button>
                )}
                {(isCompleted || isLive) && hasRecording && (
                  <button
                    onClick={() => handleSendEmail(workshop.id, 'send-recording', 'Recording Available')}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {busy && sendingAction === 'send-recording' ? <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" /> : <Mail size={12} />}
                    Send Recording
                  </button>
                )}
                {isCancelled && (
                  <button
                    onClick={() => handleSendEmail(workshop.id, 'send-cancellation', 'Cancellation Notice')}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {busy && sendingAction === 'send-cancellation' ? <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <AlertTriangle size={12} />}
                    Send Cancellation
                  </button>
                )}
                {(isUpcoming || isLive) && (
                  <button
                    onClick={() => handleSendEmail(workshop.id, 'send-confirmation-all', 'Confirmation Email')}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {busy && sendingAction === 'send-confirmation-all' ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail size={12} />}
                    Send Confirmation
                  </button>
                )}
              </div>

              {/* Status Automation Info */}
              <div className="flex flex-wrap gap-3 mt-3 text-[9px] text-white/30">
                {isLive && !hasMeetingLink && (
                  <span className="text-yellow-400">⚠️ Missing meeting link — add before sending live notification</span>
                )}
                {isCompleted && !hasRecording && (
                  <span className="text-yellow-400">⚠️ No recording URL set — add to enable recording email</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
