import React, { useState } from 'react';
import { CheckSquare, Square, ShieldAlert } from 'lucide-react';

interface Props {
  onAllChecked: (allChecked: boolean) => void;
}

export function BeforeYouContinueChecklist({ onAllChecked }: Props) {
  const [checks, setChecks] = useState([false, false, false]);

  const toggleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
    onAllChecked(newChecks.every(Boolean));
  };

  const checklistItems = [
    "I understand this strategy is based on my current proof assets and position.",
    "I have reviewed the primary platform and content strategy.",
    "I am ready to lock these decisions and generate my Authority Pack."
  ];

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mt-12 mb-6">
      <div className="flex items-start space-x-3 mb-4">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
            Before You Continue
          </h3>
          <p className="text-sm text-neutral-600">
            Please confirm the following before locking this strategy and proceeding to generation.
          </p>
        </div>
      </div>

      <div className="space-y-3 pl-8">
        {checklistItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggleCheck(idx)}
            className="flex items-start text-left w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md p-1 -ml-1"
          >
            {checks[idx] ? (
              <CheckSquare className="w-5 h-5 text-indigo-600 mr-3 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 mr-3 shrink-0 transition-colors" />
            )}
            <span className={`text-sm ${checks[idx] ? 'text-neutral-900 font-medium' : 'text-neutral-600'}`}>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
