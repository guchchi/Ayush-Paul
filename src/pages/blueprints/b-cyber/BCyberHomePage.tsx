import React from 'react';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

export function BCyberHomePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber');

  useSEO({
    title: 'B.Cyber Compass | Ground Truth & Verified Admission Intelligence',
    description:
      'The authoritative student intelligence system for the 4-year Bachelor of Cybersecurity (B.Cyber) program.',
    keywords: 'B.Cyber, IIT Kanpur, IIT Madras, admission intelligence',
    url: canonical,
  });

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0b1c30] pt-24 sm:pt-28">
      {/* 100% Blank Canvas - Ready for step-by-step construction */}
    </div>
  );
}
