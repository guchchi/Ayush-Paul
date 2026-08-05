import React from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';
import { StrategicRecommendationCard } from '../components/StrategicRecommendationCard';
import { useModule3Store } from '../../../../lib/module3/store';

interface ProfilePositioningSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const ProfilePositioningSection: React.FC<ProfilePositioningSectionProps> = ({ blueprint }) => {
  const { profilePositioning } = blueprint;
  const { acceptBlueprintRecommendation, updateMessageLayer } = useModule3Store();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          Section 2 — Stranger Perception Blueprint
        </div>
        <h3 className="text-xl font-bold text-slate-100">Profile Positioning & Message Hierarchy</h3>
        <p className="text-sm text-slate-400 mt-1">
          Define the strategic message hierarchy behind your public profiles (LinkedIn, X, Instagram) to create an immediate 5-second authority perception.
        </p>
      </div>

      {/* Mental Model Callout */}
      <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 flex items-center justify-between text-xs font-mono text-indigo-300">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          PERCEPTION SEQUENCE:
        </span>
        <span className="text-slate-300">
          WHO YOU ARE → WHAT YOU DO → WHO YOU HELP → KNOWN FOR → CREDIBILITY → NEXT STEP
        </span>
      </div>

      {/* Strategic Hierarchy Stack */}
      <div className="space-y-4">
        {profilePositioning.map((layer) => (
          <StrategicRecommendationCard
            key={layer.layerKey}
            id={layer.layerKey}
            title={layer.layerTitle}
            recommendation={layer.recommendedFocus}
            strategicRationale={layer.strategicRationale}
            actionRequired={`Perception Target: "${layer.perceptionTarget}"`}
            status={layer.status}
            userCustomization={layer.userCustomization}
            onAccept={() => acceptBlueprintRecommendation('profilePositioning', layer.layerKey)}
            onAdjust={(newValue) => updateMessageLayer(layer.layerKey, newValue)}
          />
        ))}
      </div>
    </div>
  );
};
