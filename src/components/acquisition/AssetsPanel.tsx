import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, MessageSquare, Eye, CheckSquare, Play,
  ChevronRight, Sparkles, HelpCircle, AlertCircle, TrendingUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

interface AssetEntry {
  id: string;
  title: string;
  description: string;
}

interface AssetCategory {
  id: string;
  label: string;
  icon: string;
  items: AssetEntry[];
}

interface AssetsPanelProps {
  categories: AssetCategory[];
  activeSection?: string;
}

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  templates: FileText,
  prompts: MessageSquare,
  examples: Eye,
  checklists: CheckSquare,
  videos: Play,
};

export function AssetsPanel({ categories, activeSection }: AssetsPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(
    categories.length > 0 ? [categories[0].id] : [],
  ));

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[10px] text-white/20">No intelligence available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-1 pb-4 border-b border-white/[0.06] mb-3">
        <Sparkles size={12} className="text-brand-primary" />
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em]">Intelligence</span>
      </div>

      {activeSection === 'career-track' && (
        <div className="space-y-3 mb-5">
          {/* How to choose */}
          <div className="p-3.5 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <HelpCircle size={11} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary">How to choose</h4>
            </div>
            <ul className="space-y-1.5 text-[10px] text-white/50 leading-relaxed list-disc pl-3.5">
              <li>Pick the track closest to the service you can actually deliver.</li>
              <li>Choose based on skills, proof potential, and client demand.</li>
              <li>Do not choose only because it sounds trendy.</li>
            </ul>
          </div>

          {/* Common mistake */}
          <div className="p-3.5 rounded-xl bg-red-400/5 border border-red-400/10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-red-400/10 flex items-center justify-center text-red-400">
                <AlertCircle size={11} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-400">Common mistake</h4>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed pl-1">
              Choosing a broad identity without knowing what service you will sell.
            </p>
          </div>

          {/* Example path */}
          <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40">
                <TrendingUp size={11} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">Example path</h4>
            </div>
            <div className="space-y-2.5 text-[10px] leading-relaxed text-white/50 pl-1">
              <div className="pb-2 border-b border-white/[0.04] last:border-0 last:pb-0">
                <span className="font-semibold text-white/80 block mb-0.5">🎬 Video Editor</span>
                <span className="text-[9px] text-white/40 block leading-normal">Short-form clips &rarr; Gaming creators &rarr; Monthly clip retainer</span>
              </div>
              <div className="pb-2 border-b border-white/[0.04] last:border-0 last:pb-0">
                <span className="font-semibold text-white/80 block mb-0.5">💻 Developer</span>
                <span className="text-[9px] text-white/40 block leading-normal">Plugin integration &rarr; Marketing agencies &rarr; Campaign setup support</span>
              </div>
              <div>
                <span className="font-semibold text-white/80 block mb-0.5">🎨 Designer</span>
                <span className="text-[9px] text-white/40 block leading-normal">Product UI &rarr; SaaS teams &rarr; Dashboard redesign offer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.icon] || FileText;
        const isOpen = openSections.has(cat.id);

        return (
          <div key={cat.id} className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
            {/* Header */}
            <button
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                <Icon size={12} className="text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
              <span className="flex-1 text-left text-[11px] font-medium text-white/60 group-hover:text-white/80 transition-colors">
                {cat.label}
              </span>
              <span className="text-[9px] font-medium text-white/20 tabular-nums">{cat.items.length}</span>
              <ChevronRight
                size={10}
                className={cn(
                  'text-white/20 transition-transform duration-200',
                  isOpen && 'rotate-90',
                )}
              />
            </button>

            {/* Items */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASING.PREMIUM }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-2 space-y-0.5">
                    {cat.items.length === 0 ? (
                      <p className="text-[10px] text-white/15 py-1.5 px-2">Coming soon</p>
                    ) : (
                      cat.items.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          <p className="text-[10px] font-medium text-white/40 group-hover:text-white/60 transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-white/20 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
