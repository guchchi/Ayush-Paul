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
  <Component id={id} className={cn("relative w-full py-24 lg:py-32 isolate overflow-visible", className)}>
    {glowVariant && <SectionGlow variant={glowVariant} />}
    <Container className={cn("relative z-10", containerClassName)}>
      {children}
    </Container>
  </Component>
);
