import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Users, Briefcase, GraduationCap, Lightbulb, Globe, Target } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const FOR_ICON_MAP: Record<string, React.ComponentType<any>> = {
  'freelancer': Briefcase,
  'freelancers': Briefcase,
  'student': GraduationCap,
  'students': GraduationCap,
  'founder': Lightbulb,
  'founders': Lightbulb,
  'startup': Lightbulb,
  'creator': Globe,
  'creators': Globe,
  'content': Globe,
  'agency': Briefcase,
  'agencies': Briefcase,
  'professional': Target,
  'professionals': Target,
  'developer': Users,
  'developers': Users,
  'engineer': Users,
  'builder': Users,
  'builders': Users,
};

const getForIcon = (label: string) => {
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(FOR_ICON_MAP)) {
    if (lower.includes(key)) return Icon;
  }
  return Users;
};

export const BlueprintWhoItsFor = ({ product }: Props) => {
  const idealFor = product.idealFor && product.idealFor.length > 0 ? product.idealFor : null;
  const notFor = product.notFor && product.notFor.length > 0 ? product.notFor : null;

  if (!idealFor && !notFor) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Who This Is For</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">Is This Blueprint Right for You?</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {idealFor && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-emerald-100 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Check size={16} className="text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Perfect For</span>
            </div>
            <div className="space-y-3">
              {idealFor.map((item, idx) => {
                const IconComponent = getForIcon(item);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                    <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0">
                      <IconComponent size={15} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-[#0b1c30]">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {notFor && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-red-100 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                <X size={16} className="text-red-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Not For</span>
            </div>
            <div className="space-y-3">
              {notFor.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-red-50/50 border border-red-100/50">
                  <div className="w-9 h-9 rounded-xl bg-white border border-red-200 flex items-center justify-center shrink-0">
                    <X size={15} className="text-red-400" />
                  </div>
                  <span className="text-sm font-bold text-[#424754]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {idealFor && !notFor && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#c2c6d6]/30 shadow-sm text-left flex items-center justify-center">
            <p className="text-sm text-[#424754] font-semibold text-center">This blueprint is designed for a wide range of builders. If you're ready to implement, it's for you.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};
