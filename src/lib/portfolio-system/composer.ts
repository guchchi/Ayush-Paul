import type {
  UpstreamContext, PortfolioDirection, PortfolioGoal,
  PlatformRecommendation, PortfolioDestination,
  PortfolioSectionSpec, ProjectPlacement, ProjectRole,
  ProjectPresentationSpec, EvidencePlacement,
  PortfolioCopyArchitecture, CTAArchitecture,
  PortfolioBuildPack, Module5BridgeContext,
  ChecklistItem, NextAction,
} from '../../types/portfolio-system';

/* ──────────────────────────────────────────────
   SERVICE PRIMITIVES — 15 services
   ────────────────────────────────────────────── */

interface ServicePrimitives {
  medium: string[];
  destinationPrefs: PortfolioDestination[];
  sectionPrimitives: { id: string; heading: string; purpose: string; buyerQuestion: string }[];
  presentationSequence: string[];
  evidencePrimitives: { type: string; label: string }[];
  openingMedia: string;
  buyerTrustConcerns: string[];
  ctaTendency: string;
  mistakes: string[];
}

const SERVICE_PRIMITIVES: Record<string, ServicePrimitives> = {
  video_editor: {
    medium: ['video_embed', 'clip_comparison', 'social_showcase'],
    destinationPrefs: ['personal_site', 'social_native_showcase'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Video Portfolio', purpose: 'Introduce editing style and service', buyerQuestion: 'Can this editor make my content better?' },
      { id: 'selected_work', heading: 'Selected Edits', purpose: 'Showcase best clip samples', buyerQuestion: 'What does their finished work look like?' },
      { id: 'process', heading: 'My Editing Process', purpose: 'Explain how raw footage becomes finished clips', buyerQuestion: 'How do they work?' },
    ],
    presentationSequence: ['raw_clip', 'hook_breakdown', 'edited_clip', 'retention_note'],
    evidencePrimitives: [
      { type: 'side_by_side', label: 'Before/after comparison' },
      { type: 'retention_note', label: 'Pacing and retention notes' },
      { type: 'clip_embed', label: 'Finished clip embed' },
    ],
    openingMedia: 'clip_embed',
    buyerTrustConcerns: ['Can they match my content style?', 'Will clips retain viewers?'],
    ctaTendency: 'review_style',
    mistakes: ['No before/after comparison', 'Generic clips without context'],
  },
  short_form_editor: {
    medium: ['clip_showcase', 'hook_gallery', 'social_embed'],
    destinationPrefs: ['social_native_showcase', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Short-Form Portfolio', purpose: 'Show hook-driven editing style', buyerQuestion: 'Can they make content that stops the scroll?' },
      { id: 'hook_gallery', heading: 'Hook Examples', purpose: 'Show first 3 seconds of best clips', buyerQuestion: 'Do their hooks actually work?' },
      { id: 'metrics', heading: 'Engagement Context', purpose: 'Show how editing affects retention', buyerQuestion: 'Does their editing drive results?' },
    ],
    presentationSequence: ['hook_card', 'full_clip', 'engagement_context'],
    evidencePrimitives: [
      { type: 'hook_card', label: 'Hook breakdown card' },
      { type: 'clip_embed', label: 'Full clip' },
      { type: 'engagement_note', label: 'Engagement context' },
    ],
    openingMedia: 'hook_card',
    buyerTrustConcerns: ['Can they hook viewers in 3 seconds?', 'Do they understand platform trends?'],
    ctaTendency: 'review_hooks',
    mistakes: ['Clips without hook analysis', 'No platform-specific formatting'],
  },
  youtube_editor: {
    medium: ['long_form_showcase', 'retention_graph', 'timeline_demo'],
    destinationPrefs: ['personal_site', 'video_walkthrough'],
    sectionPrimitives: [
      { id: 'hero', heading: 'YouTube Editing Portfolio', purpose: 'Show retention-focused editing', buyerQuestion: 'Can they improve my watch time?' },
      { id: 'retention_work', heading: 'Retention Improvements', purpose: 'Show before/after retention impact', buyerQuestion: 'How do they keep viewers watching?' },
      { id: 'process', heading: 'Editing Workflow', purpose: 'Explain long-form editing approach', buyerQuestion: 'How do they handle long-form content?' },
    ],
    presentationSequence: ['original_timeline', 'edited_timeline', 'retention_comparison', 'finished_video'],
    evidencePrimitives: [
      { type: 'timeline_comparison', label: 'Before/after timeline' },
      { type: 'retention_graph', label: 'Retention graph comparison' },
      { type: 'video_embed', label: 'Finished video' },
    ],
    openingMedia: 'retention_graph',
    buyerTrustConcerns: ['Can they improve retention?', 'Do they understand YouTube pacing?'],
    ctaTendency: 'review_retention',
    mistakes: ['No retention evidence', 'Ignoring audience retention as a metric'],
  },
  podcast_clip_editor: {
    medium: ['clip_showcase', 'episode_map', 'moment_highlight'],
    destinationPrefs: ['personal_site', 'social_native_showcase'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Podcast Clip Portfolio', purpose: 'Show moment-selection editing', buyerQuestion: 'Can they find the best moments in my episodes?' },
      { id: 'clip_gallery', heading: 'Featured Clips', purpose: 'Showcase best podcast clips', buyerQuestion: 'Do their clips drive listens?' },
      { id: 'process', heading: 'My Clip Selection Process', purpose: 'Explain how moments are chosen and edited', buyerQuestion: 'How do they decide what to clip?' },
    ],
    presentationSequence: ['original_moment', 'clip_edit', 'context_note'],
    evidencePrimitives: [
      { type: 'moment_map', label: 'Episode moment map' },
      { type: 'clip_embed', label: 'Edited clip' },
      { type: 'context_card', label: 'Moment context explanation' },
    ],
    openingMedia: 'clip_embed',
    buyerTrustConcerns: ['Can they find the right moments?', 'Will clips represent my podcast well?'],
    ctaTendency: 'review_clip_selection',
    mistakes: ['Clips without episode context', 'No explanation of moment selection'],
  },
  ad_creative_editor: {
    medium: ['ad_showcase', 'split_test_gallery', 'performance_dashboard'],
    destinationPrefs: ['personal_site', 'document_case_study'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Ad Creative Portfolio', purpose: 'Show conversion-focused editing', buyerQuestion: 'Can they make ads that convert?' },
      { id: 'ad_showcase', heading: 'Ad Variations', purpose: 'Show ad versions with split test context', buyerQuestion: 'Can they produce multiple effective variations?' },
      { id: 'cta_focus', heading: 'CTA & Conversion Focus', purpose: 'Show how CTAs are integrated into creative', buyerQuestion: 'Do they understand direct-response video?' },
    ],
    presentationSequence: ['ad_variant', 'structure_breakdown', 'cta_placement'],
    evidencePrimitives: [
      { type: 'ad_still', label: 'Ad thumbnail/still' },
      { type: 'structure_card', label: 'Ad structure breakdown' },
      { type: 'cta_annotation', label: 'CTA placement annotation' },
    ],
    openingMedia: 'ad_still',
    buyerTrustConcerns: ['Do they understand ad conversion?', 'Can they produce multiple variations?'],
    ctaTendency: 'review_ad_creative',
    mistakes: ['No ad structure breakdowns', 'Single creative without context'],
  },
  wordpress_developer: {
    medium: ['live_site', 'build_case_study', 'performance_report'],
    destinationPrefs: ['personal_site', 'document_case_study'],
    sectionPrimitives: [
      { id: 'hero', heading: 'WordPress Development Portfolio', purpose: 'Show live site builds and case studies', buyerQuestion: 'Can they build the site I need?' },
      { id: 'live_projects', heading: 'Live Sites', purpose: 'Showcase completed WordPress sites', buyerQuestion: 'What have they built?' },
      { id: 'process', heading: 'Build Process', purpose: 'Explain development workflow', buyerQuestion: 'How do they build and deliver?' },
    ],
    presentationSequence: ['live_url', 'build_process', 'performance_evidence', 'handoff_note'],
    evidencePrimitives: [
      { type: 'live_url', label: 'Live site URL' },
      { type: 'performance_report', label: 'Lighthouse performance report' },
      { type: 'screenshot', label: 'Site screenshots' },
    ],
    openingMedia: 'screenshot',
    buyerTrustConcerns: ['Can they build a professional site?', 'Will it load fast and rank well?'],
    ctaTendency: 'review_website',
    mistakes: ['No live URLs', 'No performance evidence'],
  },
  landing_page_developer: {
    medium: ['live_page', 'conversion_annotations', 'a_b_context'],
    destinationPrefs: ['code_and_live_demo', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Landing Page Portfolio', purpose: 'Show conversion-focused page builds', buyerQuestion: 'Can they build a page that converts?' },
      { id: 'page_showcase', heading: 'Landing Pages', purpose: 'Showcase completed landing pages', buyerQuestion: 'What kind of pages have they built?' },
      { id: 'process', heading: 'Design & Build Process', purpose: 'Explain landing page methodology', buyerQuestion: 'How do they approach landing page design?' },
    ],
    presentationSequence: ['live_url', 'design_rationale', 'structure_breakdown'],
    evidencePrimitives: [
      { type: 'live_url', label: 'Live landing page URL' },
      { type: 'page_screenshot', label: 'Page screenshot' },
      { type: 'annotated_mockup', label: 'Annotated design callouts' },
    ],
    openingMedia: 'page_screenshot',
    buyerTrustConcerns: ['Can they build a focused conversion page?', 'Do they understand page structure?'],
    ctaTendency: 'review_page',
    mistakes: ['Generic landing pages without rationale', 'No structure breakdown'],
  },
  no_code_developer: {
    medium: ['live_app', 'workflow_demo', 'build_timeline'],
    destinationPrefs: ['code_and_live_demo', 'document_case_study'],
    sectionPrimitives: [
      { id: 'hero', heading: 'No-Code Build Portfolio', purpose: 'Show rapid build capabilities', buyerQuestion: 'Can they build what I need without code?' },
      { id: 'app_showcase', heading: 'Built Apps & Tools', purpose: 'Showcase completed no-code projects', buyerQuestion: 'What have they built?' },
      { id: 'process', heading: 'Build Approach', purpose: 'Explain how they build fast with no-code', buyerQuestion: 'How do they build and iterate?' },
    ],
    presentationSequence: ['live_link', 'build_timeline', 'feature_walkthrough', 'tool_stack'],
    evidencePrimitives: [
      { type: 'live_link', label: 'Live app link' },
      { type: 'flow_diagram', label: 'Workflow diagram' },
      { type: 'feature_list', label: 'Features built' },
    ],
    openingMedia: 'live_link',
    buyerTrustConcerns: ['Can they build fast?', 'Will the product work reliably?'],
    ctaTendency: 'discuss_build',
    mistakes: ['No live demos', 'No explanation of tool choices'],
  },
  frontend_developer: {
    medium: ['live_demo', 'code_sample', 'responsive_showcase'],
    destinationPrefs: ['code_and_live_demo', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Frontend Development Portfolio', purpose: 'Show interactive frontend work', buyerQuestion: 'Can they build the interface I need?' },
      { id: 'live_projects', heading: 'Live Demos', purpose: 'Showcase working frontend implementations', buyerQuestion: 'What have they built and how does it work?' },
      { id: 'implementation', heading: 'Implementation Details', purpose: 'Show code quality and technical decisions', buyerQuestion: 'Is their code quality good?' },
    ],
    presentationSequence: ['live_demo', 'mobile_path', 'implementation_notes', 'tech_decisions'],
    evidencePrimitives: [
      { type: 'live_demo', label: 'Live interactive demo' },
      { type: 'code_snippet', label: 'Implementation code sample' },
      { type: 'responsive_gif', label: 'Responsive behaviour capture' },
      { type: 'accessibility_note', label: 'Accessibility checks' },
    ],
    openingMedia: 'live_demo',
    buyerTrustConcerns: ['Can they build responsive interfaces?', 'Is their code production-quality?'],
    ctaTendency: 'review_code',
    mistakes: ['No live demos', 'No code samples', 'Ignoring mobile experience'],
  },
  automation_developer: {
    medium: ['workflow_showcase', 'roi_context', 'process_documentation'],
    destinationPrefs: ['document_case_study', 'video_walkthrough'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Automation Portfolio', purpose: 'Show workflow automation expertise', buyerQuestion: 'Can they automate my workflows?' },
      { id: 'automation_showcase', heading: 'Automation Examples', purpose: 'Showcase completed automations', buyerQuestion: 'What kind of processes have they automated?' },
      { id: 'process', heading: 'My Automation Approach', purpose: 'Explain how they identify and build automations', buyerQuestion: 'How do they solve automation problems?' },
    ],
    presentationSequence: ['problem_context', 'workflow_diagram', 'automation_demo', 'time_impact'],
    evidencePrimitives: [
      { type: 'workflow_diagram', label: 'Before/after workflow diagram' },
      { type: 'process_doc', label: 'Process documentation' },
      { type: 'screencast', label: 'Automation screencast' },
    ],
    openingMedia: 'workflow_diagram',
    buyerTrustConcerns: ['Can they understand my workflow?', 'Will the automation actually save time?'],
    ctaTendency: 'discuss_automation',
    mistakes: ['No workflow before/after', 'No documentation of the process'],
  },
  ui_ux_designer: {
    medium: ['prototype_link', 'case_study_frames', 'design_rationale'],
    destinationPrefs: ['visual_showcase', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'UI/UX Design Portfolio', purpose: 'Show interface design and problem-solving', buyerQuestion: 'Can they design a better interface?' },
      { id: 'case_studies', heading: 'Design Case Studies', purpose: 'Show end-to-end design process', buyerQuestion: 'How do they approach design problems?' },
      { id: 'process', heading: 'Design Process', purpose: 'Explain design methodology', buyerQuestion: 'What is their design workflow?' },
    ],
    presentationSequence: ['problem', 'user_flow', 'designed_screens', 'prototype_link', 'design_rationale'],
    evidencePrimitives: [
      { type: 'before_after', label: 'Before/after screen comparison' },
      { type: 'prototype_link', label: 'Interactive prototype' },
      { type: 'user_flow', label: 'User flow diagram' },
      { type: 'rationale_card', label: 'Design decision rationale' },
    ],
    openingMedia: 'before_after',
    buyerTrustConcerns: ['Can they improve my product UX?', 'Do they have a user-centered process?'],
    ctaTendency: 'review_ui',
    mistakes: ['No design rationale', 'No before/after comparison'],
  },
  landing_page_designer: {
    medium: ['page_mockups', 'conversion_context', 'variant_showcase'],
    destinationPrefs: ['visual_showcase', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Landing Page Design Portfolio', purpose: 'Show conversion-focused design work', buyerQuestion: 'Can they design a page that converts?' },
      { id: 'page_showcase', heading: 'Landing Page Designs', purpose: 'Showcase landing page examples', buyerQuestion: 'What landing page styles do they create?' },
      { id: 'process', heading: 'Design Approach', purpose: 'Explain landing page design methodology', buyerQuestion: 'How do they design for conversion?' },
    ],
    presentationSequence: ['final_design', 'design_rationale', 'mobile_view', 'variant_notes'],
    evidencePrimitives: [
      { type: 'page_mockup', label: 'Full page mockup' },
      { type: 'annotation', label: 'Design annotations' },
      { type: 'mobile_mockup', label: 'Mobile version mockup' },
    ],
    openingMedia: 'page_mockup',
    buyerTrustConcerns: ['Can they design a page that converts visitors?', 'Do they understand layout and hierarchy?'],
    ctaTendency: 'review_page_design',
    mistakes: ['No mobile mockups', 'No design decision explanation'],
  },
  brand_designer: {
    medium: ['identity_showcase', 'application_mockups', 'style_guide'],
    destinationPrefs: ['visual_showcase', 'personal_site'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Brand Design Portfolio', purpose: 'Show visual identity expertise', buyerQuestion: 'Can they create a cohesive brand identity?' },
      { id: 'identity_systems', heading: 'Brand Identity Systems', purpose: 'Show complete identity projects', buyerQuestion: 'What identities have they created?' },
      { id: 'applications', heading: 'Brand Applications', purpose: 'Show how identity works across touchpoints', buyerQuestion: 'Does the identity work in real contexts?' },
    ],
    presentationSequence: ['logo', 'color_typography', 'application_mockups', 'style_guide_samples'],
    evidencePrimitives: [
      { type: 'logo_showcase', label: 'Logo and primary marks' },
      { type: 'palette', label: 'Color palette' },
      { type: 'application', label: 'Brand on applications' },
      { type: 'guidelines', label: 'Style guide samples' },
    ],
    openingMedia: 'logo_showcase',
    buyerTrustConcerns: ['Can they create a professional brand?', 'Will the identity work across applications?'],
    ctaTendency: 'review_brand',
    mistakes: ['No application mockups', 'Only logo without system context'],
  },
  social_media_designer: {
    medium: ['feed_mockups', 'template_library', 'content_calendar'],
    destinationPrefs: ['visual_showcase', 'social_native_showcase'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Social Media Design Portfolio', purpose: 'Show social content design expertise', buyerQuestion: 'Can they create on-brand social content?' },
      { id: 'feed_showcase', heading: 'Feed & Content Examples', purpose: 'Showcase social media designs', buyerQuestion: 'What does their content look like?' },
      { id: 'templates', heading: 'Template Systems', purpose: 'Show reusable template libraries', buyerQuestion: 'Can they create a system I can use?' },
    ],
    presentationSequence: ['feed_grid', 'single_post', 'template_system', 'content_variations'],
    evidencePrimitives: [
      { type: 'feed_mockup', label: 'Feed grid mockup' },
      { type: 'post_design', label: 'Individual post design' },
      { type: 'template', label: 'Reusable template' },
    ],
    openingMedia: 'feed_mockup',
    buyerTrustConcerns: ['Can they maintain brand consistency across posts?', 'Can they create templates I can use?'],
    ctaTendency: 'review_social',
    mistakes: ['No feed cohesion shown', 'Single designs without system'],
  },
  presentation_designer: {
    medium: ['deck_embeds', 'slide_showcase', 'before_after_decks'],
    destinationPrefs: ['visual_showcase', 'document_case_study'],
    sectionPrimitives: [
      { id: 'hero', heading: 'Presentation Design Portfolio', purpose: 'Show deck design expertise', buyerQuestion: 'Can they design professional presentations?' },
      { id: 'deck_showcase', heading: 'Presentation Examples', purpose: 'Showcase completed decks', buyerQuestion: 'What kind of decks have they designed?' },
      { id: 'process', heading: 'Design Process', purpose: 'Explain presentation design methodology', buyerQuestion: 'How do they approach deck design?' },
    ],
    presentationSequence: ['before_after_slide', 'full_deck_preview', 'design_choices'],
    evidencePrimitives: [
      { type: 'slide_comparison', label: 'Before/after slide comparison' },
      { type: 'deck_embed', label: 'Deck preview or embed' },
      { type: 'rationale_card', label: 'Design decision notes' },
    ],
    openingMedia: 'slide_comparison',
    buyerTrustConcerns: ['Can they make my deck look professional?', 'Do they understand storytelling through slides?'],
    ctaTendency: 'review_deck',
    mistakes: ['No before/after comparison', 'Decks without context or rationale'],
  },
};

/* ──────────────────────────────────────────────
   MARKET BUYER MODIFIERS — all real IDs
   ────────────────────────────────────────────── */

interface MarketModifier {
  concernHierarchy: string[];
  trustSignalPriority: string[];
  proofEmphasis: string;
  languageStyle: string;
  ctaIntent: string;
  sectionRankingBoost: string[];
}

const MARKET_MODIFIERS: Record<string, MarketModifier> = {
  youtube_creators: {
    concernHierarchy: ['retention', 'engagement', 'consistency', 'style'],
    trustSignalPriority: ['retention_samples', 'process_clarity', 'style_range'],
    proofEmphasis: 'retention_and_engagement',
    languageStyle: 'creator_direct',
    ctaIntent: 'review_approach',
    sectionRankingBoost: ['selected_work', 'retention_work'],
  },
  coaches: {
    concernHierarchy: ['trust', 'credibility', 'client_understanding', 'process'],
    trustSignalPriority: ['professional_presentation', 'client_context', 'process_clarity'],
    proofEmphasis: 'trust_and_professionalism',
    languageStyle: 'professional_empathetic',
    ctaIntent: 'discuss_needs',
    sectionRankingBoost: ['process', 'case_studies'],
  },
  creators: {
    concernHierarchy: ['style_match', 'growth_potential', 'consistency', 'speed'],
    trustSignalPriority: ['style_samples', 'consistency_proof', 'process_efficiency'],
    proofEmphasis: 'style_and_consistency',
    languageStyle: 'creative_direct',
    ctaIntent: 'see_more',
    sectionRankingBoost: ['hook_gallery', 'selected_work'],
  },
  agencies: {
    concernHierarchy: ['reliability', 'quality_consistency', 'scalability', 'turnaround'],
    trustSignalPriority: ['process_documentation', 'quality_samples', 'communication'],
    proofEmphasis: 'reliability_and_process',
    languageStyle: 'professional_scalable',
    ctaIntent: 'discuss_partnership',
    sectionRankingBoost: ['process', 'implementation'],
  },
  local_businesses: {
    concernHierarchy: ['local_relevance', 'trust', 'simplicity', 'affordability'],
    trustSignalPriority: ['local_examples', 'process_clarity', 'service_transparency'],
    proofEmphasis: 'local_relevance_and_trust',
    languageStyle: 'simple_benefit_first',
    ctaIntent: 'learn_more',
    sectionRankingBoost: ['process', 'live_projects'],
  },
  personal_brands: {
    concernHierarchy: ['style_match', 'authenticity', 'consistency', 'voice'],
    trustSignalPriority: ['style_fit', 'authentic_examples', 'consistency_samples'],
    proofEmphasis: 'style_and_voice',
    languageStyle: 'collaborative_personal',
    ctaIntent: 'discuss_collaboration',
    sectionRankingBoost: ['selected_work', 'hero'],
  },
  course_creators: {
    concernHierarchy: ['educational_quality', 'student_engagement', 'clarity', 'consistency'],
    trustSignalPriority: ['educational_examples', 'clarity_of_process', 'student_focus'],
    proofEmphasis: 'educational_clarity',
    languageStyle: 'educational_clear',
    ctaIntent: 'see_educational_work',
    sectionRankingBoost: ['process', 'selected_work'],
  },
  podcasters: {
    concernHierarchy: ['audio_quality', 'moment_selection', 'listener_growth', 'consistency'],
    trustSignalPriority: ['clip_samples', 'selection_process', 'quality_demonstration'],
    proofEmphasis: 'content_repurposing',
    languageStyle: 'listener_focused',
    ctaIntent: 'review_podcast_work',
    sectionRankingBoost: ['clip_gallery', 'process'],
  },
  educators: {
    concernHierarchy: ['clarity', 'engagement', 'structure', 'student_outcomes'],
    trustSignalPriority: ['lesson_samples', 'structure_clarity', 'engagement_approach'],
    proofEmphasis: 'teaching_clarity',
    languageStyle: 'educational_structured',
    ctaIntent: 'see_educational_examples',
    sectionRankingBoost: ['process', 'selected_work'],
  },
  business_owners: {
    concernHierarchy: ['time_savings', 'professionalism', 'reliability', 'roi_context'],
    trustSignalPriority: ['process_efficiency', 'professional_result', 'reliability_proof'],
    proofEmphasis: 'efficiency_and_professionalism',
    languageStyle: 'business_direct',
    ctaIntent: 'discuss_business_need',
    sectionRankingBoost: ['process', 'implementation'],
  },
  ecommerce_brands: {
    concernHierarchy: ['conversion', 'brand_consistency', 'speed', 'scale'],
    trustSignalPriority: ['conversion_focused_examples', 'brand_alignment', 'production_speed'],
    proofEmphasis: 'conversion_and_brand',
    languageStyle: 'data_conscious_brand',
    ctaIntent: 'see_commercial_work',
    sectionRankingBoost: ['cta_focus', 'ad_showcase', 'page_showcase'],
  },
  marketing_agencies: {
    concernHierarchy: ['scale_capacity', 'quality_consistency', 'white_label_ready', 'turnaround'],
    trustSignalPriority: ['volume_samples', 'quality_at_scale', 'process_reliability'],
    proofEmphasis: 'scale_and_consistency',
    languageStyle: 'agency_partner',
    ctaIntent: 'discuss_partnership',
    sectionRankingBoost: ['process', 'implementation'],
  },
  saas_startups: {
    concernHierarchy: ['speed', 'quality', 'product_understanding', 'iteration'],
    trustSignalPriority: ['product_context', 'build_speed', 'technical_quality'],
    proofEmphasis: 'product_speed_and_quality',
    languageStyle: 'product_growth',
    ctaIntent: 'review_product_fit',
    sectionRankingBoost: ['implementation', 'process', 'live_projects'],
  },
  startups: {
    concernHierarchy: ['speed', 'cost_effective', 'quality', 'iteration_capability'],
    trustSignalPriority: ['build_speed', 'cost_context', 'quality_examples'],
    proofEmphasis: 'speed_and_value',
    languageStyle: 'startup_paced',
    ctaIntent: 'discuss_build',
    sectionRankingBoost: ['implementation', 'process', 'app_showcase'],
  },
  coaches_consultants: {
    concernHierarchy: ['professionalism', 'trust', 'client_understanding', 'reliability'],
    trustSignalPriority: ['professional_examples', 'client_context', 'process_reliability'],
    proofEmphasis: 'professionalism_and_trust',
    languageStyle: 'professional_consultative',
    ctaIntent: 'discuss_needs',
    sectionRankingBoost: ['process', 'case_studies', 'identity_systems'],
  },
  startups_saas: {
    concernHierarchy: ['speed', 'quality', 'product_context', 'iteration'],
    trustSignalPriority: ['product_context', 'build_evidence', 'technical_quality'],
    proofEmphasis: 'product_execution',
    languageStyle: 'product_build_focused',
    ctaIntent: 'review_build_capability',
    sectionRankingBoost: ['implementation', 'live_projects'],
  },
  creators_course_sellers: {
    concernHierarchy: ['style_fit', 'student_engagement', 'platform_experience', 'consistency'],
    trustSignalPriority: ['platform_examples', 'student_engagement_context', 'style_samples'],
    proofEmphasis: 'platform_expertise',
    languageStyle: 'creator_educational',
    ctaIntent: 'see_platform_work',
    sectionRankingBoost: ['selected_work', 'process'],
  },
};

/* ──────────────────────────────────────────────
   NICHE MODIFIER RULES
   ────────────────────────────────────────────── */

interface NicheModifier {
  terminology: Record<string, string>;
  projectFraming: string;
  sectionEmphasis: string[];
  evidencePriority: string[];
  ctaContext: string;
  portfolioPromiseHint: string;
}

const NICHE_MODIFIERS: Record<string, NicheModifier> = {
  fitness_coaches: {
    terminology: { buyer: 'fitness coaches', problem: 'client transformation', result: 'progress and transformation' },
    projectFraming: 'fitness content and transformation storytelling',
    sectionEmphasis: ['selected_work', 'process'],
    evidencePriority: ['before_after', 'clip_embed', 'process_doc'],
    ctaContext: 'fitness content approach',
    portfolioPromiseHint: 'creating content that attracts and converts fitness clients',
  },
  business_coaches: {
    terminology: { buyer: 'business coaches', problem: 'authority building', result: 'credibility and reach' },
    projectFraming: 'authority-building business content',
    sectionEmphasis: ['process', 'case_studies'],
    evidencePriority: ['clip_embed', 'hook_card', 'rationale_card'],
    ctaContext: 'business authority content',
    portfolioPromiseHint: 'positioning coaches as authorities in their field',
  },
  gaming: {
    terminology: { buyer: 'gaming creators', problem: 'retention in gaming content', result: 'viral moments and engagement' },
    projectFraming: 'gaming content and stream highlights',
    sectionEmphasis: ['hook_gallery', 'selected_work'],
    evidencePriority: ['clip_embed', 'hook_card', 'retention_note'],
    ctaContext: 'gaming content editing',
    portfolioPromiseHint: 'turning gameplay into engaging, retention-optimised clips',
  },
  educational: {
    terminology: { buyer: 'educational creators', problem: 'student engagement', result: 'completion and enrollment' },
    projectFraming: 'educational content and lesson clarity',
    sectionEmphasis: ['process', 'selected_work'],
    evidencePriority: ['retention_graph', 'clip_embed', 'timeline_comparison'],
    ctaContext: 'educational content approach',
    portfolioPromiseHint: 'making educational content engaging and clear',
  },
  restaurants: {
    terminology: { buyer: 'restaurants', problem: 'local visibility', result: 'more customers and reservations' },
    projectFraming: 'restaurant marketing and local presence',
    sectionEmphasis: ['live_projects', 'process'],
    evidencePriority: ['screenshot', 'live_url', 'page_screenshot'],
    ctaContext: 'restaurant website and content',
    portfolioPromiseHint: 'helping restaurants attract more local customers online',
  },
  gyms: {
    terminology: { buyer: 'gyms and fitness centers', problem: 'member acquisition', result: 'more members and engagement' },
    projectFraming: 'gym marketing and membership growth',
    sectionEmphasis: ['live_projects', 'process'],
    evidencePriority: ['screenshot', 'live_url', 'responsive_gif'],
    ctaContext: 'gym website and content',
    portfolioPromiseHint: 'helping fitness centers attract and retain members',
  },
  clinics: {
    terminology: { buyer: 'clinics and medical practices', problem: 'patient trust', result: 'more patient inquiries' },
    projectFraming: 'clinic website and patient trust',
    sectionEmphasis: ['process', 'live_projects'],
    evidencePriority: ['screenshot', 'live_url', 'accessibility_note'],
    ctaContext: 'clinic website development',
    portfolioPromiseHint: 'building trusted, accessible online presence for clinics',
  },
};

function getNicheModifier(nicheId: string): NicheModifier | null {
  return NICHE_MODIFIERS[nicheId] ?? null;
}

/* ──────────────────────────────────────────────
   GOAL GENERATOR
   ────────────────────────────────────────────── */

export function generatePortfolioDirection(ctx: UpstreamContext): PortfolioDirection {
  const serviceId = ctx.mod1ServiceId || '';
  const marketId = ctx.mod1MarketId || '';
  const offerType = ctx.mod2OfferType || '';
  const ctaLine = ctx.mod3ProfileCopy.ctaLine || '';
  const ap = ctx.mod3AuthorityPosition || '';

  let goal: PortfolioGoal = 'evaluate_capability';
  let reason = '';

  if (offerType === 'retainer' || offerType === 'ongoing') {
    goal = 'review_offer';
    reason = 'ongoing service — buyer evaluates long-term fit';
  } else if (ctaLine.toLowerCase().includes('book') || ctaLine.toLowerCase().includes('call')) {
    goal = 'start_conversation';
    reason = 'CTA suggests direct conversation';
  } else if (marketId === 'agencies' || marketId === 'marketing_agencies') {
    goal = 'review_offer';
    reason = 'agency buyers evaluate service offerings';
  } else if (ap === 'builder' || ap === 'practitioner') {
    goal = 'evaluate_capability';
    reason = 'authority position focuses on demonstrating ability';
  } else if (ap === 'auditor' || ap === 'deconstructor') {
    goal = 'start_conversation';
    reason = 'authority position focuses on diagnosis and discussion';
  } else if (serviceId === 'ad_creative_editor' || serviceId === 'landing_page_developer' || serviceId === 'landing_page_designer') {
    goal = 'request_project';
    reason = 'project-based service — buyer needs a specific deliverable';
  }

  const targetBuyer = marketId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const portfolioPromise = `Demonstrate how I help ${targetBuyer} achieve their goals through ${getServiceLabel(serviceId)}`;
  const ctaIntent = MARKET_MODIFIERS[marketId]?.ctaIntent ?? 'discuss_needs';

  return {
    goal, targetBuyer, portfolioPromise, ctaIntent,
    recommendedGoalReason: reason,
    isCustom: false,
  };
}

function getServiceLabel(serviceId: string): string {
  const labels: Record<string, string> = {
    video_editor: 'video editing',
    short_form_editor: 'short-form editing',
    youtube_editor: 'YouTube editing',
    podcast_clip_editor: 'podcast clip editing',
    ad_creative_editor: 'ad creative editing',
    wordpress_developer: 'WordPress development',
    landing_page_developer: 'landing page development',
    no_code_developer: 'no-code development',
    frontend_developer: 'frontend development',
    automation_developer: 'automation development',
    ui_ux_designer: 'UI/UX design',
    landing_page_designer: 'landing page design',
    brand_designer: 'brand design',
    social_media_designer: 'social media design',
    presentation_designer: 'presentation design',
  };
  return labels[serviceId] || serviceId.replace(/_/g, ' ');
}

/* ──────────────────────────────────────────────
   DESTINATION + SECTION COMPOSER
   ────────────────────────────────────────────── */

export function generatePlatformRecommendation(ctx: UpstreamContext): PlatformRecommendation {
  const serviceId = ctx.mod1ServiceId || '';
  const primitives = SERVICE_PRIMITIVES[serviceId];
  if (!primitives) {
    return {
      destination: 'personal_site',
      primaryRecommendation: 'Build a personal portfolio website',
      supportingDestinations: [],
      reason: 'Default destination for all services',
      userConfirmed: false, isUserOverride: false,
    };
  }

  const primary = primitives.destinationPrefs[0];
  const secondary = primitives.destinationPrefs[1] ?? null;

  const destLabels: Record<PortfolioDestination, string> = {
    personal_site: 'Personal portfolio website (Framer, Carrd, or similar)',
    social_native_showcase: 'Social platform showcase (Instagram, TikTok, YouTube)',
    code_and_live_demo: 'Live demo links + code repository (GitHub, live URLs)',
    visual_showcase: 'Visual portfolio platform (Behance, Dribbble, Figma)',
    document_case_study: 'Document-based case studies (Notion, blog)',
    video_walkthrough: 'Video walkthrough portfolio (Loom, YouTube)',
  };

  return {
    destination: primary,
    primaryRecommendation: destLabels[primary],
    supportingDestinations: secondary ? [destLabels[secondary]] : [],
    reason: `${getServiceLabel(serviceId)} portfolios perform best on ${primary.replace(/_/g, ' ')} platforms`,
    userConfirmed: false, isUserOverride: false,
  };
}

export function generateSections(ctx: UpstreamContext, platform: PlatformRecommendation): PortfolioSectionSpec[] {
  const serviceId = ctx.mod1ServiceId || '';
  const marketId = ctx.mod1MarketId || '';
  const nicheId = ctx.mod1NicheId || '';
  const ap = ctx.mod3AuthorityPosition || '';
  const primitives = SERVICE_PRIMITIVES[serviceId];
  const market = MARKET_MODIFIERS[marketId];
  const niche = getNicheModifier(nicheId);
  const m3Sections = ctx.mod3PortfolioCopy.sections || [];

  const sections: PortfolioSectionSpec[] = [];
  let order = 0;

  const addSection = (id: string, heading: string, purpose: string, buyerQuestion: string, source: SectionSource) => {
    sections.push({
      id, sectionType: id, heading, purpose,
      buyerQuestionAnswered: buyerQuestion,
      included: true, order: order++, source, isCustom: false,
    });
  };

  addSection('hero', primitives?.sectionPrimitives.find((s) => s.id === 'hero')?.heading ?? 'Portfolio',
    primitives?.sectionPrimitives.find((s) => s.id === 'hero')?.purpose ?? 'Showcase work',
    primitives?.sectionPrimitives.find((s) => s.id === 'hero')?.buyerQuestion ?? 'What do they do?',
    'base');

  const m3Hero = m3Sections.find((s) => s.type === 'hero');
  if (m3Hero && !sections.find((s) => s.id === 'm3_hero')) {
    addSection('m3_hero', m3Hero.heading, 'Module 3 portfolio section', 'Context from strategy', 'authority');
  }

  const serviceSections = primitives?.sectionPrimitives.filter((s) => s.id !== 'hero') ?? [];
  for (const sec of serviceSections) {
    addSection(sec.id, sec.heading, sec.purpose, sec.buyerQuestion, 'service');
  }

  const boostSections = market?.sectionRankingBoost ?? [];
  for (const boost of boostSections) {
    const existing = sections.find((s) => s.id === boost);
    if (existing) existing.order = order++;
  }

  const nicheEmphasis = niche?.sectionEmphasis ?? [];
  for (const em of nicheEmphasis) {
    const existing = sections.find((s) => s.id === em);
    if (existing) existing.order = order++;
  }

  if (ap === 'deconstructor' || ap === 'auditor') {
    const processSection = sections.find((s) => s.id === 'process');
    if (processSection) processSection.order = 1;
  }
  if (ap === 'practitioner') {
    const showcaseSection = sections.find((s) => s.id === 'selected_work' || s.id === 'live_projects' || s.id === 'case_studies' || s.id === 'page_showcase' || s.id === 'identity_systems');
    if (showcaseSection) showcaseSection.order = 1;
  }
  if (ap === 'builder') {
    const implementationSection = sections.find((s) => s.id === 'implementation' || s.id === 'process');
    if (implementationSection) implementationSection.order = 1;
  }

  sections.push({
    id: 'cta', sectionType: 'cta', heading: 'Let\'s Work Together',
    purpose: 'Encourage the buyer to take the next step',
    buyerQuestionAnswered: 'How do I get in touch?',
    included: true, order: order++, source: 'base', isCustom: false,
  });

  for (const m3Section of m3Sections) {
    if (!sections.find((s) => s.id === `m3_${m3Section.type}`)) {
      sections.push({
        id: `m3_${m3Section.type}`, sectionType: m3Section.type, heading: m3Section.heading,
        purpose: 'Section from Module 3 portfolio strategy',
        buyerQuestionAnswered: '',
        included: true, order: order++, source: 'authority', isCustom: false,
      });
    }
  }

  const reordered = sections.sort((a, b) => a.order - b.order).map((s, i) => ({ ...s, order: i }));
  return reordered;
}

type SectionSource = 'base' | 'service' | 'market' | 'niche' | 'authority' | 'user';

/* ──────────────────────────────────────────────
   PROOF PLACEMENT ENGINE
   ────────────────────────────────────────────── */

export function generateProjectPlacements(ctx: UpstreamContext, sections: PortfolioSectionSpec[]): ProjectPlacement[] {
  const assets = ctx.mod3ProofAssets.filter((a) => a.isAccepted);
  const priorities = ctx.mod3ProofPriorities;
  const marketId = ctx.mod1MarketId || '';
  const goal = ctx.mod1Positioning || '';
  const ap = ctx.mod3AuthorityPosition || '';

  if (assets.length === 0) return [];

  const ranked = assets.map((asset) => {
    const priorityIdx = priorities.findIndex((p) => p.id === asset.priorityId);
    const marketConcernIdx = MARKET_MODIFIERS[marketId]?.concernHierarchy.findIndex((c) =>
      asset.credibilityGapProved.toLowerCase().includes(c)
    ) ?? -1;
    const score = (priorityIdx >= 0 ? (3 - priorityIdx) * 3 : 1)
      + (marketConcernIdx >= 0 ? (5 - marketConcernIdx) : 1)
      + (ap === 'auditor' || ap === 'deconstructor' ? 1 : 0);
    return { asset, score };
  });

  ranked.sort((a, b) => b.score - a.score);

  const placements: ProjectPlacement[] = [];
  const roles: ProjectRole[] = ['featured', 'secondary', 'supporting'];
  const sectionsByRole = findSectionsByRole(sections);

  for (let i = 0; i < Math.min(ranked.length, 3); i++) {
    const { asset } = ranked[i];
    const role = roles[i];
    const sectionId = sectionsByRole[role] || 'selected_work';
    const ctaMap: Record<ProjectRole, 'hero' | 'inline' | 'section_end' | 'footer'> = {
      featured: 'hero',
      secondary: 'inline',
      supporting: 'section_end',
    };
    placements.push({
      assetId: asset.id,
      priorityId: asset.priorityId,
      role,
      buyerQuestionAnswered: role === 'featured' ? 'What is their best work?' : role === 'secondary' ? 'What else can they do?' : 'What backs up their claims?',
      placementReason: role === 'featured' ? 'Highest priority gap with strongest market relevance' : role === 'secondary' ? 'Second priority, supports featured work' : 'Supporting evidence for trust signals',
      sectionId,
      ctaProximity: ctaMap[role],
      isCustom: false,
    });
  }

  return placements;
}

function findSectionsByRole(sections: PortfolioSectionSpec[]): Record<ProjectRole, string> {
  const result: Record<ProjectRole, string> = { featured: 'selected_work', secondary: 'selected_work', supporting: 'process' };
  const showcase = sections.find((s) =>
    ['selected_work', 'live_projects', 'case_studies', 'page_showcase', 'identity_systems', 'hook_gallery', 'clip_gallery', 'ad_showcase', 'automation_showcase', 'app_showcase'].includes(s.id)
  );
  if (showcase) {
    result.featured = showcase.id;
    result.secondary = showcase.id;
  }
  const trust = sections.find((s) => ['process', 'implementation', 'templates'].includes(s.id));
  if (trust) result.supporting = trust.id;
  return result;
}

/* ──────────────────────────────────────────────
   PROJECT PRESENTATION COMPOSER
   ────────────────────────────────────────────── */

function computeAssetFingerprint(asset: UpstreamContext['mod3ProofAssets'][0]): string {
  return JSON.stringify({
    id: asset.id, t: asset.title, at: asset.assetType, cg: asset.credibilityGapProved,
    pc: asset.portfolioCopy, ps: asset.presentationStructure, ia: asset.isAccepted,
  });
}

export function generateProjectPresentation(
  asset: UpstreamContext['mod3ProofAssets'][0],
  role: ProjectRole,
  ctx: UpstreamContext,
): ProjectPresentationSpec {
  const serviceId = ctx.mod1ServiceId || '';
  const primitives = SERVICE_PRIMITIVES[serviceId];
  const nicheId = ctx.mod1NicheId || '';
  const niche = getNicheModifier(nicheId);
  const sequence = primitives?.presentationSequence ?? ['problem', 'process', 'output'];
  const evidenceList = primitives?.evidencePrimitives ?? [{ type: 'screenshot', label: 'Screenshot' }];
  const opening = primitives?.openingMedia ?? 'screenshot';

  const roleLabel = role === 'featured' ? ' (Featured)' : role === 'secondary' ? ' (Secondary)' : '';
  const nicheTerm = niche?.terminology?.buyer ?? '';

  const evidenceOrder: EvidencePlacement[] = evidenceList.map((e, i) => ({
    type: e.type, label: e.label, order: i, description: `Shows ${e.label.toLowerCase()}`, isCustom: false,
  }));

  return {
    assetId: asset.id,
    projectTitle: `${asset.title}${roleLabel}`,
    honestContextLabel: nicheTerm ? `Built for ${nicheTerm}` : 'Professional project demonstration',
    buyerProblem: asset.credibilityGapProved || 'Demonstrate capability through real work',
    proofObjective: `Show how this project addresses the credibility gap: ${asset.credibilityGapProved || 'proven capability'}`,
    openingMedia: opening,
    presentationSequence: sequence,
    evidenceOrder,
    processEvidence: asset.presentationStructure || [],
    decisionEvidence: [],
    outputEvidence: asset.deliverables || [],
    limitationsNote: 'This is a demonstration project based on the Module 3 proof strategy.',
    proofStatement: asset.portfolioCopy?.proofStatement || `Demonstrates ${asset.credibilityGapProved || 'capability in this area'}`,
    cta: asset.portfolioCopy?.cta || 'Learn more about my approach',
    buildChecklist: asset.completionChecklist || [],
    sourceAssetFingerprint: computeAssetFingerprint(asset),
    isCustom: false,
    isAccepted: false,
  };
}

export function generateProjectPresentations(
  ctx: UpstreamContext,
  placements: ProjectPlacement[],
): ProjectPresentationSpec[] {
  const assetMap = new Map(ctx.mod3ProofAssets.map((a) => [a.id, a]));
  return placements.map((p) => {
    const asset = assetMap.get(p.assetId);
    if (!asset) return null;
    return generateProjectPresentation(asset, p.role, ctx);
  }).filter((p): p is ProjectPresentationSpec => p !== null);
}

/* ──────────────────────────────────────────────
   PORTFOLIO COPY ARCHITECTURE GENERATOR
   ────────────────────────────────────────────── */

export function generatePortfolioCopyArchitecture(
  ctx: UpstreamContext,
  direction: PortfolioDirection,
  platform: PlatformRecommendation,
  sections: PortfolioSectionSpec[],
  placements: ProjectPlacement[],
  presentations: ProjectPresentationSpec[],
): PortfolioCopyArchitecture {
  const m3Profile = ctx.mod3ProfileCopy;
  const m3Portfolio = ctx.mod3PortfolioCopy;
  const serviceId = ctx.mod1ServiceId || '';
  const marketId = ctx.mod1MarketId || '';
  const nicheId = ctx.mod1NicheId || '';
  const niche = getNicheModifier(nicheId);
  const market = MARKET_MODIFIERS[marketId];
  const serviceLabel = getServiceLabel(serviceId);
  const buyerTerm = niche?.terminology?.buyer ?? marketId.replace(/_/g, ' ');

  const headline = m3Profile.professionalHeadline || `${serviceLabel} for ${buyerTerm}`;
  const shortIntro = m3Profile.shortBio || `I help ${buyerTerm} achieve their goals through ${serviceLabel}.`;

  const sectionCopy: Record<string, { heading: string; body: string }> = {};
  for (const section of sections) {
    const m3Section = m3Portfolio.sections.find((s) => s.type === section.sectionType);
    sectionCopy[section.id] = {
      heading: m3Section?.heading || section.heading,
      body: m3Section?.body || `Showcasing ${serviceLabel} work for ${buyerTerm}.`,
    };
  }

  const projectCopy: Record<string, { headline: string; description: string; cta: string }> = {};
  for (const pres of presentations) {
    projectCopy[pres.assetId] = {
      headline: pres.projectTitle,
      description: pres.proofStatement,
      cta: pres.cta,
    };
  }

  const ctaBase = m3Profile.ctaLine || m3Portfolio.portfolioCta || 'Get in touch to discuss your project';
  const marketCta = market?.ctaIntent ?? 'discuss_needs';

  const ctaArchitecture: CTAArchitecture = {
    heroCta: `See my work for ${buyerTerm} →`,
    inlineCta: `Interested? ${ctaBase}`,
    sectionCta: `Want to see more ${serviceLabel} examples?`,
    footerCta: `Ready to start? ${ctaBase}`,
  };

  return {
    headline,
    shortIntro,
    sectionCopy,
    projectCopy,
    ctaArchitecture,
    isCustom: false,
  };
}

/* ──────────────────────────────────────────────
   CHECKLIST GENERATOR
   ────────────────────────────────────────────── */

export function generateChecklists(
  ctx: UpstreamContext,
  platform: PlatformRecommendation,
  sections: PortfolioSectionSpec[],
  presentations: ProjectPresentationSpec[],
): { buildChecklist: ChecklistItem[]; publishChecklist: ChecklistItem[] } {
  const buildChecklist: ChecklistItem[] = [];
  const publishChecklist: ChecklistItem[] = [];
  let idCounter = 1;

  const addBuild = (label: string, source: ChecklistSource) => {
    buildChecklist.push({ id: `build-${idCounter++}`, label, status: 'pending', source, isCustom: false });
  };
  const addPublish = (label: string, source: ChecklistSource) => {
    publishChecklist.push({ id: `publish-${idCounter++}`, label, status: 'pending', source, isCustom: false });
  };

  addBuild('Set up portfolio platform', 'module4_build');
  addBuild('Write and refine headline', 'module4_build');
  addBuild('Add short intro / bio', 'module4_build');

  for (const section of sections.filter((s) => s.included)) {
    addBuild(`Build "${section.heading}" section`, 'module4_build');
  }

  for (const pres of presentations) {
    addBuild(`Create project page: ${pres.projectTitle}`, 'module4_build');
    for (const item of pres.buildChecklist) {
      addBuild(`Project task: ${item}`, 'module4_build');
    }
  }

  addPublish('Choose domain name', 'module4_publish');
  addPublish('Set up hosting', 'module4_publish');

  if (platform.destination === 'personal_site') {
    addPublish('Configure custom domain', 'module4_publish');
    addPublish('Set up SSL certificate', 'module4_publish');
  }

  addPublish('Test all links and CTAs', 'module4_publish');
  addPublish('Review on mobile device', 'module4_publish');
  addPublish('Share portfolio URL', 'module4_publish');

  if (ctx.mod3PortfolioCopy.sections.length > 0) {
    addBuild('Review and adapt Module 3 portfolio sections', 'module3');
  }

  return { buildChecklist, publishChecklist };
}

type ChecklistSource = 'module3' | 'module4_build' | 'module4_publish' | 'user';

/* ──────────────────────────────────────────────
   NEXT ACTIONS GENERATOR
   ────────────────────────────────────────────── */

export function generateNextActions(ctx: UpstreamContext, destination: PlatformRecommendation): NextAction[] {
  const serviceId = ctx.mod1ServiceId || '';
  const marketId = ctx.mod1MarketId || '';
  const actions: NextAction[] = [];
  let id = 1;

  actions.push({ id: `na-${id++}`, label: `Create your first portfolio project based on your Module 3 proof assets`, source: 'module4' });
  actions.push({ id: `na-${id++}`, label: `Set up your platform: ${destination.primaryRecommendation}`, source: 'module4' });

  if (destination.destination === 'personal_site') {
    actions.push({ id: `na-${id++}`, label: 'Register a domain name for your portfolio', source: 'module4' });
  }

  return actions;
}

/* ──────────────────────────────────────────────
   BUILD PACK COMPILER
   ────────────────────────────────────────────── */

export function compileBuildPack(
  ctx: UpstreamContext,
  direction: PortfolioDirection,
  platform: PlatformRecommendation,
  sections: PortfolioSectionSpec[],
  placements: ProjectPlacement[],
  presentations: ProjectPresentationSpec[],
  copy: PortfolioCopyArchitecture,
  buildChecklist: ChecklistItem[],
  publishChecklist: ChecklistItem[],
): PortfolioBuildPack {
  return {
    direction,
    platform,
    sections,
    projectPlacements: placements,
    projectPresentations: presentations,
    copy,
    buildChecklist,
    publishChecklist,
    nextActions: generateNextActions(ctx, platform),
    generatedAt: new Date().toISOString(),
  };
}

/* ──────────────────────────────────────────────
   MARKDOWN COMPILER
   ────────────────────────────────────────────── */

export function compileMarkdown(pack: PortfolioBuildPack): string {
  const lines: string[] = [];
  lines.push('# Portfolio Build Pack');
  lines.push('');
  lines.push(`**Generated:** ${pack.generatedAt}`);
  lines.push('');
  lines.push('## Portfolio Direction');
  lines.push(`- **Goal:** ${pack.direction.goal}`);
  lines.push(`- **Target buyer:** ${pack.direction.targetBuyer}`);
  lines.push(`- **Promise:** ${pack.direction.portfolioPromise}`);
  lines.push('');
  lines.push('## Platform & Structure');
  lines.push(`- **Destination:** ${pack.platform.destination}`);
  lines.push(`- **Primary:** ${pack.platform.primaryRecommendation}`);
  if (pack.platform.supportingDestinations.length > 0) {
    lines.push(`- **Supporting:** ${pack.platform.supportingDestinations.join(', ')}`);
  }
  lines.push('');
  lines.push('## Portfolio Sections');
  for (const section of pack.sections.filter((s) => s.included)) {
    lines.push(`### ${section.heading}`);
    lines.push(`- **Purpose:** ${section.purpose}`);
    lines.push(`- **Answers:** ${section.buyerQuestionAnswered}`);
  }
  lines.push('');
  lines.push('## Project Placements');
  for (const p of pack.projectPlacements) {
    lines.push(`### ${p.role}: ${p.assetId}`);
    lines.push(`- **Reason:** ${p.placementReason}`);
    lines.push(`- **Section:** ${p.sectionId}`);
    lines.push(`- **CTA:** ${p.ctaProximity}`);
  }
  lines.push('');
  lines.push('## Portfolio Copy');
  lines.push(`**Headline:** ${pack.copy.headline}`);
  lines.push(`**Intro:** ${pack.copy.shortIntro}`);
  lines.push('');
  lines.push('### CTA Architecture');
  lines.push(`- Hero: ${pack.copy.ctaArchitecture.heroCta}`);
  lines.push(`- Inline: ${pack.copy.ctaArchitecture.inlineCta}`);
  lines.push(`- Section: ${pack.copy.ctaArchitecture.sectionCta}`);
  lines.push(`- Footer: ${pack.copy.ctaArchitecture.footerCta}`);
  lines.push('');
  lines.push('## Build Checklist');
  for (const item of pack.buildChecklist) {
    lines.push(`- [${item.status === 'ready' ? 'x' : ' '}] ${item.label}`);
  }
  lines.push('');
  lines.push('## Publish Checklist');
  for (const item of pack.publishChecklist) {
    lines.push(`- [${item.status === 'ready' ? 'x' : ' '}] ${item.label}`);
  }
  lines.push('');
  lines.push('## Next Actions');
  for (const action of pack.nextActions) {
    lines.push(`1. ${action.label}`);
  }
  return lines.join('\n');
}

/* ──────────────────────────────────────────────
   MODULE 5 BRIDGE FUNCTION
   ────────────────────────────────────────────── */

export function buildModule5Bridge(pack: PortfolioBuildPack | null): Module5BridgeContext {
  if (!pack) {
    return {
      portfolioReady: false,
      portfolioDestination: 'personal_site',
      featuredProofAssetId: '',
      featuredProofTitle: '',
      portfolioCta: '',
      portfolioHeadline: '',
    };
  }

  const featured = pack.projectPlacements.find((p) => p.role === 'featured');
  const featuredPres = featured
    ? pack.projectPresentations.find((p) => p.assetId === featured.assetId)
    : null;

  return {
    portfolioReady: true,
    portfolioDestination: pack.platform.destination,
    featuredProofAssetId: featured?.assetId ?? '',
    featuredProofTitle: featuredPres?.projectTitle ?? featured?.assetId ?? '',
    portfolioCta: pack.copy.ctaArchitecture.heroCta,
    portfolioHeadline: pack.copy.headline,
  };
}

/* ──────────────────────────────────────────────
   FULL COMPOSER — generates all step outputs from context
   ────────────────────────────────────────────── */

export function composeAll(ctx: UpstreamContext): {
  direction: PortfolioDirection;
  platform: PlatformRecommendation;
  sections: PortfolioSectionSpec[];
  placements: ProjectPlacement[];
  presentations: ProjectPresentationSpec[];
  copy: PortfolioCopyArchitecture;
  buildChecklist: ChecklistItem[];
  publishChecklist: ChecklistItem[];
  pack: PortfolioBuildPack;
} {
  const direction = generatePortfolioDirection(ctx);
  const platform = generatePlatformRecommendation(ctx);
  const sections = generateSections(ctx, platform);
  const placements = generateProjectPlacements(ctx, sections);
  const presentations = generateProjectPresentations(ctx, placements);
  const copy = generatePortfolioCopyArchitecture(ctx, direction, platform, sections, placements, presentations);
  const { buildChecklist, publishChecklist } = generateChecklists(ctx, platform, sections, presentations);
  const pack = compileBuildPack(ctx, direction, platform, sections, placements, presentations, copy, buildChecklist, publishChecklist);

  return { direction, platform, sections, placements, presentations, copy, buildChecklist, publishChecklist, pack };
}
