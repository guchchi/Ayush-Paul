# Verification Links & Demo Flows

This document details the paths, flows, and endpoints of the Ayush Paul Innovation Lab platform (hosted at `https://iceball.version.app` on Vercel).

---

## 1. Public Verification Endpoints

These endpoints demonstrate backend hardening and correct method restrictions.

*   **Vercel Deployment URL**: `https://iceball.version.app`
*   **Newsletter Unsubscribe (GET Verification)**: 
    `https://iceball.version.app/api/email?action=newsletter-unsubscribe`
    *   *Behavior*: Returns a beautiful HTML confirmation page when called with valid parameters, or a custom error page when requested with missing parameters.
*   **Disabled Debug Route (Creator)**:
    `https://iceball.version.app/api/creator-debug`
    *   *Behavior*: Returns a safe `404 Not Found` in production to prevent information leaking.
*   **Disabled Debug Route (Firebase)**:
    `https://iceball.version.app/api/firebase-debug`
    *   *Behavior*: Returns a safe `404 Not Found` in production to prevent information leaking.

---

## 2. Interactive Client Demos

These pages showcase modern design assets, responsive CSS layouts, and live Stripe/Firebase integrations.

*   **Homepage / Venture Builder**: `https://iceball.version.app/`
    *   *Flow*: Landing page highlighting featured blueprints, developer tools, and an interactive FAQ accordion.
*   **Blueprints Shop**: `https://iceball.version.app/blueprints`
    *   *Flow*: Product showcase page. Visitors can apply discount coupons, validate codes, and initiate secure Stripe payments.
*   **Member Vault**: `https://iceball.version.app/vault`
    *   *Flow*: Secure dashboard displaying owned blueprints, streak trackers, and sharing metrics. Requires authentication.
*   **Mastery Learning Center**: `https://iceball.version.app/mastery`
    *   *Flow*: Course learning hub showing modules, lessons, and interactive markdown-based content.

---

## 3. Stripe Checkout Flow

Our purchase system flows seamlessly through Stripe hosted checkout:

1.  **Selection**: The user selects a Blueprint from the detail page (e.g., `/blueprints/startup-outreach-engine`).
2.  **Coupons**: The user inputs a coupon (optional), calling `/api/checkout?action=validate-coupon` to dynamically calculate discounts.
3.  **Authentication**: The client retrieves the Firebase user ID token and passes it to the server.
4.  **Creation**: The backend verifies the token and generates a Stripe Checkout Session via `/api/checkout?action=create-checkout-session`.
5.  **Payment**: The user is redirected to Stripe to make a payment.
6.  **Redirect**: After completion, the user returns to `/success?session_id={CHECKOUT_SESSION_ID}`, initiating session verification via `/api/checkout?action=verify-checkout-session` using their authentication token to unlock the product.
