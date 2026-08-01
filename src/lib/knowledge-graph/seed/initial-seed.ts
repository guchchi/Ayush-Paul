import { NodeBuilder, EdgeBuilder } from '../builders/builders';
import { JsonRepository } from '../repositories/json-repository';
import { BaseNode, BaseEdge } from '../core/types';

export function generateInitialGraph(): { nodes: BaseNode[]; edges: BaseEdge[]; repository: JsonRepository } {
  const nodes: BaseNode[] = [];
  const edges: BaseEdge[] = [];

  // ==========================================
  // 1. ROOT & ECOSYSTEM NODES
  // ==========================================
  const brand = new NodeBuilder('brand_paulx', 'BRAND')
    .setTitle('ThePaulX')
    .setSlug('thepaulx')
    .setDescription('The premier business execution ecosystem for high-value creators, freelancers, and consultants.')
    .build();
  nodes.push(brand);

  const blueprintEcosystem = new NodeBuilder('eco_blueprints', 'ECOSYSTEM')
    .setTitle('Blueprints')
    .setSlug('blueprints')
    .setDescription('Step-by-step operational blueprints for predictable client acquisition and revenue generation.')
    .build();
  nodes.push(blueprintEcosystem);

  const studioEcosystem = new NodeBuilder('eco_studio', 'ECOSYSTEM')
    .setTitle('Studio')
    .setSlug('studio')
    .setDescription('Interactive execution tools, fillable templates, prompt packs, and automation worksheets.')
    .build();
  nodes.push(studioEcosystem);

  const masteryEcosystem = new NodeBuilder('eco_mastery', 'ECOSYSTEM')
    .setTitle('Mastery')
    .setSlug('mastery')
    .setDescription('Comprehensive video courses, deep-dive lessons, and skill acquisition paths.')
    .build();
  nodes.push(masteryEcosystem);

  const blogEcosystem = new NodeBuilder('eco_blog', 'ECOSYSTEM')
    .setTitle('Blog')
    .setSlug('blog')
    .setDescription('Technical articles, engineering essays, and system breakdowns.')
    .build();
  nodes.push(blogEcosystem);

  edges.push(new EdgeBuilder('e_brand_blueprints', 'brand_paulx', 'eco_blueprints', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_blueprints_brand', 'eco_blueprints', 'brand_paulx', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_brand_studio', 'brand_paulx', 'eco_studio', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_studio_brand', 'eco_studio', 'brand_paulx', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_brand_mastery', 'brand_paulx', 'eco_mastery', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mastery_brand', 'eco_mastery', 'brand_paulx', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_brand_blog', 'brand_paulx', 'eco_blog', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_blog_brand', 'eco_blog', 'brand_paulx', 'HAS_PARENT').build());

  // ==========================================
  // 2. PRODUCT NODE: Get Your First 3 Clients
  // ==========================================
  const product = new NodeBuilder('prod_first_3_clients', 'PRODUCT')
    .setTitle('Get Your First 3 Clients')
    .setSlug('get-your-first-3-clients')
    .setDescription('Complete operational system to position your offer, build authority, and land your first 3 high-ticket clients.')
    .setProperties({ difficulty: 'BEGINNER', estimatedHours: 12, priceInCents: 0 })
    .build();
  nodes.push(product);

  const productContent = new NodeBuilder('cnt_prod_first3', 'CONTENT')
    .setTitle('Get Your First 3 Clients — System Overview')
    .setSlug('cnt-get-your-first-3-clients')
    .setProperties({
      bodyMarkdown: '# Get Your First 3 Clients\n\nWelcome to **Get Your First 3 Clients**. This blueprint provides an execution-ready system for freelancers, agency owners, and independent consultants to land high-value clients predictably.\n\n### What You Will Build:\n- **Module 1:** Client Acquisition Strategy & ICP Definition\n- **Module 2:** High-Ticket Offer Architecture\n- **Module 3:** High-Trust Authority System\n- **Module 4:** Proof-First Portfolio System\n- **Module 5:** Pipeline & Lead Generation Infrastructure\n- **Module 6:** Outbound Outreach & Deal Closing Engine',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(productContent);

  edges.push(new EdgeBuilder('e_prod_cnt', 'prod_first_3_clients', 'cnt_prod_first3', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_eco_prod', 'eco_blueprints', 'prod_first_3_clients', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_prod_eco', 'prod_first_3_clients', 'eco_blueprints', 'HAS_PARENT').build());

  // ==========================================
  // 3. MODULE 1: Client Acquisition Strategy
  // ==========================================
  const mod1 = new NodeBuilder('mod_client_acquisition', 'MODULE')
    .setTitle('Module 1: Client Acquisition Strategy')
    .setSlug('client-acquisition-strategy')
    .setDescription('Identify high-budget prospects and establish positioning.')
    .setProperties({ order: 1, summary: 'ICP & Niche Definition' })
    .build();
  nodes.push(mod1);

  edges.push(new EdgeBuilder('e_prod_mod1', 'prod_first_3_clients', 'mod_client_acquisition', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod1_prod', 'mod_client_acquisition', 'prod_first_3_clients', 'HAS_PARENT').build());

  // Step 1
  const step1 = new NodeBuilder('step_niche_selection', 'STEP')
    .setTitle('Step 1: Niche & ICP Definition')
    .setSlug('niche-and-icp-definition')
    .setDescription('Zero in on urgent market needs and target decision makers.')
    .setProperties({ order: 1, estimatedMinutes: 45, actionItem: 'Define your ICP target parameters' })
    .build();
  nodes.push(step1);

  const step1Content = new NodeBuilder('cnt_step1_niche', 'CONTENT')
    .setTitle('Step 1 Content')
    .setSlug('cnt-step1-niche')
    .setProperties({
      bodyMarkdown: '# Step 1: Niche & ICP Definition\n\nTargeting everyone is targeting no one. In this step, you will define the exact profile of clients who have both urgent business problems and the budget to pay for a solution.\n\n### Key Action Items:\n1. Complete the ICP Generator tool in Studio.\n2. Verify target industry purchasing power.\n3. Write your single-sentence positioning statement.',
      format: 'MARKDOWN',
      readingTimeMinutes: 4
    })
    .build();
  nodes.push(step1Content);

  edges.push(new EdgeBuilder('e_step1_cnt', 'step_niche_selection', 'cnt_step1_niche', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod1_step1', 'mod_client_acquisition', 'step_niche_selection', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step1_mod1', 'step_niche_selection', 'mod_client_acquisition', 'HAS_PARENT').build());

  // Step 2
  const step2 = new NodeBuilder('step_pricing_strategy', 'STEP')
    .setTitle('Step 2: Value-Based Pricing Strategy')
    .setSlug('value-based-pricing-strategy')
    .setDescription('Price your service based on business impact rather than hourly rates.')
    .setProperties({ order: 2, estimatedMinutes: 30, actionItem: 'Calculate offer ROI pricing tier' })
    .build();
  nodes.push(step2);

  const step2Content = new NodeBuilder('cnt_step2_pricing', 'CONTENT')
    .setTitle('Step 2 Content')
    .setSlug('cnt-step2-pricing')
    .setProperties({
      bodyMarkdown: '# Step 2: Value-Based Pricing Strategy\n\nHourly billing caps your revenue. Value-based pricing anchors your cost to the financial ROI your client realizes.\n\n### Key Principles:\n- Never quote time; quote outcomes.\n- Use the 10x ROI anchor method.',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(step2Content);

  edges.push(new EdgeBuilder('e_step2_cnt', 'step_pricing_strategy', 'cnt_step2_pricing', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod1_step2', 'mod_client_acquisition', 'step_pricing_strategy', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step2_mod1', 'step_pricing_strategy', 'mod_client_acquisition', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_step1_step2_next', 'step_niche_selection', 'step_pricing_strategy', 'NEXT_STEP').build());

  // ==========================================
  // 4. MODULE 2: Offer Engineering
  // ==========================================
  const mod2 = new NodeBuilder('mod_offer_engineering', 'MODULE')
    .setTitle('Module 2: Offer Engineering')
    .setSlug('offer-engineering')
    .setDescription('Package your core capabilities into a high-ticket, risk-reversed offer.')
    .setProperties({ order: 2, summary: 'High-Ticket Offer Construction' })
    .build();
  nodes.push(mod2);

  edges.push(new EdgeBuilder('e_prod_mod2', 'prod_first_3_clients', 'mod_offer_engineering', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod2_prod', 'mod_offer_engineering', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod1_mod2_next', 'mod_client_acquisition', 'mod_offer_engineering', 'NEXT_STEP').build());

  // Step 3
  const step3 = new NodeBuilder('step_offer_construction', 'STEP')
    .setTitle('Step 3: Offer Deliverables & Packaging')
    .setSlug('offer-deliverables-and-packaging')
    .setDescription('Structure your core deliverables into a clear, outcome-focused package.')
    .setProperties({ order: 1, estimatedMinutes: 40, actionItem: 'Build your offer stack' })
    .build();
  nodes.push(step3);

  const step3Content = new NodeBuilder('cnt_step3_offer', 'CONTENT')
    .setTitle('Step 3 Content')
    .setSlug('cnt-step3-offer')
    .setProperties({
      bodyMarkdown: '# Step 3: Offer Deliverables & Packaging\n\nTransform raw skills into a standardized service product that delivers clear business milestones.',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(step3Content);

  edges.push(new EdgeBuilder('e_step3_cnt', 'step_offer_construction', 'cnt_step3_offer', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod2_step3', 'mod_offer_engineering', 'step_offer_construction', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step3_mod2', 'step_offer_construction', 'mod_offer_engineering', 'HAS_PARENT').build());

  // Step 4
  const step4 = new NodeBuilder('step_risk_reversal', 'STEP')
    .setTitle('Step 4: Risk Reversal & Guarantees')
    .setSlug('risk-reversal-and-guarantees')
    .setDescription('Eliminate client buying friction with structured guarantees.')
    .setProperties({ order: 2, estimatedMinutes: 25, actionItem: 'Write offer guarantee clause' })
    .build();
  nodes.push(step4);

  const step4Content = new NodeBuilder('cnt_step4_guarantee', 'CONTENT')
    .setTitle('Step 4 Content')
    .setSlug('cnt-step4-guarantee')
    .setProperties({
      bodyMarkdown: '# Step 4: Risk Reversal & Guarantees\n\nHigh-value prospects hesitate due to risk. Remove doubt by offering a conditional outcome guarantee.',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(step4Content);

  edges.push(new EdgeBuilder('e_step4_cnt', 'step_risk_reversal', 'cnt_step4_guarantee', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod2_step4', 'mod_offer_engineering', 'step_risk_reversal', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step4_mod2', 'step_risk_reversal', 'mod_offer_engineering', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_step3_step4_next', 'step_offer_construction', 'step_risk_reversal', 'NEXT_STEP').build());

  // ==========================================
  // 5. MODULE 3: Authority System
  // ==========================================
  const mod3 = new NodeBuilder('mod_authority_system', 'MODULE')
    .setTitle('Module 3: Authority System')
    .setSlug('authority-system')
    .setDescription('Establish domain authority and high-trust market presence.')
    .setProperties({ order: 3, summary: 'Thought Leadership & Trust' })
    .build();
  nodes.push(mod3);

  edges.push(new EdgeBuilder('e_prod_mod3', 'prod_first_3_clients', 'mod_authority_system', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod3_prod', 'mod_authority_system', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod2_mod3_next', 'mod_offer_engineering', 'mod_authority_system', 'NEXT_STEP').build());

  const step5 = new NodeBuilder('step_authority_assets', 'STEP')
    .setTitle('Step 5: Authority Content & Proof Assets')
    .setSlug('authority-content-and-proof-assets')
    .setDescription('Create conversion-focused case studies and teardowns.')
    .setProperties({ order: 1, estimatedMinutes: 50, actionItem: 'Publish 1 detailed breakdown' })
    .build();
  nodes.push(step5);

  const step5Content = new NodeBuilder('cnt_step5_auth', 'CONTENT')
    .setTitle('Step 5 Content')
    .setSlug('cnt-step5-auth')
    .setProperties({
      bodyMarkdown: '# Step 5: Authority Content & Proof Assets\n\nDemonstrate expertise before entering sales conversations using tear-downs and case studies.',
      format: 'MARKDOWN',
      readingTimeMinutes: 4
    })
    .build();
  nodes.push(step5Content);

  edges.push(new EdgeBuilder('e_step5_cnt', 'step_authority_assets', 'cnt_step5_auth', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod3_step5', 'mod_authority_system', 'step_authority_assets', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step5_mod3', 'step_authority_assets', 'mod_authority_system', 'HAS_PARENT').build());

  // ==========================================
  // 6. MODULE 4: Portfolio System
  // ==========================================
  const mod4 = new NodeBuilder('mod_portfolio_system', 'MODULE')
    .setTitle('Module 4: Portfolio System')
    .setSlug('portfolio-system')
    .setDescription('Build a proof-first portfolio showing real business metrics.')
    .setProperties({ order: 4, summary: 'Proof Showcase' })
    .build();
  nodes.push(mod4);

  edges.push(new EdgeBuilder('e_prod_mod4', 'prod_first_3_clients', 'mod_portfolio_system', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod4_prod', 'mod_portfolio_system', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod3_mod4_next', 'mod_authority_system', 'mod_portfolio_system', 'NEXT_STEP').build());

  const step6 = new NodeBuilder('step_portfolio_build', 'STEP')
    .setTitle('Step 6: Proof-First Case Study Portfolio')
    .setSlug('proof-first-case-study-portfolio')
    .setDescription('Assemble a clean portfolio focusing on client outcomes rather than static designs.')
    .setProperties({ order: 1, estimatedMinutes: 40, actionItem: 'Publish case study portfolio page' })
    .build();
  nodes.push(step6);

  const step6Content = new NodeBuilder('cnt_step6_port', 'CONTENT')
    .setTitle('Step 6 Content')
    .setSlug('cnt-step6-port')
    .setProperties({
      bodyMarkdown: '# Step 6: Proof-First Case Study Portfolio\n\nClients buy results, not graphics. Learn how to format past work around business impact metrics.',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(step6Content);

  edges.push(new EdgeBuilder('e_step6_cnt', 'step_portfolio_build', 'cnt_step6_port', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod4_step6', 'mod_portfolio_system', 'step_portfolio_build', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step6_mod4', 'step_portfolio_build', 'mod_portfolio_system', 'HAS_PARENT').build());

  // ==========================================
  // 7. MODULE 5: Client Pipeline System
  // ==========================================
  const mod5 = new NodeBuilder('mod_client_pipeline', 'MODULE')
    .setTitle('Module 5: Client Pipeline System')
    .setSlug('client-pipeline-system')
    .setDescription('Manage lead flows and master discovery sales calls.')
    .setProperties({ order: 5, summary: 'Pipeline & Sales' })
    .build();
  nodes.push(mod5);

  edges.push(new EdgeBuilder('e_prod_mod5', 'prod_first_3_clients', 'mod_client_pipeline', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod5_prod', 'mod_client_pipeline', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod4_mod5_next', 'mod_portfolio_system', 'mod_client_pipeline', 'NEXT_STEP').build());

  const step7 = new NodeBuilder('step_discovery_calls', 'STEP')
    .setTitle('Step 7: Discovery Call Mastery')
    .setSlug('discovery-call-mastery')
    .setDescription('Conduct structured sales calls to diagnose problems and close proposals.')
    .setProperties({ order: 1, estimatedMinutes: 45, actionItem: 'Practice discovery call script' })
    .build();
  nodes.push(step7);

  const step7Content = new NodeBuilder('cnt_step7_disc', 'CONTENT')
    .setTitle('Step 7 Content')
    .setSlug('cnt-step7-disc')
    .setProperties({
      bodyMarkdown: '# Step 7: Discovery Call Mastery\n\nDiscovery calls are diagnostic consultations, not sales pitches. Ask probing questions to uncover ROI targets.',
      format: 'MARKDOWN',
      readingTimeMinutes: 4
    })
    .build();
  nodes.push(step7Content);

  edges.push(new EdgeBuilder('e_step7_cnt', 'step_discovery_calls', 'cnt_step7_disc', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod5_step7', 'mod_client_pipeline', 'step_discovery_calls', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step7_mod5', 'step_discovery_calls', 'mod_client_pipeline', 'HAS_PARENT').build());

  // ==========================================
  // 8. MODULE 6: Outreach Engine System
  // ==========================================
  const mod6 = new NodeBuilder('mod_outreach_engine', 'MODULE')
    .setTitle('Module 6: Outreach Engine System')
    .setSlug('outreach-engine-system')
    .setDescription('Launch automated and manual outbound prospect outreach.')
    .setProperties({ order: 6, summary: 'Outbound Execution' })
    .build();
  nodes.push(mod6);

  edges.push(new EdgeBuilder('e_prod_mod6', 'prod_first_3_clients', 'mod_outreach_engine', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod6_prod', 'mod_outreach_engine', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod5_mod6_next', 'mod_client_pipeline', 'mod_outreach_engine', 'NEXT_STEP').build());

  const step8 = new NodeBuilder('step_outreach_launch', 'STEP')
    .setTitle('Step 8: Cold Email Campaign Launch')
    .setSlug('cold-email-campaign-launch')
    .setDescription('Deploy personalized outbound campaigns to target accounts.')
    .setProperties({ order: 1, estimatedMinutes: 60, actionItem: 'Send 50 personalized outreach messages' })
    .build();
  nodes.push(step8);

  const step8Content = new NodeBuilder('cnt_step8_out', 'CONTENT')
    .setTitle('Step 8 Content')
    .setSlug('cnt-step8-out')
    .setProperties({
      bodyMarkdown: '# Step 8: Cold Email Campaign Launch\n\nDeploy multi-touch cold email sequences with high personalization and clear calls to action.',
      format: 'MARKDOWN',
      readingTimeMinutes: 4
    })
    .build();
  nodes.push(step8Content);

  edges.push(new EdgeBuilder('e_step8_cnt', 'step_outreach_launch', 'cnt_step8_out', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_mod6_step8', 'mod_outreach_engine', 'step_outreach_launch', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step8_mod6', 'step_outreach_launch', 'mod_outreach_engine', 'HAS_PARENT').build());

  // ==========================================
  // 9. STUDIO ASSETS (Tools, Prompts, Templates, Worksheets)
  // ==========================================
  const toolIcp = new NodeBuilder('tool_icp_generator', 'TOOL')
    .setTitle('ICP Generator')
    .setSlug('icp-generator')
    .setDescription('Interactive studio tool to define ideal buyer personas and target criteria.')
    .setProperties({ isInteractive: true, runtimeEngine: 'CLIENT_SIDE' })
    .build();
  nodes.push(toolIcp);

  edges.push(new EdgeBuilder('e_step1_tool_icp', 'step_niche_selection', 'tool_icp_generator', 'IMPLEMENTS').build());
  edges.push(new EdgeBuilder('e_tool_icp_belongs', 'tool_icp_generator', 'eco_studio', 'BELONGS_TO').build());

  const worksheetOffer = new NodeBuilder('worksheet_offer_calculator', 'WORKSHEET')
    .setTitle('Offer Pricing ROI Calculator')
    .setSlug('offer-pricing-roi-calculator')
    .setDescription('Spreadsheet worksheet to calculate 10x ROI pricing anchors.')
    .build();
  nodes.push(worksheetOffer);

  edges.push(new EdgeBuilder('e_step2_worksheet', 'step_pricing_strategy', 'worksheet_offer_calculator', 'IMPLEMENTS').build());

  const promptOutreach = new NodeBuilder('prompt_cold_email', 'PROMPT')
    .setTitle('High-Ticket Outreach Prompt Pack')
    .setSlug('high-ticket-outreach-prompt-pack')
    .setDescription('AI prompt sequence designed to generate personalized client pitches.')
    .build();
  nodes.push(promptOutreach);

  edges.push(new EdgeBuilder('e_step8_prompt', 'step_outreach_launch', 'prompt_cold_email', 'IMPLEMENTS').build());
  edges.push(new EdgeBuilder('e_prompt_belongs', 'prompt_cold_email', 'eco_studio', 'BELONGS_TO').build());

  const templateProposal = new NodeBuilder('template_proposal', 'TEMPLATE')
    .setTitle('Standard Consulting Proposal')
    .setSlug('standard-consulting-proposal')
    .setDescription('Fillable proposal template to close prospects on discovery calls.')
    .setProperties({ format: 'DOCX' })
    .build();
  nodes.push(templateProposal);

  edges.push(new EdgeBuilder('e_step7_template', 'step_discovery_calls', 'template_proposal', 'IMPLEMENTS').build());

  // ==========================================
  // 10. ENTITIES & KEYWORDS
  // ==========================================
  const entityClientAcquisition = new NodeBuilder('ent_client_acquisition', 'ENTITY')
    .setTitle('Client Acquisition')
    .setSlug('client-acquisition')
    .setDescription('The process of attracting and closing new clients.')
    .setProperties({ canonicalName: 'Client Acquisition', synonyms: ['Customer Acquisition', 'Finding Clients'], category: 'Business' })
    .build();
  nodes.push(entityClientAcquisition);

  const keywordGetClients = new NodeBuilder('kw_get_freelance_clients', 'KEYWORD')
    .setTitle('how to get freelance clients')
    .setSlug('how-to-get-freelance-clients')
    .setProperties({ searchVolume: 5400, keywordDifficulty: 38, cpc: 2.50, country: 'US' })
    .build();
  nodes.push(keywordGetClients);

  edges.push(new EdgeBuilder('e_kw_targets_ent', 'kw_get_freelance_clients', 'ent_client_acquisition', 'TARGETS').build());
  edges.push(new EdgeBuilder('e_prod_solves_ent', 'prod_first_3_clients', 'ent_client_acquisition', 'SOLVES').build());

  // ==========================================
  // 11. MASTERY COURSES & LESSONS
  // ==========================================
  const courseAi = new NodeBuilder('course_fullstack_ai', 'COURSE')
    .setTitle('Fullstack AI Agent Engineering')
    .setSlug('fullstack-ai-agent-engineering')
    .setDescription('Master autonomous AI agent orchestration, tool use, and production LLM pipelines.')
    .setProperties({
      difficulty: 'Advanced',
      durationHours: 12,
      instructor: 'Ayush Paul',
      category: 'Artificial Intelligence',
      tags: ['AI Agents', 'LLMs', 'Orchestration', 'TypeScript'],
      thumbnailUrl: '/images/mastery-ai-agents.jpg'
    })
    .build();
  nodes.push(courseAi);

  edges.push(new EdgeBuilder('e_course_ai_belongs', 'course_fullstack_ai', 'eco_mastery', 'BELONGS_TO').build());

  const lessonAi1 = new NodeBuilder('lesson_ai_agents_101', 'LESSON')
    .setTitle('Lesson 1: AI Agents Architecture & Fundamentals')
    .setSlug('ai-agents-architecture-and-fundamentals')
    .setDescription('Understand memory systems, tool calling, and autonomous decision loops.')
    .setProperties({ order: 1, durationMinutes: 35, estimatedReadingTime: 10 })
    .build();
  nodes.push(lessonAi1);

  const cntLessonAi1 = new NodeBuilder('cnt_lesson_ai_agents_101', 'CONTENT')
    .setTitle('Lesson 1 Content')
    .setSlug('cnt-lesson-ai-agents-101')
    .setProperties({
      bodyMarkdown: '# Lesson 1: AI Agents Architecture & Fundamentals\n\nAutonomous agents combine reasoning LLMs with tool execution loops and persistent memory layers.',
      format: 'MARKDOWN',
      readingTimeMinutes: 10
    })
    .build();
  nodes.push(cntLessonAi1);

  edges.push(new EdgeBuilder('e_course_lesson1', 'course_fullstack_ai', 'lesson_ai_agents_101', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_lesson1_cnt', 'lesson_ai_agents_101', 'cnt_lesson_ai_agents_101', 'HAS_CONTENT').build());

  const lessonAi2 = new NodeBuilder('lesson_llm_orchestration', 'LESSON')
    .setTitle('Lesson 2: Multi-Agent Orchestration & Tool Use')
    .setSlug('multi-agent-orchestration-and-tool-use')
    .setDescription('Coordinate multiple specialized subagents with state handoffs.')
    .setProperties({ order: 2, durationMinutes: 45, estimatedReadingTime: 12 })
    .build();
  nodes.push(lessonAi2);

  const cntLessonAi2 = new NodeBuilder('cnt_lesson_llm_orchestration', 'CONTENT')
    .setTitle('Lesson 2 Content')
    .setSlug('cnt-lesson-llm-orchestration')
    .setProperties({
      bodyMarkdown: '# Lesson 2: Multi-Agent Orchestration & Tool Use\n\nLearn how to build swarm systems using strict typed tools and message queues.',
      format: 'MARKDOWN',
      readingTimeMinutes: 12
    })
    .build();
  nodes.push(cntLessonAi2);

  edges.push(new EdgeBuilder('e_course_lesson2', 'course_fullstack_ai', 'lesson_llm_orchestration', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_lesson2_cnt', 'lesson_llm_orchestration', 'cnt_lesson_llm_orchestration', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_lesson1_next_lesson2', 'lesson_ai_agents_101', 'lesson_llm_orchestration', 'NEXT_LESSON').build());
  edges.push(new EdgeBuilder('e_lesson2_requires_lesson1', 'lesson_llm_orchestration', 'lesson_ai_agents_101', 'REQUIRES').build());

  // ==========================================
  // 12. BLOG ARTICLES & CONTENT
  // ==========================================
  const blogAi = new NodeBuilder('blog_ai_agents_2026', 'BLOG')
    .setTitle('How We Built Autonomous AI Subagents in 2026')
    .setSlug('how-we-built-autonomous-ai-subagents')
    .setDescription('Architectural lessons from scaling multi-agent swarm systems using TypeScript and strict tool specifications.')
    .setProperties({
      author: 'Ayush Paul',
      publishedAt: '2026-07-15',
      category: 'AI Architecture',
      tags: ['AI', 'Subagents', 'Architecture'],
      readingTimeMinutes: 8,
      coverImageUrl: '/images/blog-ai-agents.jpg'
    })
    .build();
  nodes.push(blogAi);

  const cntBlogAi = new NodeBuilder('cnt_blog_ai_agents', 'CONTENT')
    .setTitle('Blog Article Content: AI Subagents')
    .setSlug('cnt-blog-ai-agents')
    .setProperties({
      bodyMarkdown: '# How We Built Autonomous AI Subagents in 2026\n\nIn this article we cover how multi-agent swarm architectures resolve complex software tasks using deterministic state loops.',
      format: 'MARKDOWN',
      readingTimeMinutes: 8
    })
    .build();
  nodes.push(cntBlogAi);

  edges.push(new EdgeBuilder('e_blog_ai_belongs', 'blog_ai_agents_2026', 'eco_blog', 'BELONGS_TO').build());
  edges.push(new EdgeBuilder('e_blog_ai_cnt', 'blog_ai_agents_2026', 'cnt_blog_ai_agents', 'HAS_CONTENT').build());

  const blogOutreach = new NodeBuilder('blog_client_acquisition_system', 'BLOG')
    .setTitle('The 10x Cold Outreach Framework for High-Ticket Services')
    .setSlug('the-10x-cold-outreach-framework')
    .setDescription('A comprehensive guide to packaging value-based offers and automating client acquisition pipelines.')
    .setProperties({
      author: 'Ayush Paul',
      publishedAt: '2026-07-20',
      category: 'Business Growth',
      tags: ['Outreach', 'Client Acquisition', 'Sales'],
      readingTimeMinutes: 6,
      coverImageUrl: '/images/blog-outreach.jpg'
    })
    .build();
  nodes.push(blogOutreach);

  const cntBlogOutreach = new NodeBuilder('cnt_blog_outreach', 'CONTENT')
    .setTitle('Blog Article Content: Cold Outreach')
    .setSlug('cnt-blog-outreach')
    .setProperties({
      bodyMarkdown: '# The 10x Cold Outreach Framework\n\nLearn how to construct offer packages and sequence outbound communications to close high-ticket clients consistently.',
      format: 'MARKDOWN',
      readingTimeMinutes: 6
    })
    .build();
  nodes.push(cntBlogOutreach);

  edges.push(new EdgeBuilder('e_blog_outreach_belongs', 'blog_client_acquisition_system', 'eco_blog', 'BELONGS_TO').build());
  edges.push(new EdgeBuilder('e_blog_outreach_cnt', 'blog_client_acquisition_system', 'cnt_blog_outreach', 'HAS_CONTENT').build());
  edges.push(new EdgeBuilder('e_blog_outreach_solves', 'blog_client_acquisition_system', 'ent_client_acquisition', 'SOLVES').build());

  const repo = new JsonRepository(nodes, edges);
  return { nodes, edges, repository: repo };
}
