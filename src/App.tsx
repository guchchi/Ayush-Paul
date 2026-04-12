import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell
} from "recharts";
import { 
  Menu, X, Github, Linkedin, Youtube, ExternalLink, Mail, Phone, MapPin, Code, Cpu, Palette, Sparkles, Rocket, BookOpen, MessageSquare, ArrowRight, ArrowLeft, ChevronRight, Star, Globe, Home, User, Layers, Search, Plus, Trash2, Edit, LogOut, LogIn, Clock, Calendar, Tag,
  CheckCircle2, Zap, TrendingUp, ChevronUp, Monitor, Video, Terminal, Command, Briefcase, Award, Activity, Shield, Coffee, Lightbulb, Heart, CreditCard, Loader2,
  GripVertical, Bold, Italic, Underline, List, ListOrdered, Quote, Minus, Type, Image as ImageIcon, Layout, Settings, Wand2, Eye, Save, Send, History, BarChart3, Filter, MoreVertical, Copy, Link as LinkIcon, FileText, Share2, Info, AlertCircle
} from "lucide-react";
import Typewriter from 'typewriter-effect';
import ReactMarkdown from "react-markdown";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from "@/src/lib/utils";
import { auth, db, storage, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL, getDocFromServer } from "./firebase";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParallaxContainer, ParallaxLayer } from "./components/Parallax";
import { PremiumSkills } from "./components/PremiumSkills";
import { ProfessionalAi } from "./components/ProfessionalAi";
import { useSEO } from "./hooks/useSEO";

// --- Types ---

type BlockType = 'text' | 'heading' | 'image' | 'code' | 'quote' | 'video' | 'callout' | 'divider' | 'list';

interface Block {
  id: string;
  type: BlockType;
  content: any;
  metadata?: {
    level?: 1 | 2 | 3 | 4;
    listType?: 'ordered' | 'unordered';
    alignment?: 'left' | 'center' | 'full';
    caption?: string;
    alt?: string;
    language?: string;
    variant?: 'info' | 'warning' | 'success' | 'danger';
  };
}

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// --- Firestore Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function formatDate(date: any) {
  if (!date) return "N/A";
  if (typeof date === "string") return new Date(date).toLocaleDateString();
  if (date && typeof date === "object" && "seconds" in date) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

// --- Components ---

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinkleSpeed: number;
      color: string;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.color = `rgba(255, 255, 255,`;
      }

      update(width: number, height: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 0.8 || this.opacity < 0.1) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }

        // Subtle mouse reaction
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
          const force = (200 - distance) / 200;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const currentColor = `${this.color}${this.opacity})`;
        ctx.fillStyle = currentColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 150 }, () => new Particle(canvas.width, canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const ProfileSelection = ({ onSelect }: { onSelect: (profile: string) => void }) => {
  useSEO({ title: "Choose Profile | Ayush Paul", noindex: true });
  const profiles = [
    { name: "Recruiter", color: "bg-cyan-500", image: "https://picsum.photos/seed/recruiter/200/200" },
    { name: "Developer", color: "bg-gray-500", image: "https://picsum.photos/seed/developer/200/200" },
    { name: "Stalker", color: "bg-red-500", image: "https://picsum.photos/seed/stalker/200/200" },
    { name: "Adventurer", color: "bg-purple-500", image: "https://picsum.photos/seed/adventurer/200/200" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] relative overflow-hidden px-6 py-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <span className="text-brand-primary font-display font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-2 block">Ayush Paul</span>
        <div className="h-px w-12 bg-brand-primary/30 mx-auto" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-3xl md:text-6xl font-display font-medium text-white mb-12 md:mb-16 tracking-tight text-center"
      >
        Who's Watching?
      </motion.h1>

      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 relative z-10 max-w-5xl">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            whileHover={{ y: -10 }}
            onClick={() => onSelect(profile.name)}
            className="group flex flex-col items-center"
          >
            <div className={cn(
              "w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-xl overflow-hidden mb-3 md:mb-6 border-[3px] border-transparent group-hover:border-white group-hover:scale-105 transition-all duration-500 shadow-2xl shadow-black/50",
              profile.color
            )}>
              <img 
                src={profile.image} 
                alt={`${profile.name} profile`} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm md:text-xl font-medium text-white/50 group-hover:text-white transition-all duration-300">
              {profile.name}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => onSelect("back")}
        className="mt-12 md:mt-24 px-8 md:px-10 py-3 border border-white/10 text-white/30 hover:text-white hover:border-white hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-[10px] font-bold rounded-lg flex items-center gap-2"
      >
        <ArrowLeft size={14} />
        Back to Home
      </motion.button>
    </div>
  );
};

const CursorFollower = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("button, a, .interactive"));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-primary/50 pointer-events-none z-[9999] hidden lg:block"
      style={{ willChange: "transform" }}
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? "rgba(0, 194, 255, 0.1)" : "rgba(0, 194, 255, 0)",
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.2 }}
    />
  );
};

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-[1000] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const CommandPalette = () => {
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

const StatsDashboard = () => {
  const stats = [
    { label: "Projects Completed", value: "50+", icon: <Rocket size={20} />, color: "text-blue-400" },
    { label: "Lines of Code", value: "100k+", icon: <Code size={20} />, color: "text-purple-400" },
    { label: "Robots Built", value: "12", icon: <Cpu size={20} />, color: "text-orange-400" },
    { label: "Happy Clients", value: "25+", icon: <User size={20} />, color: "text-green-400" },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 text-center group hover:border-brand-primary/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandEcosystem = () => {
  const items = [
    { title: "Currently Building", content: "A multi-agent AI framework for autonomous robotics.", icon: <Zap size={20} /> },
    { title: "Learning in Public", content: "Deep diving into Rust and WebAssembly for high-performance web apps.", icon: <BookOpen size={20} /> },
    { title: "Tech Philosophy", content: "Simplicity is the ultimate sophistication. Build for impact, not just for code.", icon: <Lightbulb size={20} /> },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] glass-card border border-white/5 hover:border-brand-primary/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NowPage = () => {
  useSEO({
    title: "What Ayush Paul Is Building Now",
    description: "Ayush Paul's focus, current projects, and learning journey in AI and robotics.",
  });
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8">
            Now
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-12 tracking-tighter">What I'm doing <span className="text-brand-primary">now.</span></h1>
          
          <div className="space-y-16">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Rocket className="text-brand-primary" size={24} /> Current Focus
              </h2>
              <p className="text-white/60 text-xl leading-relaxed">
                I'm currently focused on building autonomous robotics systems integrated with large language models. My goal is to bridge the gap between digital intelligence and physical action.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Briefcase className="text-brand-primary" size={24} /> Professional Work
              </h2>
              <ul className="space-y-4 text-white/60 text-lg">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                  Building custom AI solutions for startups as a freelance developer.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                  Developing a robotics curriculum for student innovators.
                </li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Coffee className="text-brand-primary" size={24} /> Personal Life
              </h2>
              <p className="text-white/60 text-xl leading-relaxed">
                When I'm not coding, I'm usually reading about space exploration, practicing photography, or experimenting with new coffee brewing techniques.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10 text-white/20 text-sm italic">
              Last updated: April 2024 from New Delhi, India.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileBottomNav = ({ onPortfolioClick }: { onPortfolioClick: () => void }) => {
  const navItems = [
    { name: "About", icon: <User size={18} />, href: "/#about" },
    { name: "Blog", icon: <BookOpen size={18} />, href: "/blog" },
    { name: "Portfolio", icon: <Layers size={18} />, onClick: onPortfolioClick },
    { name: "Contact", icon: <Mail size={18} />, href: "/#contact" },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-between px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          item.onClick ? (
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 p-3 text-white/40 hover:text-brand-primary transition-all active:scale-90"
            >
              {item.icon}
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center gap-1 p-3 text-white/40 hover:text-brand-primary transition-all active:scale-90"
            >
              {item.icon}
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

const Navbar = ({ onPortfolioClick }: { onPortfolioClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  // Close menu on route change
  const location = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (link: any) => {
    if (link.name === "Portfolio") {
      onPortfolioClick();
    } else if (link.href.startsWith("/#")) {
      const id = link.href.split("#")[1];
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(link.href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-[#0A0A0A]/50 backdrop-blur-md py-4 border-b border-white/10" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
          ayushpaul<span className="text-brand-primary">.in</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              if (window.location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all cursor-pointer"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div key="mobile-menu-root" className="contents">
            {/* Backdrop Overlay */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden cursor-pointer"
            />
            
            {/* Sliding Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[110] w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/10 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold tracking-tighter">
                  ayushpaul<span className="text-brand-primary">.in</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col p-6 space-y-2 overflow-y-auto flex-1">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleNavClick(link)}
                    className="text-xl font-display font-bold text-left text-white/60 hover:text-white transition-colors group flex items-center justify-between w-full py-4 px-4 rounded-2xl hover:bg-white/5"
                  >
                    {link.name}
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-60 transition-opacity text-brand-primary" />
                  </motion.button>
                ))}
              </div>

              {/* Drawer Footer / CTA */}
              <div className="p-6 border-t border-white/5 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (window.location.pathname !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    } else {
                      document.getElementById('hire')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-center w-full py-4 bg-white text-black rounded-xl text-base font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-white/10"
                >
                  Hire Me
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 12, stiffness: 200, mass: 0.1 }}
      className={className}
      style={{ willChange: "transform" }}
    >
      <button onClick={onClick} className="w-full h-full">
        {children}
      </button>
    </motion.div>
  );
};

const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: any, delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.1, 1],
      y: [0, -20, 0],
      x: [0, 10, 0]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-brand-primary/50"
    style={{ left: x, top: y }}
  >
    <Icon size={32} />
  </motion.div>
);

const Hero = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse updates for performance
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <ParallaxContainer id="home" className="min-h-screen flex items-center justify-center pt-32 bg-[#0A0A0A]">
      {/* Background Layer: Deepest, slow moving */}
      <ParallaxLayer offset={150} zIndex={0}>
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <Particles />
        <div 
          className="absolute inset-0 spotlight pointer-events-none transition-opacity duration-500"
          style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` } as any}
        />
        {/* Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[800px] bg-[#00C2FF]/10 rounded-full blur-[150px] pointer-events-none" />
      </ParallaxLayer>

      {/* Parallax Mid-Layer removed for minimalism */}

      {/* Foreground Layer: UI and Glassmorphism context */}
      <ParallaxLayer offset={0} zIndex={10}>
        <div className="container mx-auto px-6 relative h-full flex flex-col justify-center pt-24 md:pt-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/50 mb-8 backdrop-blur-sm shadow-xl shadow-black/20">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                Available for Startup Collaborations
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight text-white"
              >
                Building Ideas Into <br className="hidden md:block" />
                <span className="text-brand-primary italic neon-glow-blue relative text-6xl md:text-8xl lg:text-9xl mt-2 block">
                  Reality
                  {/* Soft background highlight plate */}
                  <div className="absolute inset-0 bg-brand-primary/10 blur-xl -z-10 rounded-full" />
                </span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 mb-16"
              >
                <div className="text-lg md:text-xl text-white/50 font-semibold tracking-tight">
                  AI & Product Engineer
                </div>
                <div className="text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
                  I design, build, and launch intelligent products powered by AI, engineering, and creativity.
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              >
                <MagneticButton 
                  className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-white/10"
                >
                  <a href="#hire" className="relative z-10 w-full h-full flex items-center justify-center">Hire Me</a>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-shimmer transition-opacity" />
                </MagneticButton>
                
                <MagneticButton
                  onClick={onViewPortfolio}
                  className="w-full sm:w-auto px-10 py-5 bg-white/[0.03] border border-white/10 rounded-full font-bold text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md text-white"
                >
                  <span className="flex items-center justify-center gap-2">Explore Projects <ArrowRight className="w-4 h-4 opacity-50" /></span>
                </MagneticButton>

                <SupportButton />
              </motion.div>

              {/* Social Proof Strip */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto"
              >
                {[
                  { label: "4+ Years Building", icon: <span className="text-yellow-400">⚡</span> },
                  { label: "Startup Collaborations", icon: <span>🚀</span> },
                  { label: "AI • Robotics • Development", icon: <span className="text-[#00C2FF]">🌐</span> }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold tracking-wide text-white/50 hover:bg-white/[0.05] hover:text-white/80 transition-all cursor-default group backdrop-blur-md shadow-lg"
                  >
                    <span className="text-white/70 group-hover:text-white transition-colors">{item.icon}</span>
                    <span className="group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Side Elements */}
        <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 space-y-8 z-50">
          {[
            { icon: <Github />, href: "https://github.com/guchchi", hoverColor: "hover:text-green-500" },
            { icon: <Linkedin />, href: "https://www.linkedin.com/in/paulayush/", hoverColor: "hover:text-blue-700" },
            { icon: <Youtube />, href: "https://www.youtube.com/@ALX-17", hoverColor: "hover:text-red-600" }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              whileHover={{ x: 5 }}
              className={cn("block text-white/20 transition-all", item.hoverColor)}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </ParallaxLayer>
    </ParallaxContainer>
  );
};


const About = () => {
  const highlights = [
    { title: "Student Innovator", icon: <Rocket className="text-brand-primary" />, desc: "Bridging academia and real-world tech." },
    { title: "Robotics Developer", icon: <Cpu className="text-brand-secondary" />, desc: "Building hardware that thinks." },
    { title: "AI Builder", icon: <Sparkles className="text-brand-primary" />, desc: "Crafting intelligent software solutions." },
    { title: "Future Engineer", icon: <Globe className="text-brand-secondary" />, desc: "Solving global problems with code." },
  ];

  return (
    <section id="about" className="py-32 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Student Entrepreneur <br />
              with a <span className="text-brand-primary">Visionary Mindset</span>
            </h2>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed max-w-xl">
              <p>
                I'm Ayush Paul, a 12th PCM student who doesn't just study science—I apply it. My journey started with a curiosity for how things work, leading me into the worlds of <span className="text-white">Web Development</span>, <span className="text-white">AI</span>, and <span className="text-white">Robotics</span>.
              </p>
              <p>
                As a student entrepreneur, I bridge the gap between academic learning and real-world application. Whether it's coding a complex AI application or building an Arduino-powered robot, my goal is always to innovate and solve problems.
              </p>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Projects</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-white">4+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Years Exp</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Clients</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Skills = ({ onFilterProjects }: { onFilterProjects: (category: string | null) => void }) => {
  const skillCategories = [
    {
      title: "Development",
      icon: <Code className="text-brand-primary" />,
      skills: ["React / Next.js", "Python", "Tailwind CSS", "TypeScript", "Node.js"],
      filter: "Web"
    },
    {
      title: "Robotics & Electronics",
      icon: <Cpu className="text-brand-secondary" />,
      skills: ["Arduino", "Raspberry Pi", "Circuit Design", "IoT", "Automation"],
      filter: "Robotics"
    },
    {
      title: "Design & Editing",
      icon: <Palette className="text-brand-accent" />,
      skills: ["Video Editing", "Branding", "UI/UX Design", "Motion Graphics", "Figma"],
      filter: "Design"
    },
    {
      title: "AI Tools",
      icon: <Sparkles className="text-brand-primary" />,
      skills: ["Prompt Engineering", "AI App Dev", "LLM Integration", "Automation", "Data Analysis"],
      filter: "AI"
    },
  ];

  return (
    <section id="skills" className="py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            Expertise
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Mastered <span className="text-brand-primary">Skills</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">A diverse toolkit for the modern digital era. Click a category to see related projects.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => onFilterProjects(category.filter)}
              className="glass-card p-10 rounded-[40px] border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-brand-primary" size={20} />
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6 group-hover:text-brand-primary transition-colors">{category.title}</h3>
              <ul className="space-y-4">
                {category.skills.map((skill, j) => (
                  <li key={j} className="flex items-center text-white/50 text-sm group-hover:text-white/80 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 mr-4 group-hover:scale-150 transition-transform" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AuthoritySignals = () => {
  const skillData = [
    { subject: 'AI / ML', A: 120, fullMark: 150 },
    { subject: 'Robotics', A: 110, fullMark: 150 },
    { subject: 'Full Stack', A: 140, fullMark: 150 },
    { subject: 'UI / UX', A: 90, fullMark: 150 },
    { subject: 'DevOps', A: 100, fullMark: 150 },
    { subject: 'Hardware', A: 115, fullMark: 150 },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Technical <span className="text-brand-primary">Radar</span></h2>
            <p className="text-white/40 text-lg mb-12 leading-relaxed">
              A visual representation of my core technical competencies. I focus on the intersection of high-level software architecture and low-level hardware integration.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "AI & ML", value: "Expert", desc: "Neural Networks, Computer Vision" },
                { label: "Robotics", value: "Advanced", desc: "ROS, Arduino, Embedded Systems" },
                { label: "Web Tech", value: "Master", desc: "React, Node.js, Cloud Arch" },
                { label: "Design", value: "Professional", desc: "Product UX, Visual Identity" }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-brand-primary font-bold text-lg mb-1">{item.value}</div>
                  <div className="text-white font-bold text-sm mb-2">{item.label}</div>
                  <div className="text-white/20 text-[10px] uppercase tracking-widest font-bold">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] w-full glass-card rounded-[40px] p-8 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Ayush"
                  dataKey="A"
                  stroke="#00C2FF"
                  fill="#00C2FF"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* GitHub Activity Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-10 rounded-[40px] glass-card border border-white/5 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Github className="text-brand-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Open Source Contributions</h3>
                <p className="text-white/40 text-sm">Always building, always contributing.</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1,248</div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Contributions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">42</div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Repositories</div>
              </div>
              <a href="https://github.com/guchchi" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all">
                View GitHub
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 justify-center">
            {Array.from({ length: 365 }).map((_, i) => {
              const opacity = Math.random() > 0.8 ? 0.8 : Math.random() > 0.5 ? 0.4 : 0.1;
              return (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-sm bg-brand-primary" 
                  style={{ opacity }}
                />
              );
            })}
          </div>
          <div className="mt-6 flex justify-end items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            Less <div className="w-2 h-2 rounded-sm bg-brand-primary opacity-10" /> <div className="w-2 h-2 rounded-sm bg-brand-primary opacity-40" /> <div className="w-2 h-2 rounded-sm bg-brand-primary opacity-80" /> More
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Projects = ({ filter }: { filter: string | null }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!filter) return projects;
    return projects.filter(p => p.category?.toLowerCase().includes(filter.toLowerCase()));
  }, [projects, filter]);

  const featuredProject = projects.find(p => p.featured) || projects[0];

  return (
    <section id="projects" className="py-32 bg-white/[0.02] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              Portfolio
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Featured <span className="text-brand-primary">Products</span></h2>
            <p className="text-white/40 text-lg">Turning complex problems into elegant, production-ready solutions. Each project is a deep dive into engineering and design.</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {filter && (
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
              >
                Clear Filter: {filter}
              </button>
            )}
            <button className="px-8 py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-3 group shadow-xl shadow-brand-primary/20">
              Explore All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>
        </div>

        {/* Featured Project Spotlight */}
        {!filter && featuredProject && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedProject(featuredProject)}
            className="mb-24 group relative rounded-[40px] overflow-hidden glass-card border border-white/10 cursor-pointer"
          >
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto overflow-hidden relative">
                <img src={featuredProject.image} alt={featuredProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute top-8 left-8">
                  <div className="px-4 py-2 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">
                    Featured Project
                  </div>
                </div>
              </div>
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 block">{featuredProject.category}</span>
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{featuredProject.title}</h3>
                <p className="text-white/60 text-xl mb-10 leading-relaxed line-clamp-3">{featuredProject.description}</p>
                <div className="flex flex-wrap gap-4 mb-12">
                  {featuredProject.tech?.map((t: string) => (
                    <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-brand-primary font-bold group-hover:gap-6 transition-all">
                  View Full Case Study <ArrowRight size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {filteredProjects.filter(p => !p.featured || filter).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-[40px] overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-brand-primary/30 transition-all duration-700"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={`Project: ${project.title}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-40"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover Preview Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mb-4 shadow-2xl">
                    <ArrowRight size={32} />
                  </div>
                  <span className="text-white font-bold tracking-widest uppercase text-xs">View Case Study</span>
                </div>

                {/* Metrics Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Zap size={12} className="text-brand-primary" /> High Impact
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <TrendingUp size={12} className="text-brand-secondary" /> Scalable
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">
                    {project.category}
                  </span>
                  <div className="flex gap-3">
                    {project.tech?.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                <p className="text-white/40 mb-8 line-clamp-2 text-lg leading-relaxed">{project.description}</p>
                
                <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                    <Clock size={14} /> 2024
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                    <User size={14} /> Solo Project
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-[40px] border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full relative">
                {selectedProject.video ? (
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={selectedProject.video} type="video/mp4" />
                  </video>
                ) : (
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2 block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-16">
                <div className="grid lg:grid-cols-3 gap-16 mb-20">
                  <div className="lg:col-span-2 space-y-12">
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-sm">01</span>
                        The Problem
                      </h3>
                      <p className="text-white/60 text-xl leading-relaxed">{selectedProject.problem || selectedProject.description}</p>
                    </section>
                    
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-sm">02</span>
                        Thinking Process
                      </h3>
                      <p className="text-white/60 text-xl leading-relaxed">{selectedProject.process || "Deep dive into user needs and technical constraints to build a scalable solution."}</p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-sm">03</span>
                        Architecture
                      </h3>
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <p className="text-white/60 text-lg leading-relaxed">{selectedProject.architecture || "Modular microservices architecture with real-time data synchronization."}</p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Technology Stack</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.tech?.map((t: string) => (
                          <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Impact</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <Zap size={18} />
                          </div>
                          <div>
                            <div className="text-white font-bold">99.9% Uptime</div>
                            <div className="text-white/20 text-[10px] uppercase font-bold">Reliability</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <TrendingUp size={18} />
                          </div>
                          <div>
                            <div className="text-white font-bold">2x Performance</div>
                            <div className="text-white/20 text-[10px] uppercase font-bold">Optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="flex flex-col gap-4">
                        <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all">
                          Live Demo <ExternalLink size={18} />
                        </a>
                        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                          View Code <Github size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "AI Solutions",
      description: "Custom AI agents, LLM integrations, and automation workflows that think and act like humans.",
      icon: <Sparkles size={32} className="text-brand-primary" />,
      cta: "Start a Project →"
    },
    {
      title: "Website Development",
      description: "High-performance, scalable web applications built with modern stacks like Next.js and React.",
      icon: <Globe size={32} className="text-brand-secondary" />,
      cta: "Build My Site →"
    },
    {
      title: "Digital Branding",
      description: "Cohesive brand identities and UI/UX designs that make your startup stand out in a crowded market.",
      icon: <Palette size={32} className="text-brand-accent" />,
      cta: "Get Branded →"
    },
    {
      title: "Robotics & IoT",
      description: "Hardware prototyping and smart automation solutions using Arduino, Raspberry Pi, and custom sensors.",
      icon: <Cpu size={32} className="text-brand-primary" />,
      cta: "Innovate Now →"
    },
  ];

  return (
    <section id="services" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            Services
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Premium <span className="text-brand-primary">Solutions</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">Helping startups and visionaries build the future with cutting-edge technology and design.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[40px] glass-card border border-white/5 hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{service.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 group-hover:text-white/60 transition-colors">
                {service.description}
              </p>
              
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all">
                {service.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Courses = () => {
  return (
    <section id="courses" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Learning Journey</h2>
            <div className="space-y-8">
              {[
                {
                  title: "JEE Preparation",
                  desc: "Mastering Physics, Chemistry, and Mathematics for higher engineering research.",
                  status: "Ongoing",
                },
                {
                  title: "Advanced Programming",
                  desc: "Deep diving into system architecture, AI algorithms, and full-stack dev.",
                  status: "Continuous",
                },
                {
                  title: "Robotics Research",
                  desc: "Exploring the intersection of AI and hardware for autonomous systems.",
                  status: "Passionate",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-brand-primary">
                    0{i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 text-[10px] font-bold uppercase text-brand-primary">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <BookOpen className="text-brand-primary" size={32} />
              <h3 className="text-2xl font-bold">Research Interests</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Quantum Computing", "Neural Networks", "Space Tech", "Renewable Energy", "Bio-Robotics", "Cybersecurity"].map((interest, i) => (
                <div key={i} className="px-4 py-3 rounded-xl bg-white/5 text-sm font-medium text-white/80">
                  {interest}
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
              <p className="text-sm italic text-white/80">
                "Education is not just about learning facts, but training the mind to think."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Hiring = () => {
  return (
    <section id="hire" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-primary/5 blur-[150px] rounded-full -translate-y-1/2" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[60px] overflow-hidden p-12 md:p-24 text-center border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl"
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8">
              Open for Collaboration
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tighter leading-tight">
              Let's Build the <br /> Next Big Thing.
            </h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
              Whether you're a startup looking for a technical co-founder or a company needing elite engineering, I'm ready to help you scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <MagneticButton className="w-full sm:w-auto">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 bg-brand-primary text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-brand-primary/20 group"
                >
                  Start a Project <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </MagneticButton>
              <a
                href="mailto:hello@ayushpaul.in"
                className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all"
              >
                Book a Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  useSEO({
    title: "Ayush Paul | AI Developer & Digital Builder",
    keywords: "Ayush Paul, AI Developer India, Robotics Developer, Hire Ayush Paul"
  });
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const handleFilterProjects = (category: string | null) => {
    setProjectFilter(category);
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero onViewPortfolio={onViewPortfolio} />
      <SectionReveal><StatsDashboard /></SectionReveal>
      <SectionReveal><BrandEcosystem /></SectionReveal>
      <SectionReveal><About /></SectionReveal>
      <SectionReveal><AuthoritySignals /></SectionReveal>
      <SectionReveal><PremiumSkills /></SectionReveal>
      <SectionReveal><Projects filter={projectFilter} /></SectionReveal>
      <SectionReveal><Services /></SectionReveal>
      <SectionReveal><Courses /></SectionReveal>
      <SectionReveal><Hiring /></SectionReveal>
      <SectionReveal><BlogSection /></SectionReveal>
      <SectionReveal><Testimonials /></SectionReveal>
      <SectionReveal><Contact /></SectionReveal>
      <SectionReveal><Newsletter /></SectionReveal>
    </motion.div>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="blog" className="py-24 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest <span className="text-brand-primary">Insights</span></h2>
            <p className="text-white/60">Thoughts on AI, Robotics, and the future of tech.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="px-6 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2">
              Read All <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, i) => (
            <div 
              key={post.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{post.tags?.[0]}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{post.description}</p>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              No blog posts found. Add some in the admin dashboard!
            </div>
          )}
        </div>
      </div>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-[40px] border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full relative">
                <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                      {selectedPost.tags?.[0]}
                    </span>
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(selectedPost.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">{selectedPost.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <p className="text-xl text-white/60 leading-relaxed italic border-l-4 border-brand-primary pl-6 mb-12">
                  {selectedPost.description}
                </p>
                <div className="prose prose-invert prose-brand max-w-none">
                  <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
                  <Link 
                    to={`/blog/${selectedPost.slug}`}
                    className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2"
                  >
                    Read Full Article <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const BlogPage = () => {
  useSEO({
    title: "Ayush Paul Blog | Ideas, AI & Engineering",
    description: "Ayush Paul's Blog discussing AI, Development, learning journey and featured projects."
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        {/* Back to Home */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">The <span className="text-brand-primary">Blog</span></h1>
          <p className="text-white/60 text-xl">Exploring the intersection of AI, Robotics, and Entrepreneurship.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={cn("px-6 py-4 rounded-2xl font-bold text-sm transition-all", !selectedTag ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10")}
            >
              All
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn("px-6 py-4 rounded-2xl font-bold text-sm transition-all", selectedTag === tag ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{post.tags?.[0]}</span>
                    <span className="text-xs text-white/40 uppercase tracking-widest">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  <p className="text-white/60 mb-6 line-clamp-3">{post.description}</p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-primary">
                    Read More <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: post ? `${post.title} | Ayush Paul Blog` : "Ayush Paul Blog",
    description: post?.description || post?.excerpt,
    image: post?.coverImage,
    url: `/blog/${slug}`
  });

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data: any = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setPost(data);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });
    return () => unsubscribe();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">Post not found</div>;

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors">
            <ArrowRight size={20} className="rotate-180" /> Back to Blog
          </Link>

          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                <Calendar size={16} className="text-brand-primary" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                <Clock size={16} className="text-brand-primary" />
                {Math.ceil(post.content.split(" ").length / 200)} min read
              </div>
              <div className="flex gap-2">
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">{post.title}</h1>
            <p className="text-xl text-white/60 leading-relaxed italic border-l-4 border-brand-primary pl-6 mb-12">{post.description}</p>
          </div>

          <div className="aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/10">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            {post.blocks ? (
              <div className="space-y-8">
                {post.blocks.map((block: Block) => {
                  switch (block.type) {
                    case 'text':
                      return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
                    case 'heading':
                      const Tag = `h${block.metadata?.level || 2}` as any;
                      return <Tag key={block.id} className="font-bold text-white/90 mt-12 mb-6">{block.content}</Tag>;
                    case 'list':
                      return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="list-container" />;
                    case 'image':
                      return (
                        <figure key={block.id} className={cn(
                          "my-12 rounded-3xl overflow-hidden border border-white/10",
                          block.metadata?.alignment === 'center' ? "max-w-2xl mx-auto" : 
                          block.metadata?.alignment === 'full' ? "w-full" : ""
                        )}>
                          <img src={block.content} alt={block.metadata?.alt} className="w-full h-auto" referrerPolicy="no-referrer" />
                          {block.metadata?.caption && <figcaption className="p-4 text-center text-sm text-white/40 italic">{block.metadata.caption}</figcaption>}
                        </figure>
                      );
                    case 'code':
                      return (
                        <div key={block.id} className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                          <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{block.metadata?.language || 'code'}</span>
                          </div>
                          <pre className="p-6 overflow-x-auto font-mono text-sm text-brand-primary"><code>{block.content}</code></pre>
                        </div>
                      );
                    case 'quote':
                      return (
                        <blockquote key={block.id} className="my-12 p-8 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-3xl italic text-2xl text-white/90 font-display">
                          "{block.content}"
                        </blockquote>
                      );
                    case 'callout':
                      const variants = {
                        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                        success: 'bg-green-500/10 border-green-500/20 text-green-400',
                        danger: 'bg-red-500/10 border-red-500/20 text-red-400',
                      };
                      return (
                        <div key={block.id} className={cn("my-8 p-6 rounded-2xl border flex gap-4", variants[block.metadata?.variant || 'info'])}>
                          <Info size={24} className="shrink-0" />
                          <div className="text-sm font-medium">{block.content}</div>
                        </div>
                      );
                    case 'divider':
                      return <hr key={block.id} className="my-16 border-white/10" />;
                    default:
                      return null;
                  }
                })}
              </div>
            ) : (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

const AdminPage = () => {
  useSEO({ title: "Admin Dashboard | Ayush Paul", noindex: true });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="glass-card p-12 rounded-[40px] border border-white/10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Rocket size={40} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
          <p className="text-white/40 mb-12">Please sign in with your authorized account to manage the startup portal.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <LogIn size={24} /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard user={user} />;
};

// --- CMS Components ---

const SortableBlock = ({ block, onUpdate, onDelete, onAIAction }: { 
  block: Block, 
  onUpdate: (id: string, updates: Partial<Block>) => void,
  onDelete: (id: string) => void,
  onAIAction: (id: string, action: string) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const renderEditor = () => {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'code'],
        ['clean']
      ],
    };

    switch (block.type) {
      case 'text':
        return (
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(content) => onUpdate(block.id, { content })}
            placeholder="Start writing..."
            modules={modules}
            className="quill-editor-dark"
          />
        );
      case 'heading':
        const Level = `h${block.metadata?.level || 2}` as any;
        return (
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary shrink-0">H{block.metadata?.level || 2}</div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder={`Heading ${block.metadata?.level || 2}...`}
              className={cn(
                "w-full bg-transparent border-none outline-none font-bold text-white/90",
                block.metadata?.level === 1 ? "text-4xl" : 
                block.metadata?.level === 2 ? "text-3xl" : 
                block.metadata?.level === 3 ? "text-2xl" : "text-xl"
              )}
            />
          </div>
        );
      case 'list':
        return (
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(content) => onUpdate(block.id, { content })}
            placeholder={block.metadata?.listType === 'ordered' ? "Ordered list..." : "Unordered list..."}
            modules={{
              toolbar: [
                [block.metadata?.listType === 'ordered' ? 'ordered' : 'bullet'],
                ['bold', 'italic', 'link'],
                ['clean']
              ]
            }}
            className="quill-editor-dark"
          />
        );
      case 'image':
        return (
          <div className="space-y-4">
            {block.content ? (
              <div className={cn(
                "relative group rounded-2xl overflow-hidden border border-white/10",
                block.metadata?.alignment === 'center' ? "max-w-2xl mx-auto" : 
                block.metadata?.alignment === 'full' ? "w-full" : "max-w-xl"
              )}>
                <img src={block.content} alt={block.metadata?.alt} className="w-full h-auto" />
                <button 
                  onClick={() => onUpdate(block.id, { content: '' })}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-white/20 hover:border-brand-primary/50 hover:text-brand-primary/50 transition-all cursor-pointer relative">
                <ImageIcon size={48} className="mb-4" />
                <p className="font-bold">Click or drag to upload image</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    onUpdate(block.id, { content: url });
                  }}
                />
              </div>
            )}
            <div className="flex gap-4">
              <input 
                type="text"
                placeholder="Alt text (SEO)"
                value={block.metadata?.alt || ''}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, alt: e.target.value } })}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-primary"
              />
              <select 
                value={block.metadata?.alignment || 'left'}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, alignment: e.target.value as any } })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4 py-2 bg-white/5 border border-white/10 rounded-t-xl">
              <select 
                value={block.metadata?.language || 'javascript'}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, language: e.target.value } })}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-white/40 outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Paste your code here..."
              className="w-full bg-black/40 border border-white/10 rounded-b-xl p-6 font-mono text-sm text-brand-primary outline-none resize-none min-h-[150px]"
            />
          </div>
        );
      case 'quote':
        return (
          <div className="flex gap-6 p-8 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-2xl">
            <Quote className="text-brand-primary shrink-0" size={32} />
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Enter quote..."
              className="w-full bg-transparent border-none outline-none text-2xl font-display italic text-white/90 resize-none min-h-[60px]"
            />
          </div>
        );
      case 'callout':
        const variants = {
          info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
          success: 'bg-green-500/10 border-green-500/20 text-green-400',
          danger: 'bg-red-500/10 border-red-500/20 text-red-400',
        };
        const variant = block.metadata?.variant || 'info';
        return (
          <div className={cn("p-6 rounded-2xl border flex gap-4", variants[variant])}>
            <Info size={24} className="shrink-0" />
            <div className="flex-1 space-y-2">
              <select 
                value={variant}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, variant: e.target.value as any } })}
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
              </select>
              <textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                placeholder="Callout message..."
                className="w-full bg-transparent border-none outline-none text-sm font-medium resize-none min-h-[40px]"
              />
            </div>
          </div>
        );
      case 'divider':
        return <div className="h-px w-full bg-white/10 my-8" />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative mb-4"
    >
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <div {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white transition-colors">
          <GripVertical size={20} />
        </div>
        <button 
          onClick={() => onDelete(block.id)}
          className="p-2 text-white/20 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {block.type === 'text' && (
          <button 
            onClick={() => onAIAction(block.id, 'improve')}
            className="p-2 text-white/20 hover:text-brand-primary transition-colors"
            title="AI Improve"
          >
            <Wand2 size={20} />
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
        {renderEditor()}
      </div>
    </div>
  );
};

const BlogEditor = ({ blocks, setBlocks, onAIAction }: { 
  blocks: Block[], 
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  onAIAction: (id: string, action: string) => void
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: BlockType, metadata: any = {}) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      metadata: {
        ...metadata,
        ...(type === 'image' ? { alignment: 'center' } : 
           type === 'code' ? { language: 'javascript' } : 
           type === 'callout' ? { variant: 'info' } : {})
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-[400px] space-y-4">
            {blocks.map((block) => (
              <SortableBlock 
                key={block.id} 
                block={block} 
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onAIAction={onAIAction}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mr-2">Add Block</span>
        <div className="flex bg-white/5 rounded-xl p-1">
          <button onClick={() => addBlock('heading', { level: 2 })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Heading 2">
            <span className="text-xs font-bold">H2</span>
          </button>
          <button onClick={() => addBlock('heading', { level: 3 })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Heading 3">
            <span className="text-xs font-bold">H3</span>
          </button>
        </div>
        <button onClick={() => addBlock('text')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <Type size={18} /> <span className="text-xs font-bold">Text</span>
        </button>
        <div className="flex bg-white/5 rounded-xl p-1">
          <button onClick={() => addBlock('list', { listType: 'unordered' })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Bullet List">
            <List size={18} />
          </button>
          <button onClick={() => addBlock('list', { listType: 'ordered' })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Numbered List">
            <ListOrdered size={18} />
          </button>
        </div>
        <button onClick={() => addBlock('image')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <ImageIcon size={18} /> <span className="text-xs font-bold">Image</span>
        </button>
        <button onClick={() => addBlock('code')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <Code size={18} /> <span className="text-xs font-bold">Code</span>
        </button>
        <button onClick={() => addBlock('quote')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <Quote size={18} /> <span className="text-xs font-bold">Quote</span>
        </button>
        <button onClick={() => addBlock('callout')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <Info size={18} /> <span className="text-xs font-bold">Callout</span>
        </button>
        <button onClick={() => addBlock('divider')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
          <Minus size={18} /> <span className="text-xs font-bold">Divider</span>
        </button>
      </div>
    </div>
  );
};

const SEOPanel = ({ data, setData, blocks, onAIAction }: { 
  data: SEOData, 
  setData: React.Dispatch<React.SetStateAction<SEOData>>,
  blocks: Block[],
  onAIAction: (id: string, action: string) => void
}) => {
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    let s = 0;
    let i = [];

    if (data.title.length >= 50 && data.title.length <= 60) s += 20;
    else i.push("SEO Title should be between 50-60 characters");

    if (data.description.length >= 120 && data.description.length <= 160) s += 20;
    else i.push("Meta description should be between 120-160 characters");

    if (data.keywords) s += 20;
    else i.push("Focus keyword is missing");

    const hasImagesWithAlt = blocks.filter(b => b.type === 'image').every(b => b.metadata?.alt);
    if (hasImagesWithAlt && blocks.some(b => b.type === 'image')) s += 20;
    else if (blocks.some(b => b.type === 'image')) i.push("Some images are missing alt text");

    const textContent = blocks.filter(b => b.type === 'text').map(b => b.content).join(' ');
    if (textContent.length > 300) s += 20;
    else i.push("Content is too short (minimum 300 words recommended)");

    setScore(s);
    setIssues(i);
  }, [data, blocks]);

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">SEO Title</label>
              <button 
                onClick={() => onAIAction('', 'title')}
                className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Sparkles size={10} /> AI Generate
              </button>
            </div>
            <input 
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
              placeholder="Enter SEO title..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.title.length}</span>
              <span>Recommended: 50-60</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Meta Description</label>
              <button 
                onClick={() => onAIAction('', 'summary')}
                className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Sparkles size={10} /> AI Generate
              </button>
            </div>
            <textarea 
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-32 resize-none"
              placeholder="Enter meta description..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.description.length}</span>
              <span>Recommended: 120-160</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Focus Keyword</label>
              <button 
                onClick={() => onAIAction('', 'keywords')}
                className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Sparkles size={10} /> AI Generate
              </button>
            </div>
            <input 
              type="text"
              value={data.keywords}
              onChange={(e) => setData({ ...data, keywords: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
              placeholder="Enter focus keyword..."
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass-card border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">SEO Score</h3>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4",
                score >= 80 ? "border-green-500 text-green-500" : 
                score >= 50 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"
              )}>
                {score}
              </div>
            </div>
            
            <div className="space-y-4">
              {issues.length > 0 ? (
                issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-white/40">
                    <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                    {issue}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 text-sm text-green-500 font-bold">
                  <CheckCircle2 size={16} />
                  Your SEO is perfectly optimized!
                </div>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Social Preview</h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                {data.ogImage ? <img src={data.ogImage} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-white/10" />}
              </div>
              <div className="p-6 space-y-2">
                <div className="text-xs font-bold text-brand-primary uppercase tracking-widest">ayushpaul.in</div>
                <div className="text-lg font-bold text-white line-clamp-1">{data.ogTitle || data.title || "Post Title"}</div>
                <div className="text-sm text-white/40 line-clamp-2">{data.ogDescription || data.description || "Post description will appear here..."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIWritingAssistant = ({ onAction, isProcessing }: { onAction: (action: string) => void, isProcessing: boolean }) => {
  const actions = [
    { id: 'improve', label: 'Improve Writing', icon: <Sparkles size={16} />, desc: 'Enhance clarity and tone' },
    { id: 'grammar', label: 'Fix Grammar', icon: <CheckCircle2 size={16} />, desc: 'Correct errors instantly' },
    { id: 'expand', label: 'Expand Paragraph', icon: <Plus size={16} />, desc: 'Add more detail and depth' },
    { id: 'simplify', label: 'Simplify Text', icon: <Minus size={16} />, desc: 'Make it easier to read' },
    { id: 'summary', label: 'Generate Summary', icon: <FileText size={16} />, desc: 'Create meta description' },
    { id: 'keywords', label: 'SEO Keywords', icon: <Tag size={16} />, desc: 'Suggest target keywords' },
    { id: 'headings', label: 'Suggest Headings', icon: <Layout size={16} />, desc: 'Optimize structure' },
  ];

  return (
    <div className="p-8 rounded-[40px] glass-card border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Sparkles size={18} className="text-brand-primary" /> AI Writing Assistant
        </h3>
        {isProcessing && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Processing...
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={isProcessing}
            className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-black group-hover:bg-white/20 transition-all">
                {action.icon}
              </div>
              <span className="text-sm font-bold group-hover:text-black transition-colors">{action.label}</span>
            </div>
            <p className="text-[10px] text-white/40 group-hover:text-black/60 ml-11 transition-colors">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "messages" | "dashboard">("dashboard");
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    tags: "",
    published: false,
    featured: false,
    category: "Technology",
    scheduledAt: "",
  });

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const [projectFormData, setProjectFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    video: "",
    tech: "",
    caseStudy: "",
    link: ""
  });

  const [blogFilter, setBlogFilter] = useState<"all" | "published" | "draft" | "scheduled" | "featured">("all");

  useEffect(() => {
    const qBlogs = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribeBlogs = onSnapshot(qBlogs, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });

    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    const qMessages = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "contacts");
    });

    return () => {
      unsubscribeBlogs();
      unsubscribeProjects();
      unsubscribeMessages();
    };
  }, []);

  // Autosave logic
  useEffect(() => {
    if (!isEditing || !currentPost) return;
    const timer = setInterval(() => {
      handleSaveBlog(true);
    }, 10000);
    return () => clearInterval(timer);
  }, [isEditing, currentPost, blogFormData, blocks, seoData]);

  const handleAIAction = async (action: string, blockId?: string) => {
    setIsAIProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      let prompt = "";
      let targetContent = "";

      if (blockId) {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;
        targetContent = block.content;
      } else {
        targetContent = blocks.filter(b => b.type === 'text').map(b => b.content).join('\n');
      }

      switch (action) {
        case 'improve': prompt = `Improve the following text for a professional tech blog. Make it more engaging and clear:\n\n${targetContent}`; break;
        case 'grammar': prompt = `Fix any grammar or spelling mistakes in the following text:\n\n${targetContent}`; break;
        case 'expand': prompt = `Expand on the following paragraph, adding more technical detail and depth:\n\n${targetContent}`; break;
        case 'simplify': prompt = `Simplify the following text to make it easier to read for beginners:\n\n${targetContent}`; break;
        case 'summary': prompt = `Generate a concise summary (max 160 characters) for the following blog content. This will be used as a meta description:\n\n${targetContent}`; break;
        case 'keywords': prompt = `Suggest 5-10 SEO keywords for the following content. Return them as a comma-separated list:\n\n${targetContent}`; break;
        case 'headings': prompt = `Suggest a better heading hierarchy for the following content:\n\n${targetContent}`; break;
        case 'title': prompt = `Suggest a catchy, SEO-friendly title for a blog post with the following content:\n\n${targetContent}`; break;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const result = response.text;

      if (blockId) {
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, content: result } : b));
      } else if (action === 'summary') {
        setSeoData({ ...seoData, description: result });
        setBlogFormData({ ...blogFormData, description: result });
      } else if (action === 'keywords') {
        setSeoData({ ...seoData, keywords: result });
        setBlogFormData({ ...blogFormData, tags: result });
      } else if (action === 'title') {
        setSeoData({ ...seoData, title: result });
        setBlogFormData({ ...blogFormData, title: result, slug: generateSlug(result) });
      }
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "blog" | "project") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `${type}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (type === "blog") {
        setBlogFormData(prev => ({ ...prev, coverImage: url }));
      } else {
        setProjectFormData(prev => ({ ...prev, image: url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Make sure Firebase Storage is set up.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      tags: "",
      published: false,
      featured: false,
      category: "Technology",
      scheduledAt: "",
    });
    setBlocks([{ id: '1', type: 'text', content: '' }]);
    setSeoData({
      title: "",
      description: "",
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    });
  };

  const handleSaveBlog = async (eOrAutosave: React.FormEvent | boolean) => {
    if (typeof eOrAutosave !== 'boolean') eOrAutosave.preventDefault();
    const isAutosave = typeof eOrAutosave === 'boolean' ? eOrAutosave : false;

    const postData = {
      ...blogFormData,
      blocks,
      seo: seoData,
      tags: typeof blogFormData.tags === 'string' ? blogFormData.tags.split(",").map(t => t.trim()).filter(t => t) : blogFormData.tags,
      updatedAt: serverTimestamp(),
      author: user.email,
      readingTime: Math.ceil(blocks.filter(b => b.type === 'text').map(b => b.content).join(' ').split(' ').length / 200)
    };

    try {
      if (currentPost) {
        await updateDoc(doc(db, "blogPosts", currentPost.id), postData);
      } else if (!isAutosave) {
        await addDoc(collection(db, "blogPosts"), {
          ...postData,
          createdAt: serverTimestamp(),
          views: 0
        });
      }
      
      setLastSaved(new Date());
      if (!isAutosave) {
        setIsEditing(false);
        setCurrentPost(null);
        resetBlogForm();
      }
    } catch (error) {
      if (!isAutosave) {
        handleFirestoreError(error, currentPost ? OperationType.UPDATE : OperationType.CREATE, "blogPosts");
      }
    }
  };

  const handleEditBlog = (post: any) => {
    setCurrentPost(post);
    setBlogFormData({
      title: post.title || "",
      slug: post.slug || "",
      description: post.description || "",
      coverImage: post.coverImage || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      published: post.published ?? false,
      featured: post.featured ?? false,
      category: post.category || "Technology",
      scheduledAt: post.scheduledAt || "",
    });
    setBlocks(post.blocks || [{ id: '1', type: 'text', content: post.content || '' }]);
    setSeoData(post.seo || {
      title: post.title || "",
      description: post.description || "",
      keywords: "",
      canonicalUrl: "",
      ogTitle: post.title || "",
      ogDescription: post.description || "",
      ogImage: post.coverImage || "",
    });
    setIsEditing(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...projectFormData,
      tech: projectFormData.tech.split(",").map(t => t.trim()).filter(t => t),
      updatedAt: serverTimestamp()
    };

    try {
      if (currentProject) {
        await updateDoc(doc(db, "projects", currentProject.id), projectData);
      } else {
        await setDoc(doc(collection(db, "projects")), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentProject(null);
      setProjectFormData({ title: "", category: "", description: "", image: "", video: "", tech: "", caseStudy: "", link: "" });
    } catch (error) {
      handleFirestoreError(error, currentProject ? OperationType.UPDATE : OperationType.CREATE, "projects");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    const itemType = collectionName === "blogPosts" ? "post" : collectionName === "projects" ? "project" : "message";
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, collectionName);
      }
    }
  };

  const StatCard = ({ label, value, icon, trend }: { label: string, value: string | number, icon: React.ReactNode, trend?: string }) => (
    <div className="p-8 rounded-[40px] glass-card border border-white/5 group hover:border-brand-primary/30 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
          {icon}
        </div>
        {trend && (
          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <TrendingUp size={10} /> {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-2 tracking-tighter">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-white/20">{label}</div>
    </div>
  );

  if (isDistractionFree && isEditing) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0A0A0A] overflow-y-auto p-8 md:p-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-24">
            <div className="flex items-center gap-4 text-white/20">
              <Shield size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Distraction-Free Mode</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                <Clock size={12} /> {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
              </div>
              <button 
                onClick={() => setIsDistractionFree(false)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <input 
            type="text" 
            value={blogFormData.title}
            onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full bg-transparent border-none outline-none text-5xl md:text-7xl font-bold mb-12 tracking-tighter text-white placeholder:text-white/10"
            placeholder="Post Title"
          />
          
          <BlogEditor 
            blocks={blocks} 
            setBlocks={setBlocks} 
            onAIAction={(id, action) => handleAIAction(action, id)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold">Creator <span className="text-brand-primary">Studio</span></h1>
            <p className="text-white/40">Manage your content and authority signals</p>
          </div>
          <div className="flex gap-4">
            {activeTab !== "messages" && activeTab !== "dashboard" && !isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCurrentPost(null);
                  setCurrentProject(null);
                  if (activeTab === "blogs") {
                    resetBlogForm();
                  } else {
                    setProjectFormData({ title: "", category: "", description: "", image: "", video: "", tech: "", caseStudy: "", link: "" });
                  }
                }}
                className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2"
              >
                <Plus size={20} /> Create {activeTab === "blogs" ? "Post" : "Project"}
              </button>
            )}
            <button onClick={() => signOut(auth)} className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold flex items-center gap-2 hover:text-white transition-colors">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {!isEditing && (
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layout size={18} /> },
              { id: 'blogs', label: 'Blog Posts', icon: <FileText size={18} /> },
              { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2", 
                  activeTab === tab.id ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-12">
            {activeTab === "blogs" ? (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => { setIsEditing(false); setCurrentPost(null); }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold">{currentPost ? "Edit Post" : "New Post"}</h2>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                        <Clock size={12} /> {lastSaved ? `Autosaved at ${lastSaved.toLocaleTimeString()}` : 'Draft'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsDistractionFree(true)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                      title="Distraction-Free Mode"
                    >
                      <Monitor size={20} />
                    </button>
                    <button 
                      onClick={() => handleSaveBlog(false)}
                      className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2"
                    >
                      <Save size={20} /> {currentPost ? "Update" : "Publish"}
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-12">
                  <div className="space-y-12">
                    <div className="glass-card p-12 rounded-[40px] border border-white/10 space-y-12">
                      <div className="space-y-8">
                        <input 
                          type="text" 
                          value={blogFormData.title}
                          onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
                          className="w-full bg-transparent border-none outline-none text-5xl font-bold tracking-tighter text-white placeholder:text-white/10"
                          placeholder="Post Title"
                        />
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <LinkIcon size={14} className="text-white/20" />
                            <span className="text-xs text-white/40">ayushpaul.in/blog/</span>
                            <input 
                              type="text" 
                              value={blogFormData.slug}
                              onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                              className="bg-transparent border-none outline-none text-xs font-bold text-brand-primary w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Tag size={14} className="text-white/20" />
                            <input 
                              type="text" 
                              value={blogFormData.tags}
                              onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                              placeholder="Tags (comma separated)"
                              className="bg-transparent border-none outline-none text-xs font-bold text-white/60 w-40"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Cover Image</label>
                        <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                          {blogFormData.coverImage ? (
                            <>
                              <img src={blogFormData.coverImage} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setBlogFormData({ ...blogFormData, coverImage: '' })}
                                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={20} />
                              </button>
                            </>
                          ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                              <ImageIcon size={48} className="text-white/10 mb-4" />
                              <span className="text-sm font-bold text-white/20">Upload Cover Image</span>
                              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "blog")} accept="image/*" />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="pt-12 border-t border-white/10">
                        <BlogEditor 
                          blocks={blocks} 
                          setBlocks={setBlocks} 
                          onAIAction={(id, action) => handleAIAction(action, id)} 
                        />
                      </div>
                    </div>

                    <div className="glass-card p-12 rounded-[40px] border border-white/10">
                      <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <Globe size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">SEO Optimization</h3>
                      </div>
                      <SEOPanel data={seoData} setData={setSeoData} blocks={blocks} onAIAction={(id, action) => handleAIAction(action, id)} />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <AIWritingAssistant onAction={(action) => handleAIAction(action)} isProcessing={isAIProcessing} />
                    
                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
                      <h3 className="font-bold flex items-center gap-2">
                        <Settings size={18} className="text-white/20" /> Publishing
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className={blogFormData.published ? "text-green-500" : "text-white/20"} />
                            <span className="text-sm font-medium">Published</span>
                          </div>
                          <button 
                            onClick={() => setBlogFormData({ ...blogFormData, published: !blogFormData.published })}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-all",
                              blogFormData.published ? "bg-green-500" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              blogFormData.published ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <Star size={18} className={blogFormData.featured ? "text-yellow-500" : "text-white/20"} />
                            <span className="text-sm font-medium">Featured Post</span>
                          </div>
                          <button 
                            onClick={() => setBlogFormData({ ...blogFormData, featured: !blogFormData.featured })}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-all",
                              blogFormData.featured ? "bg-yellow-500" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              blogFormData.featured ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Category</label>
                        <select 
                          value={blogFormData.category}
                          onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                        >
                          <option value="Technology">Technology</option>
                          <option value="Robotics">Robotics</option>
                          <option value="AI">Artificial Intelligence</option>
                          <option value="Startup">Startup</option>
                          <option value="Development">Development</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Schedule Publish</label>
                        <input 
                          type="datetime-local" 
                          value={blogFormData.scheduledAt}
                          onChange={(e) => setBlogFormData({ ...blogFormData, scheduledAt: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProject} className="glass-card p-12 rounded-[40px] border border-white/10 space-y-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">{currentProject ? "Edit Project" : "New Project"}</h2>
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setCurrentProject(null); }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Title</label>
                    <input 
                      type="text" 
                      value={projectFormData.title}
                      onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Category</label>
                    <input 
                      type="text" 
                      value={projectFormData.category}
                      onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Description</label>
                  <textarea 
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-24 resize-none"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Image URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={projectFormData.image}
                        onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                        required
                      />
                      <label className="cursor-pointer px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                        <Plus size={20} /> {isUploading ? "..." : "Upload"}
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "project")} accept="image/*" disabled={isUploading} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Video URL (Optional)</label>
                    <input 
                      type="text" 
                      value={projectFormData.video}
                      onChange={(e) => setProjectFormData({ ...projectFormData, video: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Technologies (comma separated)</label>
                    <input 
                      type="text" 
                      value={projectFormData.tech}
                      onChange={(e) => setProjectFormData({ ...projectFormData, tech: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Link</label>
                    <input 
                      type="text" 
                      value={projectFormData.link}
                      onChange={(e) => setProjectFormData({ ...projectFormData, link: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Case Study Content (Markdown)</label>
                  <textarea 
                    value={projectFormData.caseStudy}
                    onChange={(e) => setProjectFormData({ ...projectFormData, caseStudy: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-64 resize-none font-mono"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setCurrentProject(null); }}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all"
                  >
                    {currentProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard label="Total Posts" value={posts.length} icon={<FileText size={24} />} trend="+12%" />
                  <StatCard label="Total Views" value={posts.reduce((acc, p) => acc + (p.views || 0), 0)} icon={<Eye size={24} />} trend="+24%" />
                  <StatCard label="Messages" value={messages.length} icon={<MessageSquare size={24} />} trend="+5%" />
                  <StatCard label="Projects" value={projects.length} icon={<Layers size={24} />} />
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="glass-card p-10 rounded-[40px] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Popular Posts</h3>
                      <BarChart3 size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-6">
                      {posts.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((post, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => handleEditBlog(post)}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <div className="font-bold text-white/80 group-hover:text-brand-primary transition-colors line-clamp-1">{post.title}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{post.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/40 font-bold text-sm">
                            <Eye size={14} /> {post.views || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[40px] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Recent Activity</h3>
                      <History size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-8">
                      {messages.slice(0, 5).map((msg, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                          <div>
                            <div className="text-sm text-white/80"><span className="font-bold text-white">{msg.name}</span> sent a message about <span className="font-bold text-white">{msg.subject}</span></div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">{formatDate(msg.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blogs" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'published', 'draft', 'scheduled', 'featured'] as const).map((f) => (
                      <button 
                        key={f}
                        onClick={() => setBlogFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                          blogFilter === f ? "bg-brand-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search posts..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts
                    .filter(p => {
                      if (blogFilter === 'published') return p.published;
                      if (blogFilter === 'draft') return !p.published;
                      if (blogFilter === 'featured') return p.featured;
                      if (blogFilter === 'scheduled') return p.scheduledAt && new Date(p.scheduledAt) > new Date();
                      return true;
                    })
                    .map((post) => (
                    <div key={post.id} className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {post.published ? (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Published</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Draft</span>
                          )}
                          {post.featured && (
                            <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Featured</span>
                          )}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">{post.category || "Technology"}</div>
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">{post.title}</h3>
                        <div className="flex items-center gap-4 text-white/40 text-xs mb-8">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
                        </div>
                        <div className="mt-auto flex gap-3 pt-6 border-t border-white/5">
                          <button 
                            onClick={() => handleEditBlog(post)}
                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id, "blogPosts")}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">{project.category}</div>
                      <h3 className="text-xl font-bold mb-6">{project.title}</h3>
                      <div className="flex gap-3 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => {
                            setCurrentProject(project);
                            setProjectFormData({
                              title: project.title,
                              category: project.category,
                              description: project.description,
                              image: project.image,
                              video: project.video || "",
                              tech: project.tech.join(", "),
                              caseStudy: project.caseStudy || "",
                              link: project.link || ""
                            });
                            setIsEditing(true);
                          }}
                          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id, "projects")}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="glass-card p-8 rounded-[40px] border border-white/10 group hover:border-brand-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
                          {msg.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{msg.name}</h3>
                          <p className="text-white/40 text-sm">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{formatDate(msg.timestamp)}</div>
                        <button 
                          onClick={() => handleDelete(msg.id, "contacts")}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-brand-primary">{msg.subject}</div>
                      <p className="text-white/60 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {((activeTab === "blogs" && posts.length === 0) || (activeTab === "projects" && projects.length === 0) || (activeTab === "messages" && messages.length === 0)) && (
              <div className="text-center py-24 glass-card rounded-[40px] border border-white/5">
                <p className="text-white/40">No {activeTab === "messages" ? "messages" : "items"} yet. {activeTab !== "messages" && `Start by creating your first ${activeTab === "blogs" ? "article" : "project"}!`}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      text: "Ayush is a rare talent. His ability to understand complex requirements and deliver high-quality code is impressive, especially considering he's still a student.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "David Chen",
      role: "Tech Lead",
      text: "The AI application Ayush built for us exceeded our expectations. His knowledge of prompt engineering and LLM integration is top-notch.",
      avatar: "https://i.pravatar.cc/150?u=david",
    },
    {
      name: "Elena Rodriguez",
      role: "Creative Director",
      text: "Working with Ayush on our branding was a breeze. He has a great eye for design and a very professional approach to feedback.",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Client Love</h2>
          <p className="text-white/60">What people say about working with me.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl glass-card relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white">
                <MessageSquare size={20} />
              </div>
              <p className="text-lg text-white/80 italic mb-8 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      if (!db) throw new Error("Firestore is not initialized");
      
      await addDoc(collection(db, "contacts"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp()
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, "contacts");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-[#0A0A0A] relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                Contact
              </div>
              <h2 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">Let's build <br /> something <span className="text-brand-primary">legendary.</span></h2>
              <p className="text-xl text-white/40 leading-relaxed max-w-lg">
                Have a project in mind or just want to say hi? I'm always open to discussing new ideas and opportunities.
              </p>
            </div>

            <div className="space-y-10">
              {[
                { icon: <Mail size={24} />, label: "Email", value: "hello@ayushpaul.in", href: "mailto:hello@ayushpaul.in" },
                { icon: <Phone size={24} />, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                { icon: <MapPin size={24} />, label: "Location", value: "New Delhi, India", href: "#" },
              ].map((item, i) => (
                <a 
                  key={i} 
                  href={item.href}
                  className="flex items-center gap-8 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                    <p className="text-2xl font-bold group-hover:text-brand-primary transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[50px] border border-white/5 relative"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all text-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all text-lg"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all text-lg"
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all resize-none text-lg"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full py-6 bg-white text-black rounded-2xl font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/10 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight size={20} />
                  </>
                )}
              </button>
              
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-center font-bold flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={20} />
                    Message received — I’ll reply within 24 hours.
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-bold"
                  >
                    Something went wrong. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        subscribedAt: serverTimestamp()
      });
      setStatus('success');
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[60px] glass-card border border-white/10 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mx-auto mb-8">
              <Mail size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Stay in the <span className="text-brand-primary">Loop</span></h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto">Get exclusive insights on AI, Robotics, and Startup building delivered straight to your inbox.</p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-brand-primary transition-all text-lg"
                required
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-2 top-2 bottom-2 px-8 bg-brand-primary text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join Now'}
              </button>
            </form>
            
            {status === 'success' && (
              <p className="text-green-500 font-bold animate-bounce">Welcome to the inner circle! Check your inbox soon.</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 font-bold">Something went wrong. Please try again later.</p>
            )}
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">No spam. Only high-signal tech insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
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
                { icon: <Mail size={24} />, href: "mailto:hello@ayushpaul.in", hoverColor: "hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/20" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 transition-all border border-white/5", item.hoverColor)}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {["About", "Projects", "Skills", "Services", "Blog"].map((link) => (
                <li key={link}>
                  {link === "Blog" ? (
                    <Link to="/blog" className="text-white/40 hover:text-brand-primary transition-colors font-medium">
                      {link}
                    </Link>
                  ) : (
                    <a href={`#${link.toLowerCase()}`} className="text-white/40 hover:text-brand-primary transition-colors font-medium">
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-sm font-medium">
            © 2024 Ayush Paul. Crafted with <span className="text-brand-primary">Passion</span> and AI.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white/20 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status: Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Error Boundary ---

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} (Operation: ${parsedError.operationType})`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <X className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4">Application Error</h1>
          <p className="text-white/60 max-w-md mb-8">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-primary/80 transition-all"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main App ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // SEO Title Management
    if (pathname === "/") {
      document.title = "Ayush Paul | AI Developer & Robotics Innovator";
    } else if (pathname === "/blog") {
      document.title = "Blog | Ayush Paul - AI & Tech Insights";
    } else if (pathname === "/admin") {
      document.title = "Admin Dashboard | Ayush Paul";
    }
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-[160px] right-6 md:bottom-28 md:right-8 z-[100] w-14 h-14 rounded-full glass-card flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const SupportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tiers = [
    { id: 1, name: "Supporter", price: 99, icon: <Heart size={24} />, desc: "A small token of appreciation" },
    { id: 2, name: "Coffee Support", price: 299, icon: <Coffee size={24} />, desc: "Keep the code flowing with caffeine" },
    { id: 3, name: "Premium Supporter", price: 999, icon: <Sparkles size={24} />, desc: "Ultimate support for my journey" },
  ];

  const handleSupport = async (tier: typeof tiers[0]) => {
    setLoading(tier.id);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: tier.price, tierName: tier.name }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-[40px] border border-white/10 overflow-hidden"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Support My Work</h2>
                <p className="text-white/40 text-sm mt-1">Choose a tier to support my projects</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-4">
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  disabled={loading !== null}
                  onClick={() => handleSupport(tier)}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-white/10 transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                      {tier.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{tier.name}</div>
                      <div className="text-sm text-white/40">{tier.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-primary">₹{tier.price}</div>
                    {loading === tier.id ? (
                      <Loader2 size={16} className="animate-spin ml-auto mt-1" />
                    ) : (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">One-time</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10 text-center">
              <p className="text-xs text-white/20 font-medium">
                Secure payment powered by <span className="text-white/40">Stripe</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-white/40 text-lg">Thank you for supporting Ayush Paul 🚀</p>
        </div>
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 text-sm text-white/60 leading-relaxed">
          Your contribution helps me keep building open-source projects and creating content for the community. You're awesome!
        </div>
        <button 
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl bg-brand-primary text-black font-bold hover:scale-105 active:scale-95 transition-all"
        >
          Back to Portfolio
        </button>
      </motion.div>
    </div>
  );
};

const CancelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
          <X size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Payment Cancelled</h1>
          <p className="text-white/40 text-lg">No worries! You can always support later.</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
        >
          Back to Portfolio
        </button>
      </motion.div>
    </div>
  );
};

const SupportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-primary/30 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
          <Heart size={16} fill="currentColor" />
        </div>
        <span className="text-sm font-bold">Support My Work</span>
      </button>
      <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default function App() {
  const [view, setView] = useState<"landing" | "profiles">("landing");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [konami, setKonami] = useState<string[]>([]);
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key].slice(-10);
      setKonami(newKonami);
      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        alert("🚀 STARTUP MODE ACTIVATED! You found the secret easter egg.");
        document.documentElement.style.setProperty('--color-brand-primary', '#00C2FF');
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konami]);

  const handleProfileSelect = (profile: string) => {
    if (profile === "back") {
      setView("landing");
    } else {
      setSelectedProfile(profile);
      alert(`Welcome, ${profile}! Portfolio for this profile is coming soon.`);
      setView("landing");
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="font-sans selection:bg-brand-primary/30 selection:text-brand-primary bg-[#0A0A0A] min-h-screen text-white overflow-x-hidden">
        
        <Routes>
          <Route path="/" element={
            view === "landing" ? (
              <>
                <CursorFollower />
                <ScrollProgressBar />
                <CommandPalette />
                <Navbar onPortfolioClick={() => setView("profiles")} />
                <main>
                  <LandingPage onViewPortfolio={() => setView("profiles")} />
                </main>
                <Footer />
                <MobileBottomNav onPortfolioClick={() => setView("profiles")} />
              </>
            ) : (
              <ProfileSelection onSelect={handleProfileSelect} />
            )
          } />
          <Route path="/now" element={
            <>
              <ScrollProgressBar />
              <CommandPalette />
              <Navbar onPortfolioClick={() => setView("profiles")} />
              <NowPage />
              <Footer />
              <MobileBottomNav onPortfolioClick={() => setView("profiles")} />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navbar onPortfolioClick={() => setView("profiles")} />
              <BlogPage />
              <Footer />
              <MobileBottomNav onPortfolioClick={() => setView("profiles")} />
            </>
          } />
          <Route path="/blog/:slug" element={
            <>
              <Navbar onPortfolioClick={() => setView("profiles")} />
              <BlogPostPage />
              <Footer />
              <MobileBottomNav onPortfolioClick={() => setView("profiles")} />
            </>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
        <ScrollToTopButton />
        <ProfessionalAi />
      </div>
    </Router>
    </ErrorBoundary>
  );
}
