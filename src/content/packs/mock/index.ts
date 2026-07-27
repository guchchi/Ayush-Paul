import { IEIO, IXIO, IAIO } from '../../../lib/blueprint-os/engine/types';
import manifestJson from './manifest.json';

const MOCK_EIO: IEIO = {
  id: "eio-mock-001",
  uuid: "00000000-0000-0000-0000-000000000001",
  type: "eio",
  lifecycle: {
    status: "published",
    stability: "stable",
    deprecated: false,
    createdAt: "2026-07-27"
  },
  capabilities: ["mock-capability"],
  provenance: {
    source: "Mock Pack",
    author: "System",
    version: "1.0.0"
  },
  education: {
    coreConcept: "This is a mock concept to test the engine.",
    explanations: {
      beginner: "Just a test."
    }
  },
  signals: {
    success: ["Engine loads it."],
    failure: ["Engine crashes."]
  }
};

const MOCK_XIO: IXIO = {
  id: "xio-mock-001",
  uuid: "00000000-0000-0000-0000-000000000002",
  type: "xio",
  linkedEioUuid: MOCK_EIO.uuid,
  lifecycle: {
    status: "published",
    stability: "stable",
    deprecated: false,
    createdAt: "2026-07-27"
  },
  capabilities: ["mock-capability"],
  workflow: {
    objective: "Execute the mock.",
    inputs: [],
    outputs: ["Mock Result"]
  },
  practice: {
    prompt: "Do the mock thing."
  }
};

const MOCK_AIO: IAIO = {
  id: "aio-mock-001",
  uuid: "00000000-0000-0000-0000-000000000003",
  type: "aio",
  linkedEioUuid: MOCK_EIO.uuid,
  lifecycle: {
    status: "published",
    stability: "stable",
    deprecated: false,
    createdAt: "2026-07-27"
  },
  capabilities: ["mock-capability"],
  assessment: {
    scenarios: [
      {
        context: "Testing the engine",
        question: "Did it load?"
      }
    ],
    rubrics: ["Yes"],
    passThreshold: 1.0
  },
  completion: {
    observableBehaviors: ["Engine verified"]
  }
};

export const MockPack = {
  manifest: manifestJson,
  objects: [MOCK_EIO, MOCK_XIO, MOCK_AIO]
};
