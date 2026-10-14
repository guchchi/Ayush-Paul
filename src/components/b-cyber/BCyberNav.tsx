import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavPillar {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

export const PILLARS: NavPillar[] = [
  { 
    name: 'Understand B.Cyber', 
    href: '/blueprints/b-cyber', 
    icon: Compass, 
    description: 'Degree, 2+2 model & curriculum' 
  },
  { 
    name: 'Admission', 
    href: '/blueprints/b-cyber/admission', 
    icon: ShieldCheck, 
    description: 'Eligibility, 2026 vs 2027 shift' 
  },
  { 
    name: 'Preparation Roadmap', 
    href: '/blueprints/b-cyber/roadmap', 
    icon: MapPin, 
    description: 'Free stages & personal planning' 
  },
];

export const BCyberNav: React.FC = () => {
  // In Model 1 (Contextual Header Swap), the main global navbar dynamically morphs
  // into the B.Cyber Compass header (with breadcrumbs, 3 pillar tabs, and portal links).
  // Therefore, this component returns null to eliminate duplicate stacked navbars.
  return null;
};
