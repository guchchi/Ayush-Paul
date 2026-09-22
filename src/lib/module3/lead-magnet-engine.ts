import { Stage5LeadMagnetData } from '../../types/module3';

function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateLeadMagnetConcept(niche: string, mechanism: string): Stage5LeadMagnetData {
  const safeNiche = niche || 'Client Acquisition';
  const safeMechanism = mechanism || 'Authority Framework';
  const seedStr = `${safeNiche}-${safeMechanism}`;
  const hash = deterministicHash(seedStr);

  const formatPool = ['notion_template', 'mini_course', 'pdf_playbook', 'checklist'] as const;
  const selectedFormat = formatPool[hash % formatPool.length];

  // Dynamic template generation based on format
  if (selectedFormat === 'notion_template') {
    return {
      conceptTitle: `The ${safeMechanism} OS`,
      format: 'notion_template',
      hook: `Steal the exact Notion system we use to help ${safeNiche} scale without burnout.`,
      primaryBenefit: 'Actionable, step-by-step workspace to implement immediately.',
      ctaText: 'Get the Free Notion Template',
    };
  } else if (selectedFormat === 'mini_course') {
    return {
      conceptTitle: `The ${safeNiche} Mastery Crash Course`,
      format: 'mini_course',
      hook: `Learn how to master ${safeMechanism} in just 5 days with zero prior experience.`,
      primaryBenefit: 'Deep-dive video lessons delivered straight to your inbox over 5 days.',
      ctaText: 'Start the Free Mini-Course',
    };
  } else if (selectedFormat === 'pdf_playbook') {
    return {
      conceptTitle: `The Ultimate ${safeMechanism} Playbook`,
      format: 'pdf_playbook',
      hook: `The definitive guide to dominating the ${safeNiche} market using our proven method.`,
      primaryBenefit: 'A beautifully designed, actionable PDF packed with advanced strategies.',
      ctaText: 'Download the Free Playbook',
    };
  } else {
    return {
      conceptTitle: `The 10-Point ${safeMechanism} Audit`,
      format: 'checklist',
      hook: `Don't launch your next ${safeNiche} campaign without checking these 10 critical elements.`,
      primaryBenefit: 'A quick, scannable diagnostic list to ensure you never miss a crucial step.',
      ctaText: 'Grab the Free Checklist',
    };
  }
}
