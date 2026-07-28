import { EventBus } from './EventBus';
import { IOSBaseEvent, OSEventType } from '../types/events';

export class TelemetryTracker {
  private static instance: TelemetryTracker;
  private logs: any[] = [];

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): TelemetryTracker {
    if (!TelemetryTracker.instance) {
      TelemetryTracker.instance = new TelemetryTracker();
    }
    return TelemetryTracker.instance;
  }

  private setupListeners() {
    const bus = EventBus.getInstance();
    
    const handler = (event: IOSBaseEvent) => {
      this.logs.push({
        timestamp: new Date().toISOString(),
        type: event.type,
        data: event.payload
      });
    };

    bus.subscribe(OSEventType.AiGenerationCompleted, handler);
    bus.subscribe(OSEventType.ObjectServed, handler);
    bus.subscribe(OSEventType.AssessmentPassed, handler);
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
  }
}
