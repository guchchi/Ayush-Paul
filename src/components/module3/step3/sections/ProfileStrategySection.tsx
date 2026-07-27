import React from 'react';
import { ProfileStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { StrategyActionPanel } from '../components/StrategyActionPanel';
import { UserCircle } from 'lucide-react';

interface Props {
  profile: ProfileStrategyParams;
}

export const ProfileStrategySection = React.memo(function ProfileStrategySection({ profile }: Props) {
  return (
    <StrategyAccordion 
      title="Profile Strategy" 
      subtitle="How you present yourself across platforms"
      icon={<UserCircle className="w-5 h-5" />}
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={profile.personalizationNote}
          educational={profile.educational}
        />
        {profile.metadata && (
          <StrategyActionPanel metadata={profile.metadata} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Display Name</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">{profile.displayName}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Headline</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">{profile.headline}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Bio Structure</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 whitespace-pre-line">{profile.bio}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Profile Image Concept</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">{profile.profileImageConcept}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Banner Concept</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">{profile.bannerConcept}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">Call to Action (Link)</h4>
              <p className="text-sm text-indigo-600 font-medium bg-indigo-50 p-3 rounded-lg border border-indigo-100">{profile.callToAction}</p>
            </div>
          </div>
        </div>
      </div>
    </StrategyAccordion>
  );
});
