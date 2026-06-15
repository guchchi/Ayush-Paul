import { useState, useCallback } from 'react';
import type { MessageDraft } from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

const CHANNEL_ICONS: Record<string, string> = {
  linkedin_dm: 'in',
  email: '@',
  instagram_twitter_dm: 'DM',
  website_contact_form: 'WWW',
  community_message: 'COM',
};

export default function MessageBuilderStep() {
  const store = useOutreachEngineStore();
  const {
    messageDrafts, selectedMessageDraftId, outreachGoal,
    generateMessageDrafts, selectMessageDraft, updateMessageDraft,
    confirmStep, nextStep,
  } = store;

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';

  const draftsGenerated = messageDrafts.length > 0;
  const selectedDraft = messageDrafts.find((d) => d.id === selectedMessageDraftId);

  const cleanCtx = getCleanOutreachContext(store);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editDraftId, setEditDraftId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const handleCopy = useCallback(async (text: string, draftId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(draftId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  }, []);

  function handleGenerate() {
    generateMessageDrafts();
  }

  function handleSelect(draftId: string) {
    selectMessageDraft(draftId);
  }

  function handleEditStart(draft: MessageDraft) {
    setEditDraftId(draft.id);
    setEditSubject(sanitizeText(draft.subject ?? '', cleanCtx));
    setEditMessage(sanitizeText(draft.message, cleanCtx));
  }

  function handleEditSave(draftId: string) {
    const patch: Partial<MessageDraft> = { message: editMessage };
    const draft = messageDrafts.find((d) => d.id === draftId);
    if (draft?.channel === 'email') patch.subject = editSubject;
    updateMessageDraft(draftId, patch);
    setEditDraftId(null);
  }

  function handleEditCancel() {
    setEditDraftId(null);
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Message Builder
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Generate the first outreach message based on your goal, prospect, and chosen angle.
        </p>
      </div>

      {!draftsGenerated && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Message Drafts
        </button>
      )}

      {draftsGenerated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              Choose a channel and select a draft:
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
            {messageDrafts.map((draft) => {
              const isSelected = draft.id === selectedMessageDraftId;
              const isEditing = editDraftId === draft.id;

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
                <div
                  key={draft.id}
                  className={`rounded-lg border-2 p-4 transition-all shadow-sm ${borderClass} ${bgClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                        isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {CHANNEL_ICONS[draft.channel] ?? '?'}
                      </span>
                      <div>
                        <h3 className={`text-sm font-semibold ${isSelected ? (isDark ? 'text-blue-300' : 'text-blue-800') : (isDark ? 'text-zinc-200' : 'text-gray-800')}`}>
                          {draft.label}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                          {draft.bestFor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                          onClick={() => handleSelect(draft.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-3">
                      {draft.channel === 'email' && (
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Subject
                          </label>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              isDark
                                ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 focus:border-blue-500'
                                : 'border border-gray-300 focus:border-blue-400'
                            }`}
                          />
                        </div>
                      )}
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                          Message
                        </label>
                        <textarea
                          rows={5}
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            isDark
                              ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 focus:border-blue-500'
                              : 'border border-gray-300 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSave(draft.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {draft.channel === 'email' && draft.subject && (
                        <div className={`mt-3 flex items-center gap-2 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Subject:</span>
                          <span className={isDark ? 'text-zinc-300' : 'text-gray-700'}>{sanitizeText(draft.subject, cleanCtx)}</span>
                        </div>
                      )}
                      <div className={`mt-2 p-3 rounded-lg text-sm whitespace-pre-wrap border-l-4 ${
                        isDark ? 'bg-zinc-800 border-zinc-600 text-zinc-300' : 'bg-gray-50 border-gray-300 text-gray-600'
                      }`}>
                        {sanitizeText(draft.message, cleanCtx)}
                      </div>
                      <div className={`mt-2 flex items-center justify-between text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        <span>Tone: {draft.tone} | {draft.riskLevel} risk | {draft.message.length} chars</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const copyText = draft.channel === 'email' && draft.subject
                              ? `Subject: ${sanitizeText(draft.subject, cleanCtx)}\n\n${sanitizeText(draft.message, cleanCtx)}`
                              : sanitizeText(draft.message, cleanCtx);
                            handleCopy(copyText, draft.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            copiedId === draft.id
                              ? 'bg-green-600 text-white'
                              : isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {copiedId === draft.id ? 'Copied!' : 'Copy Message'}
                        </button>
                        {draft.channel === 'email' && draft.subject && (
                          <button
                            type="button"
                            onClick={() => handleCopy(sanitizeText(draft.message, cleanCtx), `${draft.id}-body`)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              copiedId === `${draft.id}-body`
                                ? 'bg-green-600 text-white'
                                : isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {copiedId === `${draft.id}-body` ? 'Copied!' : 'Copy Body Only'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditStart(draft)}
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
              );
            })}
          </div>
        </div>
      )}

      <div className={`flex justify-end pt-4 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
        <button
          type="button"
          disabled={!selectedDraft}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedDraft
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
