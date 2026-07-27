import { ObjectRegistry } from './src/lib/blueprint-os/engine/services';
import { BusinessPack } from './src/content/packs/business-pack';

const registry = ObjectRegistry.getInstance();

console.log("Loading Business Pack into OS Engine...");
registry.registerPack(BusinessPack.manifest as any, BusinessPack.objects);

console.log("\nVerifying object capabilities...");
const positioningObjects = registry.getObjectsByCapability('positioning');
console.log(`Found ${positioningObjects.length} objects tagged with 'positioning' capability (EIO, XIO, AIO, EDO).`);

const nicheEio = registry.getObjectByUuid('f6b0f0a4-1234-4001-8001-123456789001');
if (nicheEio) {
    console.log(`\nSuccessfully loaded Niche EIO: ${nicheEio.id}`);
    // @ts-ignore
    console.log(`Core Concept: ${nicheEio.education.coreConcept}`);
}

const positioningAio = registry.getObjectByUuid('f6b0f0a4-3234-4001-8001-123456789005');
if (positioningAio) {
    console.log(`\nSuccessfully loaded Positioning AIO: ${positioningAio.id}`);
    // @ts-ignore
    console.log(`Pass Threshold: ${positioningAio.assessment.passThreshold}`);
}
