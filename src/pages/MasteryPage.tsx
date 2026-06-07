import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { auth, db, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { AuthModal } from "../components/ui/AuthModal";

// Modular Sections
import { MasteryHero } from "../components/sections/MasteryHero";
import { MasteryExploreSkills } from "../components/sections/MasteryExploreSkills";
import { MasteryPaths } from "../components/sections/MasteryPaths";
import { MasteryTracks } from "../components/sections/MasteryTracks";
import { MasteryWorkshops } from "../components/sections/MasteryWorkshops";
import { MasteryMentorship } from "../components/sections/MasteryMentorship";
import { MasteryFreeResources } from "../components/sections/MasteryFreeResources";
import { MasteryTestimonials } from "../components/sections/MasteryTestimonials";
import { MasteryWhy } from "../components/sections/MasteryWhy";
import { MasteryFAQ } from "../components/sections/MasteryFAQ";
import { MasteryFinalCTA } from "../components/sections/MasteryFinalCTA";

const PRESET_CATEGORIES = [
  { id: 'ai', name: 'AI & Automation' },
  { id: 'websites', name: 'Website Development' },
  { id: 'design', name: 'UI/UX Design' },
  { id: 'typography', name: 'Typography' },
  { id: 'color', name: 'Color Theory' },
  { id: 'seo', name: 'SEO' },
  { id: 'robotics', name: 'Robotics' },
  { id: 'branding', name: 'Personal Branding' },
  { id: 'products', name: 'Digital Products' },
  { id: 'entrepreneurship', name: 'Entrepreneurship' }
];

const DEFAULT_COURSES_COUNT_FALLBACK = [
  { category: 'color' },
  { category: 'typography' },
  { category: 'seo' },
  { category: 'robotics' },
  { category: 'ai' }
];

const trackEvent = (eventName: string, payload?: Record<string, any>) => {
  console.log(`[Mastery Event] ${eventName}`, payload);
};

export const MasteryPage = () => {
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
    title: "Mastery | AyushPaul.in",
    description: "Build high-leverage skills that compound over time. Self-paced courses, live workshops, and 1-on-1 mentorship designed for founders and creators.",
    keywords: "Ayush Paul Mastery, Design, AI, Automation, Product Strategy, Personal Branding, Web Development",
    url: getCanonicalUrl("/mastery"),
    schema: {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": "Ayush Paul Mastery Ecosystem",
      "description": "Guided execution pathways covering Web Engineering, AI, and Automation.",
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
  const scrollToExploreSkills = () => {
    const el = document.getElementById("explore-skills-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPaths = () => {
    const el = document.getElementById("choose-learning-paths");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToCourses = () => {
    const el = document.getElementById("featured-courses-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMentorship = () => {
    const el = document.getElementById("learn-directly-with-ayush");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Smooth scroll to featured courses after setting filter
    setTimeout(() => {
      scrollToCourses();
    }, 100);
  };

  // Aggregate skill categories and count course occurrences dynamically
  const activeCourses = courses.length > 0 ? courses : DEFAULT_COURSES_COUNT_FALLBACK;
  const categoriesWithCounts = PRESET_CATEGORIES.map(cat => {
    const count = activeCourses.filter(c => c.category && c.category.toLowerCase() === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      count
    };
  });

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
      <MasteryHero 
        onExploreClick={scrollToExploreSkills} 
        onPathsClick={scrollToPaths} 
      />

      {/* 2. EXPLORE SKILLS (Pill Tags directory) */}
      <MasteryExploreSkills 
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* 3. CHOOSE HOW YOU WANT TO LEARN */}
      <MasteryPaths 
        onExploreCoursesClick={scrollToCourses}
        onMentorshipClick={scrollToMentorship}
      />

      {/* 4. FEATURED COURSES */}
      <MasteryTracks 
        courses={courses}
        userEnrollments={userEnrollments}
        onEnroll={handleEnroll}
        onNavigateToCourse={handleNavigateToCourse}
        loading={loading}
        activeCategory={activeCategory}
      />

      {/* 5. UPCOMING WORKSHOPS */}
      <MasteryWorkshops />

      {/* 6. LEARN DIRECTLY WITH AYUSH */}
      <MasteryMentorship />

      {/* 7. FREE RESOURCES */}
      <MasteryFreeResources />

      {/* 8. STUDENT RESULTS */}
      <MasteryTestimonials />

      {/* 9. WHY MASTERY */}
      <MasteryWhy />

      {/* 10. FAQ SECTION */}
      <MasteryFAQ />

      {/* 11. FINAL CTA */}
      <MasteryFinalCTA trackEvent={trackEvent} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
};

export default MasteryPage;
