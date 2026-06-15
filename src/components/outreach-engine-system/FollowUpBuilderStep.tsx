import { useState, useCallback } from 'react';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

export default function FollowUpBuilderStep() {
  const store = useOutreachEngineStore();
  const {
    followUpSequence, selectedFollowUpId, prospectContext, outreachGoal,
    generateFollowUpSequence, selectFollowUpMessage, updateFollowUpMessage,
    confirmStep, nextStep,
  } = store;

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';
  const cleanCtx = getCleanOutreachContext(store);

  const seqGenerated = followUpSequence.length > 0;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  }, []);

  function handleGenerate() {
    generateFollowUpSequence();
  }

  function handleSelect(id: string) {
    selectFollowUpMessage(id);
  }

  function handleEditStart(msg: typeof followUpSequence[number]) {
    setEditId(msg.id);
    setEditMessage(sanitizeText(msg.message, cleanCtx));
  }

  function handleEditSave(id: string) {
    updateFollowUpMessage(id, { message: editMessage });
    setEditId(null);
  }

  function handleEditCancel() {
    setEditId(null);
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  const selectedMsg = followUpSequence.find((m) => m.id === selectedFollowUpId);

  function riskColor(r: string) {
    if (r === 'Very Low') return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
    if (r === 'Low') return isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600';
    return isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
  }

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Follow-Up Builder
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Create respectful follow-up messages if the prospect does not reply to your first message.
        </p>
      </div>

      <div className={`rounded-lg border p-4 space-y-2 ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Context
        </h3>
        {prospectContext ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm ${isDark ? 'text-zinc-300' : ''}`}>
            <div><span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Prospect:</span> {sanitizeText(prospectContext.prospectName, cleanCtx)}</div>
            <div><span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Platform:</span> {prospectContext.platform}</div>
            {outreachGoal && (
              <div className="sm:col-span-2">
                <span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Goal:</span> {outreachGoal.label}
              </div>
            )}
          </div>
        ) : (
          <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>No prospect selected.</p>
        )}
      </div>

      {!seqGenerated && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Follow-Up Sequence
        </button>
      )}

      {seqGenerated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              3 follow-up messages:
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Regenerate
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {followUpSequence.map((msg) => {
              const isSelected = msg.id === selectedFollowUpId;
              const isEditing = editId === msg.id;

              let borderClass: string;
              let bgClass: string;
              if (isSelected) {
                borderClass = isDark ? 'border-blue-400' : 'border-blue-500';
                bgClass = isDark ? 'bg-blue-900/30' : 'bg-blue-50';
              } else {
                borderClass = isDark ? 'border-zinc-700' : 'border-gray-200';
                bgClass = isDark ? 'bg-zinc-900' : 'bg-white';
              }

              return (
                <div key={msg.id} className={`rounded-lg border-2 p-4 transition-all shadow-sm ${borderClass} ${bgClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {msg.sequenceStep}
                        </span>
                        <h3 className={`text-sm font-semibold ${isSelected ? (isDark ? 'text-blue-300' : 'text-blue-800') : (isDark ? 'text-zinc-200' : 'text-gray-800')}`}>
                          {msg.label}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${riskColor(msg.riskLevel)}`}>
                          {msg.riskLevel}
                        </span>
                      </div>
                      <p className={`mt-1 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        {msg.timing}
                      </p>
                      <p className={`mt-1 text-xs italic ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        {msg.purpose}
                      </p>

                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <textarea
                            rows={3}
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              isDark
                                ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 focus:border-blue-500'
                                : 'border border-gray-300 focus:border-blue-400'
                            }`}
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleEditSave(msg.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
                              Save
                            </button>
                            <button type="button" onClick={handleEditCancel}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`mt-2 p-3 rounded-lg text-sm whitespace-pre-wrap border-l-4 ${
                            isDark ? 'bg-zinc-800 border-zinc-600 text-zinc-300' : 'bg-gray-50 border-gray-300 text-gray-600'
                          }`}>
                            {sanitizeText(msg.message, cleanCtx)}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(sanitizeText(msg.message, cleanCtx), msg.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                copiedId === msg.id
                                  ? 'bg-green-600 text-white'
                                  : isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {copiedId === msg.id ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditStart(msg)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Edit
                            </button>
                            {isSelected ? (
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                isDark ? 'text-blue-300 bg-blue-900/40' : 'text-blue-600 bg-blue-100'
                              }`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <title>Selected</title>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Selected
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelect(msg.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
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
          disabled={!selectedMsg}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedMsg
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : isDark ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
