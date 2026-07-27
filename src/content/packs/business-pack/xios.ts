import { IXIO } from '../../../lib/blueprint-os/engine/types';

export const BUSINESS_XIOS: IXIO[] = [
  {
    id: "xio-m1-niche-001",
    uuid: "f6b0f0a4-2234-4001-8001-123456789001",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789001", // Niche EIO
    type: "xio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis"],
    workflow: {
      objective: "Define your target niche in one sentence.",
      inputs: [],
      outputs: ["Niche Definition"]
    },
    practice: {
      prompt: "Using the Viable Niche Matrix, who exactly are you helping?",
      hints: ["Must have purchasing power and high pain."]
    },
    failureHandling: {
      failureModes: [
        {
          mode: "Too Broad",
          recoverySteps: ["Ask the user to specify an industry sub-vertical."]
        }
      ]
    }
  },
  {
    id: "xio-m1-icp-001",
    uuid: "f6b0f0a4-2234-4001-8001-123456789002",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789002", // ICP EIO
    type: "xio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis"],
    workflow: {
      objective: "Define your ICP's exact job title and frustration.",
      inputs: ["Niche Definition"],
      outputs: ["ICP Profile"]
    },
    practice: {
      prompt: "What is the exact job title of the person writing the check?",
      hints: ["Target VPs and C-levels."]
    }
  },
  {
    id: "xio-m2-offer-001",
    uuid: "f6b0f0a4-2234-4001-8001-123456789003",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789003", // Offer EIO
    type: "xio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["offer-design"],
    workflow: {
      objective: "Write your transformation statement.",
      inputs: ["ICP Profile"],
      outputs: ["Offer Transformation"]
    },
    practice: {
      prompt: "I help [ICP] achieve [Outcome] without [Pain]."
    }
  },
  {
    id: "xio-m2-pricing-001",
    uuid: "f6b0f0a4-2234-4001-8001-123456789004",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789004", // Pricing EIO
    type: "xio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["pricing"],
    workflow: {
      objective: "Calculate ROI-based price.",
      inputs: ["Offer Transformation"],
      outputs: ["Price Point"]
    },
    practice: {
      prompt: "How much monetary value does your offer create in 12 months? Price it at 10% of that."
    }
  },
  {
    id: "xio-m3-positioning-001",
    uuid: "f6b0f0a4-2234-4001-8001-123456789005",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789005", // Positioning EIO
    type: "xio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["positioning"],
    workflow: {
      objective: "Draft a Category of One positioning statement.",
      inputs: ["Offer Transformation", "Price Point"],
      outputs: ["Positioning Statement"]
    },
    practice: {
      prompt: "Write your authority positioning statement using the framework."
    }
  }
];
