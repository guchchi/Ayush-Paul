import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Youtube, Mail } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { WaitlistForm } from '../components/ui/WaitlistForm';

export const Footer = () => {
  return (
    <footer id="footer" className="layout-section border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      {/* Seamless gradient transition from last section */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0A0A0B] to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter block group">
              ayushpaul<span className="text-brand-primary group-hover:neon-glow-blue transition-all">.in</span>
            </Link>
            <p className="text-white/40 text-lg max-w-sm leading-relaxed">
              Student entrepreneur and innovator crafting the future of AI and Robotics. Building products that solve real-world problems.
            </p>
            <div className="flex items-center gap-6">
              {[
                { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/paulayush/", hoverColor: "hover:text-blue-700 hover:bg-blue-700/10 hover:border-blue-700/20" },
                { icon: <Github size={24} />, href: "https://github.com/guchchi/", hoverColor: "hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/20" },
                { icon: <Youtube size={24} />, href: "https://www.youtube.com/@ALX-17", hoverColor: "hover:text-red-600 hover:bg-red-600/10 hover:border-red-600/20" },
                { icon: <Mail size={24} />, href: "mailto:hello.ayushishere@gmail.com", hoverColor: "hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/20" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 transition-all border border-white/5", item.hoverColor)}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Ecosystem Systems", href: "/systems" },
                { name: "Ecosystem Milestones", href: "/milestones" },
                { name: "Research Logs", href: "/blog" },
                { name: "Vision & About", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/40 hover:text-brand-primary transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Join the Lab</h4>
            <p className="text-white/30 text-xs mb-6 leading-relaxed">
              Get notified whenever I drop a new engineering blueprint or system update.
            </p>
            <WaitlistForm context="footer" />
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <p className="text-white/20 text-sm font-medium">
                © 2026 <span className="sr-only">Ayush Paul</span>. Built independently in India.
             </p>
             <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors">Terms</Link>
             </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white/20 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status: Operational
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
