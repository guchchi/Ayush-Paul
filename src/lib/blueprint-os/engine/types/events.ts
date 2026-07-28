export enum OSEventType {
  AssessmentPassed = 'AssessmentPassed',
  AssessmentFailed = 'AssessmentFailed',
  KnowledgeMastered = 'KnowledgeMastered',
  PathCompleted = 'PathCompleted',
  AiGenerationCompleted = 'AiGenerationCompletedEvent',
  ObjectServed = 'ObjectServedEvent'
}

export interface IOSBaseEvent {
  type: OSEventType;
  timestamp: string;
  userId: string;
  payload: any;
}

export interface IAssessmentPassedEvent extends IOSBaseEvent {
  type: OSEventType.AssessmentPassed;
  payload: {
    aioUuid: string;
    linkedEioUuid: string;
    score: number;
  };
}

export interface IAssessmentFailedEvent extends IOSBaseEvent {
  type: OSEventType.AssessmentFailed;
  payload: {
    aioUuid: string;
    linkedEioUuid: string;
    failureMode: string;
  };
}

export interface IEventBus {
  publish(event: IOSBaseEvent): void;
  subscribe(eventType: OSEventType, handler: (event: IOSBaseEvent) => void): () => void;
}
