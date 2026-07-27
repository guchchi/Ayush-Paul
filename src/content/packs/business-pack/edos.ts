import { IEDO } from '../../../lib/blueprint-os/engine/types';

export const BUSINESS_EDOS: IEDO[] = [
  {
    id: "edo-m1-niche-force-constraint",
    uuid: "f6b0f0a4-4234-4001-8001-123456789001",
    type: "edo",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis"],
    condition: {
      rules: [
        { field: "user.niche_breadth", operator: "gt", value: 3 }
      ]
    },
    decision: "Force constraint to a single vertical",
    explainability: {
      explanation: "Generalists cannot charge premium prices. By targeting everyone, your marketing costs soar.",
      evidence: "Specialists in the program close deals 4x faster.",
      tradeoffs: ["Feels like turning down potential business initially"],
      alternatives: [],
      confidenceScore: 99
    },
    outputs: {
      prioritizeUuids: ["f6b0f0a4-1234-4001-8001-123456789001"] // Recommend Niche EIO
    }
  },
  {
    id: "edo-m1-icp-c-level",
    uuid: "f6b0f0a4-4234-4001-8001-123456789002",
    type: "edo",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["customer-profiling"],
    condition: {
      rules: [
        { field: "user.target_market", operator: "eq", value: "Enterprise" }
      ]
    },
    decision: "Target VP or C-Level, not Managers",
    explainability: {
      explanation: "Managers lack the budget authority for enterprise-level transformation.",
      evidence: "Sales cycles involving end-users stall 78% of the time at the procurement stage.",
      tradeoffs: ["Harder to book the initial meeting"],
      alternatives: [],
      confidenceScore: 90
    },
    outputs: {
      prioritizeUuids: ["f6b0f0a4-1234-4001-8001-123456789002"]
    }
  },
  {
    id: "edo-m2-offer-dfy",
    uuid: "f6b0f0a4-4234-4001-8001-123456789003",
    type: "edo",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["offer-design"],
    condition: {
      rules: [
        { field: "user.experience_level", operator: "eq", value: "Beginner" }
      ]
    },
    decision: "Recommend Done-For-You (DFY) offer",
    explainability: {
      explanation: "Beginners lack the proof required to sell pure consulting or coaching.",
      evidence: "DFY offers convert at 15% vs 2% for DWY for users with zero past clients.",
      tradeoffs: ["Unscalable time commitment for fulfillment"],
      alternatives: [],
      confidenceScore: 85
    },
    outputs: {
      prioritizeUuids: ["f6b0f0a4-1234-4001-8001-123456789003"]
    }
  },
  {
    id: "edo-m2-pricing-roi",
    uuid: "f6b0f0a4-4234-4001-8001-123456789004",
    type: "edo",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["pricing"],
    condition: {
      rules: [
        { field: "offer.roi_measurable", operator: "eq", value: true }
      ]
    },
    decision: "Charge 10% of generated revenue",
    explainability: {
      explanation: "Aligns your financial incentive directly with the client's growth.",
      evidence: "Performance deals yield 3x higher LTV.",
      tradeoffs: ["Client execution risk"],
      alternatives: [],
      confidenceScore: 92
    },
    outputs: {
      prioritizeUuids: ["f6b0f0a4-1234-4001-8001-123456789004"]
    }
  },
  {
    id: "edo-m3-positioning-unique",
    uuid: "f6b0f0a4-4234-4001-8001-123456789005",
    type: "edo",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["positioning"],
    condition: {
      rules: [
        { field: "market.saturation", operator: "eq", value: "high" }
      ]
    },
    decision: "Position via a unique mechanism",
    explainability: {
      explanation: "You cannot compete on 'better' in a crowded market, only on 'different'.",
      evidence: "Agencies using a named mechanism saw a 40% reduction in price objections.",
      tradeoffs: ["Requires more education in your marketing copy"],
      alternatives: [],
      confidenceScore: 95
    },
    outputs: {
      prioritizeUuids: ["f6b0f0a4-1234-4001-8001-123456789005"]
    }
  }
];
