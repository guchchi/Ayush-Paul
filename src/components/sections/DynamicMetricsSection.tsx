import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Rocket, Code, Cpu, Zap, Activity } from 'lucide-react';
import { db, collection, onSnapshot } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';

export const DynamicMetricsSection = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    blogs: 0,
    updates: 0,
    activeBuilds: 0
  });

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setCounts(prev => ({ ...prev, projects: snap.size }));
    });
    const unsubBlogs = onSnapshot(collection(db, "blogPosts"), (snap) => {
      setCounts(prev => ({ ...prev, blogs: snap.size }));
    });
    const unsubUpdates = onSnapshot(collection(db, "updates"), (snap) => {
      const active = snap.docs.filter(doc => doc.data().statusTag === 'Building').length;
      setCounts(prev => ({ ...prev, updates: snap.size, activeBuilds: active }));
    });

    return () => {
      unsubProjects();
      unsubBlogs();
      unsubUpdates();
    };
  }, []);

  const stats = [
    { label: "Systems Built", value: counts.projects || "24", icon: <Rocket size={20} />, color: "text-blue-400" },
    { label: "Insights Published", value: counts.blogs || "18", icon: <Code size={20} />, color: "text-purple-400" },
    { label: "Engineering Logs", value: counts.updates || "156", icon: <Activity size={20} />, color: "text-brand-primary" },
    { label: "Active R&D", value: counts.activeBuilds || "3", icon: <Zap size={24} className="animate-pulse" />, color: "text-brand-secondary" },
  ];

  return (
    <Section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 rounded-[40px] border border-white/5 text-center group hover:border-brand-primary/30 transition-all shadow-2xl bg-white/[0.01]"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 ${stat.color} group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500`}>
                {stat.icon}
              </div>
              <div className="text-5xl font-extrabold mb-2 tracking-tighter text-white">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
