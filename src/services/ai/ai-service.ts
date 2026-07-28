import { AIRenderer, UserContext } from '../../lib/blueprint-os/engine/services/AIRenderer';
import { ObjectRegistry } from '../../lib/blueprint-os/engine/services/ObjectRegistry';
import { EventBus } from '../../lib/blueprint-os/engine/services/EventBus';
import { IEIO, IXIO } from '../../lib/blueprint-os/engine/types';

export interface GenerationOptions {
  signal?: AbortSignal;
}

/**
 * Modern AI Service using Blueprint OS Engine
 */
export async function renderPersonalizedWorkflow<T>(
  xioUuid: string,
  userContext: UserContext,
  options?: GenerationOptions
): Promise<T> {
  const registry = ObjectRegistry.getInstance();
  const renderer = AIRenderer.getInstance();
  const eventBus = EventBus.getInstance();

  const xio = registry.getObjectByUuid(xioUuid) as IXIO;
  if (!xio) {
    throw new Error(`XIO not found in registry: ${xioUuid}`);
  }

  const eio = registry.getObjectByUuid(xio.linkedEioUuid) as IEIO;
  if (!eio) {
    throw new Error(`Linked EIO not found for XIO: ${xioUuid}`);
  }

  const startTime = Date.now();

  try {
    const result = await renderer.renderWorkflow<T>(xio, eio, userContext, options?.signal);
    
    const latency = Date.now() - startTime;
    eventBus.publish({
      type: 'AiGenerationCompletedEvent',
      payload: {
        xioUuid,
        eioUuid: eio.uuid,
        latencyMs: latency,
        success: true
      },
      timestamp: Date.now()
    });

    return result;
  } catch (err: any) {
    const latency = Date.now() - startTime;
    eventBus.publish({
      type: 'AiGenerationCompletedEvent',
      payload: {
        xioUuid,
        eioUuid: eio.uuid,
        latencyMs: latency,
        success: false,
        error: err.message
      },
      timestamp: Date.now()
    });
    throw err;
  }
}
