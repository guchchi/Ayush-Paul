# Payment & Checkout Security Architecture

This document outlines the secure payment architecture, webhook verification, and digital delivery flow implemented in this application.

## Intended Secure Flow

To ensure digital product assets cannot be downloaded or accessed without a completed transaction, the application enforces the following pipeline:

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant API as Server API
    participant Stripe as Stripe API
    participant DB as Firestore Database

    Client->>API: 1. POST /api/create-checkout-session (Bearer ID Token)
    Note over API: Verify Firebase ID Token<br/>Validate user ownership check
    API->>Stripe: 2. Create Checkout Session (Metadata: userId, productId)
    Stripe-->>API: Return Session URL
    API-->>Client: Return Session URL
    Client->>Stripe: 3. User Completes Payment
    Stripe->>API: 4. POST /api/stripe-webhook (Raw body + stripe-signature)
    Note over API: Verify signature using STRIPE_WEBHOOK_SECRET<br/>Idempotency check (sessionId)
    API->>DB: 5. Grant Ownership (Set ownedProducts[productId] = "premium")
    API->>DB: 6. Log Purchase Transaction & send confirmation email
    Client->>API: 7. GET /api/download-product (Bearer ID Token)
    Note over API: Verify Firebase ID Token<br/>Check ownership record in DB
    API-->>Client: Return Secure Download URL
```

---

## Security Controls

### 1. Cryptographic Signature Verification
All inbound Stripe webhooks to `/api/stripe-webhook` must have a valid `stripe-signature` header. The payload is verified using the raw request buffer and `STRIPE_WEBHOOK_SECRET` via Stripe SDK `stripe.webhooks.constructEvent()`. This prevents parameter tampering and spoofing.

### 2. Double-Sided Fulfillment Verification
- **Primary (Asynchronous Webhook)**: The `/api/stripe-webhook` serves as the primary authority for transaction logging, emailing, and ownership updates. If a client closes the browser or loses connection, the webhook guarantees fulfillment.
- **Secondary (Client-Side Verification)**: The success redirect page triggers `/api/verify-checkout-session` as a fallback for instant sync. 
  - To prevent spoofing, `/api/verify-checkout-session` requires the user's Firebase ID token.
  - The server retrieves the session directly from Stripe's servers using the `sessionId` and asserts that `session.metadata.userId` matches the authenticated caller's token UID.

### 3. Server-Side Price & Product Verification
All product prices, price IDs, and details are resolved on the server-side from Firestore. The client cannot inject a customized price or alter the payable amount during checkout creation. 

### 4. Stripe Key Segregation
Secret Stripe keys (`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`) are never exposed to the client bundle. They are loaded exclusively from server environment variables and are excluded from git.
