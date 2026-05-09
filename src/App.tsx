import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// --- Layouts ---
import { MainLayout } from "./layouts/MainLayout";

// --- Pages (Lazy Loaded) ---
const HomePage = lazy(() => import("./pages/Home").then(m => ({ default: m.HomePage })));
const BlogPage = lazy(() => import("./pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.AdminPage })));
const SuccessPage = lazy(() => import("./pages/SuccessPage").then(m => ({ default: m.SuccessPage })));
const CancelPage = lazy(() => import("./pages/CancelPage").then(m => ({ default: m.CancelPage })));
const NowPage = lazy(() => import("./pages/NowPage").then(m => ({ default: m.NowPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then(m => ({ default: m.ProjectDetailPage })));
const ProfileSelectionPage = lazy(() => import("./pages/ProfileSelectionPage").then(m => ({ default: m.ProfileSelectionPage })));
const CollaboratePage = lazy(() => import("./pages/CollaboratePage").then(m => ({ default: m.CollaboratePage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const CookiePage = lazy(() => import("./pages/CookiePage").then(m => ({ default: m.CookiePage })));
const ContentAdminPage = lazy(() => import("./pages/ContentAdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const DomainWorldPage = lazy(() => import("./pages/DomainWorldPage").then(m => ({ default: m.DomainWorldPage })));

// --- Loading Fallback ---
const PageLoading = () => (
  <div className="fixed inset-0 z-[500] bg-[#0A0A0A] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Loading Environment</span>
    </div>
  </div>
);

// --- Components ---
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop, ScrollToTopButton } from "./components/ui/ScrollUtilities";
import { KingdomCursor } from "./components/ui/KingdomCursor";
import { FirebaseConfigWarning } from "./components/FirebaseConfigWarning";
import { CookieConsent } from "./components/ui/CookieConsent";
import { getFirebaseStatus } from "./firebase";

export default function App() {
  const [view, setView] = useState<"landing" | "profiles">("landing");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showConfigWarning, setShowConfigWarning] = useState(true);
  const { isConfigured } = getFirebaseStatus();

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konami: string[] = [];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key].slice(-10);
      konami = newKonami;
      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        alert("🚀 STARTUP MODE ACTIVATED! You found the secret easter egg.");
        document.documentElement.style.setProperty('--color-brand-primary', '#00C2FF');
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleProfileSelect = (profile: string) => {
    if (profile === "back") {
      setView("landing");
    } else {
      setSelectedProfile(profile);
      alert(`Welcome, ${profile}! Portfolio for this profile is coming soon.`);
      setView("landing");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const wrapInLayout = (Component: React.ReactNode) => (
    <MainLayout onPortfolioClick={() => setView("profiles")}>
      {Component}
    </MainLayout>
  );

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="font-sans selection:bg-brand-primary/30 selection:text-brand-primary bg-[#0A0A0A] min-h-screen w-full text-white">
          <KingdomCursor />
          
          {!isConfigured && showConfigWarning && (
            <FirebaseConfigWarning 
              variant="banner" 
              onDismiss={() => setShowConfigWarning(false)} 
            />
          )}
          
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={
                view === "landing" ? (
                  wrapInLayout(<HomePage onViewPortfolio={() => setView("profiles")} />)
                ) : (
                  <ProfileSelectionPage onSelect={handleProfileSelect} />
                )
              } />
              <Route path="/now" element={wrapInLayout(<NowPage />)} />
              <Route path="/domain/:id" element={<DomainWorldPage />} />
              <Route path="/about" element={wrapInLayout(<AboutPage />)} />
              <Route path="/projects" element={wrapInLayout(<ProjectsPage />)} />
              <Route path="/projects/:slug" element={wrapInLayout(<ProjectDetailPage />)} />
              <Route path="/blog" element={wrapInLayout(<BlogPage />)} />
              <Route path="/blog/:slug" element={wrapInLayout(<BlogPostPage />)} />
              <Route path="/collaborate" element={wrapInLayout(<CollaboratePage />)} />
              <Route path="/contact" element={wrapInLayout(<ContactPage />)} />
              <Route path="/privacy" element={wrapInLayout(<PrivacyPage />)} />
              <Route path="/terms" element={wrapInLayout(<TermsPage />)} />
              <Route path="/cookie-policy" element={wrapInLayout(<CookiePage />)} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/content" element={<ContentAdminPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <ScrollToTopButton />
          <CookieConsent />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
