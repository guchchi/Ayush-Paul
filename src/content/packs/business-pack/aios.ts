import { IAIO } from '../../../lib/blueprint-os/engine/types';

export const BUSINESS_AIOS: IAIO[] = [
  {
    id: "aio-m1-niche-001",
    uuid: "f6b0f0a4-3234-4001-8001-123456789001",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789001", // Niche EIO
    type: "aio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis"],
    assessment: {
      scenarios: [
        {
          context: "A founder says they target 'small businesses who need more sales'.",
          question: "Why is this not a viable niche?"
        }
      ],
      rubrics: ["Identifies lack of purchasing power", "Identifies lack of specificity"],
      passThreshold: 1.0
    },
    completion: {
      observableBehaviors: ["Can reject unviable markets rapidly"]
    }
  },
  {
    id: "aio-m1-icp-001",
    uuid: "f6b0f0a4-3234-4001-8001-123456789002",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789002", // ICP EIO
    type: "aio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["market-analysis"],
    assessment: {
      scenarios: [
        {
          context: "Selling a $50k software solution to a hospital.",
          question: "Who is the ICP: The head nurse or the hospital administrator?"
        }
      ],
      rubrics: ["Identifies hospital administrator as having budget authority"],
      passThreshold: 1.0
    },
    completion: {
      observableBehaviors: ["Targets roles with budget authority"]
    }
  },
  {
    id: "aio-m2-offer-001",
    uuid: "f6b0f0a4-3234-4001-8001-123456789003",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789003", // Offer EIO
    type: "aio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["offer-design"],
    assessment: {
      scenarios: [
        {
          context: "A consultant says 'I offer leadership coaching sessions.'",
          question: "Rewrite this to be a transformation offer."
        }
      ],
      rubrics: ["Focuses on outcome", "Removes focus on deliverables"],
      passThreshold: 0.8
    },
    completion: {
      observableBehaviors: ["Pitches outcomes, not services"]
    }
  },
  {
    id: "aio-m2-pricing-001",
    uuid: "f6b0f0a4-3234-4001-8001-123456789004",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789004", // Pricing EIO
    type: "aio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["pricing"],
    assessment: {
      scenarios: [
        {
          context: "You build an integration that takes 2 days and saves the client $200k/year in headcount.",
          question: "What should you charge and why?"
        }
      ],
      rubrics: ["Quotes 10-20% of ROI", "Explicitly ignores time taken"],
      passThreshold: 1.0
    },
    completion: {
      observableBehaviors: ["Calculates price based on ROI"]
    }
  },
  {
    id: "aio-m3-positioning-001",
    uuid: "f6b0f0a4-3234-4001-8001-123456789005",
    linkedEioUuid: "f6b0f0a4-1234-4001-8001-123456789005", // Positioning EIO
    type: "aio",
    lifecycle: {
      status: "published",
      stability: "stable",
      deprecated: false,
      createdAt: "2026-07-27"
    },
    capabilities: ["positioning"],
    assessment: {
      scenarios: [
        {
          context: "A prospect says 'We are a full-service marketing agency.'",
          question: "What is the primary commodity trap here?"
        }
      ],
      rubrics: ["Identifies generic language", "Suggests a constrained alternative"],
      passThreshold: 0.8
    },
    completion: {
      observableBehaviors: ["Can critique weak positioning", "Can reject poor ICPs"]
    }
  }
];
