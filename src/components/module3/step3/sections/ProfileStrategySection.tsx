import React, { useState } from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Pencil, RotateCcw, CheckCircle2, User } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

export const ProfileStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, updateProfileField, resetProfileField } = useModule3Store();
  const [activeTab, setActiveTab] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!authoritySuite || !authoritySuite.profileSystem) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center border border-neutral-200 rounded-xl bg-neutral-50/50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-500 font-medium">Generating your profile copy...</p>
      </div>
    );
  }

  const platforms = authoritySuite.profileSystem;
  
  React.useEffect(() => {
    if (platforms.length > 0 && !activeTab) {
      setActiveTab(platforms[0].platform);
    }
  }, [platforms, activeTab]);

  const activePlatformData = platforms.find((p) => p.platform === activeTab);

  const formatPlatformName = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin': return 'LinkedIn';
      case 'twitter': return 'X / Twitter';
      case 'personal_site': return 'Personal Portfolio Site';
      default: return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  const getCharLimit = (platform: string, fieldKey: string): number | null => {
    const p = platform.toLowerCase();
    const k = fieldKey.toLowerCase();
    if (p === 'linkedin' && k === 'headline') return 220;
    if (p === 'linkedin' && k === 'about') return 2600;
    if (p === 'twitter' && k === 'bio') return 160;
    if (p === 'personal_site' && k === 'hero_tagline') return 120;
    if (p === 'personal_site' && k === 'value_prop_subhead') return 250;
    return null;
  };

  const handleEditStart = (fieldKey: string, value: string) => {
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleEditSave = (platform: 'linkedin'|'twitter'|'personal_site', fieldKey: string) => {
    updateProfileField(platform, fieldKey, editValue);
    setEditingField(null);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900">
          Section 2 — Profile Identity Copy
        </h2>
        <p className="text-sm text-neutral-600">
          Review and refine your AI-generated profile copy for each platform. These are your positioning claims — the evidence placement in Section 5 will map proof to each field.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {platforms.map((p) => (
          <button
            key={p.platform}
            onClick={() => {
              setActiveTab(p.platform);
              setEditingField(null);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors duration-200",
              activeTab === p.platform
                ? "bg-indigo-600 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {formatPlatformName(p.platform)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activePlatformData && (
            <motion.div
              key={activePlatformData.platform}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              className="space-y-4"
            >
              {activePlatformData.fields.map((field) => {
                const isEditing = editingField === field.key;
                const charLimit = getCharLimit(activePlatformData.platform, field.key);
                const currentLength = isEditing ? editValue.length : field.value.length;
                const platformEnum = activePlatformData.platform as 'linkedin'|'twitter'|'personal_site';

                return (
                  <div key={field.key} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-sm font-semibold text-neutral-900">{field.label}</h4>
                        {field.isCustomized && (
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                            Customized
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {charLimit && (
                          <span className={cn(
                            "text-xs font-medium",
                            currentLength > charLimit ? "text-red-500" : "text-neutral-400"
                          )}>
                            {currentLength} / {charLimit}
                          </span>
                        )}
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(field.key, field.value)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit field"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {!isEditing && field.isCustomized && (
                          <button
                            onClick={() => resetProfileField(platformEnum, field.key)}
                            className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Reset to original AI generation"
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
                          className={cn(
                            "w-full text-sm text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y",
                            charLimit && editValue.length > charLimit && "border-red-300 focus:ring-red-500/50"
                          )}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={handleEditCancel}
                            className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(platformEnum, field.key)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                        {field.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200"
        >
          Profile Reviewed — Continue
        </button>
      </div>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
