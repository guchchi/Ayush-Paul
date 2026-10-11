import React from 'react';
import { ExternalLink, CheckCircle2, Quote } from 'lucide-react';
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
  return (
    <div
      className={cn(
        'rounded-lg border border-border-color bg-white p-3.5 shadow-2xs transition-all hover:border-brand-primary/30',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-xs text-brand-primary hover:text-brand-secondary hover:underline group"
        >
          <span>{citation.title}</span>
          <ExternalLink className="w-3 h-3 text-brand-primary/60 group-hover:text-brand-primary shrink-0" />
        </a>

        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Verified {citation.verifiedDate}</span>
        </div>
      </div>

      {citation.sectionAnchor && (
        <div className="text-[11px] text-text-secondary font-mono bg-bg-secondary/60 px-2 py-0.5 rounded inline-block mb-2">
          Section: {citation.sectionAnchor}
        </div>
      )}

      {citation.verbatimQuote && !compact && (
        <div className="mt-2 text-xs text-text-secondary border-l-2 border-brand-primary/40 pl-2.5 py-0.5 italic bg-bg-secondary/30 rounded-r">
          <Quote className="w-3 h-3 inline mr-1 text-brand-primary/40 -mt-1" />
          "{citation.verbatimQuote}"
        </div>
      )}
    </div>
  );
};
