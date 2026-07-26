import React from 'react';
import { BrandingStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { Palette } from 'lucide-react';

interface Props {
  branding: BrandingStrategyParams;
}

export const BrandingStrategySection = React.memo(function BrandingStrategySection({ branding }: Props) {
  return (
    <StrategyAccordion 
      title="Branding Strategy" 
      subtitle="Visual and verbal identity guidelines"
      icon={<Palette className="w-5 h-5" />}
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={branding.personalizationNote}
          educational={branding.educational}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Visual Consistency</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {branding.visualConsistency}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Tone of Voice</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {branding.toneOfVoice}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Typography</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {branding.typography}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Color Usage</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {branding.colorUsage}
            </p>
          </div>
        </div>
      </div>
    </StrategyAccordion>
  );
});
