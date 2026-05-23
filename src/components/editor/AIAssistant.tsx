import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Type, Tag, Layout, CheckCircle2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIAssistantProps {
  onAction: (action: string) => void;
  isProcessing: boolean;
  score: number;
  issues: string[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onAction, isProcessing, score, issues }) => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10 space-y-10 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Cpu size={120} className="text-brand-primary animate-pulse" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Cpu size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-mono">COGNITIVE_SYNTHESIZER</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 font-mono">System Co-Processor</p>
          </div>
        </div>

        {/* SEO Score Meter */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1 font-mono">SEO Index score</p>
              <div className="text-4xl font-bold tracking-tighter">
                {score}<span className="text-white/20 text-xl">/100</span>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono",
              score >= 80 ? "bg-green-500/10 text-green-500" : 
              score >= 50 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
            )}>
              {score >= 80 ? 'Optimized' : score >= 50 ? 'Developing' : 'Needs Focus'}
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              className={cn(
                "h-full transition-all duration-1000",
                score >= 80 ? "bg-green-500" : 
                score >= 50 ? "bg-yellow-500" : "bg-red-500"
              )}
            />
          </div>
        </div>

        {/* AI Actions */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1 font-mono">Direct Ingestion pipelines</p>
          <div className="grid gap-3 font-mono text-xs">
            {[
              { id: 'title', label: 'Synthesize Narrative Title', icon: <Type size={18} /> },
              { id: 'summary', label: 'Compile Excerpt Hash', icon: <Layout size={18} /> },
              { id: 'keywords', label: 'Index Target Keywords', icon: <Tag size={18} /> },
              { id: 'headings', label: 'Repair Outline Hierarchy', icon: <RefreshCw size={18} /> },
            ].map(action => (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                disabled={isProcessing}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary/40 hover:bg-brand-primary/5 text-white/60 hover:text-white transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-sm font-bold">{action.label}</span>
                </div>
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Terminal size={16} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
          </div>
        </div>

        {/* Issue List */}
        {issues.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1 font-mono">Compiler warnings</p>
            <div className="space-y-2">
              {issues.slice(0, 3).map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-white/60 leading-relaxed">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
