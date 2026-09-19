export interface CopywritingContext {
  serviceId: string;
  careerTrackId: string;
  positioning: string;
  marketId: string;
  mechanism: string;
  nicheId?: string;
  offerId?: string;
  offerType?: string;
  valueAmplifier?: string;
}

export interface GeneratedIdentity {
  headline: string;
  proofLine: string;
  tone: string;
}

const TONES = ['Authority', 'Results', 'Contrarian', 'Visionary'] as const;

// Helper to clean up ID strings (e.g. 'e_commerce' -> 'E-Commerce')
function formatId(id: string): string {
  if (!id) return '';
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Utility to randomly pick from an array
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Vocabulary Banks
const PREFIXES = ["The", "Elite", "Premium", "Chief", "Lead", "Go-To", "Expert", "Signature"];
const CONNECTORS = ["using", "with", "powered by", "via", "through", "leveraging"];
const PROOF_STARTERS = [
  "Helping", "Empowering", "Partnering with", "Working with", "Trusted by", "Guiding"
];
const OUTCOMES = [
  "explosive growth", "predictable ROI", "sustainable scale", 
  "market dominance", "record revenue", "unprecedented success"
];

// Context-Aware Verb Banks
const getVerbBank = (track: string) => {
  const t = (track || '').toLowerCase();
  if (t.includes('dev') || t.includes('engineer') || t.includes('tech')) {
    return {
      actioning: ["Architecting", "Engineering", "Building", "Developing", "Shipping"],
      actioned: ["architected", "built", "engineered", "shipped", "deployed"]
    };
  }
  if (t.includes('design') || t.includes('creative')) {
    return {
      actioning: ["Crafting", "Designing", "Sculpting", "Curating", "Creating"],
      actioned: ["crafted", "designed", "curated", "launched", "perfected"]
    };
  }
  if (t.includes('market') || t.includes('growth')) {
    return {
      actioning: ["Scaling", "Driving", "Generating", "Accelerating", "Multiplying"],
      actioned: ["scaled", "driven", "generated", "accelerated", "multiplied"]
    };
  }
  // Default fallback
  return {
    actioning: ["Transforming", "Building", "Delivering", "Unlocking", "Scaling"],
    actioned: ["transformed", "built", "delivered", "unlocked", "scaled"]
  };
};

export class CopywritingEngine {
  static generate(context: CopywritingContext, cycleIndex: number): GeneratedIdentity {
    const tone = TONES[cycleIndex % TONES.length];
    
    // Clean and normalize inputs
    const market = formatId(context.marketId) || 'Clients';
    const niche = formatId(context.nicheId || '');
    const positioning = context.positioning?.trim() || formatId(context.serviceId) || 'Specialist';
    const mechanism = context.mechanism?.trim() || 'Custom Framework';
    const track = context.careerTrackId || '';
    const offer = formatId(context.offerId || '');
    const valueAmp = context.valueAmplifier?.trim() || '';
    
    // Combine market and niche for extreme specificity if niche exists
    const targetAudience = niche && niche !== market ? `${niche} ${market}` : market;
    
    // Create an "Enhanced Mechanism" that includes the value amplifier if it exists
    const enhancedMechanism = valueAmp ? `${valueAmp} ${mechanism}` : mechanism;
    
    const verbs = getVerbBank(track);
    
    // Randomly selected modular pieces
    const pre = pick(PREFIXES);
    const conn = pick(CONNECTORS);
    const act = pick(verbs.actioning);
    const acted = pick(verbs.actioned);
    const out = pick(OUTCOMES);
    const pStart = pick(PROOF_STARTERS);
    
    let headline = '';
    let proofLine = '';

    // Combinatorial Syntax Trees based on Tone
    switch (tone) {
      case 'Authority':
        headline = `${pre} ${targetAudience} ${positioning} | ${act} ${pick(["Growth", "Systems", "Success", "Scale"])} ${conn} ${enhancedMechanism}`;
        proofLine = `${pStart} top ${targetAudience} to achieve ${out} ${conn} ${enhancedMechanism}.`;
        break;
        
      case 'Results':
        headline = `${pick(["Helping", "Making", "Ensuring"])} ${targetAudience} ${pick(["Dominate", "Win", "Scale", "Lead"])} | ${pick(["Powered by", "Driven by", "Fueled by"])} ${enhancedMechanism}`;
        proofLine = `I've ${acted} ${out} for ${targetAudience} by ${conn} a world-class ${enhancedMechanism}.`;
        break;
        
      case 'Contrarian':
        headline = `${pick(["Stop Wasting Time", "Ditch The Basics", "Beyond Ordinary", "Forget The Norm"])} | ${positioning} & ${mechanism} Expert`;
        proofLine = `${pick(["Traditional methods fail.", "Average doesn't work.", "Don't settle."])} I use ${enhancedMechanism} to give ${targetAudience} an unfair advantage.`;
        break;
        
      case 'Visionary':
        headline = `${pre} ${positioning} | ${pick(["Redefining", "Reinventing", "Revolutionizing"])} ${targetAudience} ${conn} ${enhancedMechanism}`;
        proofLine = `${act} the future of ${targetAudience} by deploying my signature ${enhancedMechanism}.`;
        break;
    }

    return { headline, proofLine, tone };
  }
}
