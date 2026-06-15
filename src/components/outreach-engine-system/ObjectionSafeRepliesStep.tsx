import { useState, useCallback } from 'react';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

export default function ObjectionSafeRepliesStep() {
  const store = useOutreachEngineStore();
  const {
    objectionReplies, prospectContext,
    generateObjectionReplies, updateObjectionReply,
    confirmStep, nextStep,
  } = store;

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';
  const cleanCtx = getCleanOutreachContext(store);

  const repliesGenerated = objectionReplies.length > 0;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editReply, setEditReply] = useState('');

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  }, []);

  function handleGenerate() {
    generateObjectionReplies();
  }

  function handleEditStart(reply: typeof objectionReplies[number]) {
    setEditId(reply.id);
    setEditReply(sanitizeText(reply.reply, cleanCtx));
  }

  function handleEditSave(id: string) {
    updateObjectionReply(id, { reply: editReply });
    setEditId(null);
  }

  function handleEditCancel() {
    setEditId(null);
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  function riskColor(r: string) {
    if (r === 'Very Low') return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
    if (r === 'Low') return isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600';
    return isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
  }

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Objection-Safe Replies
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Prepare respectful replies if the prospect responds with hesitation.
        </p>
      </div>

      {!repliesGenerated && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Reply Bank
        </button>
      )}

      {repliesGenerated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              {objectionReplies.length} objection replies ready:
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
            {objectionReplies.map((reply) => {
              const isEditing = editId === reply.id;
              let bgClass = isDark ? 'bg-zinc-900' : 'bg-white';
              let borderClass = isDark ? 'border-zinc-700' : 'border-gray-200';

              return (
                <div key={reply.id} className={`rounded-lg border-2 p-4 transition-all shadow-sm ${borderClass} ${bgClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                          {reply.label}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${riskColor(reply.riskLevel)}`}>
                          {reply.riskLevel}
                        </span>
                      </div>

                      <div className={`mt-2 p-2 rounded text-xs italic ${
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {reply.prospectSays}
                      </div>

                      <p className={`mt-1 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Strategy: {reply.strategy}
                      </p>

                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <textarea
                            rows={3}
                            value={editReply}
                            onChange={(e) => setEditReply(e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              isDark
                                ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 focus:border-blue-500'
                                : 'border border-gray-300 focus:border-blue-400'
                            }`}
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleEditSave(reply.id)}
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
                            {sanitizeText(reply.reply, cleanCtx)}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(sanitizeText(reply.reply, cleanCtx), reply.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                copiedId === reply.id
                                  ? 'bg-green-600 text-white'
                                  : isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {copiedId === reply.id ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditStart(reply)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Edit
                            </button>
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
          disabled={!repliesGenerated}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            repliesGenerated
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
