import React from 'react';
import { ShieldAlert, ExternalLink, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DisclaimerBannerProps {
  className?: string;
  variant?: 'prominent' | 'compact';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  className,
  variant = 'prominent',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-[11px] text-slate-600',
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            <strong className="font-semibold text-slate-800">Independent Research:</strong> Not affiliated with IIT Kanpur or IIT Madras. Does not guarantee admission.
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <a
            href="https://iitk.ac.in/wsais/b-cyber.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 inline-flex items-center gap-0.5"
          >
            IITK WSAIS <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>•</span>
          <a
            href="https://www.iitm.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 inline-flex items-center gap-0.5"
          >
            IIT Madras <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-slate-100 p-1.5 text-slate-600 shrink-0 mt-0.5 border border-slate-200/60">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs leading-relaxed flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-900 tracking-tight">
              Independent Student Research & Institutional Disclosure
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Unofficial Guide
            </span>
          </div>
          <p className="text-slate-600 text-xs">
            B.Cyber Compass is an independent research platform. It is <strong>not affiliated with, sponsored by, or endorsed by IIT Kanpur or IIT Madras</strong>. Admissions policies and formats are determined exclusively by institute Senates.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="text-slate-400">• No admission guarantees</span>
            <span className="text-slate-400">• Always cross-reference official portals:</span>
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-950 underline font-semibold"
            >
              IITK WSAIS Portal <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-300">/</span>
            <a
              href="https://www.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-950 underline font-semibold"
            >
              IIT Madras Portal <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
