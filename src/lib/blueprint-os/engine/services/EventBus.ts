import { IOSBaseEvent, OSEventType, IEventBus } from '../types';

type EventHandler = (event: IOSBaseEvent) => void;

export class EventBus implements IEventBus {
  private static instance: EventBus;
  private listeners: Map<OSEventType, Set<EventHandler>>;

  private constructor() {
    this.listeners = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribes to a specific OS event type.
   * @returns A function to unsubscribe.
   */
  public subscribe(eventType: OSEventType, handler: EventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  /**
   * Publishes an event to all subscribed listeners.
   */
  public publish(event: IOSBaseEvent): void {
    console.debug(`[Blueprint OS] Event Dispatched: ${event.type}`, event);
    
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[Blueprint OS] Error in event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Clears all listeners (useful for testing/resetting the engine)
   */
  public clearAll(): void {
    this.listeners.clear();
  }
}
