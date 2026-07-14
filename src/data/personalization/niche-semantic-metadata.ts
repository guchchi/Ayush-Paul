import type { NicheSemanticMetadata, NicheResolution, NicheResolutionTier, AudienceType } from '../../lib/personalization/types';

/* ──────────────────────────────────────────────
   TIER A — EXPLICIT HIGH-VALUE OVERRIDES
   ────────────────────────────────────────────── */

const AUTHORED_OVERRIDES: Record<string, NicheSemanticMetadata> = {

  /* P0 — Cross-service niches (appear in 4+ paths) */
  fitness_coaches: {
    audienceLabel: 'Fitness Coaches', audienceType: 'coach',
    domainThemes: ['fitness', 'health', 'wellness', 'transformation', 'workout'],
    contentContexts: ['workout demonstrations', 'transformation stories', 'fitness tips', 'nutrition content', 'client progress'],
    buyerContexts: ['attract more coaching clients', 'look credible online', 'showcase transformations', 'compete with other fitness brands'],
    commonArtifacts: ['workout clip', 'transformation video', 'fitness template', 'nutrition guide visual', 'coaching package description'],
    exampleSubjects: ['workout clip before and after', 'client transformation highlight', 'fitness tip short-form video'],
    proofEmphasis: ['transformation evidence', 'client progress documentation', 'fitness knowledge demonstration'],
    actionContexts: ['schedule a consultation', 'book a free session', 'follow on social', 'join a fitness program'],
    languageTerms: ['transformation', 'results', 'progress', 'fitness journey', 'client success'],
    sectionEmphasis: ['selected_work', 'process', 'results_gallery'],
    avoidClaims: ['do not claim guaranteed fitness results', 'do not fabricate client transformation timelines', 'do not use fake before/after images'],
  },
  youtubers_retention: {
    audienceLabel: 'YouTubers', audienceType: 'creator',
    domainThemes: ['youtube', 'video content', 'retention', 'audience growth', 'long-form content'],
    contentContexts: ['retention analysis', 'content pacing', 'viewer engagement', 'video structure', 'channel strategy'],
    buyerContexts: ['improve watch time', 'keep viewers engaged longer', 'grow YouTube channel', 'produce better content faster'],
    commonArtifacts: ['retention graph', 'timeline comparison', 'edited video', 'pacing breakdown', 'chapter structure'],
    exampleSubjects: ['retention before and after', 'pacing breakdown example', 'timeline edit comparison'],
    proofEmphasis: ['retention data comparison', 'pacing improvement demonstration', 'viewer engagement analysis'],
    actionContexts: ['review a channel', 'request sample edit', 'discuss content strategy', 'book a call'],
    languageTerms: ['watch time', 'retention', 'audience retention graph', 'pacing', 'CTR', 'AVD'],
    sectionEmphasis: ['selected_work', 'retention_work', 'process'],
    avoidClaims: ['do not guarantee specific watch time increase', 'do not fabricate retention data', 'do not claim algorithm expertise'],
  },
  gaming_youtubers: {
    audienceLabel: 'Gaming Creators', audienceType: 'creator',
    domainThemes: ['gaming', 'stream highlights', 'esports', 'gaming content', 'twitch clips'],
    contentContexts: ['gaming highlights', 'stream moments', 'funny moments compilation', 'clip editing', 'commentary editing'],
    buyerContexts: ['stand out in gaming content', 'create viral moments', 'improve clip engagement', 'grow gaming audience'],
    commonArtifacts: ['gaming highlight reel', 'stream clip', 'funny moment compilation', 'commentary edit', 'gameplay trailer'],
    exampleSubjects: ['gaming moment highlight', 'stream clip before and after', 'commentary edit sample'],
    proofEmphasis: ['moment selection quality', 'pacing in gaming content', 'engagement optimization'],
    actionContexts: ['request sample edit', 'discuss content style', 'join discord', 'review channel'],
    languageTerms: ['highlight', 'stream', 'clip', 'moment', 'gameplay', 'viral', 'engagement'],
    sectionEmphasis: ['hook_gallery', 'selected_work', 'process'],
    avoidClaims: ['do not guarantee viral gaming content', 'do not fabricate stream growth numbers', 'do not claim esports expertise unless experienced'],
  },
  podcasters: {
    audienceLabel: 'Podcasters', audienceType: 'podcaster',
    domainThemes: ['podcasting', 'audio content', 'interview clips', 'episode highlights', 'audio storytelling'],
    contentContexts: ['episode repurposing', 'clip extraction', 'social media clips', 'shownotes', 'audiogram creation'],
    buyerContexts: ['reach new listeners', 'repurpose episodes for social', 'increase podcast visibility', 'save editing time'],
    commonArtifacts: ['podcast clip', 'audiogram', 'social highlight', 'episode teaser', 'quote card'],
    exampleSubjects: ['podcast clip extraction demo', 'audiogram creation sample', 'episode highlight reel'],
    proofEmphasis: ['moment selection judgment', 'audio clarity', 'content repurposing effectiveness'],
    actionContexts: ['listen to full episode', 'subscribe to podcast', 'request sample clip', 'discuss podcast strategy'],
    languageTerms: ['episode', 'clip', 'highlight', 'moment', 'listener', 'download', 'subscribe'],
    sectionEmphasis: ['clip_gallery', 'process', 'selected_work'],
    avoidClaims: ['do not guarantee download increase', 'do not fabricate listener statistics', 'do not claim audio engineering expertise'],
  },
  course_creators: {
    audienceLabel: 'Course Creators', audienceType: 'course_creator',
    domainThemes: ['online courses', 'educational content', 'student engagement', 'course production', 'learning materials'],
    contentContexts: ['lesson editing', 'course preview creation', 'student testimonial clips', 'promotional content', 'curriculum design visuals'],
    buyerContexts: ['sell more courses', 'increase student engagement', 'professional course production', 'stand out from competitors'],
    commonArtifacts: ['lesson sample', 'course promo video', 'curriculum overview', 'student testimonial', 'course preview clip'],
    exampleSubjects: ['lesson edit before and after', 'course promo reel sample', 'curriculum overview design'],
    proofEmphasis: ['educational clarity', 'student engagement understanding', 'professional production value'],
    actionContexts: ['request course sample', 'discuss production needs', 'book strategy call', 'review portfolio'],
    languageTerms: ['course', 'lesson', 'student', 'engagement', 'curriculum', 'enrollment', 'preview'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    avoidClaims: ['do not guarantee enrollment numbers', 'do not fabricate student results', 'do not claim teaching expertise'],
  },
  personal_brand_creators: {
    audienceLabel: 'Personal Brand Creators', audienceType: 'personal_brand',
    domainThemes: ['personal branding', 'content creation', 'thought leadership', 'social media presence', 'authentic content'],
    contentContexts: ['brand story content', 'thought leadership clips', 'personal content series', 'social media consistency', 'brand voice development'],
    buyerContexts: ['build a stronger personal brand', 'create consistent content', 'look professional online', 'save time on content creation'],
    commonArtifacts: ['brand introduction video', 'content series sample', 'social media post set', 'brand style sample', 'thought leadership clip'],
    exampleSubjects: ['brand story video sample', 'content series episode', 'social media template set'],
    proofEmphasis: ['brand consistency', 'authentic content creation', 'style versatility'],
    actionContexts: ['request brand sample', 'discuss content strategy', 'book consultation', 'review content library'],
    languageTerms: ['brand', 'content', 'authentic', 'consistent', 'audience', 'personal story', 'voice'],
    sectionEmphasis: ['selected_work', 'hero', 'content_series'],
    avoidClaims: ['do not guarantee follower growth', 'do not promise viral content', 'do not fabricate engagement metrics'],
  },
  restaurants: {
    audienceLabel: 'Restaurants', audienceType: 'local_business',
    domainThemes: ['restaurant', 'food service', 'local dining', 'hospitality', 'food marketing'],
    contentContexts: ['menu promotion', 'food photography', 'ambiance showcase', 'location highlighting', 'customer experience storytelling'],
    buyerContexts: ['attract more diners', 'showcase restaurant online', 'look professional', 'compete with other restaurants'],
    commonArtifacts: ['restaurant website', 'menu page', 'food photo gallery', 'location page', 'review page'],
    exampleSubjects: ['restaurant website before and after', 'menu page design sample', 'food gallery showcase'],
    proofEmphasis: ['visual presentation', 'local SEO awareness', 'professional online presence'],
    actionContexts: ['visit restaurant', 'book a table', 'view menu', 'call for reservation'],
    languageTerms: ['menu', 'dining', 'reservation', 'location', 'cuisine', 'ambiance', 'local'],
    sectionEmphasis: ['live_projects', 'process', 'local_examples'],
    avoidClaims: ['do not guarantee more customers', 'do not fabricate review data', 'do not promise specific revenue increase'],
  },
  local_business_owners: {
    audienceLabel: 'Local Business Owners', audienceType: 'local_business',
    domainThemes: ['local business', 'small business', 'main street', 'local services', 'community'],
    contentContexts: ['business website', 'local service page', 'customer testimonial', 'location content', 'service description'],
    buyerContexts: ['get more local customers', 'look professional online', 'compete with bigger businesses', 'simplify customer communication'],
    commonArtifacts: ['business website', 'service page', 'location page', 'contact form', 'review page'],
    exampleSubjects: ['local business website sample', 'service page redesign', 'contact form optimization example'],
    proofEmphasis: ['local relevance', 'professional quality', 'clear service communication'],
    actionContexts: ['visit store', 'call business', 'book appointment', 'request quote'],
    languageTerms: ['local', 'service', 'business', 'customer', 'professional', 'reliable', 'trusted'],
    sectionEmphasis: ['live_projects', 'process', 'local_examples'],
    avoidClaims: ['do not guarantee more foot traffic', 'do not promise specific revenue increase', 'do not fabricate customer testimonials'],
  },
  saas_startups: {
    audienceLabel: 'SaaS Startups', audienceType: 'startup',
    domainThemes: ['saas', 'software', 'product development', 'b2b', 'technology'],
    contentContexts: ['product demo', 'UI showcase', 'feature walkthrough', 'landing page', 'user onboarding flow'],
    buyerContexts: ['launch product faster', 'improve user experience', 'attract investors', 'stand out from competitors'],
    commonArtifacts: ['product demo', 'UI mockup set', 'feature walkthrough', 'landing page design', 'onboarding flow'],
    exampleSubjects: ['product demo sample', 'UI redesign before and after', 'landing page case study'],
    proofEmphasis: ['product quality', 'user-centered approach', 'execution speed'],
    actionContexts: ['request product demo', 'book strategy call', 'review portfolio', 'discuss project scope'],
    languageTerms: ['product', 'user experience', 'feature', 'onboarding', 'conversion', 'growth', 'iteration'],
    sectionEmphasis: ['implementation', 'process', 'live_projects', 'product_examples'],
    avoidClaims: ['do not guarantee product-market fit', 'do not fabricate user metrics', 'do not claim specific revenue impact'],
  },
  ecommerce_stores: {
    audienceLabel: 'Ecommerce Stores', audienceType: 'ecommerce',
    domainThemes: ['ecommerce', 'online store', 'product sales', 'retail', 'shopping'],
    contentContexts: ['product page', 'storefront design', 'cart flow', 'product photography', 'promotional content'],
    buyerContexts: ['sell more products online', 'improve store design', 'increase conversion', 'compete with larger stores'],
    commonArtifacts: ['product page design', 'store mockup', 'cart flow diagram', 'product photo set', 'promotional banner'],
    exampleSubjects: ['product page redesign sample', 'store design before and after', 'cart flow improvement example'],
    proofEmphasis: ['visual merchandising', 'user flow design', 'brand consistency'],
    actionContexts: ['visit online store', 'browse products', 'request design sample', 'book consultation'],
    languageTerms: ['product', 'store', 'cart', 'checkout', 'inventory', 'catalog', 'shopping'],
    sectionEmphasis: ['page_showcase', 'cta_focus', 'selected_work'],
    avoidClaims: ['do not guarantee sales increase', 'do not fabricate conversion rates', 'do not promise specific revenue growth'],
  },

  /* P1 — Editor-specific high-value niches */
  real_estate_agents: {
    audienceLabel: 'Real Estate Agents', audienceType: 'creator',
    domainThemes: ['real estate', 'property', 'housing', 'local market', 'home sales'],
    contentContexts: ['property showcase', 'neighborhood tour', 'listing promotion', 'agent introduction', 'market update'],
    buyerContexts: ['attract more home buyers', 'showcase properties better', 'look professional', 'build local authority'],
    commonArtifacts: ['property tour video', 'listing promo clip', 'neighborhood guide', 'agent introduction video'],
    exampleSubjects: ['property tour sample', 'listing promo before and after', 'neighborhood guide example'],
    proofEmphasis: ['visual presentation', 'property storytelling', 'local market knowledge'],
    actionContexts: ['view property listing', 'schedule a tour', 'contact agent', 'visit website'],
    languageTerms: ['property', 'home', 'listing', 'tour', 'neighborhood', 'buy', 'sell', 'market'],
    sectionEmphasis: ['selected_work', 'process', 'local_examples'],
    avoidClaims: ['do not guarantee home sale', 'do not fabricate property values', 'do not claim market expertise without license'],
  },
  business_coaches: {
    audienceLabel: 'Business Coaches', audienceType: 'coach',
    domainThemes: ['business coaching', 'entrepreneurship', 'leadership', 'business growth', 'consulting'],
    contentContexts: ['coaching content', 'thought leadership', 'client testimonial', 'workshop promotion', 'consultation process'],
    buyerContexts: ['attract more coaching clients', 'build authority', 'showcase coaching results', 'stand out from other coaches'],
    commonArtifacts: ['coaching promo video', 'client testimonial clip', 'workshop highlight', 'consultation walkthrough'],
    exampleSubjects: ['coaching content sample', 'client testimonial production', 'workshop promo edit'],
    proofEmphasis: ['thought leadership', 'client success documentation', 'professional presentation'],
    actionContexts: ['book a coaching call', 'download free resource', 'attend workshop', 'follow on LinkedIn'],
    languageTerms: ['coaching', 'business growth', 'leadership', 'strategy', 'results', 'transformation'],
    sectionEmphasis: ['process', 'case_studies', 'selected_work'],
    avoidClaims: ['do not guarantee business success', 'do not fabricate client revenue results', 'do not claim specific ROIs'],
  },
  newsletter_creators: {
    audienceLabel: 'Newsletter Creators', audienceType: 'creator',
    domainThemes: ['newsletters', 'email content', 'writing', 'audience building', 'digital publishing'],
    contentContexts: ['newsletter promotion', 'content upgrade visuals', 'audience growth content', 'welcome sequence', 'sponsorship materials'],
    buyerContexts: ['grow newsletter audience', 'improve visual content', 'create better promotional materials', 'monetize newsletter'],
    commonArtifacts: ['newsletter visual', 'promotional clip', 'welcome sequence design', 'sponsorship deck'],
    exampleSubjects: ['newsletter visual sample', 'promotional clip for newsletter', 'welcome sequence mockup'],
    proofEmphasis: ['visual content creation', 'audience engagement understanding', 'brand consistency'],
    actionContexts: ['subscribe to newsletter', 'request media kit', 'discuss sponsorship', 'book consultation'],
    languageTerms: ['newsletter', 'subscriber', 'audience', 'content', 'email', 'open rate', 'sponsorship'],
    sectionEmphasis: ['selected_work', 'process', 'content_series'],
    avoidClaims: ['do not guarantee subscriber growth', 'do not fabricate open rates', 'do not promise specific monetization outcomes'],
  },
  online_course_creators: {
    audienceLabel: 'Online Course Creators', audienceType: 'course_creator',
    domainThemes: ['online courses', 'digital education', 'edtech', 'learning platforms', 'instructional design'],
    contentContexts: ['course lesson editing', 'course preview production', 'promotional video', 'student engagement content', 'platform adaptation'],
    buyerContexts: ['create professional courses', 'increase student satisfaction', 'sell more enrollments', 'reduce production time'],
    commonArtifacts: ['lesson video sample', 'course preview clip', 'promotional trailer', 'student testimonial', 'curriculum visual'],
    exampleSubjects: ['lesson edit sample', 'course trailer production', 'curriculum overview design'],
    proofEmphasis: ['educational production quality', 'student engagement awareness', 'clear instructional design'],
    actionContexts: ['preview a course', 'request sample lesson', 'discuss course production', 'book strategy call'],
    languageTerms: ['course', 'lesson', 'student', 'learning', 'module', 'curriculum', 'enroll'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    avoidClaims: ['do not guarantee student enrollment', 'do not fabricate student completion rates', 'do not claim instructional design certification'],
  },
  linkedin_creators: {
    audienceLabel: 'LinkedIn Creators', audienceType: 'creator',
    domainThemes: ['linkedin', 'professional content', 'b2b thought leadership', 'career content', 'professional networking'],
    contentContexts: ['thought leadership clips', 'professional story content', 'carousel design', 'profile optimization visuals', 'engagement content'],
    buyerContexts: ['build professional authority', 'grow LinkedIn following', 'create better LinkedIn content', 'attract business opportunities'],
    commonArtifacts: ['thought leadership clip', 'professional story video', 'carousel design sample', 'profile banner', 'content series'],
    exampleSubjects: ['LinkedIn video content sample', 'thought leadership clip edit', 'professional content series'],
    proofEmphasis: ['professional storytelling', 'brand voice consistency', 'audience engagement understanding'],
    actionContexts: ['connect on LinkedIn', 'request content sample', 'discuss content strategy', 'book consultation'],
    languageTerms: ['linkedin', 'professional', 'thought leadership', 'network', 'authority', 'b2b', 'career'],
    sectionEmphasis: ['selected_work', 'process', 'content_series'],
    avoidClaims: ['do not guarantee follower growth', 'do not fabricate engagement metrics', 'do not promise specific career outcomes'],
  },
  educational: {
    audienceLabel: 'Educational Creators', audienceType: 'educator',
    domainThemes: ['education', 'teaching', 'learning', 'instructional content', 'student development'],
    contentContexts: ['lesson content', 'educational video', 'tutorial production', 'explainer content', 'student resource'],
    buyerContexts: ['create better educational content', 'engage students effectively', 'save production time', 'expand reach'],
    commonArtifacts: ['lesson video edit', 'educational animation', 'tutorial production', 'explainer video', 'student resource design'],
    exampleSubjects: ['lesson video editing sample', 'educational animation demo', 'tutorial production example'],
    proofEmphasis: ['instructional clarity', 'student engagement', 'content structure'],
    actionContexts: ['view educational content', 'request sample lesson', 'discuss production', 'subscribe to channel'],
    languageTerms: ['lesson', 'learn', 'teach', 'student', 'understand', 'concept', 'explain', 'tutorial'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    avoidClaims: ['do not guarantee learning outcomes', 'do not fabricate student performance data', 'do not claim teaching certification'],
  },

  /* P2 — Developer-specific high-value niches */
  mvp_founders: {
    audienceLabel: 'MVP Founders', audienceType: 'startup',
    domainThemes: ['mvp', 'minimum viable product', 'product launch', 'early stage', 'prototyping'],
    contentContexts: ['mvp development', 'rapid prototyping', 'product iteration', 'user testing content', 'pitch preparation'],
    buyerContexts: ['launch mvp faster', 'validate product ideas', 'save development costs', 'attract early users'],
    commonArtifacts: ['mvp demo', 'prototype walkthrough', 'iteration timeline', 'feature showcase', 'pitch deck support'],
    exampleSubjects: ['mvp build timeline', 'prototype demo sample', 'rapid iteration showcase'],
    proofEmphasis: ['speed of delivery', 'pragmatic approach', 'user-centered prioritization'],
    actionContexts: ['request mvp consultation', 'discuss product idea', 'book strategy call', 'review past builds'],
    languageTerms: ['mvp', 'prototype', 'launch', 'iterate', 'validate', 'early stage', 'product-market fit'],
    sectionEmphasis: ['implementation', 'process', 'app_showcase'],
    avoidClaims: ['do not guarantee product-market fit', 'do not fabricate user validation data', 'do not promise specific funding outcomes'],
  },
  agency_workflow: {
    audienceLabel: 'Agency Workflow Clients', audienceType: 'agency',
    domainThemes: ['agency operations', 'workflow automation', 'client management', 'team productivity', 'process optimization'],
    contentContexts: ['automation setup', 'workflow design', 'tool integration', 'process documentation', 'efficiency reporting'],
    buyerContexts: ['save time on repetitive tasks', 'improve team efficiency', 'streamline client onboarding', 'reduce manual work'],
    commonArtifacts: ['workflow diagram', 'automation demo', 'process documentation', 'before/after time comparison'],
    exampleSubjects: ['workflow automation before and after', 'process optimization demo', 'tool integration walkthrough'],
    proofEmphasis: ['efficiency improvement', 'process clarity', 'automation reliability'],
    actionContexts: ['request automation demo', 'discuss workflow needs', 'book process audit', 'review case studies'],
    languageTerms: ['workflow', 'automation', 'efficiency', 'process', 'integrate', 'streamline', 'optimize'],
    sectionEmphasis: ['process', 'implementation', 'automation_showcase'],
    avoidClaims: ['do not guarantee specific time savings', 'do not fabricate efficiency metrics', 'do not promise zero-error automation'],
  },
  real_estate_websites: {
    audienceLabel: 'Real Estate Website Owners', audienceType: 'local_business',
    domainThemes: ['real estate', 'property websites', 'real estate agents', 'property listings', 'local housing'],
    contentContexts: ['real estate website', 'property listing page', 'idX integration', 'neighborhood page', 'agent profile'],
    buyerContexts: ['attract more property buyers', 'showcase listings effectively', 'improve real estate website', 'generate leads'],
    commonArtifacts: ['real estate website', 'listing page design', 'property search interface', 'agent profile page'],
    exampleSubjects: ['real estate website redesign', 'listing page optimization', 'property search improvement'],
    proofEmphasis: ['visual property presentation', 'user experience for buyers', 'local market context'],
    actionContexts: ['view property listings', 'contact agent', 'search properties', 'request website demo'],
    languageTerms: ['property', 'listing', 'real estate', 'home', 'search', 'agent', 'market'],
    sectionEmphasis: ['live_projects', 'process', 'local_examples'],
    avoidClaims: ['do not guarantee more property leads', 'do not fabricate listing data', 'do not promise specific search rankings'],
  },
  membership_creators: {
    audienceLabel: 'Membership Site Creators', audienceType: 'creator',
    domainThemes: ['membership', 'subscription content', 'community', 'exclusive content', 'recurring revenue'],
    contentContexts: ['membership promo', 'community content', 'exclusive material preview', 'onboarding sequence', 'retention content'],
    buyerContexts: ['attract more members', 'create better membership content', 'reduce churn', 'increase membership value'],
    commonArtifacts: ['membership promo video', 'community content sample', 'exclusive content preview', 'onboarding sequence design'],
    exampleSubjects: ['membership promo sample', 'community content example', 'exclusive preview production'],
    proofEmphasis: ['content value demonstration', 'community engagement understanding', 'member retention awareness'],
    actionContexts: ['join membership', 'preview content', 'request sample', 'book strategy call'],
    languageTerms: ['membership', 'member', 'community', 'exclusive', 'subscription', 'content library', 'access'],
    sectionEmphasis: ['selected_work', 'process', 'content_series'],
    avoidClaims: ['do not guarantee membership growth', 'do not fabricate member retention data', 'do not promise specific revenue outcomes'],
  },

  /* P3 — Designer-specific high-value niches */
  saas_design_agencies: {
    audienceLabel: 'SaaS Design Agencies', audienceType: 'agency',
    domainThemes: ['saas design', 'b2b design', 'product design', 'enterprise ux', 'software interfaces'],
    contentContexts: ['product design', 'enterprise dashboard', 'b2b interface', 'saas onboarding', 'design system creation'],
    buyerContexts: ['win more saas clients', 'demonstrate product design skill', 'show b2b expertise', 'build design portfolio for tech'],
    commonArtifacts: ['product mockup set', 'dashboard design', 'design system sample', 'enterprise ui example'],
    exampleSubjects: ['saas dashboard redesign', 'design system component showcase', 'enterprise ui before and after'],
    proofEmphasis: ['product thinking', 'design system creation', 'complex workflow simplification'],
    actionContexts: ['request design consultation', 'discuss product needs', 'review portfolio', 'book design audit'],
    languageTerms: ['saas', 'product', 'dashboard', 'enterprise', 'design system', 'workflow', 'ux'],
    sectionEmphasis: ['case_studies', 'process', 'identity_systems'],
    avoidClaims: ['do not guarantee user adoption metrics', 'do not fabricate usability test results', 'do not claim enterprise sales expertise'],
  },
  personal_brand_design: {
    audienceLabel: 'Personal Brand Design Clients', audienceType: 'personal_brand',
    domainThemes: ['personal branding', 'visual identity', 'brand design', 'professional image', 'personal website'],
    contentContexts: ['brand identity creation', 'personal logo design', 'brand application', 'social media visuals', 'personal website design'],
    buyerContexts: ['build a professional brand image', 'stand out in market', 'attract better opportunities', 'create consistent visuals'],
    commonArtifacts: ['brand identity system', 'personal logo suite', 'brand application mockup', 'social media template', 'personal website design'],
    exampleSubjects: ['personal brand identity showcase', 'logo and application sample', 'brand style guide example'],
    proofEmphasis: ['visual brand thinking', 'identity system creation', 'application consistency'],
    actionContexts: ['request brand consultation', 'discuss personal brand', 'review portfolio', 'book discovery call'],
    languageTerms: ['brand', 'identity', 'personal', 'logo', 'style', 'professional', 'consistent', 'recognition'],
    sectionEmphasis: ['identity_systems', 'process', 'selected_work'],
    avoidClaims: ['do not guarantee personal brand success', 'do not fabricate career outcomes', 'do not promise specific recognition levels'],
  },
  startup_pitch: {
    audienceLabel: 'Startup Pitch Deck Clients', audienceType: 'startup',
    domainThemes: ['pitch deck', 'startup fundraising', 'investor presentation', 'storytelling', 'business narrative'],
    contentContexts: ['pitch deck design', 'investor presentation', 'story deck creation', 'data visualization', 'fundraising materials'],
    buyerContexts: ['raise funding more effectively', 'create compelling pitch', 'save deck creation time', 'stand out to investors'],
    commonArtifacts: ['pitch deck sample', 'investor slide set', 'story deck example', 'data visualization', 'fundraising collateral'],
    exampleSubjects: ['pitch deck before and after', 'slide transformation example', 'data visualization sample'],
    proofEmphasis: ['narrative structuring', 'visual storytelling', 'investor communication understanding'],
    actionContexts: ['request deck consultation', 'review sample decks', 'book pitch prep call', 'discuss fundraising needs'],
    languageTerms: ['pitch deck', 'investor', 'fundraising', 'story', 'narrative', 'slide', 'presentation', 'seed', 'series'],
    sectionEmphasis: ['process', 'selected_work', 'deck_showcase'],
    avoidClaims: ['do not guarantee funding outcomes', 'do not fabricate investor interest', 'do not promise specific valuation'],
  },
  dtc_brands: {
    audienceLabel: 'DTC Brands', audienceType: 'ecommerce',
    domainThemes: ['direct to consumer', 'dtc', 'ecommerce brand', 'retail branding', 'consumer products'],
    contentContexts: ['brand identity', 'product packaging', 'social media content', 'ecommerce visuals', 'brand storytelling'],
    buyerContexts: ['build recognizable brand', 'compete with established brands', 'create consistent customer experience', 'stand out in market'],
    commonArtifacts: ['brand identity system', 'packaging mockup', 'social media template set', 'ecommerce visual', 'brand story deck'],
    exampleSubjects: ['dtc brand identity showcase', 'packaging design sample', 'social media visual system'],
    proofEmphasis: ['brand system creation', 'visual consistency', 'consumer understanding'],
    actionContexts: ['request brand consultation', 'review brand portfolio', 'book discovery call', 'discuss project scope'],
    languageTerms: ['brand', 'consumer', 'packaging', 'identity', 'retail', 'dtc', 'customer experience'],
    sectionEmphasis: ['identity_systems', 'process', 'selected_work'],
    avoidClaims: ['do not guarantee brand recognition', 'do not fabricate sales metrics', 'do not promise specific market positioning'],
  },
  workshops_hosts: {
    audienceLabel: 'Workshop Hosts', audienceType: 'educator',
    domainThemes: ['workshops', 'training', 'live events', 'skill development', 'professional education'],
    contentContexts: ['workshop promotion', 'training material', 'event content', 'participant engagement', 'course materials'],
    buyerContexts: ['attract more workshop participants', 'professional workshop materials', 'save content creation time', 'expand workshop reach'],
    commonArtifacts: ['workshop promo video', 'training material design', 'event highlight clip', 'participant testimonial', 'workshop preview'],
    exampleSubjects: ['workshop promo sample', 'training material design', 'event content example'],
    proofEmphasis: ['professional presentation', 'participant engagement', 'content structure'],
    actionContexts: ['register for workshop', 'request workshop info', 'book facilitator', 'view past workshops'],
    languageTerms: ['workshop', 'training', 'learn', 'skill', 'participant', 'session', 'event', 'register'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    avoidClaims: ['do not guarantee workshop attendance', 'do not fabricate participant testimonials', 'do not claim specific skill outcomes'],
  },
};

/* ──────────────────────────────────────────────
   TIER B — SEMANTIC TAG COMPOSITION
   Uses known niche ID patterns and label keywords.
   ────────────────────────────────────────────── */

type NicheTagRule = {
  audienceType: AudienceType;
  domainKeywords: string[];
  industryTerms: string[];
  sectionEmphasis: string[];
  proofEmphasisBase: string[];
  avoidBase: string[];
};

const TAG_RULES: Record<string, NicheTagRule> = {
  coach: {
    audienceType: 'coach',
    domainKeywords: ['coach', 'coaching', 'consultant', 'consulting', 'advisor', 'mentor', 'trainer'],
    industryTerms: ['coaching', 'consulting', 'professional development', 'client transformation'],
    sectionEmphasis: ['process', 'case_studies', 'selected_work'],
    proofEmphasisBase: ['client understanding', 'professional presentation', 'credibility building'],
    avoidBase: ['do not guarantee client outcomes', 'do not fabricate testimonials'],
  },
  creator: {
    audienceType: 'creator',
    domainKeywords: ['creator', 'influencer', 'youtuber', 'tiktok', 'instagram', 'streamer', 'blogger', 'vlogger'],
    industryTerms: ['content creation', 'audience growth', 'platform engagement', 'social media'],
    sectionEmphasis: ['selected_work', 'hook_gallery', 'content_series'],
    proofEmphasisBase: ['style versatility', 'platform understanding', 'trend awareness'],
    avoidBase: ['do not guarantee follower growth', 'do not fabricate engagement metrics'],
  },
  agency: {
    audienceType: 'agency',
    domainKeywords: ['agency', 'studio', 'firm', 'collective', 'production company'],
    industryTerms: ['agency services', 'client work', 'professional services', 'scalable delivery'],
    sectionEmphasis: ['process', 'implementation', 'selected_work'],
    proofEmphasisBase: ['reliability', 'consistent quality', 'process adherence'],
    avoidBase: ['do not guarantee client acquisition', 'do not fabricate case study results'],
  },
  startup: {
    audienceType: 'startup',
    domainKeywords: ['startup', 'founder', 'mvp', 'saas', 'venture', 'early stage'],
    industryTerms: ['product development', 'startup growth', 'rapid iteration', 'fundraising'],
    sectionEmphasis: ['implementation', 'process', 'app_showcase'],
    proofEmphasisBase: ['speed of delivery', 'pragmatic approach', 'iteration capability'],
    avoidBase: ['do not guarantee product success', 'do not fabricate user metrics'],
  },
  ecommerce: {
    audienceType: 'ecommerce',
    domainKeywords: ['ecommerce', 'store', 'shop', 'brand', 'retail', 'product', 'dtc'],
    industryTerms: ['online sales', 'product presentation', 'customer journey', 'brand experience'],
    sectionEmphasis: ['page_showcase', 'cta_focus', 'selected_work'],
    proofEmphasisBase: ['visual merchandising', 'brand consistency', 'customer experience'],
    avoidBase: ['do not guarantee sales increase', 'do not fabricate conversion data'],
  },
  educator: {
    audienceType: 'educator',
    domainKeywords: ['educator', 'teacher', 'professor', 'trainer', 'instructor', 'tutor', 'lesson', 'course'],
    industryTerms: ['education', 'learning', 'teaching', 'student engagement', 'instructional design'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    proofEmphasisBase: ['instructional clarity', 'student engagement', 'content structure'],
    avoidBase: ['do not guarantee learning outcomes', 'do not fabricate student results'],
  },
  local_business: {
    audienceType: 'local_business',
    domainKeywords: ['local', 'restaurant', 'salon', 'gym', 'clinic', 'dentist', 'barber', 'shop', 'store', 'service'],
    industryTerms: ['local business', 'community', 'neighborhood', 'local marketing'],
    sectionEmphasis: ['live_projects', 'process', 'local_examples'],
    proofEmphasisBase: ['local relevance', 'professional quality', 'clear communication'],
    avoidBase: ['do not guarantee more customers', 'do not fabricate local results'],
  },
  podcaster: {
    audienceType: 'podcaster',
    domainKeywords: ['podcast', 'podcaster', 'audio', 'show', 'episode'],
    industryTerms: ['podcasting', 'audio content', 'episode production', 'audience building'],
    sectionEmphasis: ['clip_gallery', 'process', 'selected_work'],
    proofEmphasisBase: ['content repurposing', 'moment selection', 'audio quality'],
    avoidBase: ['do not guarantee listener growth', 'do not fabricate download stats'],
  },
  course_creator: {
    audienceType: 'course_creator',
    domainKeywords: ['course', 'curriculum', 'lesson', 'program', 'cohort', 'workshop', 'seminar'],
    industryTerms: ['online education', 'course creation', 'digital learning', 'student success'],
    sectionEmphasis: ['process', 'selected_work', 'educational_examples'],
    proofEmphasisBase: ['educational production quality', 'clarity', 'engagement'],
    avoidBase: ['do not guarantee enrollment', 'do not fabricate student testimonials'],
  },
};

function classifyAudienceType(nicheLabel: string, nicheId: string): { type: AudienceType; rule: NicheTagRule | null } {
  const lowerLabel = nicheLabel.toLowerCase();
  const lowerId = nicheId.toLowerCase();
  for (const [key, rule] of Object.entries(TAG_RULES)) {
    for (const kw of rule.domainKeywords) {
      if (lowerLabel.includes(kw) || lowerId.includes(kw)) return { type: rule.audienceType as AudienceType, rule };
    }
  }
  return { type: 'creator', rule: TAG_RULES.creator };
}

function deriveFromServiceMarket(serviceId: string, marketId: string): NicheSemanticMetadata {
  const isEditor = ['video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor'].includes(serviceId);
  const isDesigner = ['ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer'].includes(serviceId);
  const marketLabel = marketId.replace(/_/g, ' ');

  let domainThemes: string[];
  let contentContexts: string[];
  let commonArtifacts: string[];
  let exampleSubjects: string[];

  if (isEditor) {
    domainThemes = ['video content', 'editing', marketLabel];
    contentContexts = ['content editing', 'video production', 'post-production workflow'];
    commonArtifacts = ['edited video', 'clip sample', 'before/after comparison'];
    exampleSubjects = ['editing sample for ' + marketLabel, 'before/after edit demo', 'content project walkthrough'];
  } else if (isDesigner) {
    domainThemes = ['design', 'visual content', marketLabel];
    contentContexts = ['visual design', 'creative production', 'design workflow'];
    commonArtifacts = ['design mockup', 'visual sample', 'before/after design comparison'];
    exampleSubjects = ['design sample for ' + marketLabel, 'visual project showcase', 'design process walkthrough'];
  } else {
    domainThemes = ['development', 'build', marketLabel];
    contentContexts = ['project development', 'technical implementation', 'build workflow'];
    commonArtifacts = ['project documentation', 'implementation demo', 'before/after comparison'];
    exampleSubjects = ['build sample for ' + marketLabel, 'project walkthrough', 'implementation demo'];
  }

  return {
    audienceLabel: marketLabel.replace(/\b\w/g, (c) => c.toUpperCase()),
    audienceType: classifyAudienceType(marketLabel, marketId).type,
    domainThemes,
    contentContexts,
    buyerContexts: ['demonstrate capability', 'show relevant work', 'build trust'],
    commonArtifacts,
    exampleSubjects,
    proofEmphasis: ['quality demonstration', 'process clarity', 'relevant experience'],
    actionContexts: ['request sample', 'discuss needs', 'review portfolio'],
    languageTerms: ['professional', 'quality', 'reliable', 'experience', 'delivery'],
    sectionEmphasis: ['selected_work', 'process'],
    avoidClaims: ['do not fabricate results', 'do not claim expertise beyond demonstrated work', 'do not guarantee outcomes'],
  };
}

/* ──────────────────────────────────────────────
   TIER C — SERVICE + MARKET FALLBACK
   Always resolves.
   ────────────────────────────────────────────── */

function fallbackNicheModifier(serviceId: string, nicheId: string): NicheSemanticMetadata {
  const nicheName = nicheId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const isEditor = ['video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor'].includes(serviceId);
  const isDesigner = ['ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer'].includes(serviceId);

  const serviceType = isEditor ? 'editing' : isDesigner ? 'design' : 'development';

  return {
    audienceLabel: nicheName,
    audienceType: classifyAudienceType(nicheName, nicheId).type,
    domainThemes: [serviceType, nicheName.toLowerCase(), 'professional work'],
    contentContexts: [`${serviceType} projects`, 'client work', 'professional deliverables'],
    buyerContexts: ['assess capability', 'review quality', 'decide fit'],
    commonArtifacts: [serviceType === 'editing' ? 'video sample' : serviceType === 'design' ? 'design mockup' : 'build documentation'],
    exampleSubjects: [`${nicheName.toLowerCase()} ${serviceType} example`, 'project demonstration sample'],
    proofEmphasis: ['quality of work', 'attention to detail', 'professional approach'],
    actionContexts: ['request more examples', 'discuss project', 'reach out'],
    languageTerms: ['professional', serviceType, 'quality', 'experience'],
    sectionEmphasis: ['selected_work', 'process'],
    avoidClaims: ['do not fabricate client results', 'do not claim expertise beyond demonstrated work', 'do not guarantee outcomes'],
  };
}

/* ──────────────────────────────────────────────
   RESOLVER
   ────────────────────────────────────────────── */

export function resolveNicheMetadata(
  nicheId: string,
  nicheLabel: string,
  serviceId: string,
  marketId: string,
): NicheResolution {
  const id = nicheId;

  if (AUTHORED_OVERRIDES[id]) {
    return { metadata: AUTHORED_OVERRIDES[id], tier: 'exact_override', nicheId: id };
  }

  const lowerLabel = nicheLabel.toLowerCase();
  const { type, rule } = classifyAudienceType(lowerLabel, id);

  if (rule) {
    const nicheName = nicheLabel || id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const isEditor = ['video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor'].includes(serviceId);
    const serviceType = isEditor ? 'editing' : ['ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer'].includes(serviceId) ? 'design' : 'development';

    return {
      metadata: {
        audienceLabel: nicheName,
        audienceType: type,
        domainThemes: [serviceType, type, nicheName.toLowerCase()],
        contentContexts: [`${nicheName.toLowerCase()} ${serviceType}`, `${type} content production`, 'project delivery'],
        buyerContexts: [`find a ${serviceType} professional for ${nicheName.toLowerCase()}`, 'assess capability', 'review quality'],
        commonArtifacts: [serviceType === 'editing' ? 'edited clip' : serviceType === 'design' ? 'design mockup' : 'project demo'],
        exampleSubjects: [`${nicheName} ${serviceType} project example`, `${serviceType} process walkthrough`],
        proofEmphasis: rule.proofEmphasisBase,
        actionContexts: ['request sample work', 'discuss project needs', 'review examples'],
        languageTerms: [...rule.industryTerms, serviceType, 'professional', 'quality'],
        sectionEmphasis: rule.sectionEmphasis,
        avoidClaims: rule.avoidBase,
      },
      tier: 'semantic_composition',
      nicheId: id,
    };
  }

  const fallback = fallbackNicheModifier(serviceId, id);
  return { metadata: fallback, tier: 'service_market_fallback', nicheId: id };
}
