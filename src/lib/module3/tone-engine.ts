import type { GeneratedAuthoritySuite, ProfileSystemAsset } from '../../data/module3/authority-suite-engine';

export type ToneType = 'executive' | 'conversion' | 'direct';

export interface ToneContext {
  market: string;
  service: string;
  mechanism: string;
  promise: string;
  positioning: string;
  primaryProofTitle: string | null;
  proofTitles: string[];
}

export function generateToneBasedField(
  platform: string,
  fieldKey: string,
  tone: ToneType,
  ctx: ToneContext
): string {
  const { market, service, mechanism, promise, positioning, primaryProofTitle, proofTitles } = ctx;
  const proofHook = primaryProofTitle ? `See my teardown on "${primaryProofTitle}"` : `See our live proof assets`;
  
  if (platform === 'linkedin') {
    switch (fieldKey) {
      case 'banner_text':
        if (tone === 'executive') return `Strategic ${service} Advisory for ${market} | Measurable Outcomes`;
        if (tone === 'conversion') return `Helping ${market} scale ${service} via ${mechanism} | Zero Fluff. Pure Execution.`;
        return `Building ${mechanism} for ${market} | Documenting the process`;
      case 'headline':
        if (tone === 'executive') return `${positioning} | ${service} Partner for ${market} | Creator of ${mechanism} | Backed by Verifiable Proof`;
        if (tone === 'conversion') return `${service} Partner for ${market} | We use ${mechanism} to guarantee results | ${proofHook}`;
        return `Solving ${service} for ${market} using ${mechanism} | No BS, just execution`;
      case 'about':
        if (tone === 'executive') return `As a ${positioning}, I advise ${market} on scalable ${service} architecture. ${promise}.\n\nWe prioritize empirical evidence over speculative claims. By deploying our ${mechanism}, we ensure total alignment before engagement.\n\n${proofHook}.`;
        if (tone === 'conversion') return `I help ${market} build scalable ${service} architecture. ${promise}.\n\nMost providers offer promises; I build live, verifiable demonstration assets using ${mechanism} so you see the exact execution standards before we ever partner.\n\nDM me "PROOF" to view my complete case study teardowns.`;
        return `Hey, I'm Ayush.\n\nI got tired of the fluff in ${service}, so I built ${mechanism} specifically for ${market}.\n\n${promise}.\n\nI document my entire process. Check out my featured section to see real proof and teardowns.`;
      case 'featured_cta':
        if (tone === 'executive') return `👉 Access the Strategic ${service} Executive Brief`;
        if (tone === 'conversion') return `👉 Access My Full ${service} Blueprint & Live Case Studies`;
        return `👉 Steal my ${service} playbook here`;
      case 'services_desc':
        if (tone === 'executive') return `Executive ${service} consulting, process architecture, and strategic auditing for ${market}.`;
        if (tone === 'conversion') return `High-ticket ${service} consulting, system implementation, and strategic auditing for ${market}.`;
        return `Hands-on ${service} implementation and fractional support for ${market}.`;
    }
  }

  if (platform === 'twitter') {
    switch (fieldKey) {
      case 'name_format':
        return `Ayush | ${service}`;
      case 'bio':
        if (tone === 'executive') return `Advising ${market} on ${service}. Creator of the ${mechanism}. ${promise}. \n👇 Strategic teardowns below.`;
        if (tone === 'conversion') return `Building ${mechanism} for ${market}. Sharing breakdown teardowns on ${service}. ${promise}. 👇 Read my pinned thread`;
        return `Just a guy building ${mechanism} for ${market}. I tweet about ${service} and execution. ${promise}.`;
      case 'pinned_post':
        if (tone === 'executive') return `Executive Breakdown: How top-tier ${market} are leveraging ${mechanism} to transform their ${service}. A thread 🧵👇`;
        if (tone === 'conversion') return `I spent 30 days building a complete ${service} framework for ${market}. Here are the exact 5 components that drive 80% of the results 🧵👇`;
        return `Want to know how I solve ${service} for ${market}? It's all about ${mechanism}. Here is the exact playbook (steal it): 🧵👇`;
      case 'cta_link':
        return `ayushpaul.app/blueprint`;
    }
  }

  if (platform === 'instagram') {
    switch (fieldKey) {
      case 'name_format':
        return `Ayush | ${service}`;
      case 'bio':
        if (tone === 'executive') return `Advising ${market} on ${service}.\n${mechanism} Architect.\n${promise}.\n👇 View Case Studies`;
        if (tone === 'conversion') return `I help ${market} scale via ${mechanism}.\n${promise}.\nCheck out my free case study below 👇`;
        return `Building ${mechanism} for ${market}.\nDocumenting the ${service} journey.\n${promise} ✨\n👇 See my latest build`;
      case 'highlights':
        if (tone === 'executive') return `1. Methodology\n2. Case Studies\n3. Client Outcomes\n4. About`;
        if (tone === 'conversion') return `1. Case Studies\n2. The Process\n3. Client Wins\n4. About Me`;
        return `1. Build in Public\n2. The Process\n3. Wins\n4. Life`;
      case 'link_cta':
        if (tone === 'executive') return `Review the ${service} Blueprint`;
        if (tone === 'conversion') return `Access the ${service} Blueprint`;
        return `Grab my free ${service} playbook`;
    }
  }

  if (platform === 'personal_site') {
    switch (fieldKey) {
      case 'hero_tagline':
        if (tone === 'executive') return `Strategic ${service} Architecture for ${market} | Powered by ${mechanism}`;
        if (tone === 'conversion') return `High-Certainty ${service} for ${market} | Powered by ${mechanism}`;
        return `Solving ${service} for ${market} with ${mechanism}`;
      case 'value_prop_subhead':
        if (tone === 'executive') return `Delivering predictable client outcomes using ${mechanism}. Documented results with zero fabricated claims.`;
        if (tone === 'conversion') return `Stop gambling on agencies. We use ${mechanism} to guarantee delivery and eliminate execution risk for ${market}.`;
        return `I build the systems that help ${market} scale their ${service}, so you don't have to guess what works.`;
      case 'about_summary':
        if (tone === 'executive') return `I advise ${market} on building scalable ${service} systems without generic agency overhead. ${promise}. Every engagement is backed by verifiable proof assets.`;
        if (tone === 'conversion') return `I help ${market} build scalable ${service} systems without generic agency overhead. ${promise}. Every claim is backed by open proof assets.`;
        return `Hey, I'm Ayush. I help ${market} fix their ${service} workflows using my ${mechanism}. ${promise} - check my live case studies.`;
      case 'primary_cta':
        if (tone === 'executive') return `Request Strategic Consultation`;
        if (tone === 'conversion') return `Schedule Strategic Consultation & Audit`;
        return `Let's Chat`;
    }
  }

  if (platform === 'youtube') {
    switch (fieldKey) {
      case 'banner_text':
        if (tone === 'executive') return `Strategic ${service} Insights for ${market} | Executive Briefings Weekly`;
        if (tone === 'conversion') return `The No-BS Guide to ${service} for ${market} | New Teardowns Weekly`;
        return `Building ${mechanism} | Weekly ${service} Vlogs & Teardowns`;
      case 'bio':
        if (tone === 'executive') return `We document the exact methodologies ${market} use to scale using ${mechanism}. Expect deep-dive strategic teardowns and verified execution frameworks.\n\n${promise}.`;
        if (tone === 'conversion') return `I document exactly how ${market} can scale using ${mechanism}. No fluff, just raw execution and teardowns.\n\n${promise}.`;
        return `Welcome to my channel! I show you exactly how I build ${service} systems for ${market} using ${mechanism}. Join me as I build in public.\n\n${promise}.`;
      case 'featured_video':
        if (tone === 'executive') return `Strategic Teardown: Resolving the core ${service} bottleneck for ${market}`;
        if (tone === 'conversion') return `Why your ${service} is failing (and how to fix it in 30 days)`;
        return `I built a ${mechanism} system for ${market} (Watch me build it)`;
    }
  }

  // Fallback if not specifically caught
  return `[${tone} variant for ${fieldKey}]`;
}

export function applyToneToSuite(
  suite: GeneratedAuthoritySuite,
  tone: ToneType,
  ctx: ToneContext
): GeneratedAuthoritySuite {
  const newProfileSystem: ProfileSystemAsset[] = suite.profileSystem.map(platformAsset => {
    return {
      ...platformAsset,
      fields: platformAsset.fields.map(field => {
        // Only apply tone if the user hasn't explicitly customized this field
        if (field.isCustomized) {
          return field;
        }

        const newToneValue = generateToneBasedField(platformAsset.platform, field.key, tone, ctx);
        return {
          ...field,
          value: newToneValue !== `[${tone} variant for ${field.key}]` ? newToneValue : field.value,
        };
      }),
    };
  });

  return {
    ...suite,
    profileSystem: newProfileSystem,
  };
}
