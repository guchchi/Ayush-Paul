import { motion } from 'motion/react';
import { Check, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

export interface Skill {
  id: string;
  title: string;
  description: string;
  demand: 'high' | 'medium' | 'low';
}

interface SkillInventoryProps {
  skills: Skill[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const demandColors = {
  high: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  low: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const demandLabels = {
  high: 'High Demand',
  medium: 'Medium Demand',
  low: 'Low Demand',
};

export function SkillInventory({ skills, selected, onSelect }: SkillInventoryProps) {
  const selectedSkill = skills.find((s) => s.id === selected);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={14} className="text-brand-primary" />
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
          Select Your Primary Skill
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill, i) => {
          const isSelected = selected === skill.id;

          return (
            <motion.button
              key={skill.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease: EASING.PREMIUM }}
              onClick={() => onSelect(skill.id)}
              className={cn(
                'relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group',
                isSelected
                  ? 'border-brand-primary/40 bg-brand-primary/[0.06] shadow-[0_0_30px_-8px_rgba(0,88,190,0.15)]'
                  : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12]',
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
                  <Check size={12} className="text-white" />
                </div>
              )}

              <h3 className={cn(
                'text-sm font-semibold mb-1.5',
                isSelected ? 'text-white' : 'text-white/80',
              )}>
                {skill.title}
              </h3>

              <p className={cn(
                'text-xs leading-relaxed mb-3',
                isSelected ? 'text-white/60' : 'text-white/40',
              )}>
                {skill.description}
              </p>

              <div className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border',
                demandColors[skill.demand],
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {demandLabels[skill.demand]}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center gap-2"
        >
          <Check size={12} className="text-brand-primary shrink-0" />
          <p className="text-xs text-brand-primary/80">
            Selected: <span className="font-semibold text-brand-primary">{selectedSkill.title}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
