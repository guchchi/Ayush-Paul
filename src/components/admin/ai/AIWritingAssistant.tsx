import React, { useState } from "react";
import {
  Terminal,
  Activity,
  Cpu,
  Workflow,
  Minus,
  FileText,
  Tag,
  Layout,
  Sliders
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface AIWritingAssistantProps {
  onAction: (action: string) => void;
  isProcessing: boolean;
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  onAction,
  isProcessing,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const actions = [
    {
      id: "improve",
      label: "Synthesize Content",
      icon: <Cpu size={16} />,
      desc: "Refine syntax & vocabulary metrics",
    },
    {
      id: "grammar",
      label: "Compile & Debug",
      icon: <Terminal size={16} />,
      desc: "Optimize syntactical grammar constraints",
    },
    {
      id: "expand",
      label: "Expand Depth",
      icon: <Workflow size={16} />,
      desc: "Inject descriptive system parameters",
    },
    {
      id: "simplify",
      label: "Optimize Density",
      icon: <Sliders size={16} />,
      desc: "Eliminate verbose layout noise",
    },
    {
      id: "summary",
      label: "Generate Meta Node",
      icon: <FileText size={16} />,
      desc: "Synthesize optimized meta description",
    },
    {
      id: "keywords",
      label: "Analyze Keyword Index",
      icon: <Tag size={16} />,
      desc: "Query keyword proximity & metadata",
    },
    {
      id: "headings",
      label: "Compile Outline Map",
      icon: <Layout size={16} />,
      desc: "Generate structured index layouts",
    },
  ];

  return (
    <div className="p-6 rounded-[32px] glass-card border border-white/10 space-y-6 text-left bg-black/10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity font-mono"
        >
          <Terminal size={16} className="text-brand-primary" />
          <h3 className="font-bold text-xs text-white">NARRATIVE_COMPILER_NODE</h3>
          <div
            className={cn(
              "transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )}
          >
            <Minus size={12} className="text-white/20" />
          </div>
        </button>
        {isProcessing && (
          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-brand-primary animate-pulse font-mono">
            <Activity size={10} className="text-brand-primary" /> [main] SYNTHESIZING_TEXT...
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={isProcessing}
              className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/30 hover:bg-brand-primary/[0.05] transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                  {action.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-white/80 group-hover:text-brand-primary transition-colors block leading-tight font-mono">
                    {action.label}
                  </span>
                  <p className="text-[9px] text-white/40 transition-colors leading-tight mt-0.5 font-medium">
                    {action.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
