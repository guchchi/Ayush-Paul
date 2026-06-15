import { useState } from 'react';
import type { ProspectContext } from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';
import { getCleanOutreachContext, sanitizeText } from '../../lib/outreach-engine-system/context-helper';

type FormMode = 'select' | 'manual' | 'sample';

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <title>Selected</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ProspectContextStep() {
  const store = useOutreachEngineStore();
  const {
    phase5PipelineProspects, phase5Service, phase5ServiceLabel,
    phase5Niche,
    prospectContext, selectPipelineProspect,
    generateSampleProspect, setProspectContext, confirmStep, nextStep,
  } = store;

  const [isDark] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });

  const d = isDark === 'dark';

  const [mode, setMode] = useState<FormMode>(() => {
    if (prospectContext?.isSampleProspect) return 'sample';
    if (prospectContext && !prospectContext.isSampleProspect) return 'manual';
    return phase5PipelineProspects.length > 0 ? 'select' : 'manual';
  });

  const [manualForm, setManualForm] = useState({
    prospectName: prospectContext?.prospectName ?? '',
    companyOrChannelName: prospectContext?.companyOrChannelName ?? '',
    platform: prospectContext?.platform ?? '',
    websiteOrProfileUrl: prospectContext?.websiteOrProfileUrl ?? '',
    visibleProblem: prospectContext?.visibleProblem ?? '',
    reasonToContact: prospectContext?.reasonToContact ?? '',
    note: prospectContext?.notes ?? '',
  });

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const serviceLabel = phase5ServiceLabel ?? phase5Service ?? '';
  const niche = phase5Niche ?? '';
  const hasPipelineProspects = phase5PipelineProspects.length > 0;

  const priorityBadgeStyle = (p: string) => {
    switch (p) {
      case 'high': return d ? 'bg-red-900/20 text-red-300 border-red-800' : 'bg-red-50 text-red-600 border-red-200';
      case 'medium': return d ? 'bg-yellow-900/20 text-yellow-300 border-yellow-800' : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'low': return d ? 'bg-green-900/20 text-green-300 border-green-800' : 'bg-green-50 text-green-600 border-green-200';
      default: return d ? 'bg-zinc-800 text-zinc-400 border-zinc-600' : 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  function handleSelectPipelineProspect(index: number) {
    setSelectedIdx(index);
    selectPipelineProspect(index);
    setMode('select');
  }

  function handleManualFieldChange(field: string, value: string) {
    setManualForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveManualProspect() {
    const ctx: ProspectContext = {
      prospectName: manualForm.prospectName || 'Unnamed prospect',
      companyOrChannelName: manualForm.companyOrChannelName,
      platform: manualForm.platform || 'LinkedIn',
      websiteOrProfileUrl: manualForm.websiteOrProfileUrl,
      visibleProblem: manualForm.visibleProblem || 'Has a visible problem that your service can address.',
      reasonToContact: manualForm.reasonToContact || 'There is a clear fit between their need and your offer.',
      leadScore: 0,
      priority: 'medium',
      recommendedAsset: '',
      notes: manualForm.note,
      isSampleProspect: false,
    };
    setProspectContext(ctx);
    setMode('manual');
  }

  function handleUseSample() {
    generateSampleProspect();
    setMode('sample');
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  const cleanCtx = getCleanOutreachContext(store);

  const isComplete = prospectContext !== null && prospectContext.prospectName.length > 0;

  function modeTab(label: string, key: FormMode, show: boolean) {
    if (!show) return null;
    return (
      <button
        type="button"
        onClick={() => setMode(key)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          mode === key
            ? d ? 'bg-zinc-700 text-white shadow-sm' : 'bg-gray-800 text-white shadow-sm'
            : d ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={`space-y-6 p-4 ${d ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${d ? 'text-zinc-100' : 'text-gray-900'}`}>Prospect Context</h2>
        <p className={`mt-1 text-sm ${d ? 'text-zinc-400' : 'text-gray-500'}`}>
          Select a prospect from your pipeline, enter one manually, or use a sample prospect to test outreach flows.
        </p>
        {!niche && serviceLabel && (
          <p className={`mt-1 text-xs px-3 py-1.5 rounded-md border ${
            d ? 'text-yellow-300 bg-yellow-900/20 border-yellow-800' : 'text-yellow-600 bg-yellow-50 border-yellow-200'
          }`}>
            Sample prospects may be generic without a specific niche selected.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {modeTab('Pipeline Prospects', 'select', hasPipelineProspects)}
        {modeTab('Enter Manually', 'manual', true)}
        <button
          type="button"
          onClick={handleUseSample}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'sample'
              ? d ? 'bg-zinc-700 text-white shadow-sm' : 'bg-gray-800 text-white shadow-sm'
              : d ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          Use Sample Prospect
        </button>
      </div>

      {mode === 'select' && hasPipelineProspects && (
        <div className="space-y-3">
          <p className={`text-sm font-medium ${d ? 'text-zinc-300' : 'text-gray-700'}`}>
            Select a prospect from your pipeline:
          </p>
          <div className="grid grid-cols-1 gap-3">
            {phase5PipelineProspects.map((prospect, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPipelineProspect(idx)}
                  className={`text-left rounded-lg border-2 p-4 transition-all shadow-sm ${
                    isSelected
                      ? d ? 'border-blue-400 bg-blue-900/30' : 'border-blue-500 bg-blue-50'
                      : d ? 'border-zinc-700 bg-zinc-900 hover:border-zinc-500' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? (d ? 'text-blue-300' : 'text-blue-800') : (d ? 'text-zinc-200' : 'text-gray-800')}`}>
                      {prospect.prospectName}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          d ? 'text-blue-300 bg-blue-900/40' : 'text-blue-600 bg-blue-100'
                        }`}>
                          <CheckIcon />
                          Selected
                        </span>
                      )}
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${priorityBadgeStyle(prospect.priority)}`}>
                        {prospect.priority}
                      </span>
                    </div>
                  </div>
                  <div className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs ${d ? 'text-zinc-500' : 'text-gray-500'}`}>
                    <span>Platform: {prospect.platform}</span>
                    <span>Score: {prospect.score}</span>
                  </div>
                  <p className={`mt-1 text-xs line-clamp-2 ${isSelected ? (d ? 'text-blue-200' : 'text-blue-600') : (d ? 'text-zinc-400' : 'text-gray-500')}`}>
                    {prospect.visibleProblem}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className={`rounded-lg border p-4 space-y-4 ${d ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-sm font-medium ${d ? 'text-zinc-300' : 'text-gray-700'}`}>Enter prospect details manually</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>
                Prospect Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualForm.prospectName}
                onChange={(e) => handleManualFieldChange('prospectName', e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  d
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                    : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
                }`}
                placeholder="e.g. Sarah Chen"
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>
                Company / Channel Name
              </label>
              <input
                type="text"
                value={manualForm.companyOrChannelName}
                onChange={(e) => handleManualFieldChange('companyOrChannelName', e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  d
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                    : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
                }`}
                placeholder="e.g. Acme Corp / MyChannel"
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>Platform</label>
              <input
                type="text"
                value={manualForm.platform}
                onChange={(e) => handleManualFieldChange('platform', e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  d
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                    : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
                }`}
                placeholder="e.g. LinkedIn, YouTube, Email"
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>
                Website / Profile URL
              </label>
              <input
                type="url"
                value={manualForm.websiteOrProfileUrl}
                onChange={(e) => handleManualFieldChange('websiteOrProfileUrl', e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  d
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                    : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
                }`}
                placeholder="e.g. https://linkedin.com/in/..."
              />
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>
              Visible Problem
            </label>
            <textarea
              rows={2}
              value={manualForm.visibleProblem}
              onChange={(e) => handleManualFieldChange('visibleProblem', e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                d
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                  : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
              }`}
              placeholder="What visible problem does this prospect have that your service addresses?"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>Reason to Contact</label>
            <textarea
              rows={2}
              value={manualForm.reasonToContact}
              onChange={(e) => handleManualFieldChange('reasonToContact', e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                d
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                  : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
              }`}
              placeholder="Why should you reach out to this prospect specifically?"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${d ? 'text-zinc-400' : 'text-gray-600'}`}>Notes</label>
            <textarea
              rows={1}
              value={manualForm.note}
              onChange={(e) => handleManualFieldChange('note', e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                d
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 focus:border-blue-500 placeholder-zinc-500'
                  : 'border border-gray-300 focus:border-blue-400 placeholder-gray-400'
              }`}
              placeholder="Optional notes about this prospect"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveManualProspect}
              disabled={!manualForm.prospectName.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                manualForm.prospectName.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : d ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Prospect
            </button>
          </div>
        </div>
      )}

      {prospectContext && mode !== 'manual' && (
        <div className={`rounded-lg border p-4 space-y-2 ${
          d ? 'border-zinc-700 bg-zinc-900' : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${d ? 'text-zinc-200' : 'text-gray-800'}`}>
            Selected Prospect
            {prospectContext.isSampleProspect && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                d ? 'text-yellow-300 bg-yellow-900/30' : 'text-yellow-700 bg-yellow-100'
              }`}>
                Sample Data
              </span>
            )}
          </h3>
          {prospectContext.isSampleProspect && (
            <p className={`text-xs px-3 py-1.5 rounded-md border ${
              d ? 'text-yellow-300 bg-yellow-900/15 border-yellow-800' : 'text-yellow-700 bg-yellow-50 border-yellow-200'
            }`}>
              This is sample data for practice. Do not treat it as a real lead.
            </p>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm ${d ? 'text-zinc-300' : ''}`}>
            <div><span className={d ? 'text-zinc-500' : 'text-gray-500'}>Name:</span> {sanitizeText(prospectContext.prospectName, cleanCtx)}</div>
            {prospectContext.companyOrChannelName && (
              <div><span className={d ? 'text-zinc-500' : 'text-gray-500'}>Company:</span> {sanitizeText(prospectContext.companyOrChannelName, cleanCtx)}</div>
            )}
            <div><span className={d ? 'text-zinc-500' : 'text-gray-500'}>Platform:</span> {prospectContext.platform}</div>
            {prospectContext.leadScore > 0 && (
              <div><span className={d ? 'text-zinc-500' : 'text-gray-500'}>Lead Score:</span> {prospectContext.leadScore}</div>
            )}
            <div><span className={d ? 'text-zinc-500' : 'text-gray-500'}>Priority:</span> {prospectContext.priority}</div>
            <div className="sm:col-span-2">
              <span className={d ? 'text-zinc-500' : 'text-gray-500'}>Problem:</span> {sanitizeText(prospectContext.visibleProblem, cleanCtx)}
            </div>
            {prospectContext.reasonToContact && (
              <div className="sm:col-span-2">
                <span className={d ? 'text-zinc-500' : 'text-gray-500'}>Reason to Contact:</span> {sanitizeText(prospectContext.reasonToContact, cleanCtx)}
              </div>
            )}
          </div>
        </div>
      )}

      {import.meta.env.DEV && (
        <details className={`border border-dashed rounded-lg ${d ? 'border-zinc-800' : 'border-gray-300'}`}>
          <summary className={`px-4 py-2 text-[10px] font-mono cursor-pointer select-none rounded-lg transition-colors ${
            d ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600'
          }`}>
            View Debug Data
          </summary>
          <div className={`p-4 border-t border-dashed ${d ? 'border-zinc-800' : 'border-gray-300'}`}>
            <pre className={`text-xs font-mono overflow-x-auto whitespace-pre-wrap ${
              d ? 'text-zinc-400' : 'text-gray-600'
            }`}>
              {JSON.stringify(prospectContext, null, 2)}
            </pre>
          </div>
        </details>
      )}

      <div className={`flex justify-end pt-4 border-t ${d ? 'border-zinc-700' : 'border-gray-200'}`}>
        <button
          type="button"
          disabled={!isComplete}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : d ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
