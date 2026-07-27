import type {
  AuthorityProfile,
  AuthorityPosition,
  ProofAssetStrategy,
  ProfilePortfolioStrategy
} from '../../types/module3';

export function generateProfilePortfolioStrategy(ctx: {
  authorityProfile: AuthorityProfile;
  proofAssetStrategy: ProofAssetStrategy;
  mod1ServiceId: string | null;
  mod2OfferType: string | null;
}): ProfilePortfolioStrategy {
  
  const { authorityProfile, proofAssetStrategy } = ctx;

  return {
    version: 2,
    strategySummary: {
      primaryPlatform: 'LinkedIn',
      primaryGoal: 'Lead Generation',
      targetClient: 'B2B Service Providers',
      portfolioStyle: 'Case-study driven',
      contentStrategy: 'Educational insights and teardowns'
    },
    platformStrategy: {
      personalizationNote: 'Focusing on LinkedIn will maximize visibility with B2B decision makers.',
      educational: {
        why: 'Consistency on one platform beats mediocrity on three.',
        principle: 'Start small and dominate one channel before expanding.',
        commonMistake: 'Spreading yourself too thin across multiple networks.'
      },
      metadata: {
        sectionId: 'platform',
        impact: 'High',
        difficulty: 'Medium',
        estimatedMinutes: 30,
        expectedOutcome: 'Higher connection acceptance and inbound inquiries.',
        firstAction: 'Optimize your LinkedIn headline and featured section.'
      },
      recommendations: [
        {
          platform: 'LinkedIn',
          priority: 1,
          purpose: 'Primary B2B lead generation and professional networking',
          action: 'focus',
          aiReasoning: 'Most decision-makers for high-ticket services are active here.',
          expectedRoi: 'High pipeline visibility',
          timeToResults: '3-6 months',
          difficulty: 'Medium'
        },
        {
          platform: 'Personal Website / Portfolio',
          priority: 2,
          purpose: 'Owned asset for deep-dive case studies and conversion',
          action: 'focus',
          aiReasoning: 'Provides a distraction-free environment to sell your authority.',
          expectedRoi: 'Higher conversion rate on booked calls',
          timeToResults: '1-2 months',
          difficulty: 'High'
        }
      ]
    },
    profileStrategy: {
      personalizationNote: 'Your profile must instantly communicate the ROI you deliver.',
      educational: {
        why: 'Your profile is your landing page.',
        principle: 'Always position yourself based on the problems you solve.',
        commonMistake: 'Using a resume-style headline instead of a value proposition.'
      },
      metadata: {
        sectionId: 'profile',
        impact: 'High',
        difficulty: 'Easy',
        estimatedMinutes: 15,
        expectedOutcome: 'Higher profile view-to-connection request ratio.',
        firstAction: 'Rewrite your headline to focus on client outcomes.'
      },
      username: 'FirstLast',
      displayName: authorityProfile.position,
      headline: authorityProfile.coreTrustPromise || 'Helping businesses achieve X through Y',
      bio: 'Detailed bio focusing on the specific problems you solve and the outcomes you deliver.',
      bannerConcept: 'Clean, professional banner highlighting your core value proposition and social proof.',
      profileImageConcept: 'High-quality, professional headshot with a clean background.',
      callToAction: 'Book a discovery call / View my portfolio'
    },
    portfolioStrategy: {
      personalizationNote: 'Case studies should highlight revenue or efficiency gains.',
      educational: {
        why: 'Clients buy results, not services.',
        principle: 'Showcase impact and transformation over deliverables.',
        commonMistake: 'Focusing on the deliverables instead of the business impact.'
      },
      metadata: {
        sectionId: 'portfolio',
        impact: 'High',
        difficulty: 'Hard',
        estimatedMinutes: 120,
        expectedOutcome: 'Increased trust and shortened sales cycles.',
        firstAction: 'Structure your best case study using the STAR method.'
      },
      recommendedStructure: [
        'Hero Section (Value Proposition)',
        'Social Proof (Logos/Testimonials)',
        'Core Services/Offerings',
        'Featured Case Studies',
        'About / Authority Positioning',
        'Contact / Next Steps'
      ],
      projectOrdering: [
        'Highest Impact / Most Recent Case Study',
        'Most Relevant to Target Client',
        'Supporting / Niche Project'
      ],
      navigation: ['Work', 'Services', 'About', 'Contact'],
      contentHierarchy: 'Problem -> Solution -> Results -> Testimonial'
    },
    trustStrategy: {
      personalizationNote: 'Social proof is critical for high-ticket sales.',
      educational: {
        why: 'Trust is the biggest barrier to high-ticket sales.',
        principle: 'Provide indisputable proof of your claims.',
        commonMistake: 'Hiding testimonials on a separate page.'
      },
      metadata: {
        sectionId: 'trust',
        impact: 'High',
        difficulty: 'Medium',
        estimatedMinutes: 45,
        expectedOutcome: 'Immediate authority positioning.',
        firstAction: 'Add a video testimonial or logo strip above the fold.'
      },
      recommendedElements: proofAssetStrategy.priorityProofAssets.map(a => a.name),
      priority: 'High'
    },
    contentStrategy: {
      personalizationNote: 'Educate prospects on the strategic value of your offer.',
      educational: {
        why: 'Consistent content builds a parasocial relationship.',
        principle: 'Share unique viewpoints and insights, not just facts.',
        commonMistake: 'Posting generic advice instead of unique viewpoints.'
      },
      metadata: {
        sectionId: 'content',
        impact: 'Medium',
        difficulty: 'Hard',
        estimatedMinutes: 90,
        expectedOutcome: 'Attracting inbound leads who value your expertise.',
        firstAction: 'Draft one teardown of a popular strategy in your niche.'
      },
      contentTypes: [
        'Case Studies (Deep Dives)',
        'Actionable Frameworks',
        'Industry Insights / Audits',
        'Client Success Stories'
      ],
      publishingFrequency: '1-2 high-quality posts per week',
      authorityBuildingIdeas: [
        'Break down a recent successful project',
        'Share a common mistake your target audience makes',
        'Publish an audit of a well-known brand in your niche'
      ]
    },
    brandingStrategy: {
      personalizationNote: 'A premium, minimalist brand signals high value.',
      educational: {
        why: 'Visual consistency implies operational consistency.',
        principle: 'Less is more; prioritize clean, readable design.',
        commonMistake: 'Using too many colors or inconsistent fonts.'
      },
      metadata: {
        sectionId: 'branding',
        impact: 'Medium',
        difficulty: 'Easy',
        estimatedMinutes: 20,
        expectedOutcome: 'A cohesive, professional brand presence.',
        firstAction: 'Select a core palette of 2 colors and stick to one font.'
      },
      visualConsistency: 'Minimalist, clean, and professional',
      typography: 'Modern sans-serif (e.g., Inter, Roboto)',
      colorUsage: 'High contrast, neutral base with one primary accent color',
      toneOfVoice: 'Authoritative, clear, and results-oriented'
    },
    optimizationRecommendations: [
      {
        area: 'Profile Headline',
        suggestion: 'Ensure your headline focuses on the client outcome, not just your job title.',
        impact: 'High'
      }
    ],
    publishingRoadmap: [
      {
        week: 'Week 1',
        tasks: [
          'Update LinkedIn profile headline and bio',
          'Publish a 1-page simple portfolio site',
          'Add your strongest case study'
        ]
      },
      {
        week: 'Week 2',
        tasks: [
          'Flesh out 2 more detailed case studies',
          'Start publishing 1x/week on LinkedIn',
          'Collect and add 3 client testimonials'
        ]
      },
      {
        week: 'Week 3',
        tasks: [
          'Create a lead magnet',
          'Expand to a second social platform',
          'Start a newsletter'
        ]
      }
    ],
    status: 'draft',
    generatedAt: new Date().toISOString()
  };
}
