
export class AIError extends Error {
  constructor(message: string, public readonly isTransient: boolean, public readonly telemetry?: any) {
    super(message);
    this.name = 'AIError';
  }
}

export class AIRateLimitError extends AIError {
  constructor(telemetry?: any) {
    super('Rate limit exceeded. Please try again later.', true, telemetry);
    this.name = 'AIRateLimitError';
  }
}

export class AITimeoutError extends AIError {
  constructor(telemetry?: any) {
    super('Request timed out. Please try again later.', true, telemetry);
    this.name = 'AITimeoutError';
  }
}

export class AIValidationError extends AIError {
  constructor(message: string, telemetry?: any) {
    super(`Model output failed validation: ${message}`, false, telemetry);
    this.name = 'AIValidationError';
  }
}
