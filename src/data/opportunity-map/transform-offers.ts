import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve('src/data/opportunity-map/master-data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const positionings: Record<string, string> = {
  weekly_reel_batch_5:
    'I help yoga instructors grow their audience on Instagram through polished daily Reels that inspire and convert.',
  challenge_series_pack:
    'I help yoga instructors launch high-engagement 30-day challenges through pre-edited video packs that keep participants motivated.',
  recipe_demo_edit_pack:
    'I help nutritionists grow their brand with professional recipe demos that make healthy eating look irresistible.',
  property_tour_reel_24h:
    'I help luxury real estate agents close more listings through cinematic property tours that showcase every detail.',
  listing_showreel_monthly:
    'I help real estate agents build trust with sellers through professional monthly listing showreels.',
  linkedin_tl_edit:
    'I help B2B SaaS founders build authority through polished LinkedIn thought leadership videos that drive engagement.',
  lecture_edit_chapters:
    'I help online course creators expand their reach through professionally edited YouTube lessons with chapterised navigation.',
  tutorial_post_production:
    'I help tech tutorial creators increase watch time through screen-recorded content with crystal-clear code demos.',
  full_podcast_episode_edit:
    'I help interview podcasters grow their audience through professional multi-cam edits that keep viewers watching.',
  podcast_full_cleanup_show_notes:
    'I help business podcasters save hours per episode through professional audio cleanup and SEO-ready show notes.',
  podcast_video_audiogram_package:
    'I help business podcasters maximize their reach through video edits and audiogram clips built for social media.',
  narrative_edit_sound_design:
    'I help narrative podcasters captivate listeners through cinematic sound design that brings every story to life.',
  five_page_business_theme:
    'I help local service businesses generate more leads through a professional WordPress site with built-in SEO.',
  ecommerce_theme_product_catalog:
    'I help boutique retail stores increase online sales through custom WooCommerce themes with seamless product catalogs.',
  blog_theme_newsletter:
    'I help long-form bloggers grow their audience through typography-first WordPress themes with integrated newsletter capture.',
  editorial_theme_authors:
    'I help multi-author publications scale their content operations through custom editorial themes with author management.',
  custom_lms_payment_bridge:
    'I help course creators monetize globally through custom payment gateways integrated with their LearnDash LMS.',
  member_only_content_plugin:
    'I help subscription site owners secure recurring revenue through custom member-only content plugins with tiered access.',
  custom_checkout_flow_plugin:
    'I help WooCommerce stores reduce cart abandonment through custom checkout flows built for their unique products.',
  automated_delivery_plugin:
    'I help digital product sellers eliminate delivery headaches through automated file distribution and license key management.',
  platform_migration_seo_preservation:
    'I help business owners transition from Wix to WordPress without losing SEO rankings through careful 301 redirects and content migration.',
  host_migration_zero_downtime:
    'I help website owners upgrade their hosting without losing traffic through zero-downtime server migrations.',
  speed_optimisation_audit:
    'I help WooCommerce store owners recover lost sales through comprehensive speed optimization audits and implementation.',
  mvp_ui_kit_5_screens:
    'I help pre-seed founders raise their first round through investor-ready UI kits that make their vision tangible.',
  investor_deck_prototype:
    'I help early-stage startups close funding through interactive prototypes and investor decks that tell a compelling product story.',
  dashboard_ui_redesign_3_views:
    'I help B2B SaaS companies retain users through intuitive dashboard redesigns that make complex data simple.',
  personal_brand_identity:
    'I help LinkedIn thought leaders command higher speaking fees through cohesive brand identities that build instant credibility.',
  creator_brand_kit_multi_platform:
    'I help creator economy founders build recognizable brands across every platform through comprehensive visual identity systems.',
  product_packaging_storefront:
    'I help DTC supplement brands boost shelf conversion through professional packaging and cohesive storefront design.',
  conversion_funnel_ux_audit:
    'I help DTC brands recover abandoned revenue through data-driven UX audits that pinpoint checkout friction.',
  onboarding_flow_ux_review:
    'I help content platforms improve user activation through UX reviews that transform onboarding drop-offs into active users.',
};

const weights: Record<string, { demand: number; competition: number; execution_speed: number }> = {
  weekly_reel_batch_5: { demand: 9, competition: 8, execution_speed: 9 },
  challenge_series_pack: { demand: 8, competition: 7, execution_speed: 7 },
  recipe_demo_edit_pack: { demand: 7, competition: 6, execution_speed: 8 },
  property_tour_reel_24h: { demand: 7, competition: 5, execution_speed: 9 },
  listing_showreel_monthly: { demand: 6, competition: 4, execution_speed: 7 },
  linkedin_tl_edit: { demand: 8, competition: 6, execution_speed: 8 },
  lecture_edit_chapters: { demand: 6, competition: 5, execution_speed: 6 },
  tutorial_post_production: { demand: 6, competition: 4, execution_speed: 7 },
  full_podcast_episode_edit: { demand: 8, competition: 6, execution_speed: 8 },
  podcast_full_cleanup_show_notes: { demand: 7, competition: 5, execution_speed: 9 },
  podcast_video_audiogram_package: { demand: 7, competition: 5, execution_speed: 7 },
  narrative_edit_sound_design: { demand: 5, competition: 3, execution_speed: 4 },
  five_page_business_theme: { demand: 7, competition: 6, execution_speed: 6 },
  ecommerce_theme_product_catalog: { demand: 6, competition: 5, execution_speed: 5 },
  blog_theme_newsletter: { demand: 5, competition: 4, execution_speed: 7 },
  editorial_theme_authors: { demand: 4, competition: 3, execution_speed: 6 },
  custom_lms_payment_bridge: { demand: 6, competition: 4, execution_speed: 5 },
  member_only_content_plugin: { demand: 5, competition: 4, execution_speed: 6 },
  custom_checkout_flow_plugin: { demand: 6, competition: 5, execution_speed: 6 },
  automated_delivery_plugin: { demand: 5, competition: 4, execution_speed: 7 },
  platform_migration_seo_preservation: { demand: 6, competition: 4, execution_speed: 6 },
  host_migration_zero_downtime: { demand: 5, competition: 3, execution_speed: 7 },
  speed_optimisation_audit: { demand: 7, competition: 5, execution_speed: 6 },
  mvp_ui_kit_5_screens: { demand: 9, competition: 7, execution_speed: 7 },
  investor_deck_prototype: { demand: 7, competition: 5, execution_speed: 6 },
  dashboard_ui_redesign_3_views: { demand: 7, competition: 6, execution_speed: 5 },
  personal_brand_identity: { demand: 6, competition: 5, execution_speed: 8 },
  creator_brand_kit_multi_platform: { demand: 6, competition: 4, execution_speed: 7 },
  product_packaging_storefront: { demand: 6, competition: 5, execution_speed: 6 },
  conversion_funnel_ux_audit: { demand: 7, competition: 5, execution_speed: 8 },
  onboarding_flow_ux_review: { demand: 6, competition: 4, execution_speed: 8 },
};

// Matches pattern: deliveryFormat: '...', followed by newline + clientSources
// We insert positioningTemplate and simulatorWeights between them.
const regex = /(deliveryFormat:\s*'[^']+')\n(\s+)(clientSources:)/g;

content = content.replace(regex, (match, deliveryLine, indent, clientSourcesLine) => {
  return `${deliveryLine}\n${indent}positioningTemplate: 'POSITIONING_PLACEHOLDER',\n${indent}simulatorWeights: { demand: 0, competition: 0, execution_speed: 0 },\n${indent}${clientSourcesLine}`;
});

// Now replace placeholders with actual values by finding offer IDs
// We need to replace POSITIONING_PLACEHOLDER for each offer
// Let's do a second pass: find each offer block by id, extract the id, replace placeholder
for (const [id, text] of Object.entries(positionings)) {
  // Find this offer's placement by its id
  const idPattern = new RegExp(`(id:\\s*'${id}')`, 'g');
  // Find the POSITIONING_PLACEHOLDER after this specific offer block
  let idx = 0;
  let pos = content.indexOf(`id: '${id}'`, idx);
  while (pos !== -1) {
    const placeholderPos = content.indexOf("'POSITIONING_PLACEHOLDER'", pos);
    if (placeholderPos !== -1 && placeholderPos < pos + 2000) {
      content = content.substring(0, placeholderPos) + `'${text}'` + content.substring(placeholderPos + 26);
      break;
    }
    idx = pos + 1;
    pos = content.indexOf(`id: '${id}'`, idx);
  }
}

// Now replace simulator weight placeholders
for (const [id, w] of Object.entries(weights)) {
  let idx = 0;
  let pos = content.indexOf(`id: '${id}'`, idx);
  while (pos !== -1) {
    // Find the simulatorWeights block for this offer
    const swPos = content.indexOf('simulatorWeights:', pos);
    if (swPos !== -1 && swPos < pos + 2000) {
      const bracketOpen = content.indexOf('{', swPos);
      const bracketClose = content.indexOf('}', bracketOpen);
      if (bracketOpen !== -1 && bracketClose !== -1) {
        const replacement = `simulatorWeights: { demand: ${w.demand}, competition: ${w.competition}, execution_speed: ${w.execution_speed} }`;
        content =
          content.substring(0, swPos) +
          replacement +
          content.substring(bracketClose + 1);
        break;
      }
    }
    idx = pos + 1;
    pos = content.indexOf(`id: '${id}'`, idx);
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Transformation complete.');
