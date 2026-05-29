import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
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
const ExperimentsPage = lazy(() => import("./pages/ExperimentsPage").then(m => ({ default: m.ExperimentsPage })));
const ExperimentDetailPage = lazy(() => import("./pages/ExperimentDetailPage").then(m => ({ default: m.ExperimentDetailPage })));

const CollaboratePage = lazy(() => import("./pages/CollaboratePage").then(m => ({ default: m.CollaboratePage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const CookiePage = lazy(() => import("./pages/CookiePage").then(m => ({ default: m.CookiePage })));
const ContentAdminPage = lazy(() => import("./pages/ContentAdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const SystemsPage = lazy(() => import("./pages/SystemsPage").then(m => ({ default: m.SystemsPage })));
const SystemDetailPage = lazy(() => import("./pages/SystemDetailPage").then(m => ({ default: m.SystemDetailPage })));
const LabsPage = lazy(() => import("./pages/LabsPage").then(m => ({ default: m.LabsPage })));
const LabDetailPage = lazy(() => import("./pages/LabDetailPage").then(m => ({ default: m.LabDetailPage })));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage").then(m => ({ default: m.ThankYouPage })));
const VaultPage = lazy(() => import("./pages/VaultPage").then(m => ({ default: m.VaultPage })));
const MomentumPage = lazy(() => import("./pages/MomentumPage").then(m => ({ default: m.MomentumPage })));

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
import { CursorFollower } from "./components/ui/CursorEffects";
import { FirebaseConfigWarning } from "./components/FirebaseConfigWarning";
import { CookieConsent } from "./components/ui/CookieConsent";
import { getFirebaseStatus } from "./firebase";

const RedirectWithSlug = () => {
  const { slug } = useParams();
  return <Navigate to={`/systems/${slug}`} replace />;
};

export default function App() {
  const [showConfigWarning, setShowConfigWarning] = useState(true);
  const { isConfigured, projectId, databaseId } = getFirebaseStatus();

  // System Health Monitoring
  useEffect(() => {
    console.group("🚀 SYSTEM DIAGNOSTICS");
    console.log("Firebase Status:", isConfigured ? "✅ Configured" : "❌ Missing Config");
    console.log("Project ID:", projectId);
    console.log("Database ID:", databaseId);
    console.groupEnd();
  }, [isConfigured, projectId, databaseId]);

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

  const wrapInLayout = (Component: React.ReactNode) => (
    <MainLayout>
      {Component}
    </MainLayout>
  );

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="font-sans selection:bg-brand-primary/30 selection:text-brand-primary bg-[#0A0A0A] min-h-screen w-full text-white">
          <CursorFollower />
          
          {!isConfigured && showConfigWarning && (
            <FirebaseConfigWarning 
              variant="banner" 
              onDismiss={() => setShowConfigWarning(false)} 
            />
          )}
          
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={
                wrapInLayout(<HomePage />)
              } />
              <Route path="/now" element={wrapInLayout(<NowPage />)} />
              <Route path="/about" element={wrapInLayout(<AboutPage />)} />
              <Route path="/projects" element={<Navigate to="/systems" replace />} />
              <Route path="/projects/:slug" element={<RedirectWithSlug />} />
              <Route path="/experiments" element={<Navigate to="/systems" replace />} />
              <Route path="/experiments/:slug" element={<RedirectWithSlug />} />
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
              <Route path="/products" element={wrapInLayout(<SystemsPage />)} />
              <Route path="/products/:slug" element={wrapInLayout(<SystemDetailPage />)} />
              <Route path="/systems" element={wrapInLayout(<SystemsPage />)} />
              <Route path="/systems/:slug" element={wrapInLayout(<SystemDetailPage />)} />
              <Route path="/labs" element={<Navigate to="/systems" replace />} />
              <Route path="/labs/:slug" element={<Navigate to="/systems" replace />} />
              <Route path="/thank-you" element={wrapInLayout(<ThankYouPage />)} />
              <Route path="/lab/dashboard" element={wrapInLayout(<VaultPage />)} />
              <Route path="/vault" element={wrapInLayout(<VaultPage />)} />
              <Route path="/blogs" element={<Navigate to="/blog" replace />} />
              <Route path="/research" element={<Navigate to="/blog" replace />} />
              <Route path="/milestones" element={wrapInLayout(<MomentumPage />)} />
              <Route path="/momentum" element={wrapInLayout(<MomentumPage />)} />
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
