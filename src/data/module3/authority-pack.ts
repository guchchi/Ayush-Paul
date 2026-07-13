import type { Module3State, ChecklistItem } from '../../types/module3';

export interface CompiledProofAsset {
  id: string;
  title: string;
  assetType: string;
  credibilityGap: string;
  headline: string;
  description: string;
  proofStatement: string;
  cta: string;
  presentationStructure: string[];
  completionChecklist: string[];
  isAccepted: boolean;
}

export interface CompiledAuthorityPack {
  authorityPosition: string;
  coreTrustPromise: string;
  proofPriorities: { gapTitle: string; recommendedFormat: string }[];
  proofAssets: CompiledProofAsset[];
  profileCopy: {
    professionalHeadline: string;
    shortBio: string;
    longBio: string;
    offerStatement: string;
    credibilityBullets: string[];
    proofReferenceLine: string;
    ctaLine: string;
  };
  portfolioCopy: {
    portfolioCta: string;
    sections: { type: string; heading: string; body: string; bullets?: string[] }[];
  };
  checklistItems: { id: string; category: string; task: string; isCompleted: boolean }[];
  masterCta: string;
}

export function compileAuthorityPack(state: Module3State): CompiledAuthorityPack {
  return {
    authorityPosition: state.authorityPosition || 'builder',
    coreTrustPromise: state.coreTrustPromise,
    proofPriorities: state.proofPriorities.map((p) => ({
      gapTitle: p.gapTitle,
      recommendedFormat: p.recommendedFormat,
    })),
    proofAssets: state.proofAssets.map((a) => ({
      id: a.id,
      title: a.title,
      assetType: a.assetType,
      credibilityGap: a.credibilityGapProved,
      headline: a.portfolioCopy.headline,
      description: a.portfolioCopy.description,
      proofStatement: a.portfolioCopy.proofStatement,
      cta: a.portfolioCopy.cta,
      presentationStructure: a.presentationStructure,
      completionChecklist: a.completionChecklist,
      isAccepted: a.isAccepted,
    })),
    profileCopy: {
      professionalHeadline: state.profileCopy.professionalHeadline,
      shortBio: state.profileCopy.shortBio,
      longBio: state.profileCopy.longBio,
      offerStatement: state.profileCopy.offerStatement,
      credibilityBullets: state.profileCopy.credibilityBullets,
      proofReferenceLine: state.profileCopy.proofReferenceLine,
      ctaLine: state.profileCopy.ctaLine,
    },
    portfolioCopy: {
      portfolioCta: state.portfolioCopy.portfolioCta,
      sections: state.portfolioCopy.sections.map((s) => ({
        type: s.type,
        heading: s.heading,
        body: s.body,
        bullets: s.bullets,
      })),
    },
    checklistItems: state.checklist.map((c) => ({
      id: c.id,
      category: c.category,
      task: c.task,
      isCompleted: c.isCompleted,
    })),
    masterCta: state.profileCopy.ctaLine,
  };
}

export function compileMarkdown(pack: CompiledAuthorityPack): string {
  const lines: string[] = [];

  lines.push('# Authority Pack');
  lines.push('');

  lines.push('## Authority Position');
  lines.push(pack.authorityPosition);
  lines.push('');

  lines.push('## Core Trust Promise');
  lines.push(pack.coreTrustPromise || '(not set)');
  lines.push('');

  lines.push('## Proof Priorities');
  pack.proofPriorities.forEach((p, i) => {
    lines.push(`${i + 1}. **${p.gapTitle}** — ${p.recommendedFormat}`);
  });
  lines.push('');

  lines.push('## Proof Assets');
  pack.proofAssets.forEach((a, i) => {
    lines.push(`### ${i + 1}. ${a.title}`);
    lines.push(`- **Format:** ${a.assetType}`);
    lines.push(`- **Credibility Gap:** ${a.credibilityGap}`);
    lines.push(`- **Headline:** ${a.headline}`);
    lines.push(`- **Description:** ${a.description}`);
    lines.push(`- **Proof Statement:** ${a.proofStatement}`);
    lines.push(`- **CTA:** ${a.cta}`);
    lines.push(`- **Presentation Structure:** ${a.presentationStructure.join(' → ')}`);
    if (a.completionChecklist.length > 0) {
      lines.push('- **Checklist:**');
      a.completionChecklist.forEach((c) => lines.push(`  - ${c}`));
    }
    lines.push(`- **Accepted:** ${a.isAccepted ? 'Yes' : 'No'}`);
    lines.push('');
  });

  lines.push('## Profile Copy');
  lines.push(`- **Professional Headline:** ${pack.profileCopy.professionalHeadline}`);
  lines.push(`- **Short Bio:** ${pack.profileCopy.shortBio}`);
  lines.push(`- **Long Bio:** ${pack.profileCopy.longBio}`);
  lines.push(`- **Offer Statement:** ${pack.profileCopy.offerStatement}`);
  lines.push(`- **Credibility Bullets:**`);
  pack.profileCopy.credibilityBullets.forEach((b) => lines.push(`  - ${b}`));
  lines.push(`- **Proof Reference Line:** ${pack.profileCopy.proofReferenceLine}`);
  lines.push(`- **CTA Line:** ${pack.profileCopy.ctaLine}`);
  lines.push('');

  lines.push('## Portfolio');
  lines.push(`- **Portfolio CTA:** ${pack.portfolioCopy.portfolioCta}`);
  pack.portfolioCopy.sections.forEach((s) => {
    lines.push(`- **${s.heading}** (${s.type})`);
    lines.push(`  ${s.body}`);
    if (s.bullets && s.bullets.length > 0) {
      s.bullets.forEach((b) => lines.push(`  - ${b}`));
    }
  });
  lines.push('');

  lines.push('## Publish Checklist');
  if (pack.checklistItems.length > 0) {
    const grouped: Record<string, typeof pack.checklistItems> = {};
    pack.checklistItems.forEach((c) => {
      if (!grouped[c.category]) grouped[c.category] = [];
      grouped[c.category].push(c);
    });
    Object.entries(grouped).forEach(([category, items]) => {
      lines.push(`### ${capitalize(category)}`);
      items.forEach((c) => {
        lines.push(`- [${c.isCompleted ? 'x' : ' '}] ${c.task}`);
      });
      lines.push('');
    });
  } else {
    lines.push('(no checklist items generated)');
    lines.push('');
  }

  return lines.join('\n');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
