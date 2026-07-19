import type { AuthorityPosition } from '../../types/module3';
import { classifyService } from './service-taxonomy';

export interface TrustScore {
  craft: number;
  reliability: number;
  impact: number;
}

export interface CredibilityAssetItem {
  id: string;
  label: string;
  doubtSolved: string;
  description: string;
  platforms: string[];
  category: 'craft' | 'reliability' | 'impact';
  weight: TrustScore;
}

export interface CredibilityGapItem {
  id: string;
  label: string;
  doubtSolved: string;
  platforms: string[];
  format: string;
}

export interface CredibilityRules {
  baseWeights: Record<string, TrustScore>;
  marketModifiers: Record<string, Partial<TrustScore>>;
  offerModifiers: Record<string, Partial<TrustScore>>;
  trackModifiers: Record<string, Record<string, number>>;
}

export const CREDIBILITY_RULES: CredibilityRules = {
  baseWeights: {
    portfolio_projects: { craft: 25, reliability: 10, impact: 15 },
    personal_projects: { craft: 20, reliability: 0, impact: 5 },
    client_work: { craft: 15, reliability: 30, impact: 15 },
    testimonials: { craft: 5, reliability: 35, impact: 10 },
    case_studies: { craft: 20, reliability: 15, impact: 30 },
    certificates: { craft: 10, reliability: 5, impact: 5 },
    github_code: { craft: 30, reliability: 0, impact: 0 },
    design_samples: { craft: 30, reliability: 0, impact: 0 },
    metrics_results: { craft: 5, reliability: 10, impact: 35 },
    content: { craft: 15, reliability: 5, impact: 10 },
    social_proof: { craft: 0, reliability: 25, impact: 10 },
    awards_achievements: { craft: 15, reliability: 10, impact: 10 },
    
    // Editor specific ids
    showreel: { craft: 35, reliability: 5, impact: 10 },
    before_after_edits: { craft: 30, reliability: 5, impact: 15 },
    youtube_videos: { craft: 25, reliability: 10, impact: 10 },
    instagram_reels: { craft: 25, reliability: 10, impact: 10 },
    editing_breakdown: { craft: 25, reliability: 10, impact: 5 },
    retention_results: { craft: 5, reliability: 10, impact: 35 },
    motion_graphics: { craft: 30, reliability: 0, impact: 5 },

    // Developer specific ids
    live_website: { craft: 30, reliability: 15, impact: 15 },
    code_walkthrough: { craft: 25, reliability: 10, impact: 5 },
    open_source: { craft: 30, reliability: 10, impact: 5 },
    performance_metrics: { craft: 15, reliability: 5, impact: 30 },
    technical_blog: { craft: 20, reliability: 5, impact: 15 },

    // Designer specific ids
    figma_portfolio: { craft: 35, reliability: 5, impact: 10 },
    design_case_study: { craft: 25, reliability: 10, impact: 30 },
    design_system: { craft: 30, reliability: 15, impact: 10 },
    interactive_prototype: { craft: 30, reliability: 10, impact: 10 },
    behance_dribbble: { craft: 25, reliability: 10, impact: 5 },
    user_flow: { craft: 20, reliability: 5, impact: 10 },
    design_process: { craft: 25, reliability: 10, impact: 5 },
    design_critique: { craft: 25, reliability: 15, impact: 10 },

    // Automation specific ids
    workflow_diagram: { craft: 25, reliability: 10, impact: 10 },
    live_automation: { craft: 35, reliability: 10, impact: 15 },
    automation_code: { craft: 30, reliability: 0, impact: 5 },
    process_walkthrough: { craft: 25, reliability: 10, impact: 5 },

    // Copywriter specific ids
    landing_pages: { craft: 30, reliability: 10, impact: 20 },
    email_sequence: { craft: 30, reliability: 5, impact: 15 },
    sales_page: { craft: 30, reliability: 10, impact: 20 },
    ad_copies: { craft: 25, reliability: 5, impact: 10 },
    conversion_metrics: { craft: 5, reliability: 10, impact: 35 },
    swipe_file: { craft: 20, reliability: 5, impact: 10 },
    content_samples: { craft: 20, reliability: 5, impact: 10 }
  },
  marketModifiers: {
    saas_startups: { impact: 1.3 },
    startups: { impact: 1.2, craft: 1.1 },
    local_businesses: { reliability: 1.25 },
    agencies: { reliability: 1.1, craft: 1.1 },
    coaches: { reliability: 1.2 },
    creators: { craft: 1.2 },
  },
  offerModifiers: {
    retainer: { reliability: 1.25 },
    one_time_project: { craft: 1.15 },
    milestone_based: { reliability: 1.1, impact: 1.1 },
  },
  trackModifiers: {
    developer: { github_code: 45, portfolio_projects: 30 },
    designer: { design_samples: 45, portfolio_projects: 30 },
    editor: { content: 40, portfolio_projects: 30 },
  },
};

// 1. MASTER DIRECTORY OF AVAILABLE ASSETS TEMPLATES BY TRACK
const AVAILABLE_TEMPLATES: Record<string, Omit<CredibilityAssetItem, 'label' | 'description' | 'doubtSolved'>[]> = {
  editor: [
    { id: 'showreel', category: 'craft', weight: { craft: 35, reliability: 5, impact: 10 }, platforms: ['YouTube', 'Vimeo', 'Frame.io'] },
    { id: 'portfolio_projects', category: 'craft', weight: { craft: 25, reliability: 10, impact: 15 }, platforms: ['Google Drive', 'Personal Website', 'Dropbox'] },
    { id: 'before_after_edits', category: 'craft', weight: { craft: 30, reliability: 5, impact: 15 }, platforms: ['YouTube', 'Instagram Reels', 'Google Drive'] },
    { id: 'youtube_videos', category: 'craft', weight: { craft: 25, reliability: 10, impact: 10 }, platforms: ['YouTube Channels', 'Vimeo'] },
    { id: 'instagram_reels', category: 'craft', weight: { craft: 25, reliability: 10, impact: 10 }, platforms: ['Instagram Reels', 'TikTok', 'YouTube Shorts'] },
    { id: 'client_work', category: 'reliability', weight: { craft: 15, reliability: 30, impact: 15 }, platforms: ['Frame.io Client Link', 'Google Drive'] },
    { id: 'editing_breakdown', category: 'craft', weight: { craft: 25, reliability: 10, impact: 5 }, platforms: ['Loom Video', 'YouTube Explainer'] },
    { id: 'retention_results', category: 'impact', weight: { craft: 5, reliability: 10, impact: 35 }, platforms: ['YouTube Studio Screenshot', 'Analytics Report'] },
    { id: 'testimonials', category: 'reliability', weight: { craft: 5, reliability: 35, impact: 10 }, platforms: ['Google Reviews', 'LinkedIn Recommendation', 'Video Testimonial'] },
    { id: 'motion_graphics', category: 'craft', weight: { craft: 30, reliability: 0, impact: 5 }, platforms: ['Behance', 'LottieFiles', 'YouTube'] },
  ],
  developer: [
    { id: 'github_code', category: 'craft', weight: { craft: 35, reliability: 0, impact: 0 }, platforms: ['GitHub', 'GitLab', 'GitHub Gists'] },
    { id: 'live_website', category: 'craft', weight: { craft: 30, reliability: 15, impact: 15 }, platforms: ['Vercel', 'Netlify', 'GitHub Pages', 'Custom Domain'] },
    { id: 'portfolio_projects', category: 'craft', weight: { craft: 25, reliability: 10, impact: 15 }, platforms: ['Personal Website', 'Notion Portfolio'] },
    { id: 'case_studies', category: 'impact', weight: { craft: 20, reliability: 15, impact: 30 }, platforms: ['Personal Website', 'GitHub Readme'] },
    { id: 'code_walkthrough', category: 'craft', weight: { craft: 25, reliability: 10, impact: 5 }, platforms: ['Loom Video', 'YouTube Explainer'] },
    { id: 'open_source', category: 'craft', weight: { craft: 30, reliability: 10, impact: 5 }, platforms: ['GitHub pull requests', 'npm registry'] },
    { id: 'performance_metrics', category: 'impact', weight: { craft: 15, reliability: 5, impact: 30 }, platforms: ['Lighthouse Report', 'WebPageTest dashboard'] },
    { id: 'client_work', category: 'reliability', weight: { craft: 15, reliability: 30, impact: 15 }, platforms: ['Live Client URL', 'Vercel Preview'] },
    { id: 'technical_blog', category: 'impact', weight: { craft: 20, reliability: 5, impact: 15 }, platforms: ['Medium', 'Dev.to', 'Hashnode'] },
    { id: 'testimonials', category: 'reliability', weight: { craft: 5, reliability: 35, impact: 10 }, platforms: ['LinkedIn Recommendations', 'Clutch.co'] },
  ],
  designer: [
    { id: 'figma_portfolio', category: 'craft', weight: { craft: 35, reliability: 5, impact: 10 }, platforms: ['Figma Community', 'Live Figma File'] },
    { id: 'design_case_study', category: 'impact', weight: { craft: 25, reliability: 10, impact: 30 }, platforms: ['Behance', 'Personal Website', 'Medium'] },
    { id: 'design_system', category: 'craft', weight: { craft: 30, reliability: 15, impact: 10 }, platforms: ['Figma Library', 'Storybook'] },
    { id: 'interactive_prototype', category: 'craft', weight: { craft: 30, reliability: 10, impact: 10 }, platforms: ['Figma Share Link', 'Framer Link'] },
    { id: 'behance_dribbble', category: 'craft', weight: { craft: 25, reliability: 10, impact: 5 }, platforms: ['Behance Profile', 'Dribbble Shots'] },
    { id: 'user_flow', category: 'craft', weight: { craft: 20, reliability: 5, impact: 10 }, platforms: ['Miro', 'FigJam', 'Figma Canvas'] },
    { id: 'design_process', category: 'craft', weight: { craft: 25, reliability: 10, impact: 5 }, platforms: ['Notion Doc', 'Loom Walkthrough'] },
    { id: 'client_work', category: 'reliability', weight: { craft: 15, reliability: 30, impact: 15 }, platforms: ['Live Site designs', 'Behance client showcase'] },
    { id: 'testimonials', category: 'reliability', weight: { craft: 5, reliability: 35, impact: 10 }, platforms: ['LinkedIn Recommendations', 'Personal Website'] },
    { id: 'design_critique', category: 'craft', weight: { craft: 25, reliability: 15, impact: 10 }, platforms: ['Loom Video', 'YouTube Audit'] },
  ],
  automation: [
    { id: 'workflow_diagram', category: 'craft', weight: { craft: 25, reliability: 10, impact: 10 }, platforms: ['Miro', 'Lucidchart', 'Make.com Canvas'] },
    { id: 'live_automation', category: 'craft', weight: { craft: 35, reliability: 10, impact: 15 }, platforms: ['Loom Walkthrough', 'YouTube Demo'] },
    { id: 'case_studies', category: 'impact', weight: { craft: 20, reliability: 15, impact: 30 }, platforms: ['Personal Website', 'Notion Link'] },
    { id: 'metrics_results', category: 'impact', weight: { craft: 5, reliability: 10, impact: 35 }, platforms: ['Time Saved calculations spreadsheet', 'Analytics dashboard'] },
    { id: 'client_work', category: 'reliability', weight: { craft: 15, reliability: 30, impact: 15 }, platforms: ['Live system access', 'Loom walkthrough of setup'] },
    { id: 'automation_code', category: 'craft', weight: { craft: 30, reliability: 0, impact: 5 }, platforms: ['GitHub Repository', 'Google App Scripts'] },
    { id: 'process_walkthrough', category: 'craft', weight: { craft: 25, reliability: 10, impact: 5 }, platforms: ['Loom Walkthrough Video'] },
    { id: 'testimonials', category: 'reliability', weight: { craft: 5, reliability: 35, impact: 10 }, platforms: ['LinkedIn Recommendations', 'Clutch'] },
    { id: 'content', category: 'impact', weight: { craft: 15, reliability: 5, impact: 10 }, platforms: ['Medium automation guides', 'YouTube tutorials'] },
    { id: 'certificates', category: 'craft', weight: { craft: 15, reliability: 5, impact: 5 }, platforms: ['Zapier Certification', 'Make.com badge'] },
  ],
  other: [
    { id: 'landing_pages', category: 'craft', weight: { craft: 30, reliability: 10, impact: 20 }, platforms: ['Live Webpage Link', 'Figma File', 'Google Docs'] },
    { id: 'email_sequence', category: 'craft', weight: { craft: 30, reliability: 5, impact: 15 }, platforms: ['Notion Database', 'Google Doc', 'Substack Link'] },
    { id: 'sales_page', category: 'craft', weight: { craft: 30, reliability: 10, impact: 20 }, platforms: ['Live Sales Letter', 'Notion Link'] },
    { id: 'ad_copies', category: 'craft', weight: { craft: 25, reliability: 5, impact: 10 }, platforms: ['Google Drive Folder', 'Facebook Ads Library screenshot'] },
    { id: 'conversion_metrics', category: 'impact', weight: { craft: 5, reliability: 10, impact: 35 }, platforms: ['Stripe/GA screenshot', 'Client dashboard report'] },
    { id: 'testimonials', category: 'reliability', weight: { craft: 5, reliability: 35, impact: 10 }, platforms: ['LinkedIn Recommendations', 'Personal Website'] },
    { id: 'portfolio_projects', category: 'craft', weight: { craft: 25, reliability: 10, impact: 15 }, platforms: ['Notion Portfolio', 'Google Drive Folder'] },
    { id: 'case_studies', category: 'impact', weight: { craft: 20, reliability: 15, impact: 30 }, platforms: ['Personal Website', 'Medium Blog'] },
    { id: 'swipe_file', category: 'craft', weight: { craft: 20, reliability: 5, impact: 10 }, platforms: ['Notion Swipe Database', 'Google Drive'] },
    { id: 'content_samples', category: 'craft', weight: { craft: 20, reliability: 5, impact: 10 }, platforms: ['Medium Article', 'LinkedIn Posts'] },
  ]
};

// 2. MASTER DIRECTORY OF MISSING GAPS TEMPLATES BY TRACK
const GAPS_TEMPLATES: Record<string, Omit<CredibilityGapItem, 'label' | 'doubtSolved'>[]> = {
  editor: [
    { id: 'showreel', format: 'demo_video', platforms: ['YouTube', 'Vimeo', 'Frame.io'] },
    { id: 'before_after_edits', format: 'before_after', platforms: ['YouTube Shorts', 'Instagram Reels'] },
    { id: 'editing_breakdown', format: 'process_walkthrough', platforms: ['Loom Video', 'YouTube Explainer'] },
    { id: 'retention_results', format: 'data_report', platforms: ['YouTube Analytics dashboard', 'Case Study'] },
    { id: 'testimonials', format: 'testimonial_equivalent', platforms: ['Google Reviews', 'LinkedIn recommendation'] },
    { id: 'youtube_videos', format: 'demo_video', platforms: ['YouTube Project link'] },
    { id: 'instagram_reels', format: 'demo_video', platforms: ['Instagram Reels / TikTok'] }
  ],
  developer: [
    { id: 'github_code', format: 'demo_video', platforms: ['Clean GitHub Repo', 'Gists'] },
    { id: 'live_website', format: 'demo_video', platforms: ['Live URL on Vercel/Netlify'] },
    { id: 'case_studies', format: 'case_study', platforms: ['Technical Case Study Document'] },
    { id: 'code_walkthrough', format: 'process_walkthrough', platforms: ['Loom Video walkthrough'] },
    { id: 'performance_metrics', format: 'data_report', platforms: ['Lighthouse performance report'] },
    { id: 'testimonials', format: 'testimonial_equivalent', platforms: ['LinkedIn client quote', 'Clutch reviews'] },
    { id: 'technical_blog', format: 'educational_content', platforms: ['Technical Guide on Dev.to/Hashnode'] }
  ],
  designer: [
    { id: 'figma_portfolio', format: 'demo_video', platforms: ['Figma Community file', 'Shared Figma file'] },
    { id: 'design_case_study', format: 'case_study', platforms: ['Behance Showcase', 'UX Case Study'] },
    { id: 'interactive_prototype', format: 'before_after', platforms: ['Live Figma Prototype', 'Framer Link'] },
    { id: 'design_process', format: 'process_walkthrough', platforms: ['Notion Doc', 'Loom Process Walkthrough'] },
    { id: 'testimonials', format: 'testimonial_equivalent', platforms: ['LinkedIn recommendations', 'Client quotes'] },
    { id: 'behance_dribbble', format: 'case_study', platforms: ['Behance Case Study'] },
    { id: 'design_critique', format: 'comparison', platforms: ['Design Audit Loom Video'] }
  ],
  automation: [
    { id: 'live_automation', format: 'demo_video', platforms: ['Loom walkthrough video of active systems'] },
    { id: 'metrics_results', format: 'data_report', platforms: ['Spreadsheet summarizing hours/cost saved'] },
    { id: 'case_studies', format: 'case_study', platforms: ['Automation Case Study writeup'] },
    { id: 'workflow_diagram', format: 'process_walkthrough', platforms: ['Workflow Architecture diagram on Miro/FigJam'] },
    { id: 'testimonials', format: 'testimonial_equivalent', platforms: ['LinkedIn recommendations', 'Client feedback quote'] },
    { id: 'automation_code', format: 'demo_video', platforms: ['GitHub script repository'] },
    { id: 'process_walkthrough', format: 'process_walkthrough', platforms: ['Step-by-step Loom walkthrough'] }
  ],
  other: [
    { id: 'case_studies', format: 'case_study', platforms: ['Copywriting Case Study document'] },
    { id: 'conversion_metrics', format: 'data_report', platforms: ['Client conversion rate dashboard screenshot'] },
    { id: 'landing_pages', format: 'demo_video', platforms: ['Live landing page URL', 'Figma designs'] },
    { id: 'email_sequence', format: 'process_walkthrough', platforms: ['Notion shareable dashboard of email sequence'] },
    { id: 'testimonials', format: 'testimonial_equivalent', platforms: ['LinkedIn client review', 'Clutch quote'] },
    { id: 'swipe_file', format: 'educational_content', platforms: ['Notion Swipe Library public access link'] },
    { id: 'ad_copies', format: 'demo_video', platforms: ['Facebook Ads Library preview folder'] }
  ]
};

// 3. BASELINE COPYS FOR ASSETS BY ID (DYNAMIC COMPOSITION TEMPLATES)
const ASSETS_LABEL_TEMPLATE: Record<string, { label: string; doubtSolved: string; desc: string }> = {
  // Common / Developer / Designer / Editor ids
  showreel: {
    label: 'Showreel / Reel',
    doubtSolved: 'Dismantles doubt: "Do your edits have professional pacing and hook structures?"',
    desc: 'A short video compilation displaying your best edits, pacing choices, and visual hooks.'
  },
  portfolio_projects: {
    label: '[Service] Portfolio',
    doubtSolved: 'Dismantles doubt: "Can you deliver high-quality [Service] outcomes?"',
    desc: 'A structured gallery of completed [Service] projects highlighting your delivery capabilities.'
  },
  before_after_edits: {
    label: 'Before/After Edits Breakdown',
    doubtSolved: 'Dismantles doubt: "Does your editing style actually improve the raw footage?"',
    desc: 'A side-by-side video showing how you transform raw clips into engaging video cuts.'
  },
  youtube_videos: {
    label: 'YouTube Videos Portfolio',
    doubtSolved: 'Dismantles doubt: "Do you understand long-form pacing and narrative structure?"',
    desc: 'A collection of edited YouTube videos showing narrative progression and attention-retention pacing.'
  },
  instagram_reels: {
    label: 'Short-Form Clips Portfolio',
    doubtSolved: 'Dismantles doubt: "Can you grab attention in the first 3 seconds?"',
    desc: 'A library of edited Instagram Reels, TikToks, or YouTube Shorts showcasing retention hooks.'
  },
  client_work: {
    label: 'Client [Service] Projects',
    doubtSolved: 'Dismantles doubt: "Have you worked with commercial budgets and constraints?"',
    desc: 'Work delivered under commercial contracts for real brands, proving delivery reliability.'
  },
  editing_breakdown: {
    label: 'Editing Workflow Breakdown',
    doubtSolved: 'Dismantles doubt: "What is your actual project assembly process?"',
    desc: 'A walkthrough explaining your timeline structuring, asset storage, and sound design choices.'
  },
  retention_results: {
    label: 'Audience Retention Analytics',
    doubtSolved: 'Dismantles doubt: "Do your edits keep people watching, or do they drop off?"',
    desc: 'Real analytics data demonstrating retention curves and watch-time performance of your cuts.'
  },
  testimonials: {
    label: 'Client Testimonials',
    doubtSolved: 'Dismantles doubt: "Are you reliable to collaborate with on a daily basis?"',
    desc: 'Written or video endorsements from previous clients verifying your communication and reliability.'
  },
  motion_graphics: {
    label: 'Motion Graphics Samples',
    doubtSolved: 'Dismantles doubt: "Can you design custom visual elements and title slides?"',
    desc: 'A compilation of keyframes, lower-thirds, callouts, and customized kinetic typography.'
  },

  // Developer specific
  github_code: {
    label: 'GitHub Repositories',
    doubtSolved: 'Dismantles doubt: "Is your code clean, modular, and maintainable?"',
    desc: 'Public codebases showcasing code quality, folder structures, and developer documentation.'
  },
  live_website: {
    label: 'Live Web Applications',
    doubtSolved: 'Dismantles doubt: "Can you ship fully functional builds to production?"',
    desc: 'URLs of active web pages showing responsive design, interactive state, and API integrations.'
  },
  case_studies: {
    label: '[Service] Case Studies',
    doubtSolved: 'Dismantles doubt: "Can you own end-to-end execution of complex problems?"',
    desc: 'A deep-dive review documenting a business problem, your implementation path, and client results.'
  },
  code_walkthrough: {
    label: 'Code Walkthrough Video',
    doubtSolved: 'Dismantles doubt: "Do you understand the systems you write, or do you copy templates?"',
    desc: 'A video detailing how you architected a specific database, system state, or module.'
  },
  open_source: {
    label: 'Open Source Contributions',
    doubtSolved: 'Dismantles doubt: "Can you collaborate with other developers on larger codebases?"',
    desc: 'Merged pull requests in third-party libraries, verifying peer-reviewed engineering capability.'
  },
  performance_metrics: {
    label: 'Lighthouse Performance Reports',
    doubtSolved: 'Dismantles doubt: "Does your code scale efficiently, or is it slow in production?"',
    desc: 'Performance audits verifying fast load speeds, SEO optimization, and accessibility tags.'
  },
  technical_blog: {
    label: 'Technical Writeups & Blog',
    doubtSolved: 'Dismantles doubt: "Can you explain complex architectures to non-technical stakeholders?"',
    desc: 'Articles detailing how you solved technical roadblocks, proving structural system comprehension.'
  },

  // Designer specific
  figma_portfolio: {
    label: 'Figma Community Files',
    doubtSolved: 'Dismantles doubt: "Is your file structure organized for engineering handoffs?"',
    desc: 'Live Figma designs demonstrating neat Auto Layout setup, component variants, and layer names.'
  },
  design_case_study: {
    label: 'Design Process Case Study',
    doubtSolved: 'Dismantles doubt: "Do you design with purpose, or just make pretty layouts?"',
    desc: 'UX research case study documenting user research, wireframes, and high-fidelity mockups.'
  },
  design_system: {
    label: 'Custom Design Systems',
    doubtSolved: 'Dismantles doubt: "Can you build reusable component libraries at scale?"',
    desc: 'Tokens, typography scales, colors, and responsive components managed in Figma or Storybook.'
  },
  interactive_prototype: {
    label: 'Interactive High-Fidelity Prototypes',
    doubtSolved: 'Dismantles doubt: "Can you design realistic user flow transitions and micro-interactions?"',
    desc: 'A clickable interactive preview showing exact modal popups and navigation transitions.'
  },
  behance_dribbble: {
    label: 'Behance / Dribbble Showcases',
    doubtSolved: 'Dismantles doubt: "Are your design standards polished to modern UI benchmarks?"',
    desc: 'Visual case studies of mockup designs, showcasing graphic composition and visual polish.'
  },
  user_flow: {
    label: 'User Flows & Wireframes',
    doubtSolved: 'Dismantles doubt: "Can you map out complex application logic before designing layouts?"',
    desc: 'UX diagrams showing user decision steps, path splits, and structural page layouts.'
  },
  design_process: {
    label: 'Design Direction Breakdown',
    doubtSolved: 'Dismantles doubt: "What is your core creative and conceptual layout direction?"',
    desc: 'A breakdown explaining design briefs, moodboards, font selections, and color palettes.'
  },
  design_critique: {
    label: 'Redesign / Design Audit Showcase',
    doubtSolved: 'Dismantles doubt: "Can you identify and correct existing layout issues in real-time?"',
    desc: 'A video audit analyzing an existing live application, pointing out usability and UI flaws.'
  },

  // Automation specific
  workflow_diagram: {
    label: 'Workflow Architecture Diagrams',
    doubtSolved: 'Dismantles doubt: "Can you design complex data synchronization patterns?"',
    desc: 'A flowchart showing Webhook triggers, router pathways, API maps, and failure handlers.'
  },
  live_automation: {
    label: 'Active System Demos',
    doubtSolved: 'Dismantles doubt: "Do your automations run reliably without breaking?"',
    desc: 'A video demo showing dynamic data syncing from triggers to outputs in real-time.'
  },
  metrics_results: {
    label: 'System Efficiency Reports',
    doubtSolved: 'Dismantles doubt: "Do your automations save real time and reduce manual work?"',
    desc: 'quantifiable data documenting operations speed improvements and administrative hours saved.'
  },
  automation_code: {
    label: 'Automation Scripts & Code',
    doubtSolved: 'Dismantles doubt: "Can you write custom logic when platform integrations are lacking?"',
    desc: 'Custom scripts (Python/JavaScript) that expand basic Make/Zapier limits.'
  },
  process_walkthrough: {
    label: 'System Setup Walkthrough',
    doubtSolved: 'Dismantles doubt: "How do you map and document custom business integrations?"',
    desc: 'A recording showing exactly how you configure data pathways and map complex APIs.'
  },
  certificates: {
    label: 'Platform Accreditations',
    doubtSolved: 'Dismantles doubt: "Are you formally certified on operations tools?"',
    desc: 'Formal certifications verifying advanced workflow engineering on Make, Zapier, or Hubspot.'
  },

  // Copywriter specific
  landing_pages: {
    label: 'Landing Page Copy Samples',
    doubtSolved: 'Dismantles doubt: "Can you write high-converting landing page layouts?"',
    desc: 'Copywriting samples for landing pages, detailing headlines, hooks, and call-to-actions.'
  },
  email_sequence: {
    label: 'Email Campaign Sequences',
    doubtSolved: 'Dismantles doubt: "Can you write automated campaigns that maintain open rates?"',
    desc: 'Onboarding, nurture, and sales campaign copy demonstrating copywriting sequencing.'
  },
  sales_page: {
    label: 'Long-Form Sales Letters',
    doubtSolved: 'Dismantles doubt: "Can you build desire and close deals using pure copy?"',
    desc: 'Long-form sales letters containing objection preemptions and value framing.'
  },
  ad_copies: {
    label: 'Paid Advertising Copy',
    doubtSolved: 'Dismantles doubt: "Can you write direct-response copies that drive click-throughs?"',
    desc: 'Short-form social media ad copies showing hook, story, and offer structures.'
  },
  conversion_metrics: {
    label: 'Conversion Results Dashboard',
    doubtSolved: 'Dismantles doubt: "Does your writing actually convert, or just read well?"',
    desc: 'A dashboard showing opt-in rates, CTRs, and client revenue shifts driven by your copy.'
  },
  swipe_file: {
    label: 'Personal Swipe File Analyses',
    doubtSolved: 'Dismantles doubt: "Do you study copywriting frameworks, or just write randomly?"',
    desc: 'A collection of successful historical campaigns analyzed to showcase copywriting theory.'
  },
  content_samples: {
    label: 'Content Writing Showcase',
    doubtSolved: 'Dismantles doubt: "Can you write authoritative blog posts and articles?"',
    desc: 'Articles and content samples that demonstrate brand tone preservation and SEO structure.'
  }
};

const GAPS_LABEL_TEMPLATE: Record<string, { label: string; doubtSolved: string }> = {
  case_studies: { label: 'UX/Technical Case Study', doubtSolved: 'Fills gap: Documents problem -> approach -> results.' },
  video_demo: { label: 'Live Video Walkthrough', doubtSolved: 'Fills gap: Visually proves your craft on a screen.' },
  before_after: { label: 'Before/After Results', doubtSolved: 'Fills gap: Displays immediate contrast of value.' },
  testimonials: { label: 'Client Testimonial', doubtSolved: 'Fills gap: Neutralizes daily collaboration and delivery risks.' },
  metrics: { label: 'ROI/Data Report', doubtSolved: 'Fills gap: Proves measurable business outcome impact.' },
  portfolio: { label: '[Service] Showcase', doubtSolved: 'Fills gap: Proves consistent execution process.' },
  reviews: { label: 'Peer/Market Reviews', doubtSolved: 'Fills gap: Confirms marketplace acceptance.' },
  github_code: { label: 'Clean GitHub Repo', doubtSolved: 'Fills gap: Proves modular engineering code structure.' },
  live_website: { label: 'Live Deploy Demo', doubtSolved: 'Fills gap: Verifies active build capability.' },
  technical_blog: { label: 'Technical Guide', doubtSolved: 'Fills gap: Showcases system architecture expertise.' },
  figma_portfolio: { label: 'Figma Community File', doubtSolved: 'Fills gap: Showcases clean file architecture.' },
  interactive_prototype: { label: 'Interactive Prototype', doubtSolved: 'Fills gap: Displays micro-interactions.' },
  design_process: { label: 'Design Process Guide', doubtSolved: 'Fills gap: Explains conceptual design thinking.' },
  behance_dribbble: { label: 'Behance Case Study', doubtSolved: 'Fills gap: Showcases layout composition.' },
  design_critique: { label: 'Design Audit Video', doubtSolved: 'Fills gap: Highlights structural layout flaws.' },
  live_automation: { label: 'Workflow Walkthrough', doubtSolved: 'Fills gap: Demonstrates active system setups.' },
  workflow_diagram: { label: 'System Architecture Chart', doubtSolved: 'Fills gap: Shows integration flow map.' },
  automation_code: { label: 'Custom Code Script', doubtSolved: 'Fills gap: Showcases advanced scripting limits.' },
  process_walkthrough: { label: 'Integration Setup Loom', doubtSolved: 'Fills gap: Explains custom API configurations.' },
  landing_pages: { label: 'Landing Page Copy', doubtSolved: 'Fills gap: Shows conversion copywriting.' },
  email_sequence: { label: 'Nurture Email Sequence', doubtSolved: 'Fills gap: Shows campaign copy flow.' },
  swipe_file: { label: 'Swipe Analysis Guide', doubtSolved: 'Fills gap: Demonstrates copy frameworks.' },
  ad_copies: { label: 'Ad Copy Portfolio', doubtSolved: 'Fills gap: Proves direct-response hooks.' }
};

// 4. DYNAMIC RULES COMPILING ENGINE
export interface CredibilityEvaluation {
  scores: TrustScore;
  recommendedAvailable: string[];
  recoBadgeText: Record<string, string>;
  gapPriorities: { id: string; rank: number; reason: string; label: string; format: string; platforms: string[] }[];
  summaryNarrative: string;
  availableList: CredibilityAssetItem[];
  gapsList: CredibilityGapItem[];
}

export function evaluateCredibilityProfile(
  selectedAvailable: string[],
  selectedStrongest: string | null,
  selectedGaps: string[],
  ctx: {
    serviceId: string | null;
    marketId: string | null;
    nicheId: string | null;
    positioning: string;
    offerType: string | null;
    authorityPosition: AuthorityPosition | null;
  }
): CredibilityEvaluation {
  const serviceClass = classifyService(ctx.serviceId);
  let track = serviceClass.family; // 'developer', 'designer', etc.

  // Detect copywriting/marketing services which land in 'other' but require copywriter taxonomy
  const serviceStr = ctx.serviceId?.toLowerCase() ?? '';
  if (track === 'other' && (serviceStr.includes('copy') || serviceStr.includes('market') || serviceStr.includes('writing') || serviceStr.includes('content'))) {
    track = 'other'; // maps to copywriting templates under 'other'
  }

  // Fallback to developer if track is other and service seems tech-like
  if (track === 'other' && (serviceStr.includes('code') || serviceStr.includes('dev') || serviceStr.includes('api'))) {
    track = 'developer';
  }

  // 1. Resolve Available Assets Taxonomy List
  const templates = AVAILABLE_TEMPLATES[track] || AVAILABLE_TEMPLATES.other;
  const serviceLabel = serviceClass.label;
  const marketLabel = ctx.marketId ? ctx.marketId.replace(/_/g, ' ') : 'target market';

  const availableList: CredibilityAssetItem[] = templates.map((tmpl) => {
    // Composition Rules: Interpolate service label, market label, etc.
    const baseline = ASSETS_LABEL_TEMPLATE[tmpl.id] || {
      label: tmpl.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      doubtSolved: 'Dismantles doubt: "Are you qualified?"',
      desc: 'Proof demonstrating your expertise.'
    };

    let label = baseline.label
      .replace(/\[Service\]/g, serviceLabel)
      .replace(/\[Market\]/g, marketLabel);

    let description = baseline.desc
      .replace(/\[Service\]/g, serviceLabel)
      .replace(/\[Market\]/g, marketLabel);

    // YouTube-editor specific adjustments
    if (ctx.serviceId === 'youtube_editor') {
      if (tmpl.id === 'showreel') {
        label = 'YouTube Video Showreel';
        description = 'A video showcase of your best YouTube pacing, retention loops, and graphic hooks.';
      }
    }
    // Short-form editor specific adjustments
    if (ctx.serviceId === 'short_form_editor') {
      if (tmpl.id === 'showreel') {
        label = 'TikTok / Reels Compilation';
        description = 'A fast-paced portfolio demonstrating hook grabs and visual captions.';
      }
    }
    // WordPress Developer specific adjustments
    if (ctx.serviceId === 'wordpress_developer') {
      if (tmpl.id === 'live_website') {
        label = 'Live WordPress Builds';
        description = 'Active WordPress sites verifying custom templates, Elementor layouts, or theme code.';
      }
    }
    // Shopify Developer specific adjustments
    if (ctx.serviceId === 'shopify_developer' || serviceStr.includes('shopify')) {
      if (tmpl.id === 'live_website') {
        label = 'Live Shopify Stores';
        description = 'Active e-commerce storefronts demonstrating checkout configurations and layouts.';
      }
    }

    return {
      id: tmpl.id,
      label,
      description,
      doubtSolved: baseline.doubtSolved,
      platforms: tmpl.platforms,
      category: tmpl.category,
      weight: CREDIBILITY_RULES.baseWeights[tmpl.id] || { craft: 10, reliability: 10, impact: 10 }
    };
  });

  // 2. Resolve Missing Assets (Gaps) Taxonomy List
  const gapsTmpls = GAPS_TEMPLATES[track] || GAPS_TEMPLATES.other;
  const gapsList: CredibilityGapItem[] = gapsTmpls.map((tmpl) => {
    const baseline = GAPS_LABEL_TEMPLATE[tmpl.id] || {
      label: tmpl.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      doubtSolved: 'Fills gap: Proves credibility.'
    };

    const label = baseline.label.replace(/\[Service\]/g, serviceLabel);

    return {
      id: tmpl.id,
      label,
      doubtSolved: baseline.doubtSolved,
      platforms: tmpl.platforms,
      format: tmpl.format
    };
  });

  // 3. Calculate Scores
  let craft = 0;
  let reliability = 0;
  let impact = 0;

  selectedAvailable.forEach((assetId) => {
    const base = CREDIBILITY_RULES.baseWeights[assetId];
    if (!base) return;

    let cWeight = base.craft;
    let rWeight = base.reliability;
    let iWeight = base.impact;

    // Track Modifier overrides
    const trackMods = CREDIBILITY_RULES.trackModifiers[track];
    if (trackMods && trackMods[assetId] !== undefined) {
      cWeight = trackMods[assetId];
    }

    craft += cWeight;
    reliability += rWeight;
    impact += iWeight;
  });

  // Apply Market Modifiers
  if (ctx.marketId && CREDIBILITY_RULES.marketModifiers[ctx.marketId]) {
    const marketMod = CREDIBILITY_RULES.marketModifiers[ctx.marketId];
    if (marketMod.craft) craft *= marketMod.craft;
    if (marketMod.reliability) reliability *= marketMod.reliability;
    if (marketMod.impact) impact *= marketMod.impact;
  }

  // Apply Offer Modifiers
  if (ctx.offerType && CREDIBILITY_RULES.offerModifiers[ctx.offerType]) {
    const offerMod = CREDIBILITY_RULES.offerModifiers[ctx.offerType];
    if (offerMod.craft) craft *= offerMod.craft;
    if (offerMod.reliability) reliability *= offerMod.reliability;
    if (offerMod.impact) impact *= offerMod.impact;
  }

  const scores: TrustScore = {
    craft: Math.min(100, Math.round(craft)),
    reliability: Math.min(100, Math.round(reliability)),
    impact: Math.min(100, Math.round(impact)),
  };

  // 4. Generate Recommendations & Transparency Badges
  const recommendedAvailable: string[] = [];
  const recoBadgeText: Record<string, string> = {};

  if (track === 'developer') {
    recommendedAvailable.push('github_code', 'live_website');
    recoBadgeText['github_code'] = '✨ Highly recommended: Indispensable for proving developer clean-code standards.';
    recoBadgeText['live_website'] = '✨ Recommended: Best for demonstrating active production builds.';
  } else if (track === 'designer') {
    recommendedAvailable.push('figma_portfolio', 'design_case_study');
    recoBadgeText['figma_portfolio'] = '✨ Highly recommended: Crucial for demonstrating Figma Auto Layout and design files.';
    recoBadgeText['design_case_study'] = '✨ Recommended: Best for showing custom design-thinking execution.';
  } else if (track === 'editor') {
    recommendedAvailable.push('showreel', 'before_after_edits');
    recoBadgeText['showreel'] = '✨ Highly recommended: Vital to demonstrate pacing, hooks, and cuts.';
    recoBadgeText['before_after_edits'] = '✨ Recommended: Proves real editing transformation from raw clips.';
  } else if (track === 'automation') {
    recommendedAvailable.push('live_automation', 'workflow_diagram');
    recoBadgeText['live_automation'] = '✨ Highly recommended: Crucial for verifying custom API configurations.';
    recoBadgeText['workflow_diagram'] = '✨ Recommended: Best for showing structural logic designs.';
  } else {
    recommendedAvailable.push('landing_pages', 'conversion_metrics');
    recoBadgeText['landing_pages'] = '✨ Highly recommended: Best for proving copywriting hooks and layout styles.';
    recoBadgeText['conversion_metrics'] = '✨ Recommended: Vital for validating direct-response performance.';
  }

  if (ctx.offerType === 'retainer') {
    recommendedAvailable.push('testimonials', 'client_work');
    recoBadgeText['testimonials'] = '✨ Recommended: Key to proof of communication & reliability on retainers.';
    recoBadgeText['client_work'] = '✨ Recommended: Verifies you have sustained real-world commercial relationships.';
  }

  if (ctx.marketId && (ctx.marketId.includes('saas') || ctx.marketId.includes('startup'))) {
    recommendedAvailable.push('metrics_results', 'conversion_metrics', 'performance_metrics');
    if (recoBadgeText['metrics_results'] === undefined) {
      recoBadgeText['metrics_results'] = '✨ Highly recommended: Startups are hyper-focused on quantifiable ROI.';
    }
    if (recoBadgeText['conversion_metrics'] === undefined) {
      recoBadgeText['conversion_metrics'] = '✨ Highly recommended: SaaS buyers demand metric validation.';
    }
  } else if (ctx.marketId === 'local_businesses') {
    recommendedAvailable.push('testimonials');
    recoBadgeText['testimonials'] = '✨ Highly recommended: Local owners buy based on local peer verification.';
  }

  const uniqRecommendations = Array.from(new Set(recommendedAvailable));

  // 5. Gap Prioritization & Backfilling Logic
  let finalGaps = [...selectedGaps];
  if (finalGaps.length < 3) {
    let priorityPool: string[] = [];
    if (track === 'developer' || ctx.authorityPosition === 'builder') {
      priorityPool = ['live_website', 'github_code', 'case_studies', 'code_walkthrough', 'performance_metrics', 'testimonials'];
    } else if (ctx.authorityPosition === 'auditor') {
      priorityPool = ['metrics', 'case_studies', 'reviews', 'video_demo', 'portfolio', 'before_after', 'testimonials'];
    } else if (track === 'designer') {
      priorityPool = ['interactive_prototype', 'design_case_study', 'figma_portfolio', 'design_process', 'testimonials'];
    } else if (track === 'editor') {
      priorityPool = ['showreel', 'before_after_edits', 'editing_breakdown', 'retention_results', 'testimonials'];
    } else {
      priorityPool = ['conversion_metrics', 'case_studies', 'landing_pages', 'email_sequence', 'testimonials'];
    }

    for (const recommended of priorityPool) {
      if (finalGaps.length >= 3) break;
      if (!finalGaps.includes(recommended)) {
        finalGaps.push(recommended);
      }
    }
  }

  const targetGaps = finalGaps.slice(0, 3);

  const gapPrioritiesList = targetGaps.map((gapId) => {
    const meta = gapsList.find((g) => g.id === gapId);
    let rank = 3;
    let reason = 'Provides supporting social/contextual validation.';

    if (gapId === 'metrics' || gapId === 'conversion_metrics' || gapId === 'case_studies' || gapId === 'design_case_study') {
      if (scores.impact < scores.craft && scores.impact < scores.reliability) {
        rank = 1;
        reason = `Priority 1: ${marketLabel} buyers are highly metric-driven. Proving results is your highest-leverage asset.`;
      } else {
        rank = 2;
        reason = 'Priority 2: Necessary for demonstrating business ROI.';
      }
    } else if (gapId === 'video_demo' || gapId === 'live_website' || gapId === 'figma_portfolio' || gapId === 'showreel' || gapId === 'live_automation') {
      if (scores.craft < scores.reliability) {
        rank = 1;
        reason = 'Priority 1: Reconciles core execution risk. Clients need visual proof of your craft first.';
      } else {
        rank = 2;
        reason = 'Priority 2: Important for showcasing execution consistency.';
      }
    } else if (gapId === 'testimonials' || gapId === 'reviews') {
      if (ctx.offerType === 'retainer') {
        rank = 1;
        reason = 'Priority 1: Retainer offers carry high churn risk. Testimonials reduce relationship anxiety.';
      } else {
        rank = 3;
        reason = 'Priority 3: Adds relationship credibility once capability is proven.';
      }
    }

    return {
      id: gapId,
      label: meta?.label ?? gapId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      format: meta?.format ?? 'case_study',
      platforms: meta?.platforms ?? ['Notion', 'Google Drive'],
      rank,
      reason,
    };
  });

  const gapPriorities = gapPrioritiesList.sort((a, b) => a.rank - b.rank);

  // 6. Generate Composable Narrative Summary
  const positionLabel = ctx.authorityPosition
    ? ctx.authorityPosition.charAt(0).toUpperCase() + ctx.authorityPosition.slice(1)
    : 'Professional';
  const strongestMeta = availableList.find((a) => a.id === selectedStrongest);
  const strongestLabel = strongestMeta ? strongestMeta.label : 'your experience';
  const strongestPlats = strongestMeta ? strongestMeta.platforms.join(' or ') : 'your channels';

  let firstGapLabel = gapPriorities[0]?.label ?? 'credibility assets';
  let firstGapPlats = gapPriorities[0] ? gapPriorities[0].platforms.join(' or ') : 'online platforms';
  let firstGapReason = gapPriorities[0]
    ? gapPriorities[0].reason.replace(/^Priority \d: /, '').toLowerCase()
    : 'build foundational trust';

  let archetype = 'The Cold-Start Specialist';
  let detailDesc = 'leveraging strong technical capabilities while systematically building market validation';

  if (scores.reliability > 50 && scores.craft > 50 && scores.impact > 50) {
    archetype = 'The Results-First Partner';
    detailDesc = 'presenting an established profile with balanced craft and client outcomes';
  } else if (scores.reliability > 60 && scores.craft < 40) {
    archetype = 'The Industry Veteran';
    detailDesc = 'anchoring on deep commercial relationship credentials and building fresh technical case studies';
  } else if (scores.impact > 60 && scores.reliability < 30) {
    archetype = 'The ROI Catalyst';
    detailDesc = 'leveraging hard numbers and metrics to bypass the lack of client testimonials';
  }

  const summaryNarrative = `### Profile Archetype: ${archetype}
Your credibility profile is characterized as **${archetype}**, ${detailDesc}.

*   **Context Alignment:** As an **${positionLabel}** selling **${serviceLabel}** to **${marketLabel}**, your buyer is looking to de-risk their hiring decisions.
*   **Anchor Stance:** You will anchor your credibility on **${strongestLabel}** (hosted on **${strongestPlats}**), using it as your primary leverage point in sales conversations.
*   **Gap Blueprint:** Your #1 priority is to build a **${firstGapLabel}** (published on **${firstGapPlats}**). This is critical because it ${firstGapReason}. Once compiled, this will directly neutralize your primary vulnerability.`;

  return {
    scores,
    recommendedAvailable: uniqRecommendations,
    recoBadgeText,
    gapPriorities,
    summaryNarrative,
    availableList,
    gapsList
  };
}
