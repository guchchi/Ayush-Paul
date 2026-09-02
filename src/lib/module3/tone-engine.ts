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
        if (tone === 'executive') return `Strategic architecture & advisory for ${market} leadership.`;
        if (tone === 'conversion') return `Stop losing ${market} revenue. We install ${mechanism} that converts.`;
        return `just building cool ${mechanism} stuff for ${market} | building in public`;
      case 'headline':
        if (tone === 'executive') return `Senior Partner | Architecting enterprise-grade ${mechanism} to scale ${service} operations for ${market} leaders.`;
        if (tone === 'conversion') return `I help ${market} DOMINATE ${service} using ${mechanism} | 👉 Guaranteed ${promise} or we don't get paid.`;
        return `figuring out ${service} so you don't have to | building ${mechanism} in public | ${promise}`;
      case 'about':
        if (tone === 'executive') return `At the highest levels of ${market}, execution risk is the singular threat to scale.\n\nMy consultancy specializes in ${service} architecture, deploying ${mechanism} frameworks that transition organizations from chaotic dependencies to predictable operational assets.\n\nWe do not operate on speculative marketing. We operate on empirical frameworks. ${promise}.`;
        if (tone === 'conversion') return `Your ${service} pipeline is leaking cash every single day.\n\nMost agencies will sell you vanity metrics. I sell ${promise}. Period.\n\nBy installing my proprietary ${mechanism}, we force your systems to perform. If you are a ${market} ready to stop playing games and start scaling aggressively, look at the pinned teardown below.\n\nResults speak louder than pitches.`;
        return `hey, i'm Ayush.\n\ni got really tired of the fake guru BS in the ${market} space, so i decided to just build ${mechanism} openly.\n\nmy goal is simple: ${promise}. i don't use fancy corporate jargon. i just document what works, what fails, and how to actually fix ${service}.\n\nif you want to see the exact playbook i use, just check my featured section. it's all free.`;
      case 'featured_cta':
        if (tone === 'executive') return `Read our Q3 Executive Brief`;
        if (tone === 'conversion') return `Unlock the 30-Day Growth Blueprint (Free)`;
        return `grab my raw templates`;
      case 'services_desc':
        if (tone === 'executive') return `Enterprise architecture, C-suite advisory, and systemic restructuring.`;
        if (tone === 'conversion') return `High-ROI implementation, funnel optimization, and guaranteed growth systems.`;
        return `1:1 coaching, raw templates, and community building.`;
    }
  }

  if (platform === 'twitter') {
    switch (fieldKey) {
      case 'name_format':
        return `Ayush | ${service}`;
      case 'bio':
        if (tone === 'executive') return `Macro-advisory for ${market}. Standardizing ${service} via ${mechanism}. ${promise}. \n👇 Strategic insights below.`;
        if (tone === 'conversion') return `Helping ${market} print cash with ${mechanism}. ${promise}. Don't hire another agency until you read this 👇`;
        return `building ${mechanism} on the internet. writing about ${service} & mental models. ${promise}.`;
      case 'pinned_post':
        if (tone === 'executive') return `Market Analysis: Why traditional ${service} models are failing ${market} (and how ${mechanism} solves the execution gap). A comprehensive thread 🧵👇`;
        if (tone === 'conversion') return `I just helped a ${market} achieve ${promise} in 45 days. The secret? We ripped out their old ${service} and installed ${mechanism}. Here is the exact step-by-step 🧵👇`;
        return `i've spent the last year obsessed with ${service} for ${market}. i compiled everything i learned about ${mechanism} into this one thread. bookmark it 🧵👇`;
      case 'cta_link':
        return `ayushpaul.app/blueprint`;
    }
  }

  if (platform === 'instagram') {
    switch (fieldKey) {
      case 'name_format':
        return `Ayush | ${service}`;
      case 'bio':
        if (tone === 'executive') return `Advising ${market} leadership.\nArchitecture for ${service}.\n${mechanism} Systems.\n👇 Verified Client Assets`;
        if (tone === 'conversion') return `Scale your ${market} business.\n${promise} guaranteed.\nUsing proprietary ${mechanism}.\n👇 Free Training Inside`;
        return `founder stuff for ${market}\nbuilding ${mechanism}\n${promise} ✨\n👇 come say hi`;
      case 'highlights':
        if (tone === 'executive') return `1. Methodology\n2. Audits\n3. Client Outcomes\n4. Firm Overview`;
        if (tone === 'conversion') return `1. ROI Proof\n2. The Secret\n3. Testimonials\n4. Apply Now`;
        return `1. behind the scenes\n2. building\n3. life\n4. free stuff`;
      case 'link_cta':
        if (tone === 'executive') return `Review our Corporate Methodology`;
        if (tone === 'conversion') return `Claim Your Free Strategy Session`;
        return `link in bio ✨`;
    }
  }

  if (platform === 'personal_site') {
    switch (fieldKey) {
      case 'hero_tagline':
        if (tone === 'executive') return `Strategic ${service} Infrastructure for ${market} Leaders`;
        if (tone === 'conversion') return `We Guarantee ${promise} for ${market} using ${mechanism}`;
        return `making ${service} actually make sense for ${market}`;
      case 'value_prop_subhead':
        if (tone === 'executive') return `We engineer predictable operational outcomes using ${mechanism}. Zero speculative marketing. Pure verifiable execution.`;
        if (tone === 'conversion') return `Stop burning cash on theories. We install ${mechanism} systems that aggressively scale your revenue with zero downside risk.`;
        return `i build systems that help you scale without losing your mind. ${promise}, completely in public.`;
      case 'about_summary':
        if (tone === 'executive') return `Our consultancy advises ${market} on eliminating operational drag. By implementing ${mechanism}, we transform fragmented ${service} workflows into centralized, high-leverage assets.`;
        if (tone === 'conversion') return `You don't need more advice; you need execution. I help ${market} dominate their niche by deploying ${mechanism} that forces ${promise}. If we don't deliver, you don't pay.`;
        return `hey, i'm ayush. i got fed up with how complicated ${service} was for ${market}, so i built ${mechanism} to fix it. i share everything i learn openly.`;
      case 'primary_cta':
        if (tone === 'executive') return `Request Executive Audit`;
        if (tone === 'conversion') return `Book Your Growth Call Now`;
        return `read the blog`;
    }
  }

  if (platform === 'youtube') {
    switch (fieldKey) {
      case 'banner_text':
        if (tone === 'executive') return `Strategic Briefings: ${service} Dynamics for ${market}`;
        if (tone === 'conversion') return `Explosive ${market} Growth | Master ${service} via ${mechanism}`;
        return `chill vibes & ${service} experiments for ${market}`;
      case 'bio':
        if (tone === 'executive') return `We analyze structural market inefficiencies and document how top-tier ${market} leverage ${mechanism} to achieve ${promise}.`;
        if (tone === 'conversion') return `The only channel that shows you the exact, step-by-step ${mechanism} tactics to absolutely crush your ${service} goals. Subscribe if you want ${promise}.`;
        return `just a founder documenting the chaotic reality of building ${mechanism} for ${market}. weekly vlogs on ${service} and life.`;
      case 'featured_video':
        if (tone === 'executive') return `Macro-Analysis: Resolving the core ${service} bottleneck for ${market}`;
        if (tone === 'conversion') return `How to force ${promise} in 30 Days (WARNING: Highly Aggressive)`;
        return `i tried building a ${mechanism} in 24 hours (it was a disaster)`;
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
