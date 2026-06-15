import { useState } from 'react';
import type { PersonalizationAngle } from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

export default function PersonalizationAngleStep() {
  const store = useOutreachEngineStore();
  const {
    prospectContext, outreachGoal, personalizationAngles, selectedAngleId,
    phase5Service, phase5Niche, phase5PortfolioAsset, phase5AuthorityAngle,
    generatePersonalizationAngles, selectPersonalizationAngle,
    updatePersonalizationAngle, confirmStep, nextStep,
  } = store;

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';
  const anglesGenerated = personalizationAngles.length > 0;
  const selectedAngle = personalizationAngles.find((a) => a.selected);
  const cleanCtx = getCleanOutreachContext(store);

  const [editId, setEditId] = useState<string | null>(null);
  const [editWhy, setEditWhy] = useState('');
  const [editHook, setEditHook] = useState('');

  function handleGenerate() {
    generatePersonalizationAngles();
  }

  function handleSelect(angle: PersonalizationAngle) {
    selectPersonalizationAngle(angle.id);
  }

  function handleEditStart(angle: PersonalizationAngle) {
    setEditId(angle.id);
    setEditWhy(sanitizeText(angle.whyItFits, cleanCtx));
    setEditHook(sanitizeText(angle.messageHook, cleanCtx));
  }

  function handleEditSave(angleId: string) {
    updatePersonalizationAngle(angleId, { whyItFits: editWhy, messageHook: editHook });
    setEditId(null);
  }

  function handleEditCancel() {
    setEditId(null);
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  const riskColor = (r: string) => {
    if (r === 'Very Low') return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
    if (r === 'Low') return isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600';
    if (r === 'Medium') return isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    return isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
  };

  return (
    <div className={`space-y-6 p-4 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          Personalization Angle
        </h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Pick the best angle to make your outreach feel relevant and natural.
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
            <div className="sm:col-span-2">
              <span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Problem:</span> {sanitizeText(prospectContext.visibleProblem, cleanCtx)}
            </div>
            {outreachGoal && (
              <div className="sm:col-span-2">
                <span className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Goal:</span> {outreachGoal.label} ({outreachGoal.selectedTone})
              </div>
            )}
          </div>
        ) : (
          <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>No prospect selected. Go back to Step 2.</p>
        )}
      </div>

      {!anglesGenerated && (
        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          Generate Angles
        </button>
      )}

      {anglesGenerated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              Select an angle:
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
            {personalizationAngles.map((angle) => {
              const isSelected = angle.selected;

              let borderClass: string;
              let bgClass: string;

              if (isSelected) {
                borderClass = isDark ? 'border-blue-400' : 'border-blue-500';
                bgClass = isDark ? 'bg-blue-900/30' : 'bg-blue-50';
              } else {
                borderClass = isDark ? 'border-zinc-700' : 'border-gray-200';
                bgClass = isDark ? 'bg-zinc-900' : 'bg-white';
              }

              const isEditing = editId === angle.id;

              return (
                <div
                  key={angle.id}
                  className={`rounded-lg border-2 p-4 transition-all shadow-sm ${borderClass} ${bgClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${isSelected ? (isDark ? 'text-blue-300' : 'text-blue-800') : (isDark ? 'text-zinc-200' : 'text-gray-800')}`}>
                          {angle.angleName}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${riskColor(angle.riskLevel)}`}>
                          {angle.riskLevel}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                              Why it fits
                            </label>
                            <textarea
                              rows={2}
                              value={editWhy}
                              onChange={(e) => setEditWhy(e.target.value)}
                              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                isDark
                                  ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 focus:border-blue-500'
                                  : 'border border-gray-300 focus:border-blue-400'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                              Message hook
                            </label>
                            <textarea
                              rows={2}
                              value={editHook}
                              onChange={(e) => setEditHook(e.target.value)}
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
                              onClick={() => handleEditSave(angle.id)}
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
                          <p className={`mt-2 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {sanitizeText(angle.whyItFits, cleanCtx)}
                          </p>
                          <div className={`mt-2 p-3 rounded-lg text-sm italic border-l-4 ${
                            isDark ? 'bg-zinc-800 border-zinc-600 text-zinc-300' : 'bg-gray-50 border-gray-300 text-gray-600'
                          }`}>
                            {sanitizeText(angle.messageHook, cleanCtx)}
                          </div>
                          <div className={`mt-2 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            Best channels: {angle.bestChannel.join(', ')}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {isEditing ? null : (
                        <>
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
                              onClick={() => handleSelect(angle)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Select
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditStart(angle)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Edit
                          </button>
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
          disabled={!selectedAngle}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedAngle
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
