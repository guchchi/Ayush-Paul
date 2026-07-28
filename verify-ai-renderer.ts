import { ObjectRegistry } from './src/lib/blueprint-os/engine/services/ObjectRegistry';
import { EventBus } from './src/lib/blueprint-os/engine/services/EventBus';
import { TelemetryTracker } from './src/lib/blueprint-os/engine/services/TelemetryTracker';
import { BusinessPack } from './src/content/packs/business-pack';
import { renderPersonalizedWorkflow } from './src/services/ai/ai-service';

// Mock env for testing outside Vite
process.env.VITE_USE_MOCK_AI = 'true';

async function run() {
  console.log("=== Blueprint OS: AI Renderer Verification ===");

  // 1. Initialize OS Engine
  const registry = ObjectRegistry.getInstance();
  const eventBus = EventBus.getInstance();
  const telemetry = TelemetryTracker.getInstance();

  console.log("[1] Loading Business Pack...");
  registry.registerPack(BusinessPack.manifest as any, BusinessPack.objects);

  // Niche XIO UUID
  const nicheXioUuid = "f6b0f0a4-2234-4001-8001-123456789001";
  
  // 2. Define User Context
  const userContext = {
    user: {
      target_market: "Healthcare",
      experience_level: "Beginner",
      niche_breadth: 5
    }
  };

  console.log(`[2] Running AI Renderer for XIO: ${nicheXioUuid}...`);
  console.log(`User Context: ${JSON.stringify(userContext)}`);

  // 3. Render
  try {
    const result = await renderPersonalizedWorkflow(nicheXioUuid, userContext);
    console.log("\n[3] Result from AI:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error("AI Rendering Failed:", err.message);
  }

  // 4. Verify Telemetry
  console.log("\n[4] Telemetry Logs:");
  console.log(JSON.stringify(telemetry.getLogs(), null, 2));
}

run();
