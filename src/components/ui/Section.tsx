import React from 'react';
import { cn } from "@/src/lib/utils";
import { Container } from "./Container";
import { SectionGlow } from './SectionGlow';

export const Section = ({ 
  children, 
  id, 
  className, 
  containerClassName,
  glowVariant,
  as: Component = "section" 
}: { 
  children: React.ReactNode; 
  id?: string; 
  className?: string; 
  containerClassName?: string;
  glowVariant?: 'hero' | 'side' | 'center' | 'orbs' | 'bottom';
  as?: any;
}) => (
  <Component id={id} className={cn("relative w-full py-[var(--layout-section-py)] isolate", className)}>
    {glowVariant && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
        <SectionGlow variant={glowVariant} />
      </div>
    )}
    <div className={cn("relative z-10 mx-auto max-w-7xl px-5", containerClassName)}>
      {children}
    </div>
  </Component>
);
