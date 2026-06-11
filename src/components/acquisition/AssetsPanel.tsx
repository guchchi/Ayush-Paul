import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, MessageSquare, Eye, CheckSquare, Play,
  ChevronRight, Sparkles,
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
}

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  templates: FileText,
  prompts: MessageSquare,
  examples: Eye,
  checklists: CheckSquare,
  videos: Play,
};

export function AssetsPanel({ categories }: AssetsPanelProps) {
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
