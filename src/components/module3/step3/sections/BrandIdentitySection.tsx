import React, { useState, useEffect } from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { Pencil, RotateCcw, CheckCircle2 } from 'lucide-react';
import { formatSnakeCaseWords } from '../../../../data/module3/authority-suite-engine';
import type { BrandIdentityOutput } from '../../../../types/module3-step3-authority';

interface Props {
  onContinue: () => void;
}

const TONE_PILLAR_OPTIONS: Record<string, string[]> = {
  builder: ['Transparent', 'Educational', 'Process-Driven', 'Iterative', 'Precise'],
  auditor: ['Critical', 'Standards-First', 'Evidence-Based', 'Direct', 'Analytical'],
  deconstructor: ['Contrarian', 'Intellectual', 'Systemic', 'Provocative', 'Research-Led'],
  practitioner: ['Client-Centric', 'Outcome-Focused', 'Empathetic', 'Proven', 'Grounded'],
};

const VISUAL_DIRECTIONS = ['Clean & Minimal', 'Bold & Confident', 'Warm & Human', 'Technical & Precise'];

export const BrandIdentitySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, authorityPosition, updateBrandAsset, resetBrandAsset, setStep3BrandIdentity } = useModule3Store();
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const defaultPillars = authorityPosition ? TONE_PILLAR_OPTIONS[authorityPosition]?.slice(0, 2) || [] : [];
  const [selectedTonePillars, setSelectedTonePillars] = useState<string[]>(defaultPillars);
  const [selectedVisualDirection, setSelectedVisualDirection] = useState<string>(VISUAL_DIRECTIONS[0]);

  // Re-sync default pillars if authority position changes
  useEffect(() => {
    if (authorityPosition) {
      const opts = TONE_PILLAR_OPTIONS[authorityPosition] || [];
      setSelectedTonePillars(opts.slice(0, 2));
    }
  }, [authorityPosition]);

  if (!authoritySuite || !authoritySuite.brandAssets) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center border border-neutral-200 rounded-xl bg-neutral-50/50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-500 font-medium">Generating your brand identity...</p>
      </div>
    );
  }

  const { brandAssets } = authoritySuite;

  // Group assets by category
  const groupedAssets = brandAssets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, typeof brandAssets>);

  const handleEditStart = (assetId: string, value: string) => {
    setEditingField(assetId);
    setEditValue(value);
  };

  const handleEditSave = (assetId: string) => {
    updateBrandAsset(assetId, editValue);
    setEditingField(null);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const toggleTonePillar = (pillar: string) => {
    setSelectedTonePillars((prev) => {
      if (prev.includes(pillar)) {
        return prev.filter((p) => p !== pillar);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), pillar];
      }
      return [...prev, pillar];
    });
  };

  const handleConfirm = () => {
    const soundLike = brandAssets
      .filter((a) => a.key === 'brand_voice' || a.category === 'Voice')
      .map((a) => a.value);

    const output: BrandIdentityOutput = {
      tonePillars: selectedTonePillars,
      soundLike,
      dontSoundLike: [],
      visualDirection: selectedVisualDirection,
      confirmedAt: new Date().toISOString(),
      isCustomized: true,
      sourceAssetIds: brandAssets.map((a) => a.id),
    };
    
    setStep3BrandIdentity(output);
    onContinue();
  };

  const toneOptions = authorityPosition ? TONE_PILLAR_OPTIONS[authorityPosition] || [] : [];

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900">
          Section 3 — Brand Identity Confirmation
        </h2>
        <p className="text-sm text-neutral-600">
          Your AI-generated brand identity is below. Review and confirm your tone, positioning language, and visual direction.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedAssets).map(([category, assets]) => (
          <div key={category} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">
                {formatSnakeCaseWords(category)}
              </h3>
            </div>
            <div className="p-5 space-y-5">
              {assets.map((asset) => {
                const isEditing = editingField === asset.id;

                return (
                  <div key={asset.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-neutral-700">{asset.title}</h4>
                        {asset.isCustomized && (
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                            Customized
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(asset.id, asset.value)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit asset"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {!isEditing && asset.isCustomized && (
                          <button
                            onClick={() => resetBrandAsset(asset.id)}
                            className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Reset to AI default"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-sm text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={handleEditCancel}
                            className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(asset.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-600 whitespace-pre-wrap">
                        {asset.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Tone Pillars</h3>
          <p className="text-xs text-neutral-500 mt-1">Select up to 3 tones for your content style</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map((pillar) => {
            const isSelected = selectedTonePillars.includes(pillar);
            return (
              <button
                key={pillar}
                onClick={() => toggleTonePillar(pillar)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  isSelected
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {pillar}
              </button>
            );
          })}
          {toneOptions.length === 0 && (
            <p className="text-sm text-neutral-500 italic">No authority position set</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Visual Direction</h3>
          <p className="text-xs text-neutral-500 mt-1">Choose the aesthetic for your authority assets</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {VISUAL_DIRECTIONS.map((direction) => {
            const isSelected = selectedVisualDirection === direction;
            return (
              <button
                key={direction}
                onClick={() => setSelectedVisualDirection(direction)}
                className={cn(
                  "p-4 rounded-xl border text-center transition-colors flex items-center justify-center min-h-[80px]",
                  isSelected
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <span className="text-sm font-medium leading-tight">{direction}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleConfirm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200"
        >
          Confirm Brand Identity
        </button>
      </div>
    </div>
  );
});

BrandIdentitySection.displayName = 'BrandIdentitySection';
