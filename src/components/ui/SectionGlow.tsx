import React from 'react';
import { cn } from "@/src/lib/utils";

type GlowVariant = 'hero' | 'side' | 'center' | 'orbs' | 'bottom';

interface SectionGlowProps {
  variant: GlowVariant;
  className?: string;
}

export const SectionGlow: React.FC<SectionGlowProps> = ({ variant, className }) => {
  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none select-none overflow-hidden", className)}>
      {variant === "hero" && (
        <>
          <div className="glow-orb glow-cyan w-[600px] h-[600px] max-w-none top-[-120px] left-[-120px] opacity-[0.15] blur-[100px] scale-75 sm:opacity-25 sm:blur-[140px] sm:scale-100 will-change-transform" />
          <div className="glow-orb glow-purple w-[700px] h-[700px] max-w-none bottom-[-200px] right-[-150px] opacity-[0.15] blur-[100px] scale-75 sm:opacity-25 sm:blur-[140px] sm:scale-100 will-change-transform" />
        </>
      )}

      {variant === "side" && (
        <div className="glow-orb glow-cyan w-[500px] h-[500px] max-w-none left-[-150px] top-1/3" />
      )}

      {variant === "center" && (
        <div className="glow-orb glow-purple w-[800px] h-[800px] max-w-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}

      {variant === "bottom" && (
        <div className="glow-orb glow-emerald w-[700px] h-[700px] max-w-none bottom-[-250px] left-1/2 -translate-x-1/2" />
      )}

      {variant === "orbs" && (
        <>
          <div className="glow-orb glow-purple w-[400px] h-[400px] max-w-none top-10 right-10" />
          <div className="glow-orb glow-cyan w-[350px] h-[350px] max-w-none bottom-10 left-10" />
        </>
      )}
    </div>
  );
};
