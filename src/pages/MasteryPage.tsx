import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { auth, db, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { useAnalytics } from "../hooks/useAnalytics";
import { getCanonicalUrl } from "../lib/domain";
import { AuthModal } from "../components/ui/AuthModal";

// Modular Sections
import { MasteryHero } from "../components/sections/MasteryHero";
import { MasteryHowToLearn } from "../components/sections/MasteryHowToLearn";
import { MasteryTracks } from "../components/sections/MasteryTracks";
import { MasteryWorkshops } from "../components/sections/MasteryWorkshops";
import { MasteryMentorship } from "../components/sections/MasteryMentorship";
import { MasteryWhy } from "../components/sections/MasteryWhy";
import { MasteryFAQ } from "../components/sections/MasteryFAQ";
import { MasteryFinalCTA } from "../components/sections/MasteryFinalCTA";

const CATEGORY_NAMES: Record<string, string> = {
  ai: 'AI & Automation',
  robotics: 'Robotics',
  websites: 'Web Development',
  design: 'UI/UX Design',
  typography: 'Typography',
  color: 'Color Theory',
  seo: 'SEO',
  branding: 'Personal Branding',
  products: 'Digital Products',
  entrepreneurship: 'Entrepreneurship',
};

const COMING_SOON_COURSES = [
  {
    id: "ai-execution-systems",
    title: "AI Execution Systems",
    category: "ai",
    description: "Build end-to-end AI agents that research, plan, and execute autonomously using LLM orchestration, tool calling, and memory management.",
    difficulty: "Advanced",
    duration: "6-8 Hours",
    lessonsCount: 12,
    isPublished: false,
    status: "COMING_SOON",
  },
  {
    id: "cursor-ai-mastery-advanced",
    title: "Cursor AI Mastery (Advanced)",
    category: "ai",
    description: "Go beyond vanilla Cursor workflows. Build custom rules, MCP servers, and advanced agentic patterns for production-grade codebases.",
    difficulty: "Advanced",
    duration: "4-6 Hours",
    lessonsCount: 10,
    isPublished: false,
    status: "COMING_SOON",
  },
  {
    id: "seo-execution-blueprint",
    title: "SEO Execution Blueprint",
    category: "seo",
    description: "A tactical system for ranking in 2026 and beyond. Learn technical SEO, content architecture, entity optimization, and AI-era search strategies.",
    difficulty: "Intermediate",
    duration: "3-5 Hours",
    lessonsCount: 8,
    isPublished: false,
    status: "COMING_SOON",
  },
  {
    id: "freelance-client-acquisition",
    title: "Freelance Client Acquisition",
    category: "entrepreneurship",
    description: "A repeatable outreach-to-close system for freelancers. Build authority, craft proposals that convert, and command premium rates.",
    difficulty: "Intermediate",
    duration: "4-6 Hours",
    lessonsCount: 10,
    isPublished: false,
    status: "COMING_SOON",
  },
  {
    id: "personal-brand-content-system",
    title: "Personal Brand Content System",
    category: "branding",
    description: "A structured content engine for busy builders. Plan, produce, and distribute consistently without burning out across Twitter, LinkedIn, and newsletters.",
    difficulty: "Beginner",
    duration: "3-5 Hours",
    lessonsCount: 8,
    isPublished: false,
    status: "COMING_SOON",
  },
];

export const MasteryPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Load courses from Firestore database
      const pubQ = query(
        collection(db, "courses"),
        where("isPublished", "==", true),
        orderBy("createdAt", "desc")
      );
      const pubSnap = await getDocs(pubQ);
      const publishedCourses = pubSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Also load COMING_SOON courses
      let comingSoonCourses: any[] = [];
      try {
        const csQ = query(
          collection(db, "courses"),
          where("status", "==", "COMING_SOON")
        );
        const csSnap = await getDocs(csQ);
        comingSoonCourses = csSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("COMING_SOON courses query failed:", e);
      }

      // Merge: published first, then coming-soon (deduplicate)
      const seen = new Set(publishedCourses.map(c => c.id));
      const coursesList = [...publishedCourses];
      for (const c of comingSoonCourses) {
        if (!seen.has(c.id)) {
          coursesList.push(c);
          seen.add(c.id);
        }
      }
      // Append local coming-soon courses not yet in Firestore
      for (const c of COMING_SOON_COURSES) {
        if (!seen.has(c.id)) {
          coursesList.push(c);
          seen.add(c.id);
        }
      }
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
      console.error("Failed to load mastery data:", err);
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
    title: "Mastery — Skill Acquisition Ecosystem for Builders | Ayush Paul",
    description: "Learn skills, build systems, and ship faster. Self-paced courses, live workshops, and private 1-on-1 learning with Ayush Paul.",
    keywords: "Ayush Paul mastery, skill acquisition, AI courses, robotics workshops, web development courses, 1-on-1 learning, design systems",
    url: getCanonicalUrl("/mastery"),
    image: "/og-image.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": "Mastery — Skill Acquisition Ecosystem",
      "description": "Self-paced courses, live workshops, and private 1-on-1 learning for builders. Learn skills, build systems, and ship faster.",
      "url": getCanonicalUrl("/mastery"),
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

        // Trigger enrollment email (fire-and-forget)
        try {
          fetch('/api/trigger-enrollment-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: auth.currentUser.uid, courseId }),
          }).catch(() => {});
        } catch (_) { /* enrollment email dispatch is fire-and-forget */ }
      }
      
      // Update local state immediately
      setUserEnrollments(prev => ({ ...prev, [courseId]: true }));
      navigate(`/mastery/courses/${courseId}`);
    } catch (err) {
      console.error("Failed to enroll user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToCourse = (courseId: string) => {
    trackEvent("Resume Program Clicked", { courseId });
    navigate(`/mastery/courses/${courseId}`);
  };

  // Scroll Actions
  const scrollToCourses = () => {
    const el = document.getElementById("featured-courses-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToExploreSkills = () => {
    const el = document.getElementById("explore-skills-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMentorship = () => {
    const el = document.getElementById("learn-directly-with-ayush");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Derive skill categories dynamically from Firestore course data
  const categoriesWithCounts = Array.from(
    new Set(courses.map(c => c.category?.toLowerCase()).filter(Boolean))
  ).map(catId => ({
    id: catId,
    name: CATEGORY_NAMES[catId] || catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: courses.filter(c => c.category?.toLowerCase() === catId).length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-32 relative overflow-hidden text-text-primary"
    >
      {/* 1. HERO */}
      <MasteryHero 
        onExploreClick={scrollToExploreSkills} 
        onCoursesClick={scrollToCourses} 
      />

      {/* 2. CHOOSE HOW YOU WANT TO LEARN */}
      <MasteryHowToLearn 
        onExploreCoursesClick={scrollToCourses}
        onMentorshipClick={scrollToMentorship}
      />

      {/* 3. COURSE DISCOVERY (Now containing the explore skills category filters!) */}
      <MasteryTracks 
        courses={courses}
        userEnrollments={userEnrollments}
        onEnroll={handleEnroll}
        onNavigateToCourse={handleNavigateToCourse}
        loading={loading}
        activeCategory={activeCategory}
        categories={categoriesWithCounts}
        onCategorySelect={handleCategorySelect}
      />

      {/* 4. WORKSHOPS */}
      <MasteryWorkshops />

      {/* 5. 1-ON-1 LEARNING */}
      <MasteryMentorship />

      {/* 6. WHY MASTERY WORKS */}
      <MasteryWhy />

      {/* 7. FAQ */}
      <MasteryFAQ />

      {/* 8. FINAL CTA */}
      <MasteryFinalCTA 
        onExploreCoursesClick={scrollToCourses}
        onBookSessionClick={scrollToMentorship}
        trackEvent={trackEvent} 
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default MasteryPage;
