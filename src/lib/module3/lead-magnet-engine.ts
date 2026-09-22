import { Stage5LeadMagnetData } from '../../types/module3';

export function generateLeadMagnetConcept(niche: string, mechanism: string): Stage5LeadMagnetData {
  const safeNiche = niche || 'clients';
  const safeMechanism = mechanism || 'Authority';
  
  const concepts: Stage5LeadMagnetData[] = [
    {
      conceptTitle: `The ${safeMechanism} Blueprint`,
      format: 'notion_template',
      hook: `Steal the exact system we use to help ${safeNiche} scale without burnout.`,
      primaryBenefit: 'Actionable, step-by-step framework to implement immediately.',
      ctaText: 'Get the Free Notion Template',
    },
    {
      conceptTitle: `The ${safeNiche} Mastery Crash Course`,
      format: 'mini_course',
      hook: `Learn how to master ${safeMechanism} in just 5 days with zero prior experience.`,
      primaryBenefit: 'Deep-dive video lessons delivered straight to your inbox.',
      ctaText: 'Start the Free Mini-Course',
    },
    {
      conceptTitle: `The Ultimate ${safeMechanism} Playbook`,
      format: 'pdf_playbook',
      hook: `The definitive guide to dominating your market using our proven method.`,
      primaryBenefit: 'A beautifully designed, 20-page PDF packed with advanced strategies.',
      ctaText: 'Download the Free Playbook',
    },
    {
      conceptTitle: `The 10-Point ${safeNiche} Checklist`,
      format: 'checklist',
      hook: `Don't launch without checking these 10 critical elements.`,
      primaryBenefit: 'A quick, scannable list to ensure you never miss a crucial step.',
      ctaText: 'Grab the Free Checklist',
    }
  ];

  // Pick one deterministically based on string lengths
  const seed = (safeNiche.length + safeMechanism.length) % concepts.length;
  return concepts[seed];
}
