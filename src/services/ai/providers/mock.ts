import { AIProvider } from '../types';

export class MockProvider implements AIProvider {
  private mockDelayMs: number;

  constructor(mockDelayMs = 1500) {
    this.mockDelayMs = mockDelayMs;
  }

  getModelName(): string {
    return 'mock-provider';
  }

  async generateJSON<T>(_prompt: string, _schemaDescription: string, signal?: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }

        // Return a basic mock structure matching ProfilePortfolioStrategy
        const mockData: any = {
          version: 2,
          strategySummary: {
            primaryPlatform: 'LinkedIn',
            primaryGoal: 'Lead Generation',
            targetClient: 'B2B SaaS Founders',
            portfolioStyle: 'Case-study driven narrative',
            contentStrategy: 'Educational frameworks and teardowns'
          },
          platformStrategy: {
            personalizationNote: 'Focus your energy on platforms where SaaS founders actively look for solutions.',
            educational: {
              why: 'Trying to be everywhere waters down your authority.',
              commonMistake: 'Posting the exact same content across LinkedIn, Twitter, and Instagram.',
              firstAction: 'Optimize your LinkedIn profile before creating any new content.',
              expectedResult: 'A solid foundation to capture and convert attention.'
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
            personalizationNote: 'Because your offer targets B2B SaaS Founders, your profile needs to instantly communicate ROI.',
            educational: {
              why: 'Your profile is your landing page.',
              commonMistake: 'Using a resume-style headline instead of a value proposition.',
              firstAction: 'Rewrite your headline to follow the "I help X achieve Y through Z" framework.',
              expectedResult: 'Higher profile view-to-connection request ratio.'
            },
            username: 'FirstLast',
            displayName: 'Expert Strategist',
            headline: 'Helping businesses achieve X through Y',
            bio: 'Detailed bio focusing on the specific problems you solve and the outcomes you deliver.',
            bannerConcept: 'Clean, professional banner highlighting your core value proposition and social proof.',
            profileImageConcept: 'High-quality, professional headshot with a clean background.',
            callToAction: 'Book a discovery call'
          },
          portfolioStrategy: {
            personalizationNote: 'For SaaS founders, case studies must highlight revenue or efficiency gains.',
            educational: {
              why: 'Clients buy results, not services.',
              commonMistake: 'Focusing on the deliverables instead of the business impact.',
              firstAction: 'Structure your best case study using the STAR method (Situation, Task, Action, Result).',
              expectedResult: 'Increased trust and shortened sales cycles.'
            },
            recommendedStructure: [
              'Hero Section (Value Proposition)',
              'Social Proof (Logos/Testimonials)',
              'Featured Case Studies'
            ],
            projectOrdering: [
              'Highest Impact / Most Recent Case Study',
              'Most Relevant to Target Client'
            ],
            navigation: ['Work', 'Services', 'About', 'Contact'],
            contentHierarchy: 'Problem -> Solution -> Results -> Testimonial'
          },
          trustStrategy: {
            personalizationNote: 'Social proof is critical when selling high-ticket strategic services.',
            educational: {
              why: 'Trust is the biggest barrier to high-ticket sales.',
              commonMistake: 'Hiding testimonials on a separate page instead of integrating them into the sales narrative.',
              firstAction: 'Add a video testimonial or a logo strip above the fold on your portfolio.',
              expectedResult: 'Immediate authority positioning.'
            },
            recommendedElements: ['Client Testimonial', 'Case Study', 'Logo Strip'],
            priority: 'High'
          },
          contentStrategy: {
            personalizationNote: 'Your content should educate founders on the strategic value of your offer.',
            educational: {
              why: 'Consistent content builds a parasocial relationship with prospects.',
              commonMistake: 'Posting generic advice instead of unique, contrarian viewpoints or deep teardowns.',
              firstAction: 'Draft one teardown of a popular SaaS tool related to your niche.',
              expectedResult: 'Attracting inbound leads who value your specific expertise.'
            },
            contentTypes: [
              'Case Studies (Deep Dives)',
              'Actionable Frameworks'
            ],
            publishingFrequency: '1-2 high-quality posts per week',
            authorityBuildingIdeas: [
              'Break down a recent successful project',
              'Share a common mistake your target audience makes'
            ]
          },
          brandingStrategy: {
            personalizationNote: 'A premium, minimalist brand signals high value to B2B founders.',
            educational: {
              why: 'Visual consistency implies operational consistency.',
              commonMistake: 'Using too many colors or inconsistent fonts across platforms.',
              firstAction: 'Select a core palette of 2 colors and stick to one modern sans-serif font.',
              expectedResult: 'A cohesive, professional brand presence.'
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
                'Publish a 1-page simple portfolio site'
              ]
            }
          ],
          status: 'draft',
          generatedAt: new Date().toISOString()
        };

        resolve(mockData as T);
      }, this.mockDelayMs);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  }
}
