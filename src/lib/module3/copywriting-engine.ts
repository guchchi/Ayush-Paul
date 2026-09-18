export interface CopywritingContext {
  serviceId: string;
  careerTrackId: string;
  positioning: string;
  marketId: string;
  mechanism: string;
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

// Power Verbs mapped by generic Career Track (very basic mapping, defaults to strong verbs)
const getPowerVerbs = (track: string) => {
  const t = (track || '').toLowerCase();
  if (t.includes('dev') || t.includes('engineer') || t.includes('tech')) {
    return { action: 'Architecting', build: 'Building', deliver: 'Shipping' };
  }
  if (t.includes('design') || t.includes('creative')) {
    return { action: 'Crafting', build: 'Designing', deliver: 'Launching' };
  }
  if (t.includes('market') || t.includes('growth')) {
    return { action: 'Scaling', build: 'Driving', deliver: 'Generating' };
  }
  return { action: 'Transforming', build: 'Building', deliver: 'Delivering' };
};

export class CopywritingEngine {
  static generate(context: CopywritingContext, cycleIndex: number): GeneratedIdentity {
    const tone = TONES[cycleIndex % TONES.length];
    
    // Clean and normalize inputs
    const market = formatId(context.marketId) || 'Clients';
    const positioning = context.positioning?.trim() || formatId(context.serviceId) || 'Specialist';
    const mechanism = context.mechanism?.trim() || 'Custom Framework';
    const track = context.careerTrackId || '';
    
    const verbs = getPowerVerbs(track);
    
    let headline = '';
    let proofLine = '';

    switch (tone) {
      case 'Authority':
        headline = `The ${market} ${positioning} | ${verbs.action} Growth with ${mechanism}`;
        proofLine = `Trusted by top ${market} to ${verbs.deliver.toLowerCase()} predictable ROI using ${mechanism}.`;
        break;
        
      case 'Results':
        headline = `Helping ${market} Dominate | Powered by ${mechanism}`;
        proofLine = `I help ${market} achieve explosive growth by ${verbs.build.toLowerCase()} world-class ${mechanism} systems.`;
        break;
        
      case 'Contrarian':
        headline = `Stop Wasting Time on Basics | ${positioning} & ${mechanism} Expert`;
        proofLine = `Traditional methods fail. I use ${mechanism} to give ${market} an unfair advantage.`;
        break;
        
      case 'Visionary':
        headline = `Chief ${positioning} | Redefining ${market} via ${mechanism}`;
        proofLine = `${verbs.action} the future of ${market} operations through my signature ${mechanism}.`;
        break;
    }

    return { headline, proofLine, tone };
  }
}
