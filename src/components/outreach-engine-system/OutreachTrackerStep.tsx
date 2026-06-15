import { useState } from 'react';
import type { OutreachTrackerEntry, TrackerStatus } from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

const STATUS_OPTIONS: TrackerStatus[] = [
  'Not Contacted', 'Draft Ready', 'Sent', 'Follow-Up Needed',
  'Replied', 'Interested', 'Not Interested', 'Later', 'Converted',
];

const STATUS_HELP: Record<TrackerStatus, string> = {
  'Not Contacted': 'Message is not ready or not sent yet.',
  'Draft Ready': 'Message has been created and should be reviewed before manual sending.',
  'Sent': 'User manually sent the message.',
  'Follow-Up Needed': 'User should use Step 5 follow-up sequence.',
  'Replied': 'Prospect replied.',
  'Interested': 'Prospect is open to discussion.',
  'Not Interested': 'Respectfully close.',
  'Later': 'Follow up in future.',
  'Converted': 'Prospect became a client/opportunity.',
};

const STATUS_COLORS: Record<TrackerStatus, string> = {
  'Not Contacted': 'bg-gray-100 text-gray-600',
  'Draft Ready': 'bg-blue-100 text-blue-700',
  'Sent': 'bg-indigo-100 text-indigo-700',
  'Follow-Up Needed': 'bg-yellow-100 text-yellow-700',
  'Replied': 'bg-green-100 text-green-700',
  'Interested': 'bg-emerald-100 text-emerald-700',
  'Not Interested': 'bg-red-100 text-red-700',
  'Later': 'bg-purple-100 text-purple-700',
  'Converted': 'bg-teal-100 text-teal-700',
};

export default function OutreachTrackerStep() {
  const store = useOutreachEngineStore();
  const {
    prospectContext, outreachTracker, messageDrafts, selectedMessageDraftId,
    outreachGoal, personalizationAngles,
    generateTrackerFromProspect, updateTrackerEntry, deleteTrackerEntry,
    confirmStep, nextStep,
  } = store;

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';
  const cleanCtx = getCleanOutreachContext(store);
  const hasEntries = (outreachTracker ?? []).length > 0;
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<OutreachTrackerEntry>>({});

  function darkStatusColor(base: string): string {
    if (isDark) {
      return base.replace('bg-', 'bg-').replace('text-', 'text-')
        .replace('gray-100', 'gray-800').replace('gray-600', 'gray-300')
        .replace('blue-100', 'blue-900/30').replace('blue-700', 'blue-300')
        .replace('indigo-100', 'indigo-900/30').replace('indigo-700', 'indigo-300')
        .replace('yellow-100', 'yellow-900/30').replace('yellow-700', 'yellow-300')
        .replace('green-100', 'green-900/30').replace('green-700', 'green-300')
        .replace('emerald-100', 'emerald-900/30').replace('emerald-700', 'emerald-300')
        .replace('red-100', 'red-900/30').replace('red-700', 'red-300')
        .replace('purple-100', 'purple-900/30').replace('purple-700', 'purple-300')
        .replace('teal-100', 'teal-900/30').replace('teal-700', 'teal-300');
    }
    return base;
  }

  function handleGenerate() {
    generateTrackerFromProspect();
  }

  function handleEditStart(entry: OutreachTrackerEntry) {
    setEditId(entry.id);
    setEditFields({
      prospectName: entry.prospectName,
      companyOrChannelName: entry.companyOrChannelName,
      platform: entry.platform,
      websiteOrProfileUrl: entry.websiteOrProfileUrl,
      messageType: entry.messageType,
      status: entry.status,
      dateContacted: entry.dateContacted ?? '',
      followUpDate: entry.followUpDate ?? '',
      response: entry.response ?? '',
      nextStep: entry.nextStep ?? '',
      notes: entry.notes ?? '',
    });
  }

  function handleEditSave() {
    if (!editId) return;
    if (!editFields.prospectName?.trim()) {
      deleteTrackerEntry(editId);
    } else {
      updateTrackerEntry(editId, editFields);
    }
    setEditId(null);
    setEditFields({});
  }

  function handleEditCancel() {
    setEditId(null);
    setEditFields({});
  }

  function handleDelete(id: string) {
    deleteTrackerEntry(id);
    if (editId === id) { setEditId(null); setEditFields({}); }
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  function addEmptyEntry() {
    const newId = `tracker-${Date.now()}`;
    const entry: OutreachTrackerEntry = {
      id: newId,
      prospectName: '',
      companyOrChannelName: '',
      platform: '',
      messageType: outreachGoal?.label ?? 'Direct message',
      status: 'Not Contacted',
    };
    store.addTrackerEntry(entry);
    setEditId(newId);
    setEditFields({
      prospectName: '',
      companyOrChannelName: '',
      platform: '',
      websiteOrProfileUrl: '',
      messageType: entry.messageType,
      status: 'Not Contacted',
      dateContacted: '',
      followUpDate: '',
      response: '',
      nextStep: '',
      notes: '',
    });
  }

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Outreach Tracker
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Track who you plan to contact, who you contacted, and what the next action is.
        </p>
      </div>

      {!prospectContext && (
        <div className={`rounded-lg border p-6 text-center ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
            No prospect selected yet. Go back to Step 2 and select or add a prospect.
          </p>
        </div>
      )}

      {prospectContext && !hasEntries && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Tracker Entry
        </button>
      )}

      {hasEntries && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              {outreachTracker.length} tracker entr{outreachTracker.length === 1 ? 'y' : 'ies'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addEmptyEntry}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                + Add Entry
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Generate from Prospect
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {outreachTracker
              .filter((entry) => entry.prospectName?.trim() || entry.id === editId)
              .map((entry) => {
              const isEditing = editId === entry.id;
              const sc = darkStatusColor(STATUS_COLORS[entry.status]);

              return (
                <div
                  key={entry.id}
                  className={`rounded-lg border-2 p-4 transition-all shadow-sm ${
                    isEditing
                      ? isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                      : isDark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Prospect Name</label>
                              <input type="text" value={editFields.prospectName ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, prospectName: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Company / Channel</label>
                              <input type="text" value={editFields.companyOrChannelName ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, companyOrChannelName: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Platform</label>
                              <input type="text" value={editFields.platform ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, platform: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>URL</label>
                              <input type="text" value={editFields.websiteOrProfileUrl ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, websiteOrProfileUrl: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Message Type</label>
                              <input type="text" value={editFields.messageType ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, messageType: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Status</label>
                              <select value={editFields.status ?? 'Not Contacted'} onChange={(e) => setEditFields((p) => ({ ...p, status: e.target.value as TrackerStatus }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`}>
                                {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                              </select>
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Date Contacted</label>
                              <input type="date" value={editFields.dateContacted ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, dateContacted: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Follow-Up Date</label>
                              <input type="date" value={editFields.followUpDate ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, followUpDate: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                            </div>
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Response</label>
                            <textarea rows={2} value={editFields.response ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, response: e.target.value }))}
                              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Next Step</label>
                            <textarea rows={1} value={editFields.nextStep ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, nextStep: e.target.value }))}
                              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Notes</label>
                            <textarea rows={2} value={editFields.notes ?? ''} onChange={(e) => setEditFields((p) => ({ ...p, notes: e.target.value }))}
                              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-zinc-800 border border-zinc-600 text-zinc-100' : 'border border-gray-300'}`} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                              {entry.prospectName || 'Unnamed'}
                            </h3>
                            {entry.companyOrChannelName && (
                              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                {entry.companyOrChannelName}
                              </span>
                            )}
                          </div>
                          <div className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            <span>Platform: {entry.platform || 'N/A'}</span>
                            <span>Type: {entry.messageType}</span>
                            {entry.dateContacted && <span>Contacted: {entry.dateContacted}</span>}
                            {entry.followUpDate && <span>Follow-up: {entry.followUpDate}</span>}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc}`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {STATUS_HELP[entry.status]}
                          </p>
                          {entry.response && (
                            <div className={`mt-2 p-2 rounded text-xs ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                              <span className="font-medium">Response:</span> {entry.response}
                            </div>
                          )}
                          {entry.nextStep && (
                            <p className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                              <span className="font-medium">Next:</span> {sanitizeText(entry.nextStep, cleanCtx)}
                            </p>
                          )}
                          {entry.notes && (
                            <p className={`mt-1 text-xs italic ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                              {sanitizeText(entry.notes, cleanCtx)}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className={`mt-3 pt-3 border-t flex flex-wrap gap-2 ${isDark ? 'border-zinc-700' : 'border-gray-100'}`}>
                    {isEditing ? (
                      <>
                        <button type="button" onClick={handleEditSave}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">Save</button>
                        <button type="button" onClick={handleEditCancel}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Cancel</button>
                        <button type="button" onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-all">Delete</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => handleEditStart(entry)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Edit</button>
                        <button type="button" onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-all">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`flex justify-end pt-4 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
