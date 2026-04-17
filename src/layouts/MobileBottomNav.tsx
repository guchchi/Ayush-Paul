import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, BookOpen, Layers, Mail } from 'lucide-react';

export const MobileBottomNav = ({ onPortfolioClick }: { onPortfolioClick: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "About", icon: <User size={18} />, onClick: () => scrollToSection('about') },
    { name: "Blog", icon: <BookOpen size={18} />, href: "/blog" },
    { name: "Portfolio", icon: <Layers size={18} />, onClick: onPortfolioClick },
    { name: "Contact", icon: <Mail size={18} />, onClick: () => scrollToSection('contact') },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-between px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          item.href ? (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center gap-1 p-3 text-white/40 hover:text-brand-primary transition-all active:scale-90"
            >
              {item.icon}
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 p-3 text-white/40 hover:text-brand-primary transition-all active:scale-90"
            >
              {item.icon}
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
};
