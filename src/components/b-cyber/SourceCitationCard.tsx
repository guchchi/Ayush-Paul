import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import type { SourceCitation } from '../../types/b-cyber-compass';
import { cn } from '../../lib/utils';

interface SourceCitationCardProps {
  citation: SourceCitation;
  className?: string;
  compact?: boolean;
}

export const SourceCitationCard: React.FC<SourceCitationCardProps> = ({
  citation,
  className,
  compact = false,
}) => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-slate-300',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-xs text-slate-900 hover:text-slate-600 hover:underline group"
        >
          <span>{citation.title}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-900 shrink-0" />
        </a>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Verified {citation.verifiedDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
        {citation.sectionAnchor ? (
          <span className="text-slate-500 text-[11px] font-medium bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
            § {citation.sectionAnchor}
          </span>
        ) : (
          <span className="text-slate-400 text-xs font-medium">Official Source</span>
        )}

        {citation.verbatimQuote && !compact && (
          <button
            type="button"
            onClick={() => setShowQuote(!showQuote)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer transition-colors"
          >
            <span>{showQuote ? 'Hide quote' : 'View excerpt'}</span>
            {showQuote ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {citation.verbatimQuote && !compact && showQuote && (
        <div className="mt-2.5 text-xs text-slate-700 border-l-2 border-slate-400 pl-3 py-1 italic bg-slate-50 rounded-r leading-relaxed">
          <Quote className="w-3 h-3 inline mr-1 text-slate-400 -mt-1" />
          &ldquo;{citation.verbatimQuote}&rdquo;
        </div>
      )}
    </div>
  );
};
