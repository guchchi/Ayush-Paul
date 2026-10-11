import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
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
          'flex items-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-xs text-amber-900',
          className
        )}
      >
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Independent Guide:</strong> Not affiliated with IIT Kanpur or IIT Madras. Does not guarantee admission or selection.{' '}
          <a
            href="https://iitk.ac.in/wsais/b-cyber.php"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-amber-950 inline-flex items-center gap-0.5"
          >
            Official Portal <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/60 p-4 sm:p-5 text-amber-950 shadow-2xs',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
          <div className="font-semibold text-amber-900 text-sm">
            Independent Student Research & Guidance Platform
          </div>
          <p className="text-amber-900/90 text-xs sm:text-sm">
            B.Cyber Compass is an independent research platform and preparation planner built by students. It is{' '}
            <strong>NOT affiliated with, sponsored by, or endorsed by IIT Kanpur or IIT Madras</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs text-amber-900/80">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
              <span><strong>No Admission Guarantee:</strong> Guidance does not guarantee shortlisting or admission.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
              <span><strong>Official Verification:</strong> Always cross-reference against the official portals.</span>
            </div>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 underline"
            >
              IIT Kanpur WSAIS Portal <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-amber-400">•</span>
            <a
              href="https://www.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 underline"
            >
              IIT Madras Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
