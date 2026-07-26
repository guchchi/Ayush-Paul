import React from 'react';
import { PublishingRoadmapPhase } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { Map, CheckCircle2, Circle } from 'lucide-react';
import { useModule3Store } from '../../../../lib/module3';

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
          <div key={phaseIdx} className="relative">
            {/* Timeline connector */}
            {phaseIdx !== (roadmap || []).length - 1 && (
              <div className="absolute left-3 top-8 bottom-[-24px] w-0.5 bg-neutral-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 mt-0.5 shadow-sm border border-indigo-200">
                {phaseIdx + 1}
              </div>
              <div className="flex-1 bg-white border border-neutral-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">{phase.week}</h4>
                <ul className="space-y-2">
                  {(phase.tasks || []).map((task, taskIdx) => {
                    const taskId = `${phase.week}.task${taskIdx}`;
                    const isCompleted = executionProgress.completedTasks[taskId] || false;
                    
                    return (
                      <li key={taskIdx} className="flex items-start space-x-3 group">
                        <button 
                          onClick={() => setTaskCompletion(phase.week, taskIdx, !isCompleted)}
                          className="shrink-0 mt-0.5 text-neutral-400 hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
                          aria-label={`Mark task "${task}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Circle className="w-5 h-5 group-hover:text-indigo-500" />
                          )}
                        </button>
                        <span className={`text-sm transition-colors ${isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
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
