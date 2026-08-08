# API Integrations & Generative Contracts

## AI Integration Framework
- Primary LLM library: `@google/generative-ai`
- Models: Gemini 2.5 Flash / Pro (as configured)

## Principles
- Deterministic copy generation uses local string templates when offline.
- Generative AI calls are scoped and handled asynchronously with loading indicators.
- Fallback content is handled gracefully without breaking state serialization.
