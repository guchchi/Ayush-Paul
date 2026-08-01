import { NodeBuilder, EdgeBuilder } from '../builders/builders';
import { JsonRepository } from '../repositories/json-repository';
import { BaseNode, BaseEdge } from '../core/types';

export function generateInitialGraph(): { nodes: BaseNode[]; edges: BaseEdge[]; repository: JsonRepository } {
  const nodes: BaseNode[] = [];
  const edges: BaseEdge[] = [];

  // 1. Root & Ecosystem
  const brand = new NodeBuilder('brand_paulx', 'BRAND')
    .setTitle('ThePaulX')
    .setSlug('thepaulx')
    .setDescription('The premier business execution ecosystem for high-value creators and consultants.')
    .build();
  nodes.push(brand);

  const blueprintEcosystem = new NodeBuilder('eco_blueprints', 'ECOSYSTEM')
    .setTitle('Blueprints')
    .setSlug('blueprints')
    .setDescription('Step-by-step operational blueprints for revenue generation.')
    .build();
  nodes.push(blueprintEcosystem);

  const studioEcosystem = new NodeBuilder('eco_studio', 'ECOSYSTEM')
    .setTitle('Studio')
    .setSlug('studio')
    .setDescription('Interactive tools, templates, and execution assets.')
    .build();
  nodes.push(studioEcosystem);

  edges.push(new EdgeBuilder('e_brand_blueprints', 'brand_paulx', 'eco_blueprints', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_blueprints_brand', 'eco_blueprints', 'brand_paulx', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_brand_studio', 'brand_paulx', 'eco_studio', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_studio_brand', 'eco_studio', 'brand_paulx', 'HAS_PARENT').build());

  // 2. Product: Get Your First 3 Clients
  const product = new NodeBuilder('prod_first_3_clients', 'PRODUCT')
    .setTitle('Get Your First 3 Clients')
    .setSlug('get-your-first-3-clients')
    .setDescription('Complete operational system to land your first 3 high-ticket freelance or consulting clients.')
    .setProperties({ difficulty: 'BEGINNER', estimatedHours: 12, priceInCents: 0 })
    .build();
  nodes.push(product);

  const productContent = new NodeBuilder('cnt_prod_first3', 'CONTENT')
    .setTitle('Get Your First 3 Clients — Blueprint Overview')
    .setSlug('cnt-get-your-first-3-clients')
    .setProperties({
      bodyMarkdown: '# Get Your First 3 Clients\n\nThis blueprint teaches high-value freelancers how to close clients with zero guesswork.',
      format: 'MARKDOWN',
      readingTimeMinutes: 2
    })
    .build();
  nodes.push(productContent);

  edges.push(new EdgeBuilder('e_prod_cnt', 'prod_first_3_clients', 'cnt_prod_first3', 'HAS_CONTENT').build());

  edges.push(new EdgeBuilder('e_eco_prod', 'eco_blueprints', 'prod_first_3_clients', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_prod_eco', 'prod_first_3_clients', 'eco_blueprints', 'HAS_PARENT').build());

  // 3. Module 1: Offer Engineering
  const mod1 = new NodeBuilder('mod_offer_engineering', 'MODULE')
    .setTitle('Module 1: Offer Engineering')
    .setSlug('offer-engineering')
    .setDescription('Construct an irresistible high-value offer tailored for a specific niche.')
    .setProperties({ order: 1, summary: 'Crafting the offer' })
    .build();
  nodes.push(mod1);

  edges.push(new EdgeBuilder('e_prod_mod1', 'prod_first_3_clients', 'mod_offer_engineering', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod1_prod', 'mod_offer_engineering', 'prod_first_3_clients', 'HAS_PARENT').build());

  const step1 = new NodeBuilder('step_niche_selection', 'STEP')
    .setTitle('Step 1: Niche & ICP Definition')
    .setSlug('niche-and-icp-definition')
    .setDescription('Identify high-budget clients and zero in on urgent market needs.')
    .setProperties({ order: 1, estimatedMinutes: 45, actionItem: 'Complete the ICP Generator' })
    .build();
  nodes.push(step1);

  const step1Content = new NodeBuilder('cnt_step1_niche', 'CONTENT')
    .setTitle('Step 1 Body Content')
    .setSlug('cnt-step-1-niche')
    .setProperties({
      bodyMarkdown: '# Niche & ICP Definition\n\nTo build a high-ticket offer, you must master Client Acquisition and target an Ideal Customer Profile. Complete the ICP Generator tool to begin.',
      format: 'MARKDOWN',
      readingTimeMinutes: 3
    })
    .build();
  nodes.push(step1Content);

  edges.push(new EdgeBuilder('e_step1_cnt', 'step_niche_selection', 'cnt_step1_niche', 'HAS_CONTENT').build());

  edges.push(new EdgeBuilder('e_mod1_step1', 'mod_offer_engineering', 'step_niche_selection', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step1_mod1', 'step_niche_selection', 'mod_offer_engineering', 'HAS_PARENT').build());

  const step2 = new NodeBuilder('step_pricing_strategy', 'STEP')
    .setTitle('Step 2: Value-Based Pricing Strategy')
    .setSlug('value-based-pricing-strategy')
    .setDescription('Price your offer based on ROI rather than billable hours.')
    .setProperties({ order: 2, estimatedMinutes: 30, actionItem: 'Calculate offer value' })
    .build();
  nodes.push(step2);

  edges.push(new EdgeBuilder('e_mod1_step2', 'mod_offer_engineering', 'step_pricing_strategy', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step2_mod1', 'step_pricing_strategy', 'mod_offer_engineering', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_step1_step2_next', 'step_niche_selection', 'step_pricing_strategy', 'NEXT_STEP').build());

  // 4. Module 2: Client Outreach Engine
  const mod2 = new NodeBuilder('mod_outreach_engine', 'MODULE')
    .setTitle('Module 2: Client Outreach Engine')
    .setSlug('client-outreach-engine')
    .setDescription('Build and launch high-converting cold email and direct messaging campaigns.')
    .setProperties({ order: 2, summary: 'Outreach execution' })
    .build();
  nodes.push(mod2);

  edges.push(new EdgeBuilder('e_prod_mod2', 'prod_first_3_clients', 'mod_outreach_engine', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_mod2_prod', 'mod_outreach_engine', 'prod_first_3_clients', 'HAS_PARENT').build());
  edges.push(new EdgeBuilder('e_mod1_mod2_next', 'mod_offer_engineering', 'mod_outreach_engine', 'NEXT_STEP').build());

  const step3 = new NodeBuilder('step_cold_email', 'STEP')
    .setTitle('Step 3: Cold Outreach Sequence')
    .setSlug('cold-outreach-sequence')
    .setDescription('Draft personalized outreach sequences using structured prompts.')
    .setProperties({ order: 1, estimatedMinutes: 60, actionItem: 'Send 20 personalized emails' })
    .build();
  nodes.push(step3);

  edges.push(new EdgeBuilder('e_mod2_step3', 'mod_outreach_engine', 'step_cold_email', 'HAS_CHILD').build());
  edges.push(new EdgeBuilder('e_step3_mod2', 'step_cold_email', 'mod_outreach_engine', 'HAS_PARENT').build());

  // 5. Studio Execution Assets
  const toolIcp = new NodeBuilder('tool_icp_generator', 'TOOL')
    .setTitle('ICP Generator')
    .setSlug('icp-generator')
    .setDescription('Interactive studio tool to define ideal buyer personas.')
    .setProperties({ isInteractive: true, runtimeEngine: 'CLIENT_SIDE' })
    .build();
  nodes.push(toolIcp);

  edges.push(new EdgeBuilder('e_step1_tool_icp', 'step_niche_selection', 'tool_icp_generator', 'IMPLEMENTS').build());
  edges.push(new EdgeBuilder('e_tool_icp_belongs', 'tool_icp_generator', 'eco_studio', 'BELONGS_TO').build());

  const promptOutreach = new NodeBuilder('prompt_cold_email', 'PROMPT')
    .setTitle('High-Ticket Outreach Prompt Pack')
    .setSlug('high-ticket-outreach-prompt-pack')
    .setDescription('AI prompt sequence designed to generate personalized client pitches.')
    .build();
  nodes.push(promptOutreach);

  edges.push(new EdgeBuilder('e_step3_prompt', 'step_cold_email', 'prompt_cold_email', 'IMPLEMENTS').build());
  edges.push(new EdgeBuilder('e_prompt_belongs', 'prompt_cold_email', 'eco_studio', 'BELONGS_TO').build());

  const templateProposal = new NodeBuilder('template_proposal', 'TEMPLATE')
    .setTitle('Standard Consulting Proposal')
    .setSlug('standard-consulting-proposal')
    .setDescription('Fillable proposal template to close prospects on discovery calls.')
    .setProperties({ format: 'DOCX' })
    .build();
  nodes.push(templateProposal);

  edges.push(new EdgeBuilder('e_step3_template', 'step_cold_email', 'template_proposal', 'IMPLEMENTS').build());

  // 6. Semantic Entities & Keywords
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

  const repo = new JsonRepository(nodes, edges);
  return { nodes, edges, repository: repo };
}
