# Secret Rotation Checklist

This document contains the checklist of all secrets and credentials associated with this project that must be rotated. Since the repository was previously public, making it private does **not** undo any potential exposure in git history or cache. 

> [!WARNING]
> Any secret that was ever present in the working directory while the repository was public, or committed to git history, should be treated as **compromised** and rotated immediately.

## Secrets to Rotate

### 1. Firebase Service Account Private Key
- **Asset**: `service-account.json` (also mapped to `FIREBASE_SERVICE_ACCOUNT` env var in Vercel)
- **Status**: Checked and ignored in `.gitignore`, but present locally.
- **Rotation Steps**:
  1. Go to Google Cloud Console or Firebase Console -> Project Settings -> Service Accounts.
  2. Generate a new private key for the service account.
  3. Delete the old/exposed private key from the console.
  4. Update Vercel environment variable `FIREBASE_SERVICE_ACCOUNT` with the new JSON string.
  5. Update local `service-account.json` (do NOT commit to git).

### 2. Stripe API Keys
- **Assets**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Status**: Mapped in `.env` and `.env.local`. Test keys are currently in use (`sk_test_*` and `pk_test_*`), but if live keys were used, they must be rotated.
- **Rotation Steps**:
  1. Go to Stripe Dashboard -> Developers -> API Keys.
  2. Roll the secret key (`STRIPE_SECRET_KEY`).
  3. Update Vercel environment variables `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
  4. Update local `.env` and `.env.local`.

### 3. Stripe Webhook Secret
- **Asset**: `STRIPE_WEBHOOK_SECRET`
- **Status**: Configured on Vercel and locally for signature verification.
- **Rotation Steps**:
  1. Go to Stripe Dashboard -> Developers -> Webhooks.
  2. Select the endpoint for your deployed site (e.g. `https://iceball.version.app/api/stripe-webhook`).
  3. Roll the signing secret.
  4. Update Vercel and local environment variable `STRIPE_WEBHOOK_SECRET`.

### 4. Gemini API Key (Google AI SDK)
- **Asset**: `GOOGLE_API_KEY` (also mapped to `VITE_GOOGLE_API_KEY`)
- **Status**: hardcoded in `.env` and `.env.local`.
- **Rotation Steps**:
  1. Go to Google AI Studio API keys dashboard.
  2. Delete the old key.
  3. Create a new API key.
  4. Update Vercel environment variables `GOOGLE_API_KEY` and `VITE_GOOGLE_API_KEY`.
  5. Update local `.env` and `.env.local` files.

### 5. Content Publishing Key
- **Asset**: `PUBLISH_API_KEY`
- **Status**: Present in `.env` and `.env.local`.
- **Rotation Steps**:
  1. Generate a new cryptographically secure random string.
  2. Update Vercel and local environment variable `PUBLISH_API_KEY`.

### 6. Email Service Key
- **Asset**: `EMAIL_SERVICE_KEY`
- **Status**: New key introduced in this security pass for background jobs.
- **Rotation Steps**:
  1. Generate a new cryptographically secure random string.
  2. Configure `EMAIL_SERVICE_KEY` in Vercel and local environments.

### 7. Internal API Key
- **Asset**: `INTERNAL_API_KEY`
- **Status**: New key introduced in this security pass.
- **Rotation Steps**:
  1. Generate a new cryptographically secure random string.
  2. Configure `INTERNAL_API_KEY` in Vercel and local environments.

### 8. Debug API Key
- **Asset**: `DEBUG_API_KEY`
- **Status**: New key introduced in this security pass.
- **Rotation Steps**:
  1. Generate a new cryptographically secure random string.
  2. Configure `DEBUG_API_KEY` in Vercel and local environments.
