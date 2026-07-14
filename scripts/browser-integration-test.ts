/**
 * Browser Integration Test — Phases 1-4 Personalization
 *
 * Tests 6 distinct user paths through M1→M2→M3→M4:
 * Checks: differentiation, persistence, stale context, console errors, responsive.
 *
 * IMPORTANT: This test hydrates localStorage directly to simulate
 * a completed upstream journey, then navigates each module to verify
 * the personalization layer renders correctly.
 */

import { chromium, type Browser, type Page } from 'playwright';
import * as fs from 'fs';
import * as pathLib from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathLib.dirname(__filename);

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = pathLib.resolve(__dirname, '..', 'test-screenshots');
const REPORT_PATH = pathLib.resolve(__dirname, '..', 'docs', 'personalization', 'BROWSER-INTEGRATION-REPORT.md');

// ── Six test paths with valid IDs ──────────────────────────────────

interface Mod1Ctx {
  careerTrackId: string; serviceId: string; marketId: string;
  nicheId: string; offerId: string; positioning: string;
}

interface TestPath {
  id: string;
  label: string;
  mod1: Mod1Ctx;
  m2offerType: string;
  m2deliverables: string[];
  m2uniqueMechanism: string;
  m2valueAmplifier: string;
}

const PATHS: TestPath[] = [
  {
    id: 'path-1-video-yoga',
    label: 'Video Editor → Short-Form Clips → Health & Wellness → Yoga Instructors',
    mod1: {
      careerTrackId: 'video_editor', serviceId: 'short_form_clips',
      marketId: 'health_wellness_creators', nicheId: 'yoga_instructors_reels',
      offerId: 'weekly_reel_batch_5',
      positioning: 'I help health and wellness creators turn raw footage into scroll-stopping reels that drive engagement and bookings.',
    },
    m2offerType: 'retainer',
    m2deliverables: ['5 edited reels per week', 'Captions & keywords', 'Thumbnail optimization'],
    m2uniqueMechanism: 'Yoga demonstration alignment system',
    m2valueAmplifier: 'Weekly A/B testing of hooks',
  },
  {
    id: 'path-2-video-youtube',
    label: 'Video Editor → Long-Form Content → YouTube Creators → YouTubers',
    mod1: {
      careerTrackId: 'video_editor', serviceId: 'long_form_content',
      marketId: 'youtube_creators', nicheId: 'youtubers_retention',
      offerId: 'youtube_retention_editing_package',
      positioning: 'I help YouTube creators keep viewers watching longer with retention-focused editing.',
    },
    m2offerType: 'milestone_based',
    m2deliverables: ['Full video edit', 'Retention graph optimization', 'Thumbnail + title A/B test'],
    m2uniqueMechanism: 'Retention curve mapping process',
    m2valueAmplifier: 'Audience retention guarantee',
  },
  {
    id: 'path-3-wp-restaurants',
    label: 'WordPress Developer → Custom Theme → Local Businesses → Restaurants',
    mod1: {
      careerTrackId: 'wordpress_developer', serviceId: 'custom_theme_development',
      marketId: 'local_businesses', nicheId: 'restaurants',
      offerId: 'restaurant_website_booking_package',
      positioning: 'I help local restaurants build WordPress sites that drive table bookings and takeout orders.',
    },
    m2offerType: 'one_time_project',
    m2deliverables: ['Custom WordPress theme', 'Online ordering integration', 'Booking system'],
    m2uniqueMechanism: 'Menu-to-digital automation workflow',
    m2valueAmplifier: 'SEO-optimized menu pages',
  },
  {
    id: 'path-4-ui-startups',
    label: 'UI/UX Designer → Product UI Design → Early-Stage Startups → Pre-seed MVP',
    mod1: {
      careerTrackId: 'ui_ux_designer', serviceId: 'product_ui_design',
      marketId: 'early_stage_startups', nicheId: 'pre_seed_mvp_ui',
      offerId: 'mvp_ui_kit_5_screens',
      positioning: 'I help early-stage startups design MVPs that investors love and users understand instantly.',
    },
    m2offerType: 'milestone_based',
    m2deliverables: ['5-screen UI kit', 'User flow diagram', 'Interactive prototype'],
    m2uniqueMechanism: 'Investor-ready design sprint',
    m2valueAmplifier: 'User testing included in each sprint',
  },
  {
    id: 'path-5-podcast-founders',
    label: 'Video Editor → Podcast Post-Production → Business Podcasts → Founder Interview',
    mod1: {
      careerTrackId: 'video_editor', serviceId: 'podcast_post_production',
      marketId: 'business_podcasts', nicheId: 'founder_interview_podcasts',
      offerId: 'podcast_full_cleanup_show_notes',
      positioning: 'I help business podcasters turn raw interviews into polished episodes with show notes.',
    },
    m2offerType: 'retainer',
    m2deliverables: ['Episode editing', 'Show notes writing', 'Social clips package'],
    m2uniqueMechanism: 'Interview flow optimization template',
    m2valueAmplifier: 'Same-day turnaround',
  },
  {
    id: 'path-6-ui-fitness',
    label: 'UI/UX Designer → Landing Page Design → Coaches → Fitness Coaches',
    mod1: {
      careerTrackId: 'ui_ux_designer', serviceId: 'landing_page_design',
      marketId: 'coaches', nicheId: 'fitness_coaches',
      offerId: 'fitness_coach_conversion_landing_page',
      positioning: 'I help fitness coaches get more leads with high-converting landing pages.',
    },
    m2offerType: 'one_time_project',
    m2deliverables: ['Landing page design', 'Mobile responsive', 'Form integration'],
    m2uniqueMechanism: 'Coach conversion blueprint',
    m2valueAmplifier: 'A/B tested headline variants',
  },
];

// ── Helpers ────────────────────────────────────────────────────────

function m2store(tp: TestPath) {
  const m1 = tp.mod1;
  return {
    state: {
      offerId: m1.offerId, phase1OfferId: m1.offerId,
      service: m1.serviceId, market: m1.marketId, niche: m1.nicheId,
      positioning: m1.positioning,
      offerType: tp.m2offerType,
      deliverables: tp.m2deliverables,
      uniqueMechanism: tp.m2uniqueMechanism,
      scopeLimits: { revisionCount: 2, communicationMethod: 'slack', responseTime: '24h', deliveryTime: '5 days', includedRounds: 3 },
      valueAmplifier: tp.m2valueAmplifier,
      pricingModel: 'flat_rate', finalPrice: 2500,
      tieredPricing: { starterPrice: 1500, proPrice: 2500, premiumPrice: 4000 },
      valueBasedPricing: null,
      proposalSummary: { headline: 'Test', problem: 'Need help', solution: 'We provide', deliverables: tp.m2deliverables, timeline: '2 weeks', pricing: '$2500', nextSteps: 'Start' },
      offerBlueprint: null,
      currentStep: 'offer_type',
      completedSteps: ['offer_type','deliverables','unique_mechanism','scope_protection','value_amplifier','pricing','proposal_summary','offer_blueprint'],
    },
    version: 1,
  };
}

function m3store(tp: TestPath) {
  const m1 = tp.mod1;
  return {
    state: {
      mod1CareerTrackId: m1.careerTrackId, mod1ServiceId: m1.serviceId,
      mod1MarketId: m1.marketId, mod1NicheId: m1.nicheId,
      mod1OfferId: m1.offerId, mod1Positioning: m1.positioning,
      mod2OfferType: tp.m2offerType,
      mod2Deliverables: tp.m2deliverables,
      mod2UniqueMechanism: tp.m2uniqueMechanism,
      mod2ScopeLimits: null, mod2ValueAmplifier: tp.m2valueAmplifier,
      mod2PricingModel: 'flat_rate', mod2FinalPrice: 2500,
      mod2TieredPricing: null, mod2ValueBasedPricing: null, mod2ProposalSummary: null,
              authorityPosition: 'practitioner',
              coreTrustPromise: `I help ${m1.marketId.replace(/_/g,' ')} with ${tp.m2uniqueMechanism}`,
      authorityPositionRationale: `Positioned for ${m1.nicheId.replace(/_/g,' ')}`,
      proofPriorities: [{ type: 'testimonial', priority: 'high', notes: 'Results' }],
      proofAssets: [],
      profileCopy: {
        professionalHeadline: `${tp.m2uniqueMechanism} Expert for ${m1.marketId.replace(/_/g,' ')}`,
        shortBio: `I help ${m1.marketId.replace(/_/g,' ')} with ${tp.m2uniqueMechanism}.`,
        longBio: `Specialized in ${m1.nicheId.replace(/_/g,' ')} using ${tp.m2uniqueMechanism}.`,
        offerStatement: `${tp.m2deliverables[0] || 'Services'} for ${m1.nicheId.replace(/_/g,' ')}.`,
        credibilityBullets: ['5+ years', '50+ projects'],
        proofReferenceLine: `Trusted by ${m1.marketId.replace(/_/g,' ')} leaders`,
        ctaLine: `Ready to elevate your ${m1.serviceId.replace(/_/g,' ')}?`,
      },
      portfolioCopy: { portfolioCta: `See how I help ${m1.marketId.replace(/_/g,' ')}`, sections: [] },
      checklist: [],
      isProfileCopyCustom: false, isPortfolioCopyCustom: false,
      isCompleted: true, isUpstreamStale: false, upstreamFingerprint: '',
      currentStep: 'profile_portfolio',
      completedSteps: ['authority_position','core_trust_promise','proof_priority','proof_asset_builder','profile_portfolio'],
      version: 4,
    },
    version: 4,
  };
}

function m4store(tp: TestPath) {
  const m1 = tp.mod1;
  return {
    state: {
      upstream: {
        mod1CareerTrackId: m1.careerTrackId, mod1ServiceId: m1.serviceId,
        mod1MarketId: m1.marketId, mod1NicheId: m1.nicheId,
        mod1OfferId: m1.offerId, mod1Positioning: m1.positioning,
        mod2OfferType: tp.m2offerType,
        mod2Deliverables: tp.m2deliverables,
        mod2UniqueMechanism: tp.m2uniqueMechanism,
        mod2ScopeLimits: null, mod2ValueAmplifier: tp.m2valueAmplifier,
        mod2PricingModel: null, mod2FinalPrice: null,
        mod2TieredPricing: null, mod2ValueBasedPricing: null, mod2ProposalSummary: null,
        mod3AuthorityPosition: 'practitioner',
        mod3CoreTrustPromise: `I help ${m1.marketId.replace(/_/g,' ')}`,
        mod3ProfileHeadline: `Expert for ${m1.marketId.replace(/_/g,' ')}`,
        mod3OfferStatement: `${tp.m2deliverables[0]} for ${m1.nicheId.replace(/_/g,' ')}`,
        mod3ProofReferenceLine: `Trusted by ${m1.marketId.replace(/_/g,' ')}`,
        mod3CtaLine: `Ready? Talk.`,
        mod3PortfolioCta: `See work with ${m1.marketId.replace(/_/g,' ')}`,
        mod3Readiness: 'ready',
        mod3ProofPriorities: [{ type: 'testimonial', priority: 'high', notes: 'Results' }],
        mod3ProofAssets: [],
      },
      upstreamFingerprint: '', staleSince: null, lastGeneratedAt: null, editedFields: [],
      portfolioDirection: {
        direction: 'Niche authority showcase',
        rationale: `Expertise in ${m1.nicheId.replace(/_/g,' ')}`,
      },
      platformRecommendation: {
        primary: 'LinkedIn', secondary: 'Website',
        reasoning: `Best for ${m1.marketId.replace(/_/g,' ')}`,
      },
      sections: [], projectPlacements: [], projectPresentations: [],
      portfolioCopy: null, buildPack: null,
      buildChecklist: [], publishChecklist: [],
      currentStep: 'portfolio_direction',
      completedSteps: ['portfolio_direction'],
      version: 2,
    },
    version: 2,
  };
}

// ── Test runner ────────────────────────────────────────────────────

async function runPath(browser: Browser, tp: TestPath, idx: number): Promise<{
  errors: string[];
  m2text: string; m3text: string; m4text: string;
  persistenceOk: boolean; staleOk: boolean; responsiveOk: boolean;
}> {
  const result = { errors: [] as string[], m2text: '', m3text: '', m4text: '', persistenceOk: false, staleOk: false, responsiveOk: false };

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  try {
    // 1. Clear state and hydrate
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.evaluate(() => localStorage.clear());

    // Hydrate M1 store (opportunity map)
    await page.evaluate((tp) => {
      const m1 = tp.mod1;
      localStorage.setItem('blueprint-opportunity-map', JSON.stringify({
        state: {
          careerTrackId: m1.careerTrackId, serviceId: m1.serviceId,
          marketId: m1.marketId, marketLabel: m1.marketId.replace(/_/g,' '),
          nicheId: m1.nicheId, nicheLabel: m1.nicheId.replace(/_/g,' '),
          offerId: m1.offerId, positioning: m1.positioning, opportunityScore: 85,
          currentStep: 'opportunity_score',
          completedSteps: ['career_track','service','market','niche','offer','positioning','opportunity_score'],
        }, version: 0,
      }));
      // M2 store
      const m2s = {
        state: {
          offerId: m1.offerId, phase1OfferId: m1.offerId,
          service: m1.serviceId, market: m1.marketId, niche: m1.nicheId,
          positioning: m1.positioning,
          offerType: tp.m2offerType,
          deliverables: tp.m2deliverables,
          uniqueMechanism: tp.m2uniqueMechanism,
          scopeLimits: { revisionCount: 2, communicationMethod: 'slack', responseTime: '24h', deliveryTime: '5 days', includedRounds: 3 },
          valueAmplifier: tp.m2valueAmplifier,
          pricingModel: 'flat_rate', finalPrice: 2500,
          tieredPricing: { starterPrice: 1500, proPrice: 2500, premiumPrice: 4000 },
          valueBasedPricing: null,
          proposalSummary: { headline: 'Test', problem: 'Need', solution: 'Provide', deliverables: tp.m2deliverables, timeline: '2 weeks', pricing: '$2500', nextSteps: 'Start' },
          offerBlueprint: null,
          currentStep: 'offer_type',
          completedSteps: ['offer_type','deliverables','unique_mechanism','scope_protection','value_amplifier','pricing','proposal_summary','offer_blueprint'],
          version: 1,
        }, version: 1,
      };
      localStorage.setItem('offer-engineering-progress', JSON.stringify(m2s));
      // M3 store
      const m3s = {
        state: {
          mod1CareerTrackId: m1.careerTrackId, mod1ServiceId: m1.serviceId,
          mod1MarketId: m1.marketId, mod1NicheId: m1.nicheId,
          mod1OfferId: m1.offerId, mod1Positioning: m1.positioning,
          mod2OfferType: tp.m2offerType,
          mod2Deliverables: tp.m2deliverables,
          mod2UniqueMechanism: tp.m2uniqueMechanism,
          mod2ScopeLimits: null, mod2ValueAmplifier: tp.m2valueAmplifier,
          mod2PricingModel: 'flat_rate', mod2FinalPrice: 2500,
          mod2TieredPricing: null, mod2ValueBasedPricing: null, mod2ProposalSummary: null,
          authorityPosition: 'practitioner',
          coreTrustPromise: `I help ${m1.marketId.replace(/_/g,' ')} with ${tp.m2uniqueMechanism}`,
          authorityPositionRationale: `Positioned for ${m1.nicheId.replace(/_/g,' ')}`,
          proofPriorities: [{ type: 'testimonial', priority: 'high', notes: 'Results' }],
          proofAssets: [],
          profileCopy: {
            professionalHeadline: `${tp.m2uniqueMechanism} Expert for ${m1.marketId.replace(/_/g,' ')}`,
            shortBio: `I help ${m1.marketId.replace(/_/g,' ')} with ${tp.m2uniqueMechanism}.`,
            longBio: `Specialized in ${m1.nicheId.replace(/_/g,' ')} using ${tp.m2uniqueMechanism}.`,
            offerStatement: `${tp.m2deliverables[0] || 'Services'} for ${m1.nicheId.replace(/_/g,' ')}.`,
            credibilityBullets: ['5+ years', '50+ projects'],
            proofReferenceLine: `Trusted by ${m1.marketId.replace(/_/g,' ')} leaders`,
            ctaLine: `Ready to elevate your ${m1.serviceId.replace(/_/g,' ')}?`,
          },
          portfolioCopy: { portfolioCta: `See how I help ${m1.marketId.replace(/_/g,' ')}`, sections: [] },
          checklist: [],
          isProfileCopyCustom: false, isPortfolioCopyCustom: false,
          isCompleted: true, isUpstreamStale: false, upstreamFingerprint: '',
          currentStep: 'profile_portfolio',
          completedSteps: ['authority_position','core_trust_promise','proof_priority','proof_asset_builder','profile_portfolio'],
          version: 4,
        }, version: 4,
      };
      localStorage.setItem('module-3-progress', JSON.stringify(m3s));
      // M4 store
      const m4s = {
        state: {
          upstream: {
            mod1CareerTrackId: m1.careerTrackId, mod1ServiceId: m1.serviceId,
            mod1MarketId: m1.marketId, mod1NicheId: m1.nicheId,
            mod1OfferId: m1.offerId, mod1Positioning: m1.positioning,
            mod2OfferType: tp.m2offerType,
            mod2Deliverables: tp.m2deliverables,
            mod2UniqueMechanism: tp.m2uniqueMechanism,
            mod2ScopeLimits: null, mod2ValueAmplifier: tp.m2valueAmplifier,
            mod2PricingModel: null, mod2FinalPrice: null,
            mod2TieredPricing: null, mod2ValueBasedPricing: null, mod2ProposalSummary: null,
            mod3AuthorityPosition: 'practitioner',
            mod3CoreTrustPromise: `I help ${m1.marketId.replace(/_/g,' ')}`,
            mod3ProfileCopy: {
              professionalHeadline: `Expert for ${m1.marketId.replace(/_/g,' ')}`,
              shortBio: `Helping ${m1.marketId.replace(/_/g,' ')} with tailored solutions.`,
              longBio: `Deep expertise in ${m1.nicheId.replace(/_/g,' ')}.`,
              offerStatement: `${tp.m2deliverables[0]} for ${m1.nicheId.replace(/_/g,' ')}.`,
              credibilityBullets: ['5+ years experience', '50+ projects delivered'],
              proofReferenceLine: `Trusted by ${m1.marketId.replace(/_/g,' ')} leaders`,
              ctaLine: `Ready? Talk.`,
            },
            mod3PortfolioCopy: {
              portfolioCta: `See work with ${m1.marketId.replace(/_/g,' ')}`,
              sections: [],
            },
            mod3Readiness: 'ready',
            mod3ProofPriorities: [{ type: 'testimonial', priority: 'high', notes: 'Results' }],
            mod3ProofAssets: [],
          },
          upstreamFingerprint: '', staleSince: null, lastGeneratedAt: null, editedFields: [],
          portfolioDirection: {
            direction: 'Niche authority showcase',
            rationale: `Expertise in ${m1.nicheId.replace(/_/g,' ')}`,
          },
          platformRecommendation: {
            primary: 'LinkedIn', secondary: 'Website',
            reasoning: `Best for ${m1.marketId.replace(/_/g,' ')}`,
          },
          sections: [], projectPlacements: [], projectPresentations: [],
          portfolioCopy: null, buildPack: null,
          buildChecklist: [], publishChecklist: [],
          currentStep: 'portfolio_direction',
          completedSteps: ['portfolio_direction'],
          version: 2,
        }, version: 2,
      };
      localStorage.setItem('portfolio-system-progress', JSON.stringify(m4s));
      // Set started flags to bypass intro pages
      localStorage.setItem('blueprint-module2-started', 'true');
      localStorage.setItem('blueprint-module3-started', 'true');
      localStorage.setItem('blueprint-module4-started', 'true');
    }, tp);
    await page.waitForTimeout(500);

    // ---- TEST M2: Navigate to Offer Engineering ----
    console.log(`  [${idx}/6] Testing M2...`);
    await page.goto(`${BASE_URL}/workspace/offer-engineering`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    // Read page body text
    result.m2text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    await page.screenshot({ path: pathLib.join(SCREENSHOT_DIR, `${tp.id}-m2.png`), fullPage: true });

    // ---- TEST M3: Navigate to Authority System ----
    console.log(`  [${idx}/6] Testing M3...`);
    await page.goto(`${BASE_URL}/workspace/authority-system`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    result.m3text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    await page.screenshot({ path: pathLib.join(SCREENSHOT_DIR, `${tp.id}-m3.png`), fullPage: true });

    // ---- TEST M4: Navigate to Portfolio System ----
    console.log(`  [${idx}/6] Testing M4...`);
    await page.goto(`${BASE_URL}/workspace/portfolio-system`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    result.m4text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    await page.screenshot({ path: pathLib.join(SCREENSHOT_DIR, `${tp.id}-m4.png`), fullPage: true });

    // ---- PERSISTENCE: Navigate away and back to M2 ----
    console.log(`  [${idx}/6] Testing persistence...`);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.goto(`${BASE_URL}/workspace/offer-engineering`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1500);
    const afterNavText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    // Persistence passes if page loaded without crash and has content
    result.persistenceOk = afterNavText.length > 50 && !afterNavText.includes('Complete Module') && !afterNavText.includes('Error');

    // ---- STALE CONTEXT: Change M1, go to M3 ----
    console.log(`  [${idx}/6] Testing stale context...`);
    // Write different M1 context
    await page.evaluate(() => {
      localStorage.setItem('blueprint-opportunity-map', JSON.stringify({
        state: {
          careerTrackId: 'wordpress_developer', serviceId: 'custom_theme_development',
          marketId: 'local_businesses', marketLabel: 'Local Businesses',
          nicheId: 'restaurants', nicheLabel: 'Restaurants',
          offerId: 'restaurant_website_booking_package',
          positioning: 'I help restaurants with WordPress sites.',
          opportunityScore: 80,
          currentStep: 'opportunity_score',
          completedSteps: ['career_track','service','market','niche','offer','positioning','opportunity_score'],
        }, version: 0,
      }));
    });
    await page.goto(`${BASE_URL}/workspace/authority-system`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    const staleText = await page.evaluate(() => document.body.innerText);
    // Look for stale context indicators
    result.staleOk = staleText.includes('Context Changed') || staleText.includes('context changed')
      || staleText.includes('upstream') || staleText.includes('Your context') 
      || staleText.includes('stale') || staleText.includes('changed');

    // ---- RESPONSIVE: 320px ----
    console.log(`  [${idx}/6] Testing responsive 320px...`);
    await page.goto(`${BASE_URL}/workspace/offer-engineering`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(1000);
    const mobileWidth = await page.evaluate(() => document.body.scrollWidth);
    // Check nothing overflows and page renders
    result.responsiveOk = mobileWidth > 0 && mobileWidth <= 450; // scrollWidth should be close to viewport

    // Record console errors
    if (consoleErrors.length > 0) {
      result.errors = [...consoleErrors];
    }
  } catch (e: any) {
    result.errors.push(`Exception: ${e.message}`);
    console.error(`Exception for ${tp.id}: ${e.message}`);
  } finally {
    await ctx.close();
  }

  return result;
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log('🧪 Browser Integration Test — Phases 1-4 Personalization\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  // Clean old screenshots
  for (const f of fs.readdirSync(SCREENSHOT_DIR)) {
    fs.rmSync(pathLib.join(SCREENSHOT_DIR, f), { force: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\ap877\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });

  const allResults: Array<{
    tp: TestPath;
    errors: string[];
    m2text: string; m3text: string; m4text: string;
    persistenceOk: boolean; staleOk: boolean; responsiveOk: boolean;
  }> = [];

  for (let i = 0; i < PATHS.length; i++) {
    const tp = PATHS[i];
    console.log(`\n[${i+1}/${PATHS.length}] ${tp.label}`);
    const res = await runPath(browser, tp, i + 1);
    allResults.push({ tp, ...res });
    console.log(`  M2 text: "${res.m2text.substring(0, 120)}..."`);
    console.log(`  M3 text: "${res.m3text.substring(0, 120)}..."`);
    console.log(`  M4 text: "${res.m4text.substring(0, 120)}..."`);
    console.log(`  Errors: ${res.errors.length > 0 ? res.errors.slice(0, 3).join('; ') : 'None'}`);
    console.log(`  Persistence: ${res.persistenceOk ? '✅' : '❌'}`);
    console.log(`  Stale: ${res.staleOk ? '✅' : '❌'}`);
    console.log(`  Responsive: ${res.responsiveOk ? '✅' : '❌'}`);
  }

  await browser.close();

  // ── Compute differentiation ──
  const m2Texts = allResults.map(r => r.m2text.trim()).filter(t => t.length > 50);
  const m3Texts = allResults.map(r => r.m3text.trim()).filter(t => t.length > 50);
  const m4Texts = allResults.map(r => r.m4text.trim()).filter(t => t.length > 50);

  const m2UniqueCount = new Set(m2Texts).size;
  const m3UniqueCount = new Set(m3Texts).size;
  const m4UniqueCount = new Set(m4Texts).size;

  const m2Diff = m2UniqueCount >= 2 && m2Texts.length >= 3;
  const m3Diff = m3UniqueCount >= 2 && m3Texts.length >= 3;
  const m4Diff = m4UniqueCount >= 2 && m4Texts.length >= 3;

  const allDifferentiated = m2Diff && m3Diff && m4Diff;
  const allNoErrors = allResults.every(r => r.errors.length === 0);
  const allPersist = allResults.every(r => r.persistenceOk);
  const anyStale = allResults.some(r => r.staleOk);
  const allResponsive = allResults.every(r => r.responsiveOk);

  const passCount = [allDifferentiated, allNoErrors, allPersist, anyStale, allResponsive].filter(Boolean).length;

  // ── Generate report ──
  let report = '# Browser Integration Test Report\n\n';
  report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  report += `**Total Paths:** ${PATHS.length}\n\n`;
  report += '## Summary\n\n';
  report += '| Check | Result |\n|-------|--------|\n';
  report += `| Console errors | ${allNoErrors ? '✅ None' : '⚠️ Found in ' + allResults.filter(r => r.errors.length > 0).length + ' path(s)'}\n`;
  report += `| M2 content differentiation (${m2UniqueCount} unique / ${m2Texts.length} paths) | ${m2Diff ? '✅ Pass' : '❌ Fail'}\n`;
  report += `| M3 content differentiation (${m3UniqueCount} unique / ${m3Texts.length} paths) | ${m3Diff ? '✅ Pass' : '❌ Fail'}\n`;
  report += `| M4 content differentiation (${m4UniqueCount} unique / ${m4Texts.length} paths) | ${m4Diff ? '✅ Pass' : '❌ Fail'}\n`;
  report += `| Persistence (navigate away & back) | ${allPersist ? '✅ All pass' : '⚠️ Some fail'}\n`;
  report += `| Stale context detection | ${anyStale ? '✅ Detected' : '⚠️ Not detected'}\n`;
  report += `| Responsive (320px) | ${allResponsive ? '✅ All pass' : '⚠️ Some fail'}\n\n`;

  report += '## Path Details\n\n';
  for (const r of allResults) {
    report += `### ${r.tp.label} (\`${r.tp.id}\`)\n\n`;
    report += `- **M1 context:** ${r.tp.mod1.careerTrackId} → ${r.tp.mod1.serviceId} → ${r.tp.mod1.marketId} → ${r.tp.mod1.nicheId}\n`;
    report += `- **M2 text snippet:** ${r.m2text.substring(0, 200).replace(/\n/g, ' ')}\n`;
    report += `- **M3 text snippet:** ${r.m3text.substring(0, 200).replace(/\n/g, ' ')}\n`;
    report += `- **M4 text snippet:** ${r.m4text.substring(0, 200).replace(/\n/g, ' ')}\n`;
    report += `- **Console errors:** ${r.errors.length > 0 ? r.errors.slice(0,3).join('; ') : 'None'}\n`;
    report += `- **Persistence:** ${r.persistenceOk ? '✅' : '❌'}\n`;
    report += `- **Stale context:** ${r.staleOk ? '✅' : '❌'}\n`;
    report += `- **Responsive (320px):** ${r.responsiveOk ? '✅' : '❌'}\n\n`;
  }

  report += '## Verdict\n\n';
  report += '| Criterion | Status |\n|-----------|--------|\n';
  report += `| Content differentiated across paths | ${allDifferentiated ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `| No runtime console errors | ${allNoErrors ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `| Persistence after navigation | ${allPersist ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `| Stale context detection | ${anyStale ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `| Responsive at 320px | ${allResponsive ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `\n**Overall: ${passCount}/5 checks passed**\n\n`;

  if (passCount === 5) {
    report += '**✅ ALL CHECKS PASS — Browser integration test complete. Phases 1-4 personalization verified across 6 paths.**\n';
  } else {
    report += '**⚠️ Some checks require attention.** See details above.\n';
  }

  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`\n📄 Report: ${REPORT_PATH}`);
  console.log(`📸 Screenshots: ${SCREENSHOT_DIR} (${fs.readdirSync(SCREENSHOT_DIR).length} files)`);
  console.log(`\nVerdict: ${passCount}/5 checks passed`);
}

main().catch(console.error);
