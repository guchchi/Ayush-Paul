import { motion } from 'motion/react';
import { Download, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OpportunityReportData {
  service: string;
  market: string;
  niche: string;
  positioning: string;
  score: number;
  track: string;
}

interface OpportunityReportProps {
  data: OpportunityReportData;
  onContinue: () => void;
}

export function OpportunityReport({ data, onContinue }: OpportunityReportProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle size={14} className="text-emerald-400" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-400/70">
          Phase 1 Complete
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <FileText size={18} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Opportunity Report</h2>
              <p className="text-xs text-white/40">Generated from your Phase 1 inputs</p>
            </div>
          </div>

          {/* Score ring */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-brand-primary">{data.score}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">Opportunity Score</p>
              <p className="text-xs text-white/40 mt-0.5">
                {data.score >= 70 ? 'Strong opportunity. Ready for Phase 2.' : 'Complete all sections to improve your score.'}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <ReportRow label="Service" value={data.service} />
          <ReportRow label="Market" value={data.market} />
          <ReportRow label="Niche" value={data.niche} />
          <div className="pt-3 border-t border-white/[0.06]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-2">
              Positioning Statement
            </p>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              {data.positioning}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer"
          >
            <Download size={12} />
            Export Report
          </button>
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-medium hover:bg-brand-primary/90 transition-all ml-auto cursor-pointer"
          >
            Continue to Phase 2
            <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30 w-20 shrink-0 pt-0.5">
        {label}
      </p>
      <p className="text-sm text-white/70 text-right">{value}</p>
    </div>
  );
}
