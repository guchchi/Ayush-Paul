const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.resolve(__dirname, 'App.tsx'), 'utf8');
const lines = fileContent.split('\n');

function sliceLines(start, end) {
  return lines.slice(start, end).join('\n');
}

const sectionImports = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { MagneticButton } from '../ui/MagneticButton';
import { cn } from '@/src/lib/utils';
`;

fs.mkdirSync(path.resolve(__dirname, 'components/sections'), { recursive: true });

// 1. HeroSection.tsx
const heroContent = sectionImports + 
  "import { ParallaxContainer, ParallaxLayer } from '../Parallax';\n" +
  "import { ArrowRight } from 'lucide-react';\n" +
  "import { SupportButton } from '../../components/SupportButton'; // Make sure this is correct later\n" + 
  sliceLines(141, 246) + "\n" +
  sliceLines(501, 523) + "\n" +
  sliceLines(523, 686).replace(/const Hero =/, 'export const HeroSection =');

fs.writeFileSync(path.resolve(__dirname, 'components/sections/HeroSection.tsx'), heroContent);

// 2. ProofSection.tsx (StatsDashboard: 361-392, BrandEcosystem: 393-424, AuthoritySignals: 833-948, Testimonials: 3315-3373) // Added SectionReveal here just to be safe
const proofContent = sectionImports + 
  "import { Rocket, Code, Cpu, User, Zap, BookOpen, Lightbulb, Star, Award, Shield } from 'lucide-react';\n" +
  sliceLines(361, 393) + "\n" +
  sliceLines(393, 424) + "\n" +
  sliceLines(833, 949) + "\n" +
  sliceLines(3315, 3374) + "\n" +
  `export const ProofSection = () => {
  return (
    <>
      <StatsDashboard />
      <BrandEcosystem />
      <AuthoritySignals />
      <Testimonials />
    </>
  );
};\n`;

fs.writeFileSync(path.resolve(__dirname, 'components/sections/ProofSection.tsx'), proofContent);

// 3. AboutSection.tsx (About: 686-760)
const aboutContent = sectionImports + 
  sliceLines(686, 760).replace(/const About =/, 'export const AboutSection =');

fs.writeFileSync(path.resolve(__dirname, 'components/sections/AboutSection.tsx'), aboutContent);

// 4. SkillsSection.tsx (Skills: 760-833) (PremiumSkills is an external component, we will use it in Home)
const skillsContent = sectionImports + 
  "import { ChevronRight } from 'lucide-react';\n" +
  sliceLines(760, 833).replace(/const Skills =/, 'export const SkillsSection =');

fs.writeFileSync(path.resolve(__dirname, 'components/sections/SkillsSection.tsx'), skillsContent);

// 5. FeaturedProjectsSection.tsx (Projects: 949-1209)
const projectsContent = sectionImports + 
  "import { Github, ExternalLink, ArrowRight } from 'lucide-react';\n" +
  sliceLines(949, 1209).replace(/const Projects =/, 'export const FeaturedProjectsSection =');

fs.writeFileSync(path.resolve(__dirname, 'components/sections/FeaturedProjectsSection.tsx'), projectsContent);

// 6. ExperienceSection.tsx (Services: 1209-1279, Courses: 1279-1353)
const expContent = sectionImports + 
  "import { Code, Palette, Rocket, Sparkles, BookOpen, Clock, Tag } from 'lucide-react';\n" +
  sliceLines(1209, 1279) + "\n" +
  sliceLines(1279, 1353) + "\n" +
  `export const ExperienceSection = () => {
  return (
    <>
      <Services />
      <Courses />
    </>
  );
};\n`;
fs.writeFileSync(path.resolve(__dirname, 'components/sections/ExperienceSection.tsx'), expContent);

// 7. CTASection.tsx (Hiring: 1353-1397, Contact: 3374-3552, Newsletter: 3552-3668)
const ctaContent = sectionImports + 
  "import { Mail, Phone, MapPin, Loader2, Send } from 'lucide-react';\n" +
  sliceLines(1353, 1397) + "\n" +
  // Contact section has dependencies on firebase. Add those explicitly just in case if later needed. For now simple.
  "import { db, collection, addDoc, serverTimestamp } from '../../firebase';\n" +
  sliceLines(3374, 3552) + "\n" +
  sliceLines(3552, 3668) + "\n" +
  `export const CTASection = ({ id }: { id?: string }) => {
  return (
    <div id={id}>
      <Hiring />
      <Contact />
      <Newsletter />
    </div>
  );
};\n`;
fs.writeFileSync(path.resolve(__dirname, 'components/sections/CTASection.tsx'), ctaContent);

console.log('Successfully wrote section files!');
