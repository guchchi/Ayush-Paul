import React from 'react';
import { motion } from 'motion/react';
import { PublishingRoadmapPhase } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { Map, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useModule3Store } from '../../../../lib/module3';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  roadmap: PublishingRoadmapPhase[];
}

export const PublishingRoadmapSection = React.memo(function PublishingRoadmapSection({ roadmap }: Props) {
  const executionProgress = useModule3Store((s) => s.executionProgress);
  const setTaskCompletion = useModule3Store((s) => s.setTaskCompletion);

  return (
    <StrategyAccordion 
      title="Publishing Roadmap" 
      subtitle="Step-by-step execution plan"
      icon={<Map className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {(roadmap || []).map((phase, phaseIdx) => (
          <div key={phaseIdx} className="relative group/phase">
            {/* Timeline connector */}
            {phaseIdx !== (roadmap || []).length - 1 && (
              <div className="absolute left-3.5 top-10 bottom-[-24px] w-0.5 bg-neutral-100 group-hover/phase:bg-[#0058be]/10 transition-colors duration-300"></div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-[#f8fafc] text-[#0058be] text-xs font-bold shrink-0 mt-0.5 border border-neutral-200 group-hover/phase:border-[#0058be]/30 group-hover/phase:bg-[#f0f6ff] transition-colors duration-300">
                {phaseIdx + 1}
              </div>
              <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:border-[#0058be]/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
                  <Calendar size={14} className="text-[#424754]" />
                  <h4 className="text-sm font-bold text-[#0b1c30]">{phase.week}</h4>
                </div>
                <ul className="space-y-3">
                  {(phase.tasks || []).map((task, taskIdx) => {
                    const taskId = `${phase.week}.task${taskIdx}`;
                    const isCompleted = executionProgress.completedTasks[taskId] || false;
                    
                    return (
                      <li key={taskIdx} className="flex items-start gap-3 group/task">
                        <button 
                          onClick={() => setTaskCompletion(phase.week, taskIdx, !isCompleted)}
                          className="shrink-0 mt-0.5 text-neutral-300 hover:text-[#0058be] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] rounded-full"
                          aria-label={`Mark task "${task}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-[#0058be]" />
                            </motion.div>
                          ) : (
                            <Circle className="w-5 h-5 group-hover/task:text-[#0058be]/50" />
                          )}
                        </button>
                        <span className={`text-sm transition-all duration-300 ${isCompleted ? 'text-neutral-400 line-through' : 'text-[#424754] group-hover/task:text-[#0b1c30]'}`}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StrategyAccordion>
  );
});
