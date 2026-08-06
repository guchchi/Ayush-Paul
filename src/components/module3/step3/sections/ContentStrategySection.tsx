import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { useModule3Store } from '../../../../lib/module3/store';
import type { ContentRoadmapOutput } from '../../../../types/module3-step3-authority';
import { generateContentRoadmap } from '../../../../data/module3/content-roadmap';
import { cn } from '../../../../lib/utils';
import { DURATION, EASING } from '../../../../lib/motion-presets';

interface Props {
  onContinue: () => void;
}

export const ContentStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { 
    authorityPosition, 
    mod1NicheId, 
    mod2UniqueMechanism, 
    mod1ServiceId, 
    step3ContentRoadmap, 
    setStep3ContentRoadmap 
  } = useModule3Store();

  const [localRoadmap, setLocalRoadmap] = useState<ContentRoadmapOutput | null>(null);

  useEffect(() => {
    if (step3ContentRoadmap) {
      setLocalRoadmap(step3ContentRoadmap);
    } else {
      const generated = generateContentRoadmap({
        position: authorityPosition,
        niche: mod1NicheId,
        mechanism: mod2UniqueMechanism,
        serviceId: mod1ServiceId,
      });
      setLocalRoadmap(generated);
    }
  }, [step3ContentRoadmap, authorityPosition, mod1NicheId, mod2UniqueMechanism, mod1ServiceId]);

  if (!localRoadmap) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSave = () => {
    setStep3ContentRoadmap(localRoadmap);
    onContinue();
  };

  const pillarColors = [
    'border-l-indigo-500',
    'border-l-emerald-500',
    'border-l-amber-500',
    'border-l-rose-500',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Section 6 — Content Roadmap</h2>
        <p className="mt-2 text-slate-600">
          Your content roadmap is generated from your authority position and niche. These pillars and starter posts are your publishing blueprint for the first 30 days.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Content Pillars
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localRoadmap.pillars.map((pillar, idx) => (
            <div key={pillar.id} className={cn("p-5 rounded-xl border bg-white shadow-sm border-l-4", pillarColors[idx % pillarColors.length])}>
              <h3 className="font-bold text-slate-800 mb-1">{pillar.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{pillar.description}</p>
              <div className="flex flex-wrap gap-2">
                {pillar.exampleTopics.map((topic, i) => (
                  <span key={i} className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-start gap-4">
        <Calendar className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-indigo-900 mb-1">Recommended Publishing Cadence</h4>
          <p className="text-sm text-indigo-700">{localRoadmap.cadence}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Zap className="w-5 h-5 text-amber-500" />
          Starter Posts (First 30 Days)
        </div>
        <div className="space-y-3">
          {localRoadmap.firstPosts.map((post, idx) => (
            <div key={post.id} className="flex gap-4 p-4 rounded-xl border bg-white shadow-sm items-start">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 mb-2">"{post.hook}"</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    post.platform.toLowerCase() === 'linkedin' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  )}>
                    {post.platform}
                  </span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                    {post.format}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" />
          Approve Content Roadmap
        </button>
      </div>
    </motion.div>
  );
});
