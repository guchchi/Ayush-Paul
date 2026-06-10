import React from 'react';
import { motion } from 'motion/react';
import { Layers, FileText, Code, MessageSquare, ListChecks, BookOpen, CheckSquare, Package } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'framework': Layers,
  'template': FileText,
  'templates': FileText,
  'prompt': MessageSquare,
  'prompts': MessageSquare,
  'workflow': Code,
  'example': CheckSquare,
  'examples': CheckSquare,
  'checklist': ListChecks,
  'checklists': ListChecks,
  'resource': Package,
  'resources': Package,
  'guide': BookOpen,
  'pdf': FileText,
  'code': Code,
  'asset': Layers,
};

const getIcon = (label: string) => {
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon;
  }
  return Layers;
};

export const BlueprintWhatYouGet = ({ product }: Props) => {
  const items = product.includedResources && product.includedResources.length > 0
    ? product.includedResources
    : null;

  if (!items) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Inside This Blueprint</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">What You Get</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {items.map((label, idx) => {
          const IconComponent = getIcon(label);
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left hover:border-[#0058be]/20 hover:bg-[#eff4ff]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0 group-hover:bg-[#0058be] group-hover:border-[#0058be] transition-all">
                <IconComponent size={16} className="text-[#0058be] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-bold text-[#0b1c30] leading-snug">{label}</span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};
