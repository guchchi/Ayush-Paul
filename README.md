# Blueprint OS

> **A modular operating system and venture engineering workspace built with React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Express, and Firebase.**
> Prepared for the **DevFest Noida 2026 Community Demo**.

---

## 📌 Overview

**Blueprint OS** is a modular web platform designed to streamline end-to-end client acquisition, offer architecture, authority positioning, portfolio generation, pipeline management, and outreach execution. 

Rather than functioning merely as a static showcase, Blueprint OS provides a sequence of interconnected workspace modules that allow creators, engineers, and digital entrepreneurs to model business paths, generate tailored sales collateral, and manage client conversion workflows.

---

## 🚀 Core Workspace Modules

Blueprint OS organizes venture engineering workflows across 6 sequential modules located under `/workspace/`:

| # | Module Route | Primary Purpose | State Management |
|---|---|---|---|
| 1 | `/workspace/client-acquisition` | Opportunity mapping, market niche analysis, and path discovery | `useOpportunityMapStore` |
| 2 | `/workspace/offer-engineering` | Offer design, tier architecture, ROI calculation, and risk reversals | `useOfferEngineeringStore` |
| 3 | `/workspace/authority-system` | Authority score modeling, lead magnet generation, and platform copy engines | `useModule3Store` |
| 4 | `/workspace/portfolio-system` | Dynamic portfolio architecture, case study structuring, and export | `usePortfolioSystemStore` |
| 5 | `/workspace/client-pipeline` | Deal pipeline tracking, lead profiling, and stage modifier management | `useClientPipelineSystemStore` |
| 6 | `/workspace/outreach-engine` | Multi-channel angle generation, objection preempting, and follow-up copy | `useOutreachEngineSystemStore` |

### Additional Systems
- **Blueprint Engine & Blueprints (`/blueprints`, `/blueprint-engine`)**: Curated system blueprints and architectural templates.
- **Publishing CMS & Dynamic Blog (`/blog`, `/admin`)**: Markdown & TipTap-powered article management with SEO schema generation.
- **Resource Vault (`/vault`)**: Downloadable guides, assets, and project blueprints.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` engine)
- **Motion & Interactions**: `motion/react` + GSAP + Lenis smooth scrolling
- **State Management**: Zustand v5 with `persist` middleware (localStorage)
- **Rich Text & Content**: TipTap, React Markdown, Gray-Matter
- **Visualization**: D3.js, Recharts, Lucide React

### Backend & Cloud Services
- **Runtime**: Node.js + Express (integrated via Vite middleware for dev; bundled for SSR/production)
- **Database & Auth**: Firebase Auth, Cloud Firestore, Cloud Storage
- **Serverless Functions**: Vercel Node Serverless functions (`/api/*`)
- **AI Integrations**: Google Generative AI SDK (`@google/generative-ai`)
- **Commerce**: Stripe Node.js SDK (Checkout sessions & webhooks)
- **Communications**: Resend API (transactional notifications)

---

## 🏗️ Architecture & Security Principles

1. **State Isolation & Persistence**: Each workspace module manages its own schema-versioned Zustand store. Upstream context flows sequentially (Module 1 → 2 → 3 → 4 → 5 → 6) with fingerprint-based change detection.
2. **Server-Side Secret Isolation**: Critical service credentials (Stripe secret keys, Resend keys, Firebase Admin service accounts) run exclusively in serverless backend handlers (`/api/*` and `server.ts`).
3. **Client Configuration Boundary**: Browser-facing values use `VITE_*` prefixes and are restricted to public client identifiers. AI generation endpoints fall back gracefully to deterministic templates if AI keys are not provided.
4. **Prebuild Architecture Guard**: An automated security script (`scripts/security/architecture-guard.mjs`) validates bundle dependencies and blocks architectural regressions prior to build.

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/guchchi/Ayush-Paul.git
cd Ayush-Paul
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create your local `.env.local`:
```bash
cp .env.example .env.local
```
Configure your credentials in `.env.local`. For local UI development, minimal Firebase client settings or test keys are sufficient. Review comments in `.env.example` for detailed variable scopes.

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` (combining the Express API and Vite HMR).

---

## 🧪 Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts local Express + Vite dev server on port 3000 |
| `npm run lint` | Runs TypeScript typecheck (`tsc --noEmit`) |
| `npm run build` | Runs architecture guard, client build, server SSR build, and SSG prerender |
| `npm run preview` | Previews the production build locally |
| `npm run security:scan` | Runs local secret scanner against project source |

---

## ⚠️ Current Status & Known Limitations

- **Community Demo Version**: This repository is prepared for demonstration and community review at DevFest Noida 2026.
- **External Services**: Full payment checkout requires active Stripe API test keys. Email dispatch requires a Resend key. Cloud database synchronization requires valid Firebase project credentials.
- **Offline / Deterministic Fallbacks**: When AI API keys are omitted, copywriting engines utilize context-driven deterministic copy generators rather than failing.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
