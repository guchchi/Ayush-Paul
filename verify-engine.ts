import { ObjectRegistry, EventBus } from './src/lib/blueprint-os/engine/services';
import { OSEventType, IAssessmentPassedEvent } from './src/lib/blueprint-os/engine/types';
import { MockPack } from './src/content/packs/mock';

// 1. Initialize Engine Services
const registry = ObjectRegistry.getInstance();
const eventBus = EventBus.getInstance();

// 2. Load Mock Pack
console.log("Loading Mock Pack into Registry...");
registry.registerPack(MockPack.manifest as any, MockPack.objects);

// 3. Verify Registry
const loadedEio = registry.getObjectByUuid('00000000-0000-0000-0000-000000000001');
console.log("Successfully retrieved from Registry:", loadedEio ? loadedEio.id : "NOT FOUND");

const objectsByCap = registry.getObjectsByCapability('mock-capability');
console.log(`Found ${objectsByCap.length} objects for 'mock-capability'`);

// 4. Test Event Pipeline
console.log("Setting up Event Bus subscription...");
eventBus.subscribe(OSEventType.AssessmentPassed, (event) => {
  const passedEvent = event as IAssessmentPassedEvent;
  console.log(`\n🎉 Received AssessmentPassed Event!`);
  console.log(`User ${passedEvent.userId} passed assessment for EIO ${passedEvent.payload.linkedEioUuid} with score ${passedEvent.payload.score}`);
});

console.log("Simulating an Assessment Pass in the runtime pipeline...");
eventBus.publish({
  type: OSEventType.AssessmentPassed,
  timestamp: new Date().toISOString(),
  userId: "user-test-123",
  payload: {
    aioUuid: '00000000-0000-0000-0000-000000000003',
    linkedEioUuid: '00000000-0000-0000-0000-000000000001',
    score: 1.0
  }
} as IAssessmentPassedEvent);
