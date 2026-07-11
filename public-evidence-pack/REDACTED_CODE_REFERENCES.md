# Hardened System Code References (Redacted)

This document provides a redacted view of the secure design patterns, architecture, and code quality implemented in the Ayush Paul Innovation Lab backend.

---

## 1. Firebase ID Token Middleware Check

We verify client requests using the Firebase Admin SDK. The helper extracts the token from the standard `Authorization: Bearer <token>` header, verifies it, and returns the caller's unique ID (`uid`).

```typescript
// Located in api/checkout.ts & api/growth.ts
async function verifyIdToken(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    // getDb() handles Firestore initialization dynamically
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("[Auth] Token verification failed:", error);
    return null;
  }
}
```

---

## 2. Parameter Validation & Identity Matching

For endpoints modifying user-owned resources, the backend asserts that the client-supplied user identifier matches the authenticated credentials.

```typescript
// Implemented across checkout, referral, and streak endpoints
const decodedUid = await verifyIdToken(req);
if (!decodedUid) {
  return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
}
if (decodedUid !== userId) {
  return res.status(403).json({ error: "Forbidden: User ID mismatch" });
}
```

---

## 3. Tiered API Authorization Routing

In the centralized email system, actions are split into distinct security tiers. Background jobs/cron-triggers are checked against specialized service keys, while admin-triggered notifications assert admin UIDs, email allowlists, or Firebase admin claims.

```typescript
// Located in api/email.ts
const adminActions = [
  "send-confirmation-all",
  "send-reminder",
  "send-live",
  "send-recording",
  "send-cancellation",
  "newsletter-send"
];

const serviceActions = [
  "schedule-email",
  "process-scheduled-emails",
  "process-email-triggers",
  "trigger-abandoned-check",
  "trigger-enrollment-email"
];

if (adminActions.includes(action)) {
  const isAuthorized = await isAdminOrInternalService(req);
  if (!isAuthorized) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
} else if (serviceActions.includes(action)) {
  const isAuthorized = verifyEmailServiceKey(req);
  if (!isAuthorized) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing service key" });
  }
}
```

---

## 4. Production-Disabled Debug Handlers

To prevent data leakage, endpoints providing diagnostic information (like `/api/creator-debug` and `/api/firebase-debug`) are strictly disabled in production. During development, they require a validated `DEBUG_API_KEY`.

```typescript
// Located in api/creator-debug.ts & api/firebase-debug.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Disable completely in production
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not Found" });
  }

  // Require DEBUG_API_KEY in dev
  const debugKey = process.env.DEBUG_API_KEY;
  const incomingKey = req.headers["x-api-key"] || req.query?.key;
  if (!debugKey || incomingKey !== debugKey) {
    return res.status(403).json({ error: "Access Denied" });
  }
  
  // Dev diagnostic execution follows...
}
```
