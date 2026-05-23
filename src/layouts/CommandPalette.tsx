import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Home, BookOpen, Layers, Mail, Shield, Search, ChevronRight } from 'lucide-react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions = [
    { name: "Go to Home", icon: <Home size={18} />, action: () => navigate("/") },
    { name: "Read Blog", icon: <BookOpen size={18} />, action: () => navigate("/blog") },
    { name: "View Projects", icon: <Layers size={18} />, action: () => { navigate("/"); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); } },
    { name: "Contact Me", icon: <Mail size={18} />, action: () => { navigate("/"); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); } },
    { name: "Admin Dashboard", icon: <Shield size={18} />, action: () => navigate("/admin") },
  ];

  const filteredActions = actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
              <Search className="text-white/40" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/20"
              />
              <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                ESC
              </div>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {filteredActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { action.action(); setIsOpen(false); }}
                  className="w-full p-4 rounded-2xl hover:bg-white/5 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                      {action.icon}
                    </div>
                    <span className="font-bold text-white/60 group-hover:text-white transition-colors">{action.name}</span>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              {filteredActions.length === 0 && (
                <div className="p-12 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                  No commands found
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
