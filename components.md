# 🧩 Blueprint OS — Master Reusable UI Components & Design System (`components.md`)

> **Single Source of Truth for all UI Elements, Cards, Navigation, Buttons, Badges, and Layouts.**
> **Core Reference Foundations:**
> 1. **Home Page (`src/pages/Home.tsx` + `HomeHeroSection.tsx`)**
> 2. **Get Your First 3 Clients Blueprint (`src/pages/BlueprintDetailPage.tsx` + `src/content/blueprints/get-your-first-3-clients.json`)**
>
> **Instruction for AI Agents & Developers:**
> Whenever building or modifying any page, blueprint, or workspace, **DO NOT invent new arbitrary styling, inconsistent borders, random shadows, or rogue color palettes**. Strictly reuse the exact tokens, class compositions, and component patterns documented in this file.

---

## 🎨 1. Global Visual & Token Foundations

These tokens define the exact visual identity inspired by the clean modern senior-architect palette:

```typescript
// Core Palette Reference (src/lib/design-tokens.ts & src/index.css)
export const UI_TOKENS = {
  colors: {
    pageBg:      "#f8f9ff", // Soft crisp canvas background
    surface:     "#ffffff", // Clean elevated white surface
    surfaceAlt:  "#eff4ff", // Soft blue-tinted container background
    navy:        "#0b1c30", // Primary high-contrast text & dark CTA button
    navyHover:   "#152a45", // Deep navy hover
    blue:        "#0058be", // Primary brand accent & action color
    blueHover:   "#0047a0", // Primary brand hover
    lime:        "#d1f34d", // High-voltage electric lime accent
    limeHover:   "#c0e045", // Lime active/hover
    border:      "rgba(11, 28, 48, 0.08)", // Subtle clean separator
    borderLight: "rgba(194, 198, 214, 0.3)", // Card border
    textPrimary: "#0b1c30", // High-contrast readable title/body
    textMuted:   "#424754", // Supporting secondary description
    textSubtle:  "rgba(11, 28, 48, 0.45)", // Captions, dates, meta tags
  },
  radius: {
    pill:        "rounded-full", // Strict standard for buttons, badges, chips (9999px)
    card:        "rounded-2xl",  // Standard 24px/32px card radius
    innerSlot:   "rounded-xl",   // Media / inner input / icon slot radius (12-16px)
    sm:          "rounded-lg",   // Small utility items
  },
  typography: {
    fontSans:    'font-["Inter",sans-serif]',
    eyebrow:     "text-[10px] md:text-xs font-bold uppercase tracking-widest",
    h1:          "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30]",
    h2:          "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0b1c30]",
    h3:          "text-lg sm:text-xl md:text-2xl font-bold text-[#0b1c30]",
    body:        "text-sm sm:text-base text-[#424754] leading-relaxed",
    caption:     "text-xs text-neutral-400 font-medium",
  }
};
```

---

## 📋 2. Complete Component & Element Registry Index

| # | Element Name | Category | Primary Code Location | Reference Page |
|---|---|---|---|---|
| **01** | [Global Navbar](#01-global-navbar) | Navigation | `src/layouts/Navbar.tsx` | Home / All Pages |
| **02** | [Global Footer](#02-global-footer) | Navigation | `src/layouts/Footer.tsx` | Home / All Pages |
| **03** | [Mobile Bottom Nav](#03-mobile-bottom-nav) | Navigation | `src/layouts/MobileBottomNav.tsx` | All Mobile Viewports |
| **04** | [In-Page Subnav / Jump Chips](#04-in-page-subnav--jump-chips) | Navigation | `src/components/b-cyber/BCyberNav.tsx` | Blueprint Landing Pages |
| **05** | [Back Button Pill](#05-back-button-pill) | Navigation | `src/components/ui/back-button.tsx` | Detail / Sub Pages |
| **06** | [Primary Navy Button](#06-primary-navy-button) | Buttons | `src/components/ui/button.tsx` | Home Hero & Blueprints |
| **07** | [Accent Lime Button](#07-accent-lime-button) | Buttons | `src/components/sections/HomeHeroSection.tsx` | High-Conversion CTAs |
| **08** | [Ghost / Outline Button](#08-ghost--outline-button) | Buttons | `src/components/ui/button.tsx` | Secondary Actions |
| **09** | [Magnetic Button](#09-magnetic-button) | Buttons | `src/components/ui/MagneticButton.tsx` | Hero Interactive Triggers |
| **10** | [Icon Action Square Button](#10-icon-action-square-button) | Buttons | `src/layouts/Footer.tsx` | Social & Toolbars |
| **11** | [Standard Glass Surface Card](#11-standard-glass-surface-card) | Cards | `src/index.css` (`.glass-card`) | Universal |
| **12** | [Interactive Pathway Card (Lime Invert)](#12-interactive-pathway-card-lime-invert) | Cards | `src/components/sections/HomeHeroSection.tsx` | Home Hero |
| **13** | [Product / Blueprint Card](#13-product--blueprint-card) | Cards | `src/components/ui/ProductCard.tsx` | Home / Blueprint Catalog |
| **14** | [Free vs Pro Comparison Card](#14-free-vs-pro-comparison-card) | Cards | `src/components/sections/BlueprintFreeVsPro.tsx` | First 3 Clients Blueprint |
| **15** | [Sticky Purchase Sidebar Card](#15-sticky-purchase-sidebar-card) | Cards | `src/components/sections/BlueprintPurchaseSidebar.tsx` | First 3 Clients Blueprint |
| **16** | [Curriculum / Module Step Card](#16-curriculum--module-step-card) | Cards | `src/components/sections/BlueprintModulesSection.tsx` | First 3 Clients Blueprint |
| **17** | [Quick Facts / Stat Metric Card](#17-quick-facts--stat-metric-card) | Cards | `src/components/sections/BlueprintQuickFacts.tsx` | Blueprint Detail |
| **18** | [Interactive Selection / Radio Card](#18-interactive-selection--radio-card) | Cards | `src/components/workspace/SelectionCard.tsx` | Workspace Modules |
| **19** | [Gated / Locked Feature Card](#19-gated--locked-feature-card) | Cards | `src/components/workspace/LockedFeatureCard.tsx` | Vault / Workspace |
| **20** | [Category Eyebrow Pill](#20-category-eyebrow-pill) | Badges | Inlined / `ProductBadge.tsx` | Headers & Hero Sections |
| **21** | [Scarcity & Price Badges](#21-scarcity--price-badges) | Badges | `src/components/ui/PricingBadge.tsx` | Cards & Checkout Rails |
| **22** | [Live Status Indicator Pulse](#22-live-status-indicator-pulse) | Badges | `src/components/sections/LiveTelemetryConsole.tsx` | System Monitors |
| **23** | [Coupon Code Input Field](#23-coupon-code-input-field) | Inputs | `src/components/ui/CouponInput.tsx` | Purchase Sidebars |
| **24** | [Newsletter / Waitlist Form](#24-newsletter--waitlist-form) | Inputs | `src/components/ui/WaitlistForm.tsx` | Home & Footer |
| **25** | [Empty State Card](#25-empty-state-card) | Feedback | `src/components/ui/SystemEmptyState.tsx` | Lists & Workspace |
| **26** | [Loading & Skeleton State](#26-loading--skeleton-state) | Feedback | `src/components/workspace/WorkspaceLoadingState.tsx` | Async Loading Views |
| **27** | [FAQ Collapsible Accordion](#27-faq-collapsible-accordion) | Content Blocks | `src/components/sections/HomeFAQSection.tsx` | Home & Blueprints |
| **28** | [Social Proof Marquee Ticker](#28-social-proof-marquee-ticker) | Content Blocks | `src/components/ui/SocialProofTicker.tsx` | Hero & Proof Sections |
| **29** | [Video Teardown Player Card](#29-video-teardown-player-card) | Content Blocks | `src/components/sections/BlueprintVideoSection.tsx` | First 3 Clients Blueprint |
| **30** | [Mobile Sticky Action Bar](#30-mobile-sticky-action-bar) | Layout | `src/components/sections/BlueprintStickyMobileBar.tsx` | Mobile Purchase Views |

---

## 🔍 3. Element Specifications, Visual References & Code Templates

### 01. Global Navbar
* **Visual Reference:** Clean floating glass bar with blurred background, pill brand identifier `ayushpaul.in`, active navigation links with smooth transitions, auth/profile launcher, and mobile hamburger drawer.
* **Component Location:** [`src/layouts/Navbar.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/layouts/Navbar.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: global-navbar -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { Navbar } from '@/src/layouts/Navbar';
  
  // Mounted globally inside MainLayout. Automatically handles hide-on-scroll and progress bar.
  <Navbar />
  ```
* **Strict Rule:** Always maintain `z-50`, backdrop blur, and smooth spring scroll indicator.

---

### 02. Global Footer
* **Visual Reference:** Deep solid navy surface (`#0b1c30`), top gradient border separator, brand story, social media pill squares, hierarchical sitemap columns, and embedded newsletter signup box.
* **Component Location:** [`src/layouts/Footer.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/layouts/Footer.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: global-footer -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { Footer } from '@/src/layouts/Footer';
  
  <Footer />
  ```
* **Strict Rule:** Never use light background for the global footer. Must always anchor the bottom with `#0b1c30` and `#d1f34d` hover accents.

---

### 03. Mobile Bottom Nav
* **Visual Reference:** Fixed bottom glass dock with 4–5 core navigation icons, active indicator dot, and backdrop blur for thumb-friendly mobile navigation.
* **Component Location:** [`src/layouts/MobileBottomNav.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/layouts/MobileBottomNav.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: mobile-bottom-nav -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { MobileBottomNav } from '@/src/layouts/MobileBottomNav';
  
  <MobileBottomNav />
  ```

---

### 04. In-Page Subnav / Jump Chips
* **Visual Reference:** Floating horizontal scrollable pill bar (`rounded-full`) allowing 1-click smooth jump to on-page sections (`#overview`, `#modules`, `#pricing`, `#faq`).
* **Component Location:** [`src/components/b-cyber/BCyberNav.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/b-cyber/BCyberNav.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: in-page-jump-chips -->
* **Drop-in Reusable Template:**
  ```tsx
  interface JumpChip {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }
  
  export const AnchorNavChips = ({ items }: { items: JumpChip[] }) => (
    <nav className="sticky top-20 z-40 py-3 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="px-4 py-1.5 rounded-full bg-white border border-black/8 text-[#0b1c30] text-xs font-semibold hover:bg-[#d1f34d] hover:border-[#d1f34d] transition-all whitespace-nowrap shadow-xs"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
  ```

---

### 05. Back Button Pill
* **Visual Reference:** Rounded pill button with left-arrow icon, subtle border, smooth hover translate left.
* **Component Location:** [`src/components/ui/back-button.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/back-button.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: back-button-pill -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { BackButton } from '@/src/components/ui/back-button';
  
  <BackButton to="/blueprints" label="Back to Blueprints" />
  ```

---

### 06. Primary Navy Button
* **Visual Reference:** High-contrast solid deep Navy (`#0b1c30`) pill button with crisp white typography, uppercase tracking, subtle hover lift, and shadow.
* **Component Location:** Home Hero Section (`.hero-cta-dark`) & [`src/components/ui/button.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/button.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: primary-navy-button -->
* **Drop-in Reusable Template:**
  ```tsx
  export const ButtonNavy = ({ children, onClick, className = '' }: any) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0b1c30] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#1a3050] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(11,28,48,0.3)] active:translate-y-0 active:scale-[0.98] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
  ```

---

### 07. Accent Lime Button
* **Visual Reference:** High-conversion electric Lime (`#d1f34d`) pill button with deep Navy text (`#0b1c30`). Used for primary conversions ("Get Instant Access", "Download Free").
* **Component Location:** Home Hero Section (`.hero-cta-lime`) & Blueprint Detail
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: accent-lime-button -->
* **Drop-in Reusable Template:**
  ```tsx
  export const ButtonLime = ({ children, onClick, className = '' }: any) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:bg-[#c0e045] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(209,243,77,0.4)] active:translate-y-0 active:scale-[0.98] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
  ```

---

### 08. Ghost / Outline Button
* **Visual Reference:** Transparent pill button with subtle border (`border-black/10` on light, `border-white/15` on dark) that elevates on hover with soft background tint.
* **Component Location:** [`src/components/ui/button.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/button.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: ghost-outline-button -->
* **Drop-in Reusable Template:**
  ```tsx
  export const ButtonOutline = ({ children, onClick, className = '' }: any) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent border border-[#0b1c30]/15 text-[#0b1c30] text-xs font-bold uppercase tracking-wider hover:border-[#0058be] hover:text-[#0058be] hover:bg-[#0058be]/5 transition-all duration-200 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
  ```

---

### 09. Magnetic Button
* **Visual Reference:** Interactive spring-driven button that physically tracks mouse coordinates within hover threshold.
* **Component Location:** [`src/components/ui/MagneticButton.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/MagneticButton.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: magnetic-button -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { MagneticButton } from '@/src/components/ui/MagneticButton';
  
  <MagneticButton onClick={handleAction}>
    <span>Explore Blueprints</span>
  </MagneticButton>
  ```

---

### 10. Icon Action Square Button
* **Visual Reference:** 40x40px rounded-xl (`rounded-xl`) soft container for social icons, copy buttons, or toolbar actions with border and hover glow.
* **Component Location:** [`src/layouts/Footer.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/layouts/Footer.tsx) & Toolbar
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: icon-action-square -->
* **Drop-in Reusable Template:**
  ```tsx
  export const IconSquareButton = ({ icon, onClick, href }: any) => {
    const Component = href ? 'a' : 'button';
    return (
      <Component
        href={href}
        onClick={onClick}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#d1f34d] hover:bg-white/10 hover:border-[#d1f34d]/30 transition-all duration-200 cursor-pointer"
      >
        {icon}
      </Component>
    );
  };
  ```

---

### 11. Standard Glass Surface Card
* **Visual Reference:** The fundamental surface unit. Crisp white/translucent card with subtle border (`border-[#0b1c30]/8`), 24px/32px radius (`rounded-2xl`), and subtle elevation shadow.
* **Component Location:** Global Utility `.glass-card` in [`src/index.css`](file:///c:/Users/ap877/2026/Ayush-Paul/src/index.css)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: glass-surface-card -->
* **Drop-in Reusable Template:**
  ```tsx
  export const GlassCard = ({ children, className = '', hover = true }: any) => (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.07] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(11,28,48,0.05)] transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(11,28,48,0.1)] hover:border-black/15' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
  ```

---

### 12. Interactive Pathway Card (Lime Invert)
* **Visual Reference:** High-impact featured card from the Home Hero. White card that on hover completely inverts its surface to Electric Lime (`#d1f34d`), lifts by `-6px`, and shifts its inner badge to Deep Navy.
* **Component Location:** [`src/components/sections/HomeHeroSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/HomeHeroSection.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: interactive-pathway-card -->
* **Drop-in Reusable Template:**
  ```tsx
  export const PathwayCard = ({ title, description, badge, link, icon: Icon }: any) => (
    <Link
      to={link}
      className="group block p-6 sm:p-8 rounded-2xl bg-white border border-[#c2c6d6]/30 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#d1f34d] hover:border-[#d1f34d] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(209,243,77,0.35)]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[10px] font-bold uppercase tracking-wider group-hover:bg-[#0b1c30] group-hover:text-white transition-colors duration-400">
          {badge}
        </span>
        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-[#0b1c30] group-hover:text-[#d1f34d] transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#0b1c30] mb-2">{title}</h3>
      <p className="text-sm text-[#424754] leading-relaxed group-hover:text-[#0b1c30]/90 transition-colors">
        {description}
      </p>
    </Link>
  );
  ```

---

### 13. Product / Blueprint Card
* **Visual Reference:** The flagship catalog item card. Displays top badge tags ("Featured", "Free", "Sale"), cover thumbnail, title, short description, pricing display with discount strike, and access CTA.
* **Component Location:** [`src/components/ui/ProductCard.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/ProductCard.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: product-blueprint-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { ProductCard } from '@/src/components/ui/ProductCard';
  
  <ProductCard product={productData} />
  ```

---

### 14. Free vs Pro Comparison Card
* **Visual Reference:** Two-column side-by-side tier comparison box from the "Get Your First 3 Clients" blueprint. Left is clean Free tier; Right is elevated Pro tier with Lime accent badge, elevated border, and full deliverable checklist.
* **Component Location:** [`src/components/sections/BlueprintFreeVsPro.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintFreeVsPro.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: free-vs-pro-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { BlueprintFreeVsPro } from '@/src/components/sections/BlueprintFreeVsPro';
  
  <BlueprintFreeVsPro
    product={product}
    isOwned={isOwned}
    onFreeDownload={handleFree}
    onPremiumUpgrade={handlePro}
  />
  ```

---

### 15. Sticky Purchase Sidebar Card
* **Visual Reference:** Desktop right-rail purchase card (320px width, `sticky top-24`). Displays dynamic price, coupon entry field, primary checkout button, and institutional trust badges.
* **Component Location:** [`src/components/sections/BlueprintPurchaseSidebar.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintPurchaseSidebar.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: sticky-purchase-sidebar -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { BlueprintPurchaseSidebar } from '@/src/components/sections/BlueprintPurchaseSidebar';
  
  <BlueprintPurchaseSidebar
    product={product}
    isOwned={isOwned}
    onPremiumUpgrade={handleCheckout}
  />
  ```

---

### 16. Curriculum / Module Step Card
* **Visual Reference:** Step-by-step numbered breakdown card (`01`, `02`, `03`) showing module icon, title, deliverable summary, and expandable lessons/assets.
* **Component Location:** [`src/components/sections/BlueprintModulesSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintModulesSection.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: curriculum-module-step-card -->
* **Drop-in Reusable Template:**
  ```tsx
  export const ModuleStepCard = ({ stepNumber, title, subtitle, deliverables }: any) => (
    <div className="p-6 rounded-2xl bg-white border border-black/8 shadow-2xs hover:border-[#0058be]/40 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#0058be] font-mono font-bold text-xs flex items-center justify-center">
          {stepNumber}
        </span>
        <h4 className="font-bold text-base text-[#0b1c30]">{title}</h4>
      </div>
      <p className="text-xs text-[#424754] mb-4">{subtitle}</p>
      <ul className="space-y-2 border-t border-black/5 pt-3">
        {deliverables.map((item: string, i: number) => (
          <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
  ```

---

### 17. Quick Facts / Stat Metric Card
* **Visual Reference:** High-density 3- or 4-column statistic box showing numeric value in bold font-mono, uppercase label, and contextual icon.
* **Component Location:** [`src/components/sections/BlueprintQuickFacts.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintQuickFacts.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: quick-facts-stat-card -->
* **Drop-in Reusable Template:**
  ```tsx
  export const StatCard = ({ icon: Icon, value, label }: any) => (
    <div className="p-5 rounded-2xl bg-white border border-black/8 text-center flex flex-col items-center justify-center">
      <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-2">
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-bold font-mono text-[#0b1c30] tracking-tight">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">{label}</div>
    </div>
  );
  ```

---

### 18. Interactive Selection / Radio Card
* **Visual Reference:** User choice card used in onboarding or workspace steppers. Displays a custom radio circle, hover elevation, and an electric blue ring when active (`ring-2 ring-[#0058be]`).
* **Component Location:** [`src/components/workspace/SelectionCard.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/workspace/SelectionCard.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: selection-radio-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { SelectionCard } from '@/src/components/workspace/SelectionCard';
  
  <SelectionCard
    title="Inbound Authority Strategy"
    description="Attract high-intent clients via technical teardowns and open-source authority."
    selected={selectedId === 'inbound'}
    onClick={() => setSelectedId('inbound')}
    badge="Recommended"
  />
  ```

---

### 19. Gated / Locked Feature Card
* **Visual Reference:** Card with blurred content backdrop, central padlock icon, and an explicit unlock requirement or upgrade button.
* **Component Location:** [`src/components/workspace/LockedFeatureCard.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/workspace/LockedFeatureCard.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: gated-locked-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { LockedFeatureCard } from '@/src/components/workspace/LockedFeatureCard';
  
  <LockedFeatureCard
    title="Module 3: Client Pipeline Engine"
    description="Complete Step 2 to unlock client opportunity generation."
    onUnlock={() => navigate('/workspace/step-2')}
  />
  ```

---

### 20. Category Eyebrow Pill
* **Visual Reference:** Small pill badge placed immediately above headers (`text-[10px] font-bold uppercase tracking-widest text-[#0058be] bg-[#eff4ff] border border-[#0058be]/15 rounded-full px-3 py-1`).
* **Component Location:** Inlined across [`src/components/sections/BlueprintHeroSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintHeroSection.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: category-eyebrow-pill -->
* **Drop-in Reusable Template:**
  ```tsx
  export const EyebrowPill = ({ label, icon: Icon }: any) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] border border-[#0058be]/15 text-[#0058be] text-[10px] font-bold uppercase tracking-widest">
      {Icon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
    </div>
  );
  ```

---

### 21. Scarcity & Price Badges
* **Visual Reference:** High-impact status pills: "FREE", "SALE 50% OFF", "POPULAR", or "ONLY 3 SPOTS LEFT".
* **Component Location:** [`src/components/ui/PricingBadge.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/PricingBadge.tsx) & [`src/components/ui/ProductBadge.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/ProductBadge.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: scarcity-price-badges -->
* **Drop-in Reusable Template:**
  ```tsx
  export const ScarcityBadge = ({ text, variant = 'lime' }: any) => {
    const styles = {
      lime: 'bg-[#d1f34d] text-[#0b1c30] shadow-sm',
      amber: 'bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]',
      navy: 'bg-[#0b1c30] text-white',
    }[variant];
    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles}`}>
        {text}
      </span>
    );
  };
  ```

---

### 22. Live Status Indicator Pulse
* **Visual Reference:** Glowing dot indicator with smooth radar ping animation (`animate-ping`) showing real-time engine activity.
* **Component Location:** [`src/components/sections/LiveTelemetryConsole.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/LiveTelemetryConsole.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: live-status-pulse -->
* **Drop-in Reusable Template:**
  ```tsx
  export const LiveStatusDot = ({ label = 'Live System' }: { label?: string }) => (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">{label}</span>
    </div>
  );
  ```

---

### 23. Coupon Code Input Field
* **Visual Reference:** Inline single-line coupon code input box with embedded "Apply" button and instant discount validation message.
* **Component Location:** [`src/components/ui/CouponInput.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/CouponInput.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: coupon-input-field -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { CouponInput } from '@/src/components/ui/CouponInput';
  
  <CouponInput onApply={(coupon) => setAppliedCoupon(coupon)} />
  ```

---

### 24. Newsletter / Waitlist Form
* **Visual Reference:** Clean single-line email input with rounded-full pill boundary, right-aligned submit arrow, and real-time validation.
* **Component Location:** [`src/components/ui/WaitlistForm.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/WaitlistForm.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: waitlist-newsletter-form -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { WaitlistForm } from '@/src/components/ui/WaitlistForm';
  
  <WaitlistForm source="home_footer" />
  ```

---

### 25. Empty State Card
* **Visual Reference:** Clean centered box with subtle icon, bold title, short explanation, and a reset/action button when no items match a filter or search.
* **Component Location:** [`src/components/ui/SystemEmptyState.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/SystemEmptyState.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: empty-state-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { SystemEmptyState } from '@/src/components/ui/SystemEmptyState';
  
  <SystemEmptyState
    title="No Blueprints Found"
    description="Try adjusting your filters or category search."
    actionLabel="Reset Filters"
    onAction={handleReset}
  />
  ```

---

### 26. Loading & Skeleton State
* **Visual Reference:** Shimmering animated pulse cards showing layout boundaries while fetching network data or generating content.
* **Component Location:** [`src/components/workspace/WorkspaceLoadingState.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/workspace/WorkspaceLoadingState.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: loading-skeleton-state -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { WorkspaceLoadingState } from '@/src/components/workspace/WorkspaceLoadingState';
  
  <WorkspaceLoadingState message="Generating personalized client proposal..." />
  ```

---

### 27. FAQ Collapsible Accordion
* **Visual Reference:** Clean, non-distracting list of questions with smooth accordion expansion and plus/minus rotation icon.
* **Component Location:** [`src/components/sections/HomeFAQSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/HomeFAQSection.tsx) & Blueprint Sidebar FAQ
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: faq-collapsible-accordion -->
* **Drop-in Reusable Template:**
  ```tsx
  export const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="border-b border-black/8 py-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between text-left font-bold text-[#0b1c30] text-sm md:text-base py-2 cursor-pointer"
        >
          <span>{question}</span>
          <span className="text-xl ml-4 font-mono text-[#0058be]">{open ? '−' : '+'}</span>
        </button>
        {open && (
          <p className="mt-2 text-sm text-[#424754] leading-relaxed pr-6">{answer}</p>
        )}
      </div>
    );
  };
  ```

---

### 28. Social Proof Marquee Ticker
* **Visual Reference:** Continuous linear scroll marquee showing verified client outcomes, student count, or recent builder signups.
* **Component Location:** [`src/components/ui/SocialProofTicker.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/ui/SocialProofTicker.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: social-proof-ticker -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { SocialProofTicker } from '@/src/components/ui/SocialProofTicker';
  
  <SocialProofTicker />
  ```

---

### 29. Video Teardown Player Card
* **Visual Reference:** Responsive 16:9 video container with dark gradient preview backdrop, centered Lime play button, and "Product Demo" top pill.
* **Component Location:** [`src/components/sections/HomeHeroSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/HomeHeroSection.tsx) & [`BlueprintVideoSection.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintVideoSection.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: video-player-card -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { BlueprintVideoSection } from '@/src/components/sections/BlueprintVideoSection';
  
  <BlueprintVideoSection product={product} />
  ```

---

### 30. Mobile Sticky Action Bar
* **Visual Reference:** Fixed bottom viewport bar on mobile devices containing product price, discount indicator, and full-width checkout action.
* **Component Location:** [`src/components/sections/BlueprintStickyMobileBar.tsx`](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/sections/BlueprintStickyMobileBar.tsx)
* **Visual Placeholder:**
  <!-- SCREENSHOT_PLACEHOLDER: mobile-sticky-action-bar -->
* **Drop-in Reusable Usage:**
  ```tsx
  import { BlueprintStickyMobileBar } from '@/src/components/sections/BlueprintStickyMobileBar';
  
  <BlueprintStickyMobileBar
    product={product}
    isOwned={isOwned}
    onPremiumUpgrade={handleCheckout}
  />
  ```

---

## 🚫 4. Strict Anti-Patterns (What AI Agents Must NEVER Do)

1. **NO Neon Cyberpunk Overload:** Never inject random bright cyan borders (`#00f5ff`) with heavy glow effects on pages unless explicitly requested. Always default to the Senior Architect Navy (`#0b1c30`), Brand Blue (`#0058be`), and Electric Lime (`#d1f34d`).
2. **NO Arbitrary Border Radiuses:** Buttons, badges, and chips MUST use `rounded-full`. Outer cards MUST use `rounded-2xl`. Never use sharp `rounded-none` or inconsistent random `rounded-[7px]`.
3. **NO Unlinked Ad-Hoc Styling:** Do not write random inline CSS style blocks. Rely strictly on the documented classes and component primitives.
4. **NO Missing Mobile Checkout Bars:** Every long-scroll Blueprint page MUST render the sticky mobile bar so mobile visitors can check out without scrolling endlessly.

