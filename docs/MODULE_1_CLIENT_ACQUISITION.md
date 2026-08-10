# Module 1: Client Acquisition System — Deep Dive

## State Machine Architecture
Module 1 operates on `useOpportunityMapStore`.

### Core Data Fields
- `serviceId`: Target service offering.
- `marketId`: Target market segment.
- `nicheId`: Specific niche focus.
- `positioning`: Position statement derived from positioning matrix.
- `currentStep` & `completedSteps`: Wizard step tracker.

## Upstream Integration
Passes market positioning and opportunity context to Module 2 (Offer Engineering).
