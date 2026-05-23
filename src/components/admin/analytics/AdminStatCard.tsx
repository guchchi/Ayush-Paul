import React from "react";
import { TrendingUp } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  trend,
}) => {
  return (
    <div className="p-8 rounded-[40px] glass-card border border-white/5 group hover:border-brand-primary/30 transition-all hover:translate-y-[-4px] duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all duration-500 ring-1 ring-white/10 group-hover:ring-brand-primary/20">
          {icon}
        </div>
        {trend && (
          <div className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md border border-brand-primary/20">
            <TrendingUp size={10} /> {trend}
          </div>
        )}
      </div>
      <div className="text-4xl font-bold mb-2 tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
        {label}
      </div>
    </div>
  );
};
