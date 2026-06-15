import React, { useState, useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { getPublishedProducts } from "../lib/product-utils";
import { getDynamicBlogs, BlogPost } from "../lib/blog-utils";
import { auth, db, collection, query, getDocs, where } from "../firebase";
import { Product, Workshop } from "../types";
import { AuthModal } from "../components/ui/AuthModal";
import { getFeaturedBlueprints } from "../data/blueprints";
import { HomeHeroSection } from "../components/sections/HomeHeroSection";
import { HomeBlueprintsSection } from "../components/sections/HomeBlueprintsSection";
import { HomeMasterySection } from "../components/sections/HomeMasterySection";
import { HomeBlogSection } from "../components/sections/HomeBlogSection";
import { HomeStudioSection } from "../components/sections/HomeStudioSection";
import { HomeFAQSection } from "../components/sections/HomeFAQSection";
import { HomeFinalCTASection } from "../components/sections/HomeFinalCTASection";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});
  
  const [allProductsCount, setAllProductsCount] = useState(12);
  const [frameworksCount, setFrameworksCount] = useState(8);
  const [coursesCount, setCoursesCount] = useState(6);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useSEO({
    title: "Ayush Paul | AI Developer, Systems Builder & Digital Creator",
    description:
      "Premium blueprints, AI automation workflows, and engineering systems for builders who ship. Explore implementation templates, structured courses, and project collaboration.",
    keywords:
      "Ayush Paul, systems builder, AI developer, implementation blueprints, automation workflows, Next.js templates, Cursor AI, SaaS development",
    url: getCanonicalUrl(),
    image: "/og-image.png",
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prod = await getPublishedProducts();
        setProducts(prod.slice(0, 3));
        setAllProductsCount(prod.length);
        const fwCount = prod.filter(p => p.category?.toLowerCase().includes("framework")).length;
        setFrameworksCount(fwCount || 6);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoadingProducts(false);
      }

      try {
        const blg = await getDynamicBlogs();
        setBlogs(blg.slice(0, 3));
      } catch (e) {
        console.error("Failed to load blogs:", e);
      } finally {
        setLoadingBlogs(false);
      }

      try {
        const coursesSnap = await getDocs(
          query(collection(db, "courses"), where("isPublished", "==", true))
        );
        const coursesList = coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList.slice(0, 3));
        setCoursesCount(coursesList.length || 5);
      } catch (e) {
        console.error("Failed to load courses:", e);
      } finally {
        setLoadingCourses(false);
      }

      try {
        const workshopsSnap = await getDocs(
          query(collection(db, "workshops"), where("isPublished", "==", true))
        );
        const workshopsList = workshopsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Workshop));
        setWorkshops(workshopsList.slice(0, 3));
      } catch (e) {
        console.error("Failed to load workshops:", e);
      } finally {
        setLoadingWorkshops(false);
      }
    };
    
    loadHomeData();
  }, []);

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
          console.error("Failed to load enrollments:", err);
        }
      } else {
        setUserEnrollments({});
      }
    });
    return () => unsubscribe();
  }, []);

  const featuredBlueprints = getFeaturedBlueprints(products);

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen pt-4 md:pt-6">
      <HomeHeroSection />
      <HomeBlueprintsSection loadingProducts={loadingProducts} featuredBlueprints={featuredBlueprints} />
      <HomeMasterySection courses={courses} coursesCount={coursesCount} loadingCourses={loadingCourses} workshops={workshops} loadingWorkshops={loadingWorkshops} />
      <HomeBlogSection loadingBlogs={loadingBlogs} blogs={blogs} />
      <HomeStudioSection />
      <HomeFAQSection />
      <HomeFinalCTASection />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default HomePage;
