import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// --- Layouts ---
import { MainLayout } from "./layouts/MainLayout";

// --- Pages ---
import { HomePage } from "./pages/Home";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { AdminPage } from "./pages/AdminPage";
import { SuccessPage } from "./pages/SuccessPage";
import { CancelPage } from "./pages/CancelPage";
import { NowPage } from "./pages/NowPage";
import { ProfileSelectionPage } from "./pages/ProfileSelectionPage";

// --- Components ---
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop, ScrollToTopButton } from "./components/ui/ScrollUtilities";
import { CursorFollower, ScrollProgressBar } from "./components/ui/CursorEffects";
import { FirebaseConfigWarning } from "./components/FirebaseConfigWarning";
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
          <CursorFollower />
          <ScrollProgressBar />
          
          {!isConfigured && showConfigWarning && (
            <FirebaseConfigWarning 
              variant="banner" 
              onDismiss={() => setShowConfigWarning(false)} 
            />
          )}
          
          <Routes>
            <Route path="/" element={
              view === "landing" ? (
                wrapInLayout(<HomePage onViewPortfolio={() => setView("profiles")} />)
              ) : (
                <ProfileSelectionPage onSelect={handleProfileSelect} />
              )
            } />
            <Route path="/now" element={wrapInLayout(<NowPage />)} />
            <Route path="/blog" element={wrapInLayout(<BlogPage />)} />
            <Route path="/blog/:slug" element={wrapInLayout(<BlogPostPage />)} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Routes>

          <ScrollToTopButton />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
