import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Github, Youtube, Mail } from 'lucide-react';
import { cn } from "@/src/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { WaitlistForm } from '../components/ui/WaitlistForm';

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="layout-section bg-[#0b1c30] text-white py-20 px-6 md:px-12 lg:px-24 border-t border-white/10 relative overflow-hidden mt-0"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight transition-transform hover:scale-[1.01] block">
              ayushpaul<span className="text-[#d1f34d]">.in</span>
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Ecosystem builder crafting blueprints, courses, and engineering systems to help developers and founders launch platforms with speed and technical authority.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/paulayush/" },
                { icon: <Github size={20} />, href: "https://github.com/guchchi/" },
                { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ALX-17" },
                { icon: <Mail size={20} />, href: "mailto:hello.ayushishere@gmail.com" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#d1f34d] hover:bg-white/10 transition-all border border-white/5">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Blueprints Registry", href: "/blueprints" },
                { name: "Building In Public", href: "/building" },
                { name: "Insights Logs", href: "/blog" },
                { name: "Mastery Ecosystem", href: "/mastery" },
                { name: "Start a Project", href: "/collaborate" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-[#d1f34d] transition-colors font-semibold text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join the Lab Newsletter Input */}
          <div className="lg:col-span-4 text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Join the Lab</h4>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Get notified whenever I release a new template, workflow playbook, or course syllabus.
            </p>
            <WaitlistForm context="footer" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm italic">
            © 2026 Ayush Paul. All rights reserved. Built independently.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy Policy</Link>
            <Link to="/terms" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Terms &amp; Conditions</Link>
            <Link to="/cookie-policy" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
