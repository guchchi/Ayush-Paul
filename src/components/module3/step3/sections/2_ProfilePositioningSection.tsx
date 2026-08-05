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
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <UserCheck className="w-4 h-4 text-[#0058be]" />
          Section 2 — Stranger Perception Blueprint
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Profile Positioning & Message Hierarchy</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Define the strategic message hierarchy behind your public profiles (LinkedIn, X, Instagram) to create an immediate 5-second authority perception.
        </p>
      </div>

      {/* Mental Model Callout */}
      <div className="p-4 rounded-2xl bg-[#eff4ff]/80 border border-[#0058be]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[#0058be] gap-2 shadow-xs">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide shrink-0">
          <Sparkles className="w-4 h-4 text-[#0058be]" />
          PERCEPTION SEQUENCE:
        </span>
        <span className="text-[#0b1c30] font-semibold text-right">
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
