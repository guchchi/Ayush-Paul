import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Github, Linkedin, Youtube, ExternalLink, Mail, Phone, MapPin, Code, Cpu, Palette, Sparkles, Rocket, BookOpen, MessageSquare, ArrowRight, ArrowLeft, ChevronRight, Star, Globe, Home, User, Layers, Search, Plus, Trash2, Edit, LogOut, LogIn, Clock, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";
import { auth, db, storage, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from "./firebase";

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
                alt={profile.name} 
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
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? "rgba(0, 194, 255, 0.1)" : "rgba(0, 194, 255, 0)",
      }}
      transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
    />
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
    <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-between px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
          <a
            href="#hire"
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] lg:hidden flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleNavClick(link)}
                  className="text-4xl font-display font-bold text-white/70 hover:text-brand-primary transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                href="#hire"
                className="px-12 py-4 bg-white text-black rounded-2xl text-xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
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
    setPosition({ x: x * 0.3, y: y * 0.3 });
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
      transition={{ type: "spring", damping: 15, stiffness: 150, mass: 0.1 }}
      className={className}
    >
      <button onClick={onClick} className="w-full h-full">
        {children}
      </button>
    </motion.div>
  );
};

const Hero = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden bg-[#0A0A0A]">
      {/* Background Layers */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <Particles />
      <div 
        className="absolute inset-0 spotlight pointer-events-none transition-opacity duration-500"
        style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` } as any}
      />
      
      {/* Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/50 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Available for new projects
            </div>

            <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight mb-8 leading-[0.95] text-white">
              Building Ideas <br />
              Into <span className="text-brand-primary italic neon-glow-blue">Reality</span>
            </h1>

            <p className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Ayush Paul — A visionary student entrepreneur crafting the next generation of <span className="text-brand-primary/80">AI apps</span> and <span className="text-brand-secondary/80">Robotics</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <MagneticButton 
                onClick={onViewPortfolio}
                className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg overflow-hidden shadow-2xl shadow-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">View Portfolio</span>
              </MagneticButton>
              
              <MagneticButton
                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <a href="#hire" className="w-full h-full flex items-center justify-center">Hire Me</a>
              </MagneticButton>
            </div>

            <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {[
                { label: "Developer", icon: <Code size={16} /> },
                { label: "Creator", icon: <Palette size={16} /> },
                { label: "Innovator", icon: <Sparkles size={16} /> },
                { label: "Entrepreneur", icon: <Rocket size={16} /> },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 text-white/30 text-sm font-bold uppercase tracking-widest"
                >
                  <span className="text-brand-primary/50">{item.icon}</span>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Side Elements */}
      <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 space-y-8">
        {[
          { icon: <Github />, href: "https://github.com/guchchi" },
          { icon: <Linkedin />, href: "https://www.linkedin.com/in/paulayush/" },
          { icon: <Youtube />, href: "https://www.youtube.com/@ALX-17" }
        ].map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="block text-white/20 hover:text-brand-primary transition-colors"
          >
            {item.icon}
          </motion.a>
        ))}
      </div>
    </section>
  );
};


const About = () => {
  const stats = [
    { label: "Projects Completed", value: "50+" },
    { label: "Happy Clients", value: "20+" },
    { label: "Years Experience", value: "4+" },
    { label: "Skills Mastered", value: "15+" },
  ];

  return (
    <section id="about" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              A Student with a <br />
              <span className="text-brand-primary">Visionary Mindset</span>
            </h2>
            <p className="text-lg text-white/60 mb-6 leading-relaxed">
              I'm Ayush Paul, a 12th PCM student who doesn't just study science—I apply it. My journey started with a curiosity for how things work, leading me into the worlds of Web Development, AI, and Robotics.
            </p>
            <p className="text-lg text-white/60 mb-10 leading-relaxed">
              As a student entrepreneur, I bridge the gap between academic learning and real-world application. Whether it's coding a complex AI app or building an Arduino-powered robot, my goal is always to innovate and solve problems.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/40 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group/about"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass-card p-2 relative z-10">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
                <img
                  src="https://picsum.photos/seed/ayush/800/800"
                  alt="Ayush Paul"
                  className="w-full h-full object-cover opacity-80 group-hover/about:opacity-100 group-hover/about:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl group-hover/about:bg-brand-primary/40 transition-colors duration-500" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-secondary/20 rounded-full blur-3xl group-hover/about:bg-brand-secondary/40 transition-colors duration-500" />
            <div className="absolute inset-0 bg-brand-primary/0 group-hover/about:bg-brand-primary/20 rounded-3xl blur-3xl transition-all duration-500 -z-10 shadow-[0_0_50px_rgba(0,194,255,0.3)] opacity-0 group-hover/about:opacity-100" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skillCategories = [
    {
      title: "Development",
      icon: <Code className="text-brand-primary" />,
      skills: ["React / Next.js", "Python", "Tailwind CSS", "TypeScript", "Node.js"],
    },
    {
      title: "Robotics & Electronics",
      icon: <Cpu className="text-brand-secondary" />,
      skills: ["Arduino", "Raspberry Pi", "Circuit Design", "IoT", "Automation"],
    },
    {
      title: "Design & Editing",
      icon: <Palette className="text-brand-accent" />,
      skills: ["Video Editing", "Branding", "UI/UX Design", "Motion Graphics", "Figma"],
    },
    {
      title: "AI Tools",
      icon: <Sparkles className="text-brand-primary" />,
      skills: ["Prompt Engineering", "AI App Dev", "LLM Integration", "Automation", "Data Analysis"],
    },
  ];

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Mastered Skills</h2>
          <p className="text-white/60">A diverse toolkit for the modern digital era.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-6">{category.title}</h3>
              <ul className="space-y-3">
                {category.skills.map((skill, j) => (
                  <li key={j} className="flex items-center text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mr-3" />
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

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="projects" className="py-24 bg-white/[0.02] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-brand-primary">Products</span></h2>
            <p className="text-white/60">Turning complex problems into elegant solutions.</p>
          </motion.div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2 group">
              View All Projects <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-3xl overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-brand-primary/30 transition-all duration-500"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2">
                    <Sparkles size={18} /> Preview Project
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                    {project.category}
                  </span>
                  <div className="flex gap-2">
                    {project.tech?.slice(0, 2).map((t: string) => (
                      <span key={t} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-white/40 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{project.title}</h3>
                <p className="text-white/60 mb-6 line-clamp-2">{project.description}</p>
                <div className="flex items-center text-sm font-bold text-white/40 group-hover:text-white transition-colors">
                  Explore Case Study <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              No projects found. Add some in the admin dashboard!
            </div>
          )}
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
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card rounded-[40px] border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full relative">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={selectedProject.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2 block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-bold text-white">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12 grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Code size={20} className="text-brand-primary" /> Overview
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-brand-primary" /> Case Study
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed">{selectedProject.caseStudy}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t: string) => (
                        <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <button className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                      Live Demo <ExternalLink size={18} />
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      View Source <Github size={18} />
                    </button>
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
      title: "Web Development",
      description: "Modern, high-performance websites built with Next.js and Tailwind CSS.",
      icon: <Globe size={24} />,
    },
    {
      title: "AI App Creation",
      description: "Custom AI solutions integrated with LLMs for automation and intelligence.",
      icon: <Sparkles size={24} />,
    },
    {
      title: "Video Editing & Branding",
      description: "Professional video production and cohesive brand identity design.",
      icon: <Palette size={24} />,
    },
    {
      title: "Robotics Solutions",
      description: "Hardware prototyping and automation using Arduino and IoT.",
      icon: <Cpu size={24} />,
    },
  ];

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-white/60">How I can help you build the future.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl glass-card border-t-2 border-t-transparent hover:border-t-brand-primary"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {service.description}
              </p>
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
    <section id="hire" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] overflow-hidden p-12 md:p-24 text-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Hire Ayush Paul to <br /> Build Your Next Idea
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
              Ready to turn your vision into a reality? Let's collaborate and create something extraordinary.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
            >
              Contact Now <ArrowRight className="ml-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  return (
    <>
      <Hero onViewPortfolio={onViewPortfolio} />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Courses />
      <Hiring />
      <BlogSection />
      <Testimonials />
      <Contact />
    </>
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
      console.error("Firestore Error: ", error);
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
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
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
                      <Calendar size={14} /> {new Date(selectedPost.createdAt).toLocaleDateString()}
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
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
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
                    <span className="text-xs text-white/40 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
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

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
      setLoading(false);
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
                {new Date(post.createdAt).toLocaleDateString()}
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
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

const AdminPage = () => {
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

const AdminDashboard = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "messages">("blogs");
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    content: "",
    tags: "",
    published: true
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

  useEffect(() => {
    const qBlogs = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribeBlogs = onSnapshot(qBlogs, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMessages = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeBlogs();
      unsubscribeProjects();
      unsubscribeMessages();
    };
  }, []);

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

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      ...blogFormData,
      tags: blogFormData.tags.split(",").map(t => t.trim()).filter(t => t),
      updatedAt: new Date().toISOString(),
      author: user.email
    };

    try {
      if (currentPost) {
        await updateDoc(doc(db, "blogPosts", currentPost.id), postData);
      } else {
        await setDoc(doc(collection(db, "blogPosts")), {
          ...postData,
          createdAt: new Date().toISOString()
        });
      }
      setIsEditing(false);
      setCurrentPost(null);
      setBlogFormData({ title: "", slug: "", description: "", coverImage: "", content: "", tags: "", published: true });
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save post.");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...projectFormData,
      tech: projectFormData.tech.split(",").map(t => t.trim()).filter(t => t),
      updatedAt: new Date().toISOString()
    };

    try {
      if (currentProject) {
        await updateDoc(doc(db, "projects", currentProject.id), projectData);
      } else {
        await setDoc(doc(collection(db, "projects")), {
          ...projectData,
          createdAt: new Date().toISOString()
        });
      }
      setIsEditing(false);
      setCurrentProject(null);
      setProjectFormData({ title: "", category: "", description: "", image: "", video: "", tech: "", caseStudy: "", link: "" });
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save project.");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    const itemType = collectionName === "blogPosts" ? "post" : collectionName === "projects" ? "project" : "message";
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold">Admin <span className="text-brand-primary">Dashboard</span></h1>
            <p className="text-white/40">Welcome back, {user.displayName}</p>
          </div>
          <div className="flex gap-4">
            {activeTab !== "messages" && (
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCurrentPost(null);
                  setCurrentProject(null);
                  if (activeTab === "blogs") {
                    setBlogFormData({ title: "", slug: "", description: "", coverImage: "", content: "", tags: "", published: true });
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
          <div className="flex gap-4 mb-12">
            <button 
              onClick={() => setActiveTab("blogs")}
              className={cn("px-8 py-4 rounded-2xl font-bold transition-all", activeTab === "blogs" ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              Blog Posts
            </button>
            <button 
              onClick={() => setActiveTab("projects")}
              className={cn("px-8 py-4 rounded-2xl font-bold transition-all", activeTab === "projects" ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab("messages")}
              className={cn("px-8 py-4 rounded-2xl font-bold transition-all", activeTab === "messages" ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              Messages
            </button>
          </div>
        )}

        {isEditing ? (
          <div className="glass-card p-12 rounded-[40px] border border-white/10">
            {activeTab === "blogs" ? (
              <form onSubmit={handleSaveBlog} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Title</label>
                    <input 
                      type="text" 
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Slug</label>
                    <input 
                      type="text" 
                      value={blogFormData.slug}
                      onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Description</label>
                  <textarea 
                    value={blogFormData.description}
                    onChange={(e) => setBlogFormData({ ...blogFormData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-24 resize-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Cover Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={blogFormData.coverImage}
                      onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                    <label className="cursor-pointer px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                      <Plus size={20} /> {isUploading ? "..." : "Upload"}
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "blog")} accept="image/*" disabled={isUploading} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Content (Markdown)</label>
                  <textarea 
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-64 resize-none font-mono"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={blogFormData.tags}
                      onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-8">
                    <input 
                      type="checkbox" 
                      checked={blogFormData.published}
                      onChange={(e) => setBlogFormData({ ...blogFormData, published: e.target.checked })}
                      className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 accent-brand-primary"
                    />
                    <label className="font-bold">Published</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="submit" className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg">
                    {currentPost ? "Update Post" : "Publish Post"}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold text-lg">Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveProject} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Title</label>
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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Case Study</label>
                  <textarea 
                    value={projectFormData.caseStudy}
                    onChange={(e) => setProjectFormData({ ...projectFormData, caseStudy: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-48 resize-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Tech Stack (comma separated)</label>
                    <input 
                      type="text" 
                      value={projectFormData.tech}
                      onChange={(e) => setProjectFormData({ ...projectFormData, tech: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Live Link</label>
                    <input 
                      type="text" 
                      value={projectFormData.link}
                      onChange={(e) => setProjectFormData({ ...projectFormData, link: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="submit" className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg">
                    {currentProject ? "Update Project" : "Publish Project"}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold text-lg">Cancel</button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {activeTab === "blogs" ? (
              posts.map(post => (
                <div key={post.id} className="glass-card p-8 rounded-3xl border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className={cn("px-2 py-0.5 rounded-md", post.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500")}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentPost(post);
                        setBlogFormData({
                          title: post.title,
                          slug: post.slug,
                          description: post.description,
                          coverImage: post.coverImage,
                          content: post.content,
                          tags: post.tags?.join(", ") || "",
                          published: post.published
                        });
                      }}
                      className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-brand-primary transition-all"
                    >
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(post.id, "blogPosts")} className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-brand-secondary transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === "projects" ? (
              projects.map(project => (
                <div key={project.id} className="glass-card p-8 rounded-3xl border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <span>{project.category}</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentProject(project);
                        setProjectFormData({
                          title: project.title,
                          category: project.category,
                          description: project.description,
                          image: project.image,
                          video: project.video || "",
                          tech: project.tech?.join(", ") || "",
                          caseStudy: project.caseStudy || "",
                          link: project.link || ""
                        });
                      }}
                      className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-brand-primary transition-all"
                    >
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(project.id, "projects")} className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-brand-secondary transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="glass-card p-8 rounded-3xl border border-white/5 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{msg.subject || "No Subject"}</h3>
                      <div className="flex items-center gap-4 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <span>{msg.name} ({msg.email})</span>
                        <span>{msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleString() : "Just now"}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(msg.id, "contacts")} className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:text-brand-secondary transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-white/60 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10">{msg.message}</p>
                </div>
              ))
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
      console.error("Error submitting contact form:", error);
      setStatus("error");
      // Log more details for debugging
      if (error.code === 'permission-denied') {
        console.error("Permission denied. Check firestore.rules");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Get in Touch</h2>
            <p className="text-lg text-white/60 mb-12">
              Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new ideas and opportunities.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail />, label: "Email", value: "hello@ayushpaul.in" },
                { icon: <Phone />, label: "Phone", value: "+91 98765 43210" },
                { icon: <MapPin />, label: "Location", value: "New Delhi, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                    <p className="text-xl font-medium">{item.value}</p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all"
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-primary outline-none transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              
              {status === "success" && (
                <p className="text-green-400 text-center font-medium">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-center font-medium">Something went wrong. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link to="/" className="text-2xl font-display font-bold tracking-tighter mb-4 block">
              ayushpaul<span className="text-brand-primary">.in</span>
            </Link>
            <p className="text-white/40 text-sm">
              © 2024 Ayush Paul. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-8">
            {["About", "Projects", "Blog", "Contact"].map((link) => (
              link === "Blog" ? (
                <Link key={link} to="/blog" className="text-sm font-medium text-white/40 hover:text-white transition-colors">
                  {link}
                </Link>
              ) : (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-white/40 hover:text-white transition-colors">
                  {link}
                </a>
              )
            ))}
          </div>

          <div className="flex items-center space-x-6">
            {[
              { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/paulayush/" },
              { icon: <Github size={20} />, href: "https://github.com/guchchi" },
              { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ALX-17" }
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-brand-primary transition-colors">
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"landing" | "profiles">("landing");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [konami, setKonami] = useState<string[]>([]);
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

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
    <Router>
      <div className="font-sans selection:bg-brand-primary/30 selection:text-brand-primary bg-[#0A0A0A] min-h-screen text-white overflow-x-hidden">
        
        <Routes>
          <Route path="/" element={
            view === "landing" ? (
              <>
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
        </Routes>
      </div>
    </Router>
  );
}
