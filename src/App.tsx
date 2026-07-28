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
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const CollaboratePage = lazy(() => import("./pages/CollaboratePage").then(m => ({ default: m.CollaboratePage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const CookiePage = lazy(() => import("./pages/CookiePage").then(m => ({ default: m.CookiePage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const BlueprintsPage = lazy(() => import("./pages/BlueprintsPage").then(m => ({ default: m.BlueprintsPage })));
const BlueprintDetailPage = lazy(() => import("./pages/BlueprintDetailPage").then(m => ({ default: m.BlueprintDetailPage })));
const BlueprintEnginePage = lazy(() => import("./pages/BlueprintEnginePage").then(m => ({ default: m.BlueprintEnginePage })));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage").then(m => ({ default: m.ThankYouPage })));
const VaultPage = lazy(() => import("./pages/VaultPage").then(m => ({ default: m.VaultPage })));
const BuildingPage = lazy(() => import("./pages/BuildingPage").then(m => ({ default: m.BuildingPage })));
const MasteryPage = lazy(() => import("./pages/MasteryPage").then(m => ({ default: m.MasteryPage })));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage").then(m => ({ default: m.CourseDetailPage })));
const LessonViewerPage = lazy(() => import("./pages/LessonViewerPage").then(m => ({ default: m.LessonViewerPage })));
const DesignSystemTestPage = lazy(() => import("./pages/DesignSystemTest").then(m => ({ default: m.DesignSystemTest })));
const AcquisitionWorkspacePage = lazy(() => import("./pages/AcquisitionWorkspace").then(m => ({ default: m.AcquisitionWorkspace })));
const OfferEngineeringPage = lazy(() => import("./pages/OfferEngineering").then(m => ({ default: m.OfferEngineering })));
const AuthoritySystemPage = lazy(() => import("./pages/AuthoritySystem").then(m => ({ default: m.AuthoritySystem })));
const PortfolioSystemPage = lazy(() => import("./pages/PortfolioSystem").then(m => ({ default: m.PortfolioSystemPage })));
const ClientPipelineSystemPage = lazy(() => import("./pages/ClientPipelineSystem").then(m => ({ default: m.ClientPipelineSystemPage })));
const OutreachEnginePage = lazy(() => import("./pages/OutreachEngine").then(m => ({ default: m.OutreachEnginePage })));
const DeliverySystemPage = lazy(() => import("./pages/DeliverySystem").then(m => ({ default: m.DeliverySystemPage })));


// --- Loading Fallback ---
const PageLoading = () => (
  <div className="fixed inset-0 z-[500] bg-bg-primary flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#424754]/30">Loading Environment</span>
    </div>
  </div>
);

// --- Components ---
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DevTestTools } from "./dev/DevTestTools";
import { ScrollToTop, ScrollToTopButton } from "./components/ui/ScrollUtilities";
import { CursorFollower } from "./components/ui/CursorEffects";
import { FirebaseConfigWarning } from "./components/FirebaseConfigWarning";
import { CookieConsent } from "./components/ui/CookieConsent";
import { BetaFeedbackButton } from "./components/ui/BetaFeedbackButton";
import { BetaOnboardingOverlay } from "./components/ui/BetaOnboardingOverlay";
import { getFirebaseStatus } from "./config/firebase-config";

const RedirectWithSlug = () => {
  const { slug } = useParams();
  return <Navigate to={`/blueprints/${slug}`} replace />;
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
        <div className="font-sans selection:bg-brand-primary/30 selection:text-brand-primary bg-bg-primary min-h-screen w-full text-text-primary">
          <CursorFollower />
          
          {!isConfigured && showConfigWarning && (
            <FirebaseConfigWarning 
              variant="banner" 
              onDismiss={() => setShowConfigWarning(false)} 
            />
          )}
          
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={wrapInLayout(<HomePage />)} />
              <Route path="/now" element={<Navigate to="/building" replace />} />
              <Route path="/about" element={wrapInLayout(<AboutPage />)} />
              <Route path="/projects" element={<Navigate to="/blueprints" replace />} />
              <Route path="/projects/:slug" element={<Navigate to="/blueprints" replace />} />
              <Route path="/experiments" element={<Navigate to="/blueprints" replace />} />
              <Route path="/experiments/:slug" element={<Navigate to="/blueprints" replace />} />
              <Route path="/blog" element={wrapInLayout(<BlogPage />)} />
              <Route path="/blog/:slug" element={wrapInLayout(<BlogPostPage />)} />
              <Route path="/collaborate" element={wrapInLayout(<CollaboratePage />)} />
              <Route path="/contact" element={<Navigate to="/collaborate" replace />} />
              <Route path="/privacy" element={wrapInLayout(<PrivacyPage />)} />
              <Route path="/terms" element={wrapInLayout(<TermsPage />)} />
              <Route path="/cookie-policy" element={wrapInLayout(<CookiePage />)} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="/products" element={<Navigate to="/blueprints" replace />} />
              <Route path="/products/:slug" element={<RedirectWithSlug />} />
              <Route path="/ebooks" element={<Navigate to="/blueprints" replace />} />
              <Route path="/ebooks/:slug" element={<RedirectWithSlug />} />
              <Route path="/systems" element={<Navigate to="/blueprints" replace />} />
              <Route path="/systems/:slug" element={<RedirectWithSlug />} />
              <Route path="/blueprints" element={wrapInLayout(<BlueprintsPage />)} />
              <Route path="/blueprints/:slug" element={wrapInLayout(<BlueprintDetailPage />)} />
              <Route path="/blueprints/:slug/engine" element={<BlueprintEnginePage />} />
              <Route path="/academy" element={<Navigate to="/mastery" replace />} />
              <Route path="/academy/courses/:courseId" element={<Navigate to="/mastery/courses/:courseId" replace />} />
              <Route path="/academy/courses/:courseId/lessons/:lessonId" element={<Navigate to="/mastery/courses/:courseId/lessons/:lessonId" replace />} />
              <Route path="/mastery" element={wrapInLayout(<MasteryPage />)} />
              <Route path="/mastery/courses/:courseId" element={wrapInLayout(<CourseDetailPage />)} />
              <Route path="/mastery/courses/:courseId/lessons/:lessonId" element={wrapInLayout(<LessonViewerPage />)} />
              <Route path="/labs" element={<Navigate to="/blueprints" replace />} />
              <Route path="/labs/:slug" element={<Navigate to="/blueprints" replace />} />
              <Route path="/thank-you" element={wrapInLayout(<ThankYouPage />)} />
              <Route path="/lab/dashboard" element={<Navigate to="/vault" replace />} />
              <Route path="/vault" element={wrapInLayout(<VaultPage />)} />
              <Route path="/blogs" element={<Navigate to="/blog" replace />} />
              <Route path="/research" element={<Navigate to="/blog" replace />} />
              <Route path="/building" element={wrapInLayout(<BuildingPage />)} />
              <Route path="/in-public" element={<Navigate to="/building" replace />} />
              <Route path="/milestones" element={<Navigate to="/building" replace />} />
              <Route path="/momentum" element={<Navigate to="/building" replace />} />
              <Route path="/design-system" element={wrapInLayout(<DesignSystemTestPage />)} />
              <Route path="/workspace/client-acquisition" element={<AcquisitionWorkspacePage />} />
              <Route path="/workspace/offer-engineering" element={<OfferEngineeringPage />} />
              <Route path="/workspace/authority-system" element={<AuthoritySystemPage />} />
              <Route path="/workspace/portfolio-system" element={<PortfolioSystemPage />} />
              <Route path="/workspace/client-pipeline" element={<ClientPipelineSystemPage />} />
<Route path="/workspace/outreach-engine" element={<OutreachEnginePage />} />
<Route path="/workspace/client-delivery" element={<DeliverySystemPage />} />
<Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <ScrollToTopButton />
          <CookieConsent />
          <BetaFeedbackButton />
          <BetaOnboardingOverlay />
          {import.meta.env.DEV && <DevTestTools />}
        </div>
      </Router>
    </ErrorBoundary>
  );
}
