import { IEIO } from '../../../lib/blueprint-os/engine/types';

export const BUSINESS_EIOS: IEIO[] = [
  {
    id: "eio-m1-niche-001",
    uuid: "f6b0f0a4-1234-4001-8001-123456789001",
    type: "eio",
    lifecycle: {
      status: "published",
      reviewStatus: "peer-reviewed",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis", "niche-selection"],
    provenance: {
      source: "Blueprint V2 Core",
      author: "System",
      version: "1.0.0"
    },
    education: {
      coreConcept: "A viable niche is an intersection of pain, purchasing power, and accessibility.",
      explanations: {
        beginner: "Don't sell to 'businesses'. Sell to 'B2B SaaS companies over $1M ARR'.",
        intermediate: "A niche isn't just an industry; it's a specific psychographic state of pain.",
        advanced: "Niche selection is about finding structural market inefficiencies you can arbitrage."
      },
      mentalModels: ["The Viable Niche Matrix"],
      commonMistakes: ["Choosing a broke audience (e.g., struggling musicians)."]
    },
    signals: {
      success: [
        "You can list 50 prospects in 10 minutes.",
        "Prospects have money to spend."
      ],
      failure: [
        "You can't find them easily online.",
        "They consistently say they have no budget."
      ]
    }
  },
  {
    id: "eio-m1-icp-001",
    uuid: "f6b0f0a4-1234-4001-8001-123456789002",
    type: "eio",
    lifecycle: {
      status: "published",
      reviewStatus: "peer-reviewed",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis", "customer-profiling"],
    provenance: {
      source: "Blueprint V2 Core",
      author: "System",
      version: "1.0.0"
    },
    education: {
      coreConcept: "Your ICP is the specific persona within your niche who signs the check.",
      explanations: {
        beginner: "If your niche is Hospitals, your ICP is the Chief of Surgery.",
        intermediate: "The ICP must have both the pain of the problem and the authority to buy the solution."
      },
      mentalModels: ["The High-Ticket ICP Profiler"],
      commonMistakes: ["Targeting end-users instead of buyers."]
    },
    signals: {
      success: [
        "You know exactly what job title to search on LinkedIn.",
        "You know what keeps them awake at 2 AM."
      ],
      failure: [
        "Your leads love your product but have to ask their boss for budget."
      ]
    }
  },
  {
    id: "eio-m2-offer-001",
    uuid: "f6b0f0a4-1234-4001-8001-123456789003",
    type: "eio",
    lifecycle: {
      status: "published",
      reviewStatus: "peer-reviewed",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["offer-design", "copywriting"],
    provenance: {
      source: "Blueprint V2 Core",
      author: "System",
      version: "1.0.0"
    },
    education: {
      coreConcept: "An offer is the vehicle that takes a client from their current pain to their desired state.",
      explanations: {
        beginner: "Don't sell 'Facebook Ads'. Sell '10 qualified leads per month'."
      },
      mentalModels: ["The Irresistible Transformation Offer"],
      commonMistakes: ["Listing features instead of outcomes."]
    },
    signals: {
      success: [
        "Prospects say 'How does it work?' instead of 'How much is it?'"
      ],
      failure: [
        "Prospects compare you to freelancers on Upwork."
      ]
    }
  },
  {
    id: "eio-m2-pricing-001",
    uuid: "f6b0f0a4-1234-4001-8001-123456789004",
    type: "eio",
    lifecycle: {
      status: "published",
      reviewStatus: "peer-reviewed",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["pricing", "offer-design"],
    provenance: {
      source: "Blueprint V2 Core",
      author: "System",
      version: "1.0.0"
    },
    education: {
      coreConcept: "Price is what they pay, value is what they get. Charge based on the size of the problem solved.",
      explanations: {
        beginner: "If you save a company $100k, charging $10k is a bargain."
      },
      mentalModels: ["Value-Based Pricing"],
      commonMistakes: ["Charging based on competitor pricing."]
    },
    signals: {
      success: [
        "You no longer track hours."
      ],
      failure: [
        "Clients ask for an itemized breakdown of your time."
      ]
    }
  },
  {
    id: "eio-m3-positioning-001",
    uuid: "f6b0f0a4-1234-4001-8001-123456789005",
    type: "eio",
    lifecycle: {
      status: "published",
      reviewStatus: "peer-reviewed",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["positioning", "authority-building"],
    provenance: {
      source: "Blueprint V2 Core",
      author: "System",
      version: "1.0.0"
    },
    education: {
      coreConcept: "Positioning is the space you occupy relative to alternatives.",
      explanations: {
        beginner: "Don't be a 'better' graphic designer. Be the 'only' designer for neurotech."
      },
      mentalModels: ["Category of One"],
      commonMistakes: ["Claiming 'high quality' as a differentiator."]
    },
    signals: {
      success: [
        "Prospects say 'I was looking specifically for someone who does X'."
      ],
      failure: [
        "Prospects ghost you to go with a cheaper alternative."
      ]
    }
  }
];
