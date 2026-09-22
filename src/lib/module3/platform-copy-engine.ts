import type { ProfileSystemAsset } from '../../data/module3/authority-suite-engine';
import { ALL_PLATFORMS_LIST } from './platformRegistry';

export interface PlatformCopyContext {
  marketId: string;
  serviceId: string;
  positioning: string;
  mechanism: string;
  promise: string;
  primaryProofTitle: string | null;
  proofTitles: string[];
  nicheId?: string;
  offerId?: string;
  offerType?: string;
  valueAmplifier?: string;
}

export type ToneType = 'executive' | 'conversion' | 'direct';

// Utility to randomly pick from an array (pseudo-random using cycleIndex)
function pick<T>(arr: T[], seed: number): T {
  // Use a simple seeded pseudo-random approach based on cycleIndex and array length
  return arr[seed % arr.length];
}

function formatId(id: string): string {
  if (!id) return '';
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ── Vocabulary Banks ──

const PREFIXES = ["The", "Elite", "Premium", "Chief", "Lead", "Go-To", "Expert", "Signature"];
const CONNECTORS = ["using", "with", "powered by", "via", "through", "leveraging"];
const OUTCOMES = [
  "explosive growth", "predictable ROI", "sustainable scale", 
  "market dominance", "record revenue", "unprecedented success",
  "client retention", "operational alpha", "hyper-growth"
];
const EVIDENCE = ["case studies", "teardowns", "live proofs", "blueprints", "verified assets", "frameworks"];

export class PlatformCopyEngine {
  static generateProfiles(
    context: PlatformCopyContext,
    cycleIndex: number,
    tone: ToneType
  ): ProfileSystemAsset[] {
    const market = formatId(context.marketId) || 'Clients';
    const niche = formatId(context.nicheId || '');
    const service = formatId(context.serviceId) || 'Service';
    const positioning = context.positioning?.trim() || 'Specialist';
    const mechanism = context.mechanism?.trim() || 'Custom Framework';
    const promise = context.promise?.trim() || 'Verifiable Results';
    const valueAmp = context.valueAmplifier?.trim() || '';
    const proofTitles = context.proofTitles || [];
    const primaryProof = context.primaryProofTitle || 'Our Blueprint';
    
    // Build a unique seed string from all parameters to ensure high variance between different users
    const seedString = `${market}-${niche}-${service}-${positioning}-${mechanism}-${promise}-${valueAmp}-${tone}`;
    let baseSeed = 0;
    for (let i = 0; i < seedString.length; i++) {
      baseSeed = (baseSeed << 5) - baseSeed + seedString.charCodeAt(i);
      baseSeed |= 0; // Convert to 32bit int
    }
    baseSeed = Math.abs(baseSeed);
    
    // Derived context
    const targetAudience = niche && niche !== market ? `${niche} ${market}` : market;
    const enhancedMechanism = valueAmp ? `${valueAmp} ${mechanism}` : mechanism;
    const evidenceTerm = pick(EVIDENCE, baseSeed + cycleIndex);
    const connector = pick(CONNECTORS, baseSeed + cycleIndex + 1);
    const outcome = pick(OUTCOMES, baseSeed + cycleIndex + 2);
    
    const assets: ProfileSystemAsset[] = [];
    
    for (const p of ALL_PLATFORMS_LIST) {
      let fields: { key: string; label: string; value: string; originalValue: string }[] = [];
      const pid = p.key;
      
      // We vary text generation by shifting the seed per platform using the baseSeed
      const s = baseSeed + cycleIndex + pid.charCodeAt(0) + pid.charCodeAt(pid.length - 1);
      
      // 1. LinkedIn
      if (pid === 'linkedin') {
        let banner = '';
        let head = '';
        let about = '';
        let cta = '';
        let serv = '';
        
        if (tone === 'executive') {
          banner = pick([
            `Strategic architecture & advisory for ${targetAudience} leadership.`,
            `Enterprise-grade ${service} systems for ${targetAudience}.`,
            `Advising ${targetAudience} executives on ${enhancedMechanism}.`
          ], s);
          head = pick([
            `Senior Partner | Architecting ${enhancedMechanism} to scale ${service} for ${targetAudience} leaders.`,
            `${positioning} | Installing predictable ${service} infrastructure for ${targetAudience}.`,
            `Executive Advisor to ${targetAudience} | Creator of ${enhancedMechanism}.`
          ], s + 1);
          about = `At the highest levels of ${targetAudience}, execution risk is the singular threat to scale.\n\nMy consultancy specializes in ${service} architecture, deploying ${enhancedMechanism} that transition organizations from chaotic dependencies to predictable operational assets.\n\nWe do not operate on speculative marketing. We operate on empirical frameworks. ${promise}.`;
          cta = `Read our Executive Brief on ${enhancedMechanism}`;
          serv = `Enterprise architecture, C-suite advisory, and systemic restructuring.`;
        } else if (tone === 'conversion') {
          banner = pick([
            `Stop losing ${targetAudience} revenue. We install ${enhancedMechanism} that converts.`,
            `Helping ${targetAudience} achieve ${outcome} ${connector} ${enhancedMechanism}.`,
            `Zero fluff. Just ${outcome} for ${targetAudience}.`
          ], s);
          head = pick([
            `I help ${targetAudience} DOMINATE ${service} ${connector} ${enhancedMechanism} | 👉 ${promise}.`,
            `Scaling ${targetAudience} to ${outcome} | Creator of ${enhancedMechanism} | ${promise}.`,
            `We guarantee ${outcome} for ${targetAudience} ${connector} ${enhancedMechanism} | See my pinned ${evidenceTerm}.`
          ], s + 1);
          about = `Your ${service} pipeline is leaking cash every single day.\n\nMost agencies will sell you vanity metrics. I sell ${promise}. Period.\n\nBy installing my proprietary ${enhancedMechanism}, we force your systems to perform. If you are a ${targetAudience} ready to stop playing games and start scaling aggressively, look at the pinned ${evidenceTerm} below.\n\nResults speak louder than pitches.`;
          cta = `Unlock the 30-Day Growth Blueprint (Free)`;
          serv = `High-ROI implementation, funnel optimization, and guaranteed growth systems.`;
        } else {
          // Direct / Default
          banner = pick([
            `Building cool ${enhancedMechanism} stuff for ${targetAudience} | Building in public.`,
            `Just a ${positioning} figuring out ${service} for ${targetAudience}.`,
            `Sharing raw ${evidenceTerm} on ${enhancedMechanism}.`
          ], s);
          head = pick([
            `Figuring out ${service} so you don't have to | Building ${enhancedMechanism} in public | ${promise}`,
            `${positioning} building for ${targetAudience} | Check out my free ${evidenceTerm} 👇`,
            `I write about ${service} and ${enhancedMechanism} for ${targetAudience}.`
          ], s + 1);
          about = `hey, i'm Ayush.\n\ni got really tired of the fake guru BS in the ${targetAudience} space, so i decided to just build ${enhancedMechanism} openly.\n\nmy goal is simple: ${promise}. i don't use fancy corporate jargon. i just document what works, what fails, and how to actually fix ${service}.\n\nif you want to see the exact playbook i use, just check my featured section. it's all free.`;
          cta = `grab my raw templates`;
          serv = `1:1 coaching, raw templates, and community building.`;
        }
        
        fields = [
          { key: 'banner_text', label: 'Banner Concept & Text', value: banner, originalValue: banner },
          { key: 'headline', label: 'Professional Headline', value: head, originalValue: head },
          { key: 'about', label: 'About Section (Story & Proof)', value: about, originalValue: about },
          { key: 'featured_cta', label: 'Featured Link CTA', value: cta, originalValue: cta },
          { key: 'services_desc', label: 'Services Description', value: serv, originalValue: serv },
        ];
      }
      // 2. Twitter / X
      else if (pid === 'twitter') {
        const name = pick([`Ayush | ${service}`, `Ayush (${positioning})`, `Ayush | ${enhancedMechanism}`], s);
        let bio = '';
        let pinned = '';
        if (tone === 'executive') {
          bio = `Macro-advisory for ${targetAudience}. Standardizing ${service} ${connector} ${enhancedMechanism}. ${promise}. \n👇 Strategic insights below.`;
          pinned = `Market Analysis: Why traditional ${service} models are failing ${targetAudience} (and how ${enhancedMechanism} solves the execution gap). A comprehensive thread 🧵👇`;
        } else if (tone === 'conversion') {
          bio = `Helping ${targetAudience} achieve ${outcome} ${connector} ${enhancedMechanism}. ${promise}. Don't hire another agency until you read this 👇`;
          pinned = `I just helped a ${targetAudience} achieve ${outcome} in 45 days. The secret? We ripped out their old ${service} and installed ${enhancedMechanism}. Here is the exact step-by-step 🧵👇`;
        } else {
          bio = `Building ${enhancedMechanism} on the internet. Writing about ${service} & mental models. ${promise}.`;
          pinned = `I've spent the last year obsessed with ${service} for ${targetAudience}. I compiled everything I learned about ${enhancedMechanism} into this one thread. Bookmark it 🧵👇`;
        }
        fields = [
          { key: 'name_format', label: 'Display Name', value: name, originalValue: name },
          { key: 'bio', label: 'Bio Copy', value: bio, originalValue: bio },
          { key: 'pinned_post', label: 'Pinned Post Hook', value: pinned, originalValue: pinned },
          { key: 'cta_link', label: 'Link CTA', value: `ayushpaul.app/blueprint`, originalValue: `ayushpaul.app/blueprint` },
        ];
      }
      // 3. Instagram
      else if (pid === 'instagram') {
        const name = `Ayush | ${service}`;
        let bio = '';
        let highlights = '';
        let cta = '';
        if (tone === 'executive') {
          bio = `Advising ${targetAudience} leadership.\nArchitecture for ${service}.\n${enhancedMechanism} Systems.\n👇 Verified Client Assets`;
          highlights = `1. Methodology\n2. Audits\n3. Outcomes\n4. Overview`;
          cta = `Review our Corporate Methodology`;
        } else if (tone === 'conversion') {
          bio = `Scale your ${targetAudience} business.\n${promise} guaranteed.\nUsing ${enhancedMechanism}.\n👇 Free Training Inside`;
          highlights = `1. ROI Proof\n2. The Secret\n3. Wins\n4. Apply`;
          cta = `Claim Your Free Strategy Session`;
        } else {
          bio = `Founder stuff for ${targetAudience}\nBuilding ${enhancedMechanism}\n${promise} ✨\n👇 Come say hi`;
          highlights = `1. Behind the scenes\n2. Building\n3. Life\n4. Free stuff`;
          cta = `Link in bio ✨`;
        }
        fields = [
          { key: 'name_format', label: 'Display Name', value: name, originalValue: name },
          { key: 'bio', label: 'Bio Copy', value: bio, originalValue: bio },
          { key: 'highlights', label: 'Story Highlights Strategy', value: highlights, originalValue: highlights },
          { key: 'link_cta', label: 'Link-in-Bio CTA', value: cta, originalValue: cta },
        ];
      }
      // 4. YouTube
      else if (pid === 'youtube') {
        let banner = '';
        let bio = '';
        let featured = '';
        if (tone === 'executive') {
          banner = pick([`Strategic Briefings: ${service} Dynamics for ${targetAudience}`, `Enterprise ${service} Architecture`], s);
          bio = `We analyze structural market inefficiencies and document how top-tier ${targetAudience} leverage ${enhancedMechanism} to achieve ${promise}.`;
          featured = `Macro-Analysis: Resolving the core ${service} bottleneck for ${targetAudience}`;
        } else if (tone === 'conversion') {
          banner = pick([`Explosive ${targetAudience} Growth | Master ${service}`, `Scale your ${targetAudience} business fast`], s);
          bio = `The only channel that shows you the exact, step-by-step ${enhancedMechanism} tactics to absolutely crush your ${service} goals. Subscribe if you want ${promise}.`;
          featured = `How to force ${promise} in 30 Days (WARNING: Highly Aggressive)`;
        } else {
          banner = pick([`Chill vibes & ${service} experiments for ${targetAudience}`, `Documenting the ${enhancedMechanism} journey`], s);
          bio = `just a founder documenting the chaotic reality of building ${enhancedMechanism} for ${targetAudience}. weekly vlogs on ${service} and life.`;
          featured = `i tried building a ${enhancedMechanism} in 24 hours (it was a disaster)`;
        }
        fields = [
          { key: 'banner_text', label: 'Channel Banner Hook', value: banner, originalValue: banner },
          { key: 'bio', label: 'About Section', value: bio, originalValue: bio },
          { key: 'featured_video', label: 'Featured Channel Trailer', value: featured, originalValue: featured },
        ];
      }
      // 5. Personal Site
      else if (pid === 'personal_site') {
        let hero = '';
        let subhead = '';
        let about = '';
        let cta = '';
        if (tone === 'executive') {
          hero = pick([`Strategic ${service} Infrastructure for ${targetAudience} Leaders`, `Architecting ${enhancedMechanism} for Scale`], s);
          subhead = `We engineer predictable operational outcomes ${connector} ${enhancedMechanism}. Zero speculative marketing. Pure verifiable execution.`;
          about = `Our consultancy advises ${targetAudience} on eliminating operational drag. By implementing ${enhancedMechanism}, we transform fragmented ${service} workflows into centralized, high-leverage assets.`;
          cta = `Request Executive Audit`;
        } else if (tone === 'conversion') {
          hero = pick([`We Guarantee ${promise} for ${targetAudience} ${connector} ${enhancedMechanism}`, `Stop Losing ${targetAudience} Revenue`], s);
          subhead = `Stop burning cash on theories. We install ${enhancedMechanism} systems that aggressively scale your revenue with zero downside risk.`;
          about = `You don't need more advice; you need execution. I help ${targetAudience} dominate their niche by deploying ${enhancedMechanism} that forces ${promise}. If we don't deliver, you don't pay.`;
          cta = `Book Your Growth Call Now`;
        } else {
          hero = pick([`Making ${service} actually make sense for ${targetAudience}`, `I build ${enhancedMechanism} in public`], s);
          subhead = `i build systems that help you scale without losing your mind. ${promise}, completely in public.`;
          about = `hey, i'm ayush. i got fed up with how complicated ${service} was for ${targetAudience}, so i built ${enhancedMechanism} to fix it. i share everything i learn openly.`;
          cta = `read the blog`;
        }
        fields = [
          { key: 'hero_tagline', label: 'Hero Tagline & Positioning', value: hero, originalValue: hero },
          { key: 'value_prop_subhead', label: 'Value Proposition Subhead', value: subhead, originalValue: subhead },
          { key: 'about_summary', label: 'About / Positioning Paragraph', value: about, originalValue: about },
          { key: 'primary_cta', label: 'Primary Conversion CTA', value: cta, originalValue: cta },
        ];
      }
      // 6-13. Other Platforms (Combinatorial Default fallback)
      else {
        let title = '';
        let bio = '';
        if (tone === 'executive') {
          title = pick([`Executive Insights: ${service}`, `Strategic ${enhancedMechanism}`, `Enterprise ${service} Architecture`], s);
          bio = `Documenting high-leverage ${enhancedMechanism} architectures for ${targetAudience}. Focused on ${promise}.`;
        } else if (tone === 'conversion') {
          title = pick([`${targetAudience} Growth Blueprints`, `Scaling ${service}`, `The ${enhancedMechanism} Playbook`], s);
          bio = `Unlocking ${outcome} for ${targetAudience} ${connector} ${enhancedMechanism}. Guaranteed ${promise}.`;
        } else {
          title = pick([`Notes on ${service}`, `Building ${enhancedMechanism}`, `Ayush's ${service} Journal`], s);
          bio = `sharing raw notes on building ${enhancedMechanism} for ${targetAudience}. ${promise}.`;
        }
        fields = [
          { key: 'headline', label: 'Profile Tagline', value: title, originalValue: title },
          { key: 'bio', label: 'Bio / About', value: bio, originalValue: bio },
        ];
      }
      
      assets.push({
        platform: pid as any,
        title: p.name + ' Profile Package',
        fields,
      });
    }
    
    return assets;
  }
}
