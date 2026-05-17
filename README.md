<div align="center">
  <img src="https://ayushpaul.in/og-image.png" alt="Ayush Paul Portfolio Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;"/>

  <h1>🚀 Ayush Paul | AI Engineer & Developer Portfolio</h1>
  
  <p>A flagship, production-grade portfolio and personal ecosystem showcasing AI integrations, secure backend architectures, and stunning frontend experiences.</p>

  <p>
    <a href="https://ayushpaul.vercel.app"><b>Live Portfolio Website</b></a> •
    <a href="https://www.linkedin.com/in/paulayush/"><b>LinkedIn</b></a> •
    <a href="https://github.com/guchchi"><b>GitHub</b></a> •
    <a href="https://www.youtube.com/@ALX-17"><b>YouTube</b></a>
  </p>
</div>

---

## 📖 Project Overview & Vision

This repository contains the source code for my personal engineering portfolio. Designed not just as a static resume, but as a **living, dynamic platform**, it incorporates advanced AI-driven features, secure serverless integrations, and an ultra-optimized reading experience for my blog.

The vision for this platform is to act as the central hub for my creations, seamlessly scaling as I release new tools, research, and open-source projects.

## ✨ Key Features

- **🧠 Integrated AI Assistant**: A conversational AI powered by Google Gemini, capable of answering queries about my experience, projects, and skills natively on the platform.
- **⚡ Venture-Grade Publishing Engine**: A custom-built, frictionless CMS that supports seamless markdown rendering, cinematic hero sections, and real-time Firestore synchronization.
- **🎨 Premium Visual Experience**: Designed with smooth micro-animations, glassmorphism, responsive typography, and curated dark-mode color palettes for maximum engagement.
- **💳 Support Tier Integration**: Fully integrated Stripe checkout sessions enabling secure sponsor tiers.
- **🚀 Serverless Architecture**: Fast edge deployments using Vite + Express, optimized for Vercel, ensuring high availability and low latency.

## 🏗️ Tech Stack & Architecture

This application leverages a modern, robust technology stack to deliver a scalable and secure experience:

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (for fluid animations)
- **Content Parsing**: TipTap, React Markdown, Gray-Matter

### Backend & Database
- **Server**: Express.js (integrated via Vite middleware for development & bundled for production)
- **Database**: Firebase / Firestore (Real-time DB)
- **Authentication**: Firebase Auth (Google Provider & Email/Password)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Payments**: Stripe Node.js SDK

## 🛠️ Installation & Environment Setup

Want to run this project locally? Follow these steps:

### Prerequisites
- Node.js (v18+ recommended)
- A Firebase Project (for Authentication & Firestore)
- A Stripe Account (for checkout features)
- Google Gemini API Key

### 1. Clone & Install
```bash
git clone https://github.com/guchchi/Ayush-Paul.git
cd Ayush-Paul
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your credentials. (Note: These are handled automatically in production).
```env
# Client-side variables (Vite)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_FIREBASE_FIRESTORE_DB_ID="your_db_id"

# Server-side secrets
STRIPE_SECRET_KEY="your_stripe_secret"
GEMINI_API_KEY="your_gemini_api_key"
PUBLISH_API_KEY="your_custom_publish_key"
```

### 3. Run Development Server
```bash
npm run dev
```

## 🔒 Security Architecture Note

This repository enforces strict security standards, guaranteeing a secure environment:
- **Secret Isolation**: All sensitive tokens and service account keys are completely decoupled from the codebase and stored exclusively in private environment variables.
- **Firestore Security**: Data reads are open for public viewing, but writes are firmly restricted via `firestore.rules` using explicitly whitelisted Admin UIDs, entirely preventing privilege escalation.
- **Fail-Safe Client**: The Firebase client initialization gracefully handles missing environment configurations, falling back to safe defaults without crashing the frontend.

## 👤 Creator Information

**Ayush Paul**  
AI Engineer & Full-Stack Developer

- 🌐 **Portfolio:** [ayushpaul.vercel.app](https://ayushpaul.vercel.app)
- 💼 **LinkedIn:** [in/paulayush](https://www.linkedin.com/in/paulayush/)
- 💻 **GitHub:** [@guchchi](https://github.com/guchchi)
- 🎥 **YouTube:** [@ALX-17](https://www.youtube.com/@ALX-17)

---

<div align="center">
  <p><i>Copyright &copy; 2026 Ayush Paul. Licensed under the <a href="./LICENSE">MIT License</a>.</i></p>
</div>
