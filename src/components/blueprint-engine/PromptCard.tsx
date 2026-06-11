import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Sparkles, Quote } from 'lucide-react';
import type { BlueprintPrompt } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface PromptCardProps {
  prompt: BlueprintPrompt;
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt.text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="ds-card overflow-hidden"
    >
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-brand-accent" />
            </span>
            <div>
              <p className="text-caption text-brand-accent/80 mb-0.5">Prompt {index + 1}</p>
              <p className="text-body-md font-semibold text-text-primary">{prompt.title}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 text-white/5 pointer-events-none">
            <Quote size={24} />
          </div>
          <div className="pl-8">
            <p ref={textRef} className="text-body-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {prompt.text}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'btn-base text-xs gap-2 transition-all duration-300 relative overflow-hidden',
              copied
                ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 hover:text-text-primary',
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} />
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Copy size={14} />
                  Copy Prompt
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
