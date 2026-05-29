import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Cpu, Cog, FlaskConical, BookOpen, LayoutTemplate, Network, ArrowRight
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CINEMATIC SERVER IMAGE (large dominant card)
// ─────────────────────────────────────────────────────────────
const SERVER_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4mKhLgCva9I164JjmcUy1glnfOnJRyIVyLCv-s-JxGi5R6EahWkgS1AHJI8a3FR9yqyC_sMDKIU6_XD6exyAo2I5JsQqmD1ByO9ottmp9T624U_b6cq5ln8HCZRRXF39-tDAHIoHy2S27Wflu8100xG_rkSL91qxX2lhdMWp7Op2rxxsdMxxZ8AdKmBlA-M8MfWPEaUJ-d3Tfbiav5cNk_cdUBEi4cfHtZeCGWz3XvLX_bdvI8FW1zwsXmwRSrFd9wdjOtR_o8zyk';

// ─────────────────────────────────────────────────────────────
// 3D TILT HOOK
// ─────────────────────────────────────────────────────────────
function useTilt(strength = 5) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -strength;
      const rotY = ((x - cx) / cx) * strength;
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    el.style.transition = 'transform 0.6s cubic-bezier(0.175,0.885,0.32,1.275)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 600);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseMove, onMouseLeave]);

  return ref;
}

// ─────────────────────────────────────────────────────────────
// MAGNETIC BUTTON HOOK
// ─────────────────────────────────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      (el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => { (el as HTMLElement).style.transform = 'translate(0,0)'; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

// ─────────────────────────────────────────────────────────────
// ANIMATED FADE-IN WRAPPER
// ─────────────────────────────────────────────────────────────
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// SHARED GLASS CARD WRAPPER (with 3D tilt + shimmer sweep)
// ─────────────────────────────────────────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tiltStrength?: number;
}> = ({ children, className = '', style = {}, tiltStrength = 5 }) => {
  const tiltRef = useTilt(tiltStrength);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={tiltRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`eco-glass-card ${className}`}
      style={{
        background: 'rgba(6, 8, 18, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(0,194,255,0.45)' : 'rgba(0,194,255,0.12)'}`,
        boxShadow: hovered
          ? '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,194,255,0.07)'
          : '0 15px 30px -12px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,194,255,0.03)',
        borderRadius: '14px',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        ...style,
      }}
    >
      {/* Shimmer sweep on hover */}
      <div className={`eco-shimmer ${hovered ? 'eco-shimmer-active' : ''}`} />
      {/* Top edge light */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${hovered ? 'rgba(0,194,255,0.5)' : 'rgba(0,194,255,0.15)'}, transparent)`,
        transition: 'background 0.5s ease', pointerEvents: 'none', zIndex: 2,
      }} />
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LARGE DOMINANT CARD
// ─────────────────────────────────────────────────────────────
const LargeDominantCard: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const tiltRef = useTilt(4);
  const [hovered, setHovered] = useState(false);
  const magneticRef = useMagnetic(0.25);

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: 'span 8', gridRow: 'span 2',
        minHeight: '580px',
        background: 'rgba(6, 8, 18, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(0,194,255,0.45)' : 'rgba(0,194,255,0.12)'}`,
        boxShadow: hovered
          ? '0 25px 60px -12px rgba(0,0,0,0.75), inset 0 0 50px rgba(0,194,255,0.08), 0 0 0 1px rgba(0,194,255,0.05)'
          : '0 15px 40px -12px rgba(0,0,0,0.55), inset 0 0 20px rgba(0,194,255,0.03)',
        borderRadius: '14px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '48px',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        cursor: 'default',
      }}
    >
      {/* Shimmer sweep */}
      <div className={`eco-shimmer ${hovered ? 'eco-shimmer-active' : ''}`} />

      {/* Background image */}
      <img
        src={SERVER_IMG}
        alt="Systems Engineering — server infrastructure"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: hovered ? 0.38 : 0.2,
          mixBlendMode: 'luminosity',
          filter: 'grayscale(80%) brightness(0.7)',
          transition: 'opacity 0.7s ease',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(5,7,18,1) 0%, rgba(5,7,18,0.85) 40%, rgba(5,7,18,0.2) 100%)',
      }} />

      {/* Blue ambient top-left glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px', width: '350px', height: '350px',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(circle, rgba(0,194,255,0.1) 0%, transparent 70%)',
        opacity: hovered ? 1 : 0.5, transition: 'opacity 0.5s ease',
      }} />

      {/* Top edge shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px', zIndex: 3,
        background: `linear-gradient(90deg, transparent, ${hovered ? 'rgba(0,194,255,0.6)' : 'rgba(0,194,255,0.15)'}, transparent)`,
        transition: 'background 0.5s ease',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 4, transform: 'translateZ(30px)' }}>
        {/* Index + tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(0,194,255,0.5)', fontWeight: 500 }}>01</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,194,255,0.4)' }}>SYSTEM NODE</span>
        </div>

        {/* Icon */}
        <Cpu
          size={36}
          style={{
            color: '#00C2FF', marginBottom: '16px', display: 'block',
            filter: `drop-shadow(0 0 ${hovered ? '18px' : '10px'} rgba(0,194,255,${hovered ? '0.7' : '0.5'}))`,
            transition: 'filter 0.3s ease, transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* Title */}
        <h3 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 700,
          fontSize: 'clamp(26px, 2.5vw, 34px)', letterSpacing: '-0.025em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.96)',
          margin: '0 0 12px 0', lineHeight: 1.1,
        }}>
          Systems Engineering
        </h3>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '14px',
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          margin: '0 0 28px 0', maxWidth: '420px',
        }}>
          Scalable digital infrastructure, intelligent interfaces, and future-ready architectures designed to bridge performance with immersive experiences.
        </p>

        {/* CTA — magnetic */}
        <Link
          to="/systems"
          ref={magneticRef as React.RefObject<HTMLAnchorElement>}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: hovered ? 'rgba(255,255,255,0.9)' : '#00C2FF',
            textDecoration: 'none',
            filter: 'drop-shadow(0 0 6px rgba(0,194,255,0.45))',
            transition: 'color 0.3s ease, transform 0.2s cubic-bezier(0.25,1,0.5,1)',
          }}
        >
          Explore Systems
          <ArrowRight size={14} style={{ transition: 'transform 0.3s ease', transform: hovered ? 'translateX(3px)' : 'translateX(0)' }} />
        </Link>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// STACKED MEDIUM CARD
// ─────────────────────────────────────────────────────────────
const StackedCard: React.FC<{
  id: string; tag: string; title: string; desc: string;
  icon: React.ReactNode; delay: number; isInView: boolean; showPulse?: boolean;
}> = ({ id, tag, title, desc, icon, delay, isInView, showPulse }) => {
  const tiltRef = useTilt(6);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: 'span 4', minHeight: '260px',
        background: hovered ? 'rgba(0,194,255,0.025)' : 'rgba(6,8,18,0.6)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(0,194,255,0.45)' : 'rgba(0,194,255,0.12)'}`,
        boxShadow: hovered
          ? '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,194,255,0.07)'
          : '0 15px 30px -12px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,194,255,0.03)',
        borderRadius: '14px', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '32px', transformStyle: 'preserve-3d', cursor: 'default',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <div className={`eco-shimmer ${hovered ? 'eco-shimmer-active' : ''}`} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${hovered ? 'rgba(0,194,255,0.5)' : 'rgba(0,194,255,0.15)'}, transparent)`, transition: 'background 0.5s ease', zIndex: 2 }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', transform: 'translateZ(20px)' }}>
        <div style={{
          color: hovered ? '#00C2FF' : 'rgba(0,194,255,0.65)',
          filter: hovered ? 'drop-shadow(0 0 12px rgba(0,194,255,0.6))' : 'drop-shadow(0 0 4px rgba(0,194,255,0.3))',
          transition: 'color 0.3s ease, filter 0.3s ease, transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {icon}
        </div>
        {showPulse && (
          <span style={{
            display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
            background: '#00C2FF', flexShrink: 0,
            boxShadow: '0 0 8px rgba(0,194,255,0.8)',
            animation: 'ecoCardPulse 2s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ transform: 'translateZ(20px)' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,194,255,0.4)' }}>
            {id} — {tag}
          </span>
        </div>
        <h4 style={{
          fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600,
          letterSpacing: '-0.02em', color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.9)',
          margin: '0 0 8px 0', lineHeight: 1.2, transition: 'color 0.3s ease',
        }}>
          {title}
        </h4>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, margin: 0 }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// HORIZONTAL CINEMATIC CARD
// ─────────────────────────────────────────────────────────────
const HorizontalCard: React.FC<{ delay: number; isInView: boolean }> = ({ delay, isInView }) => {
  const tiltRef = useTilt(3);
  const [hovered, setHovered] = useState(false);
  const btnRef = useMagnetic(0.3) as React.RefObject<HTMLButtonElement>;

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: '1 / -1', minHeight: '200px',
        background: hovered ? 'rgba(0,194,255,0.02)' : 'rgba(6,8,18,0.6)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(0,194,255,0.4)' : 'rgba(0,194,255,0.12)'}`,
        boxShadow: hovered
          ? '0 25px 60px -12px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,194,255,0.07), 0 0 80px rgba(0,194,255,0.04)'
          : '0 15px 40px -12px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,194,255,0.03)',
        borderRadius: '14px', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: '40px 48px', gap: '40px',
        transformStyle: 'preserve-3d', cursor: 'default',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <div className={`eco-shimmer ${hovered ? 'eco-shimmer-active' : ''}`} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${hovered ? 'rgba(0,194,255,0.55)' : 'rgba(0,194,255,0.15)'}, transparent)`, zIndex: 2, transition: 'background 0.5s ease' }} />

      {/* Right ambient glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px', width: '280px', height: '280px',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(0,194,255,0.07) 0%, transparent 70%)',
        opacity: hovered ? 1 : 0.3, transition: 'opacity 0.5s ease',
      }} />

      {/* Left content */}
      <div style={{ flex: 1, minWidth: 0, transform: 'translateZ(20px)', position: 'relative', zIndex: 2 }}>
        <BookOpen
          size={28}
          style={{
            color: '#00C2FF', marginBottom: '16px', display: 'block',
            filter: 'drop-shadow(0 0 8px rgba(0,194,255,0.5))',
            transition: 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,194,255,0.45)' }}>
            04 — KNOWLEDGE HUB
          </span>
        </div>
        <h3 style={{
          fontFamily: "'Inter', sans-serif", fontSize: 'clamp(22px, 2vw, 30px)', fontWeight: 700,
          letterSpacing: '-0.025em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.95)', margin: '0 0 10px 0',
        }}>
          Media & Knowledge
        </h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, margin: 0, maxWidth: '520px' }}>
          Educational infrastructure, technical writing, digital publishing, and knowledge systems built to share ideas, experiments, and innovation journeys.
        </p>
      </div>

      {/* Right CTA — magnetic */}
      <div style={{ flexShrink: 0, transform: 'translateZ(20px)', position: 'relative', zIndex: 2 }}>
        <button
          ref={btnRef}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px',
            border: '1px solid rgba(0,194,255,0.35)',
            color: '#00C2FF',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            borderRadius: '8px', background: hovered ? 'rgba(0,194,255,0.08)' : 'transparent',
            boxShadow: hovered ? '0 0 24px rgba(0,194,255,0.18)' : '0 0 12px rgba(0,194,255,0.07)',
            transition: 'all 0.35s ease, transform 0.2s cubic-bezier(0.25,1,0.5,1)',
            cursor: 'pointer',
          }}
        >
          Read Archives
          <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// BOTTOM MEDIUM CARD
// ─────────────────────────────────────────────────────────────
const BottomCard: React.FC<{
  id: string; tag: string; title: string; desc: string;
  icon: React.ReactNode; delay: number; isInView: boolean;
}> = ({ id, tag, title, desc, icon, delay, isInView }) => {
  const tiltRef = useTilt(6);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: 'span 6', minHeight: '230px',
        background: hovered ? 'rgba(0,194,255,0.02)' : 'rgba(6,8,18,0.6)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(0,194,255,0.42)' : 'rgba(0,194,255,0.1)'}`,
        boxShadow: hovered
          ? '0 20px 50px -12px rgba(0,0,0,0.65), inset 0 0 36px rgba(0,194,255,0.06)'
          : '0 15px 30px -12px rgba(0,0,0,0.5), inset 0 0 16px rgba(0,194,255,0.02)',
        borderRadius: '14px', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '32px', transformStyle: 'preserve-3d', cursor: 'default',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <div className={`eco-shimmer ${hovered ? 'eco-shimmer-active' : ''}`} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${hovered ? 'rgba(0,194,255,0.5)' : 'rgba(0,194,255,0.12)'}, transparent)`, zIndex: 2, transition: 'background 0.5s ease' }} />

      <div style={{
        color: hovered ? '#00C2FF' : 'rgba(0,194,255,0.6)',
        filter: hovered ? 'drop-shadow(0 0 12px rgba(0,194,255,0.6))' : 'drop-shadow(0 0 4px rgba(0,194,255,0.3))',
        transition: 'color 0.3s ease, filter 0.3s ease, transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
        transform: `translateZ(20px) ${hovered ? 'scale(1.1)' : 'scale(1)'}`,
        marginBottom: '24px', display: 'block',
      }}>
        {icon}
      </div>

      <div style={{ transform: 'translateZ(20px)' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,194,255,0.4)' }}>
            {id} — {tag}
          </span>
        </div>
        <h4 style={{
          fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600,
          letterSpacing: '-0.02em', color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.88)',
          margin: '0 0 8px 0', lineHeight: 1.2, transition: 'color 0.3s ease',
        }}>
          {title}
        </h4>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, margin: 0 }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────
export const EcosystemArchitectureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="ecosystem-architecture"
      aria-label="Operational Ecosystem Architecture"
      style={{
        position: 'relative', width: '100%', overflow: 'hidden',
        background: 'linear-gradient(180deg, #07070A 0%, #08080F 50%, #07070A 100%)',
        padding: '120px 0 130px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── AMBIENT BREATHING GLOWS ── */}
      <div aria-hidden className="eco-ambient-glow" style={{
        position: 'absolute', top: '-10%', left: '-15%',
        width: '800px', height: '800px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(0,194,255,0.07) 0%, rgba(0,194,255,0.02) 40%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <div aria-hidden className="eco-ambient-glow eco-ambient-glow--delay" style={{
        position: 'absolute', bottom: '-10%', right: '-10%',
        width: '700px', height: '700px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(123,97,255,0.05) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }} />

      {/* Dot grid texture */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
        backgroundSize: '36px 36px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Section blends */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(10,10,11,0.8), transparent)' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(7,7,10,0.9), transparent)' }} />

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 2 }}>

        {/* ── HEADER ── */}
        <div ref={headerRef} style={{ marginBottom: '72px', maxWidth: '700px' }}>

          {/* Micro-label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}
          >
            <span style={{
              display: 'inline-block', width: '28px', height: '1px',
              background: 'rgba(0,194,255,0.6)',
              boxShadow: '0 0 8px rgba(0,194,255,0.5)',
            }} />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(0,194,255,0.7)', fontWeight: 500,
              filter: 'drop-shadow(0 0 6px rgba(0,194,255,0.4))',
            }}>
              System Infrastructure
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.03em',
              lineHeight: 1.1, textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.95)', margin: '0 0 20px 0',
            }}
          >
            Operational Architecture<br />
            <span style={{ fontWeight: 300, textTransform: 'none', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em' }}>
              for Future Technology
            </span>
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: '15px',
              color: 'rgba(255,255,255,0.36)', lineHeight: 1.75, margin: 0, maxWidth: '540px',
            }}
          >
            A unified structural framework designed for scale. This ecosystem seamlessly operates across advanced robotics, machine intelligence, and high-fidelity digital product development.
          </motion.p>
        </div>

        {/* ── 12-COL BENTO GRID ── */}
        <div
          ref={gridRef}
          className="ecosystem-bento"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', gridAutoRows: 'auto' }}
        >
          {/* 1. LARGE DOMINANT — col-span-8, row-span-2 */}
          <LargeDominantCard isInView={isGridInView} />

          {/* 2. STACKED MEDIUM — col-span-4 */}
          <StackedCard
            id="02" tag="ACTIVE DIVISION" title="Robotics & Hardware"
            desc="Experimental robotics, physical computing, autonomous systems, and engineering prototypes exploring the interaction between software and the physical world."
            icon={<Cog size={28} />} delay={0.1} isInView={isGridInView} showPulse
          />

          {/* 3. STACKED MEDIUM — col-span-4 */}
          <StackedCard
            id="03" tag="ACTIVE DIVISION" title="Experimental Labs"
            desc="Rapid experimentation across AI systems, immersive interfaces, futuristic concepts, and next-generation technological exploration."
            icon={<FlaskConical size={28} />} delay={0.2} isInView={isGridInView}
          />

          {/* 4. HORIZONTAL FULL-WIDTH — col-span-12 */}
          <HorizontalCard delay={0.3} isInView={isGridInView} />

          {/* 5. BOTTOM — col-span-6 */}
          <BottomCard
            id="05" tag="PRODUCT DIVISION" title="Digital Products"
            desc="Blueprints, downloadable systems, future robotics kits, digital assets, and scalable products designed for creators, builders, and learners."
            icon={<LayoutTemplate size={28} />} delay={0.4} isInView={isGridInView}
          />

          {/* 6. BOTTOM — col-span-6 */}
          <BottomCard
            id="06" tag="NETWORK NODE" title="Innovation Network"
            desc="A growing ecosystem of collaborations, builders, future opportunities, and multidisciplinary initiatives focused on long-term technological impact."
            icon={<Network size={28} />} delay={0.5} isInView={isGridInView}
          />
        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        /* Shimmer sweep */
        .eco-shimmer {
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.045), transparent);
          transform: skewX(-20deg);
          transition: left 0.7s ease;
          z-index: 1; pointer-events: none;
        }
        .eco-shimmer-active { left: 200%; }

        /* Breathing ambient glow */
        @keyframes ecoBreath {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        .eco-ambient-glow { animation: ecoBreath 8s ease-in-out infinite alternate; }
        .eco-ambient-glow--delay { animation-delay: -4s; }

        @media (prefers-reduced-motion: reduce) {
          .eco-ambient-glow { animation: none; }
        }

        /* Pulse dot */
        @keyframes ecoCardPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); box-shadow: 0 0 8px rgba(0,194,255,0.8); }
          50% { opacity: 0.4; transform: scale(0.7); box-shadow: 0 0 4px rgba(0,194,255,0.4); }
        }

        /* Responsive grid */
        @media (max-width: 880px) {
          .ecosystem-bento {
            grid-template-columns: 1fr !important;
          }
          .ecosystem-bento > * {
            grid-column: 1 / -1 !important;
            grid-row: auto !important;
          }
          #ecosystem-architecture { padding: 80px 0 90px !important; }
          #ecosystem-architecture > div { padding: 0 24px !important; }
        }

        @media (min-width: 641px) and (max-width: 880px) {
          .ecosystem-bento { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 480px) {
          #ecosystem-architecture { padding: 64px 0 72px !important; }
          #ecosystem-architecture > div { padding: 0 18px !important; }
        }
      `}</style>
    </section>
  );
};

export default EcosystemArchitectureSection;
