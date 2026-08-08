# System Architecture Overview

## 6-Module Pipeline Flow
1. **Client Acquisition** (`/workspace/client-acquisition`): Market positioning & opportunity mapping.
2. **Offer Engineering** (`/workspace/offer-engineering`): Tiered offer creation & value scoping.
3. **Authority System** (`/workspace/authority-system`): Strategic profile & portfolio authority synthesis.
4. **Portfolio System** (`/workspace/portfolio-system`): Case studies & visual proof asset generator.
5. **Client Pipeline** (`/workspace/client-pipeline`): Active deal tracking & proposal pipeline.
6. **Outreach Engine** (`/workspace/outreach-engine`): Campaign sequencing & outbound engagement.

## State Persistence
- Managed via Zustand with `persist` middleware.
- Serialized to `localStorage`.
- Migrations handled via store version keys.
