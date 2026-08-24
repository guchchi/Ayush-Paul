/**
 * Comprehensive Launch and Verification Checklists for Authority Channels
 * Used in Module 3 Platform Studio and Deployment Verification.
 */

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'visual' | 'copy' | 'link' | 'seo';
  recommended: boolean;
}

export const PLATFORM_LAUNCH_CHECKLISTS: Record<string, ChecklistItem[]> = {
  linkedin: [
    { id: 'li_banner', label: 'Banner matches headline visual tone & branding', category: 'visual', recommended: true },
    { id: 'li_featured', label: 'Featured section links directly to case study or scheduler', category: 'link', recommended: true },
    { id: 'li_cta', label: 'Custom CTA button enabled ("Book appointment" / "View portfolio")', category: 'link', recommended: true },
    { id: 'li_services', label: 'Set "Open to Providing Services" with defined deliverables', category: 'copy', recommended: true },
    { id: 'li_about', label: 'About summary highlights Unique Mechanism & ROI metrics', category: 'copy', recommended: false },
  ],
  twitter: [
    { id: 'x_proof_thread', label: 'Pinned high-status proof breakdown thread', category: 'copy', recommended: true },
    { id: 'x_booking_link', label: 'Single dedicated conversion booking link in bio', category: 'link', recommended: true },
    { id: 'x_avatar', label: 'High-contrast professional profile avatar', category: 'visual', recommended: true },
    { id: 'x_header', label: 'Header banner displays clear value proposition', category: 'visual', recommended: false },
  ],
  github: [
    { id: 'gh_readme', label: 'Special profile README.md configured with project showcase', category: 'copy', recommended: true },
    { id: 'gh_pinned', label: 'Top 4 pinned repositories reflect core technical expertise', category: 'visual', recommended: true },
    { id: 'gh_sponsor', label: 'Sponsor / Hire Me link active with business contact', category: 'link', recommended: true },
    { id: 'gh_contributions', label: 'Public contribution graph green and active', category: 'visual', recommended: false },
  ],
  youtube: [
    { id: 'yt_banner', label: 'Channel banner with clear posting cadence & UVP', category: 'visual', recommended: true },
    { id: 'yt_watermark', label: 'Branded subscribe watermark added to all videos', category: 'visual', recommended: true },
    { id: 'yt_about', label: 'About section matches cross-platform positioning statement', category: 'copy', recommended: true },
    { id: 'yt_trailer', label: 'Channel trailer introduces core problem you solve', category: 'copy', recommended: false },
  ],
  instagram: [
    { id: 'ig_linktree', label: 'Link-in-bio hub with direct client funnel links', category: 'link', recommended: true },
    { id: 'ig_highlights', label: 'Story highlights organized by case studies, testimonials & services', category: 'visual', recommended: true },
    { id: 'ig_contact', label: 'Action buttons (Email, Book) enabled on professional account', category: 'link', recommended: true },
    { id: 'ig_grid', label: 'Top 3 pinned grid posts reflect core authority pillars', category: 'visual', recommended: false },
  ],
  personal_site: [
    { id: 'site_favicon', label: 'Brand favicon and OpenGraph social preview images configured', category: 'seo', recommended: true },
    { id: 'site_hero', label: 'Above-the-fold hero copy immediately conveys value proposition', category: 'copy', recommended: true },
    { id: 'site_booking', label: 'Integrated calendar booking widget with confirmation redirect', category: 'link', recommended: true },
    { id: 'site_speed', label: 'Core Web Vitals optimized (under 1.5s load time)', category: 'seo', recommended: false },
  ],
  behance: [
    { id: 'be_categorized', label: 'Case study projects categorized by industry problem solved', category: 'visual', recommended: true },
    { id: 'be_hireable', label: '"Available for freelance / full-time" status badge active', category: 'copy', recommended: true },
    { id: 'be_custom_url', label: 'Custom vanity URL claimed for professional consistency', category: 'link', recommended: true },
  ],
  figma: [
    { id: 'fig_community', label: 'Community profile has published UI kits or design systems', category: 'visual', recommended: true },
    { id: 'fig_bio', label: 'Bio links to portfolio and design methodology', category: 'copy', recommended: true },
  ],
  dribbble: [
    { id: 'dr_pro', label: 'Pro badge and portfolio showcase active', category: 'visual', recommended: true },
    { id: 'dr_hire_button', label: 'Instant message for hire enabled', category: 'link', recommended: true },
  ],
  technical_blog: [
    { id: 'blog_subdomain', label: 'Custom domain or branded newsletter publication set up', category: 'link', recommended: true },
    { id: 'blog_pinned_post', label: 'Foundational architectural essay pinned at top', category: 'copy', recommended: true },
    { id: 'blog_optin', label: 'Email newsletter opt-in widget above the fold', category: 'link', recommended: true },
  ],
  producthunt: [
    { id: 'ph_maker_badge', label: 'Maker profile verified with list of shipped products', category: 'copy', recommended: true },
    { id: 'ph_social_links', label: 'Connected X, LinkedIn, and GitHub accounts', category: 'link', recommended: true },
  ],
  tiktok: [
    { id: 'tt_bio_link', label: 'Business account enabled with website bio link', category: 'link', recommended: true },
    { id: 'tt_pinned_videos', label: '3 pinned videos addressing high-intent client inquiries', category: 'visual', recommended: true },
  ],
  vimeo_behance: [
    { id: 'vim_showreel', label: '60-second high-energy showreel on homepage', category: 'visual', recommended: true },
    { id: 'vim_custom_domain', label: 'Custom portfolio player configured without distractions', category: 'link', recommended: true },
  ],
};

export function getChecklistForPlatform(platformKey: string): ChecklistItem[] {
  return PLATFORM_LAUNCH_CHECKLISTS[platformKey] || [
    { id: `${platformKey}_bio`, label: 'Profile bio and headline updated with new authority copy', category: 'copy', recommended: true },
    { id: `${platformKey}_link`, label: 'Conversion link verified and functional', category: 'link', recommended: true },
  ];
}
