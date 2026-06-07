import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { auth, db, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { AuthModal } from "../components/ui/AuthModal";

// Modular Sections
import { AcademyHero } from "../components/sections/AcademyHero";
import { AcademyPaths } from "../components/sections/AcademyPaths";
import { AcademyPrograms } from "../components/sections/AcademyPrograms";
import { AcademyHowItWorks } from "../components/sections/AcademyHowItWorks";
import { AcademyExperience } from "../components/sections/AcademyExperience";
import { AcademyFAQ } from "../components/sections/AcademyFAQ";
import { AcademyFinalCTA } from "../components/sections/AcademyFinalCTA";

// Analytics track event console helper
const trackEvent = (eventName: string, payload?: Record<string, any>) => {
  console.log(`[Academy Event] ${eventName}`, payload);
};

export const AcademyPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Load courses from Firestore database
      const q = query(
        collection(db, "courses"),
        where("isPublished", "==", true),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const coursesList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);

      // Load current user's enrollments
      if (auth.currentUser) {
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("userId", "==", auth.currentUser.uid))
        );
        const enrollMap: Record<string, boolean> = {};
        enrollSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.courseId) {
            enrollMap[data.courseId] = true;
          }
        });
        setUserEnrollments(enrollMap);
      }
    } catch (err) {
      console.error("Failed to load academy data:", err);
      trackEvent("Database Connection Error", { error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen to auth state changes to dynamically sync enrollments
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const enrollSnap = await getDocs(
            query(collection(db, "enrollments"), where("userId", "==", currentUser.uid))
          );
          const enrollMap: Record<string, boolean> = {};
          enrollSnap.docs.forEach((doc) => {
            const data = doc.data();
            if (data.courseId) {
              enrollMap[data.courseId] = true;
            }
          });
          setUserEnrollments(enrollMap);
        } catch (err) {
          console.error("Failed to load enrollments on login change:", err);
        }
      } else {
        setUserEnrollments({});
      }
    });
    return () => unsubscribe();
  }, []);

  useSEO({
    title: "Academy & Courses | AyushPaul.in",
    description: "Master AI workflows, web development foundations, SEO engines, and operations automation through structured, project-driven learning tracks.",
    keywords: "Ayush Paul Academy, AI for Builders, Web Development, Next.js, SEO, Automation, Make.com Courses",
    url: getCanonicalUrl("/academy"),
    schema: {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": "Ayush Paul Academy Learning Track",
      "description": "Guided execution pathways covering Web Engineering, AI, and Automation.",
      "url": getCanonicalUrl("/academy"),
      "organizer": {
        "@type": "Person",
        "name": "Ayush Paul",
        "url": getCanonicalUrl()
      }
    }
  });

  const handleEnroll = async (courseId: string) => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      trackEvent("Enroll Triggered - Auth Redirected", { courseId });
      return;
    }

    try {
      setLoading(true);
      const enrollmentRef = collection(db, "enrollments");
      const q = query(
        enrollmentRef,
        where("userId", "==", auth.currentUser.uid),
        where("courseId", "==", courseId)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        await addDoc(enrollmentRef, {
          userId: auth.currentUser.uid,
          courseId,
          progress: [],
          completed: false,
          enrolledAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        trackEvent("Enrolled Success", { courseId, userId: auth.currentUser.uid });
      }
      
      // Update local state immediately
      setUserEnrollments(prev => ({ ...prev, [courseId]: true }));
      navigate(`/academy/courses/${courseId}`);
    } catch (err) {
      console.error("Failed to enroll user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToCourse = (courseId: string) => {
    trackEvent("Resume Program Clicked", { courseId });
    navigate(`/academy/courses/${courseId}`);
  };

  const scrollToPaths = () => {
    const el = document.getElementById("academy-paths-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPrograms = () => {
    const el = document.getElementById("academy-programs-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePathSelect = (pathId: string) => {
    setActiveCategory(pathId);
    scrollToPrograms();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-32 relative overflow-hidden text-text-primary"
    >
      {/* Background Soft Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      {/* 1. HERO SECTION */}
      <AcademyHero 
        onExploreClick={scrollToPaths} 
        onProgramsClick={scrollToPrograms} 
      />

      {/* 2. LEARNING PATHS */}
      <AcademyPaths 
        onPathSelect={handlePathSelect} 
      />

      {/* 3. FEATURED PROGRAMS */}
      <AcademyPrograms 
        courses={courses}
        userEnrollments={userEnrollments}
        onEnroll={handleEnroll}
        onNavigateToCourse={handleNavigateToCourse}
        loading={loading}
        activePath={activeCategory}
      />

      {/* 4. HOW LEARNING WORKS */}
      <AcademyHowItWorks />

      {/* 5. LEARNING EXPERIENCE */}
      <AcademyExperience />

      {/* 6. FAQ SECTION */}
      <AcademyFAQ />

      {/* 7. FINAL CTA */}
      <AcademyFinalCTA trackEvent={trackEvent} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default AcademyPage;
