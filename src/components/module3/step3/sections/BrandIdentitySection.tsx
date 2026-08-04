import React, { useState } from 'react';
import { BrandAssetItem } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Sparkles, Copy, Check } from 'lucide-react';

interface Props {
  assets: BrandAssetItem[];
  onAssetChange?: (id: string, newValue: string) => void;
  onAssetReset?: (id: string) => void;
}

export const BrandIdentitySection = React.memo(function BrandIdentitySection({
  assets,
  onAssetChange,
  onAssetReset,
}: Props) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    const fullText = assets
      .map((a) => `### ${a.title}\n${a.value}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="text-xl font-black tracking-tight">1. Brand Identity Engine</h3>
          </div>
          <p className="text-xs text-blue-100 font-medium">
            10 copy-ready core strategy & positioning assets. Click edit to customize any statement inline.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shrink-0"
        >
          {copiedAll ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedAll ? 'All 10 Assets Copied!' : 'Copy All 10 Brand Assets'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <EditableAssetCard
            key={asset.id}
            id={asset.id}
            title={asset.title}
            category={asset.category}
            value={asset.value}
            originalValue={asset.originalValue}
            multiline={asset.value.length > 90}
            onSave={(val) => onAssetChange && onAssetChange(asset.id, val)}
            onReset={() => onAssetReset && onAssetReset(asset.id)}
          />
        ))}
      </div>
    </section>
  );
});
