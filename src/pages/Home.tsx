import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Cpu,
  Code,
  BookOpen,
  CheckCircle2,
  User,
  Sparkles,
  ArrowRight,
  Play,
  TrendingUp,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Mail,
  AlertCircle
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useAnalytics } from "../hooks/useAnalytics";
import { getCanonicalUrl } from "../lib/domain";
import { getPublishedProducts } from "../lib/product-utils";
import { getDynamicBlogs, BlogPost } from "../lib/blog-utils";
import { auth, db, collection, query, getDocs, where, addDoc, serverTimestamp } from "../firebase";
import { Product } from "../types";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { AuthModal } from "../components/ui/AuthModal";
import { BlueprintsFAQ } from "../components/sections/BlueprintsFAQ";
import { cn } from "../lib/utils";

// --- Floating Product Cards Removed ---

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});
  
  const [allProductsCount, setAllProductsCount] = useState(12);
  const [frameworksCount, setFrameworksCount] = useState(8);
  const [coursesCount, setCoursesCount] = useState(6);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const workTogetherSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent("work_together_section_view");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (workTogetherSectionRef.current) {
      observer.observe(workTogetherSectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCardClick = (cardName: string, position: number) => {
    trackEvent("collaboration_area_click", {
      cardName,
      position,
      deviceType: window.innerWidth < 768 ? "mobile" : "desktop"
    });
  };

  const handlePathwayClick = (formatName: string) => {
    trackEvent("learn_pathway_click", { format: formatName });
  };

  const [courseWaitlistEmail, setCourseWaitlistEmail] = useState("");
  const [courseWaitlistStatus, setCourseWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [courseWaitlistError, setCourseWaitlistError] = useState("");

  const [workshopWaitlistEmail, setWorkshopWaitlistEmail] = useState("");
  const [workshopWaitlistStatus, setWorkshopWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [workshopWaitlistError, setWorkshopWaitlistError] = useState("");

  const handleWaitlistSubmit = async (
    e: React.FormEvent,
    email: string,
    interest: string,
    setStatus: (s: any) => void,
    setError: (s: string) => void,
    setEmail: (s: string) => void,
    context: string
  ) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setError("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      // Check duplicate in Firestore
      const q = query(
        collection(db, "subscribers"),
        where("email", "==", email.toLowerCase().trim()),
        where("interest", "==", interest)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setStatus("success");
        setEmail("");
        return;
      }

      await addDoc(collection(db, "subscribers"), {
        email: email.toLowerCase().trim(),
        createdAt: serverTimestamp(),
        source: context,
        page: window.location.pathname,
        interest: interest
      });

      setStatus("success");
      setEmail("");
      trackEvent("waitlist_subscribe_success", { interest, context });
    } catch (err: any) {
      console.error("Waitlist Error:", err);
      setStatus("error");
      setError(err.message || "Failed to subscribe. Please try again.");
    }
  };

  useSEO({
    title: "Ayush Paul | Ecosystem Developer & AI Builder",
    description:
      "Blueprints, courses, and engineering systems for Next.js SaaS, Cursor AI workflows, SEO crawls, and Make.com playbooks.",
    keywords:
      "Ayush Paul, Systems Builder, SaaS Academy, Next.js Templates, Cursor AI Configs, Make.com Scenario, SEO Checklist",
    url: getCanonicalUrl(),
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

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen pt-4 md:pt-6">
      
      {/* Styles for marquee & custom layout rules */}
      <style>{`
        .hero-bg {
          background: linear-gradient(180deg, #1A73E8 0%, #42A5F5 50%, #90CAF9 100%);
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 40%),
                            radial-gradient(circle at 80% 60%, rgba(255,255,255,0.15) 0%, transparent 50%);
          pointer-events: none;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .hero-title {
          color: #ffffff !important;
        }
        .hero-description {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .hero-footer-text {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        :root.light .hero-cta-blue,
        .hero-cta-blue {
          background-color: #2170e4 !important;
          color: #ffffff !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .hero-cta-blue:hover,
        .hero-cta-blue:hover {
          background-color: #1a5ab7 !important;
          color: #ffffff !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 10px 20px -5px rgba(33, 112, 228, 0.4) !important;
        }
        :root.light .hero-cta-lime,
        .hero-cta-lime {
          background-color: #d1f34d !important;
          color: #0b1c30 !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .hero-cta-lime:hover,
        .hero-cta-lime:hover {
          background-color: #c0e045 !important;
          color: #0b1c30 !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.4) !important;
        }
        :root.light .hero-cta-arrow-bg,
        .hero-cta-arrow-bg {
          background-color: #000000 !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .hero-cta-lime:hover .hero-cta-arrow-icon {
          transform: translate(2px, -2px) !important;
        }
        :root.light .hero-cta-arrow-icon,
        .hero-cta-arrow-icon {
          color: #ffffff !important;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .pathway-cta-dark-lime,
        .pathway-cta-dark-lime {
          background-color: #111111 !important;
          color: #d1f34d !important;
          border-radius: 9999px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .pathway-cta-dark-lime:hover,
        .pathway-cta-dark-lime:hover {
          background-color: #d1f34d !important;
          color: #111111 !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.4) !important;
        }
        /* Pathway card styling */
        :root.light .pathway-card,
        .pathway-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.3) !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .pathway-card:hover,
        .pathway-card:hover {
          background-color: #d1f34d !important;
          border-color: #d1f34d !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 40px -15px rgba(209, 243, 77, 0.35) !important;
        }
        /* Card 2 default background */
        :root.light .pathway-card-light-blue,
        .pathway-card-light-blue {
          background-color: rgba(239, 244, 255, 0.3) !important;
        }
        /* Pathway badge styling */
        :root.light .pathway-badge,
        .pathway-badge {
          background-color: #d1f34d !important;
          color: #0b1c30 !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .pathway-card:hover .pathway-badge {
          background-color: #0b1c30 !important;
          color: #d1f34d !important;
        }
        /* Button hover when card is hovered */
        .pathway-card:hover .pathway-cta-dark-lime:hover {
          background-color: #ffffff !important;
          color: #111111 !important;
          box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.4) !important;
        }
        /* Learn With Me Section Styles */
        :root.light .credibility-card,
        .credibility-card {
          background-color: #f8f9ff !important;
          border: 1px solid rgba(194, 198, 214, 0.3) !important;
          border-radius: 16px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .credibility-card:hover,
        .credibility-card:hover {
          border-color: #d1f34d !important;
          background-color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.15) !important;
        }
        :root.light .philosophy-quote-card,
        .philosophy-quote-card {
          background-color: #0b1c30 !important;
          border-left: 4px solid #d1f34d !important;
          border-radius: 20px !important;
          padding: 24px !important;
        }
        :root.light .philosophy-quote-card p,
        .philosophy-quote-card p {
          color: #ffffff !important;
        }
        .learn-visual-container {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(194, 198, 214, 0.3);
          background: #ffffff;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .learn-visual-container:hover {
          transform: scale(1.02) translateY(-4px);
          border-color: #d1f34d;
          box-shadow: 0 30px 60px -20px rgba(209, 243, 77, 0.15);
        }
        /* Work Together Section Styles */
        :root.light .collaboration-grid-card,
        .collaboration-grid-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.3) !important;
          border-radius: 20px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .collaboration-grid-card:hover,
        .collaboration-grid-card:hover {
          border-color: #d1f34d !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.15) !important;
        }
        
        :root.light .native-workflow-card,
        .native-workflow-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.25) !important;
          border-radius: 24px !important;
          padding: 24px !important;
          position: relative !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .native-workflow-card:hover,
        .native-workflow-card:hover {
          border-color: #d1f34d !important;
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05) !important;
        }
        
        .step-number-pill {
          background-color: #0b1c30;
          color: #d1f34d;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
 
      {/* 1. HERO SECTION (Aeline Visual Architecture) */}
      <section className="hero-bg border border-white/20 rounded-[32px] md:rounded-[40px] lg:rounded-[48px] overflow-hidden mx-4 md:mx-6 mb-8 mt-0 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col relative pb-24 text-left shadow-2xl">
        <main className="flex-grow flex flex-col items-center justify-start pt-24 md:pt-32 px-6 text-center relative z-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center mb-6">
            <h1 className="hero-title text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-tighter max-w-4xl mx-auto">
              Build Digital Products<br className="hidden md:block" /> With AI, Systems And Execution
            </h1>
            <p className="hero-description text-sm md:text-lg max-w-2xl leading-relaxed font-semibold mt-4">
              A developer ecosystem crafting blueprints, courses, and automation scenarios to help you transition from concept to production.
            </p>
          </div>
   
          <div className="flex flex-col sm:flex-row gap-4 mb-12 items-center justify-center">
            <a 
              className="hero-cta-blue px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer"
              href="#pathways"
            >
              Choose Pathway
            </a>
            <Link 
              className="hero-cta-lime px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-md"
              to="/collaborate"
            >
              Start Building
              <span className="hero-cta-arrow-bg rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                <ArrowUpRight size={14} className="hero-cta-arrow-icon" />
              </span>
            </Link>
          </div>

          {/* Video Preview Container */}
          <div className="relative w-full max-w-5xl mx-auto mb-16 aspect-video bg-black/20 rounded-3xl overflow-hidden shadow-2xl border border-white/20 group cursor-pointer">
            {/* Video Thumbnail */}
            <img 
              alt="Tech Strategy Video" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZbIUoIl6fYYGNCHnJKXylajrVUcft3cYg2kEi4bJUK3Y48pjCRVTmEIqcq9AlkDHmXMwLQwTnkeaFbApRGzdMh7FPolx9X_ShdlPysz6aCQTFzoMHCi5CahatnA-0AtxvUFsmbd3tW2UGgEQpqfZ7CVsdeChoIP_83n4QoVrPPq-um7qiXihWVo1uhqZmw_Q5MOFtCQbBl981uzV3zsg0tXtMOYDEM9Jn9qEGYGz_fQyQpyKBjjtDhpIu6PkomPHaMnlSZ9Vq114" 
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#d1f34d] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                <Play size={28} className="text-black ml-1 fill-current" />
              </div>
            </div>
            {/* Video Title/Duration Info (UI Decor) */}
            <div className="absolute bottom-6 left-8 text-white items-start flex flex-col text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-[#d1f34d] mb-1">WATCH OVERVIEW</p>
              <h3 className="text-lg md:text-xl font-bold">See How The Ecosystem Works.</h3>
            </div>
            <div className="absolute bottom-6 right-8 text-white">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                02:45
              </div>
            </div>
          </div>
   
          <div className="flex flex-col items-center gap-2.5 mt-auto relative z-20">
            <p className="hero-footer-text text-xs md:text-sm font-semibold tracking-wider text-center max-w-2xl">
              Builders, creators, students, and founders use these systems to move from idea to execution.
            </p>
            <div className="flex gap-1 text-[#d1f34d]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </main>
      </section>
  
      {/* 2. CHOOSE YOUR PATH */}
      <section id="pathways" className="bg-bg-primary py-24 px-6 md:px-12 lg:px-24 text-left">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424754] flex items-center gap-1.5 mb-6 bg-white border border-[#c2c6d6]/35 px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse"></span>
              THE PATHWAYS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] max-w-4xl mb-6 text-center">
              Tailored Structures for <br />
              Accelerating Development.
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Select the system level that fits your pipeline—speed up builds using ready-to-run blueprints, acquire structured thinking, or collaborate closely.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            {/* Path 1: Build */}
            <div className="pathway-card p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Build Faster</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Construct platforms using structured sitemaps, typescript boilerplates, automation sequences, and templates.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Framework blueprints
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Cursor Rule configurations
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Operational checklist playbooks
                  </li>
                </ul>
              </div>
              <Link to="/blueprints" className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Browse Registry
              </Link>
            </div>
 
            {/* Path 2: Learn */}
            <div className="pathway-card pathway-card-light-blue p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Learn Better</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Acquire the architectural thinking, prompt rules, and database schema configurations through structured syllabus modules.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Recorded syllabus classes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Practical building workshops
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Active support group channels
                  </li>
                </ul>
              </div>
              <Link to="/mastery" className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Explore Mastery
              </Link>
            </div>
            {/* Path 3: Studio */}

            <div className="pathway-card p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <Cpu size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Studio</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Partner directly to outline roadmap strategies, configure custom data webhooks, and build high-performance products.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Product planning roadmaps
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    MVP architecture execution
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Direct workflow configurations
                  </li>
                </ul>
              </div>
              <Link to="/collaborate" className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Start Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SYSTEMS SECTION */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-center border-b border-gray-100 mt-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center mb-16 text-center select-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              FEATURED SYSTEMS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] max-w-4xl mb-6">
              Ready-To-Use Systems<br className="hidden sm:block" /> For Faster Execution
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl mx-auto font-medium leading-relaxed">
              Access frameworks, templates, prompts, and implementation guides designed to help you build, launch, and grow faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch max-w-6xl mx-auto text-left">
            {/* Card 1: AI Website Blueprint */}
            <div className="group bg-white rounded-[32px] border border-[#c2c6d6]/30 overflow-hidden shadow-sm hover:shadow-md hover:border-[#d1f34d] transition-all duration-300 hover:scale-[1.01] flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden border-b border-[#c2c6d6]/10">
                <img 
                  src="/assets/ai_website_blueprint.png" 
                  alt="AI Website Blueprint" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 border border-[#c2c6d6]/20 text-[9px] font-bold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                    Websites &amp; Products
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-[#0b1c30] group-hover:text-black transition-colors leading-snug mb-3">
                  AI Website Blueprint
                </h3>
                <p className="text-[#424754] text-xs line-clamp-3 mb-8 flex-grow leading-relaxed font-semibold">
                  Launch optimized Next.js frameworks pre-configured with SEO layouts, copywriting blueprints, and automated webhook triggers.
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#eff4ff]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d] bg-[#0b1c30] px-2.5 py-1 rounded-full">
                    Flagship Tier
                  </span>
                  <Link to="/blueprints" className="text-[10px] font-bold uppercase tracking-widest text-[#0b1c30] hover:text-[#d1f34d] transition-colors flex items-center gap-1">
                    OPEN BLUEPRINT <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: SEO Growth System */}
            <div className="group bg-white rounded-[32px] border border-[#c2c6d6]/30 overflow-hidden shadow-sm hover:shadow-md hover:border-[#d1f34d] transition-all duration-300 hover:scale-[1.01] flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden border-b border-[#c2c6d6]/10">
                <img 
                  src="/assets/seo_growth_system.png" 
                  alt="SEO Growth System" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 border border-[#c2c6d6]/20 text-[9px] font-bold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                    SEO &amp; Growth
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-[#0b1c30] group-hover:text-black transition-colors leading-snug mb-3">
                  SEO Growth System
                </h3>
                <p className="text-[#424754] text-xs line-clamp-3 mb-8 flex-grow leading-relaxed font-semibold">
                  Deploy high-authority structural checklist configurations, keyword map sheets, and dynamic sitemaps designed to maximize visibility.
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#eff4ff]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d] bg-[#0b1c30] px-2.5 py-1 rounded-full">
                    Growth Tier
                  </span>
                  <Link to="/blueprints" className="text-[10px] font-bold uppercase tracking-widest text-[#0b1c30] hover:text-[#d1f34d] transition-colors flex items-center gap-1">
                    OPEN BLUEPRINT <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Personal Brand Framework */}
            <div className="group bg-white rounded-[32px] border border-[#c2c6d6]/30 overflow-hidden shadow-sm hover:shadow-md hover:border-[#d1f34d] transition-all duration-300 hover:scale-[1.01] flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden border-b border-[#c2c6d6]/10">
                <img 
                  src="/assets/personal_brand_framework.png" 
                  alt="Personal Brand Framework" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 border border-[#c2c6d6]/20 text-[9px] font-bold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                    Systems &amp; Automation
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-[#0b1c30] group-hover:text-black transition-colors leading-snug mb-3">
                  Personal Brand Framework
                </h3>
                <p className="text-[#424754] text-xs line-clamp-3 mb-8 flex-grow leading-relaxed font-semibold">
                  Establish structured operational playbooks, daily prompt directories, and modular asset folders to scale digital presence.
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#eff4ff]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d] bg-[#0b1c30] px-2.5 py-1 rounded-full">
                    Asset Bundle
                  </span>
                  <Link to="/blueprints" className="text-[10px] font-bold uppercase tracking-widest text-[#0b1c30] hover:text-[#d1f34d] transition-colors flex items-center gap-1">
                    OPEN BLUEPRINT <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEARNING HUB (LEARN, BUILD & GROW) SECTION */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-left mt-0">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Main Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d]/25 border border-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block">
                LEARN WITH ME
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1]">
                Learning Hub
              </h2>
              <p className="text-base text-[#424754] font-medium leading-relaxed">
                An integrated learning ecosystem designed for builders, creators, and developers. Move from self-paced curricula to live implementation.
              </p>
            </div>
            
            {/* Learning Philosophy Quote Block */}
            <div className="philosophy-quote-card max-w-sm hidden lg:block shrink-0">
              <p className="text-xs italic font-semibold leading-relaxed text-white">
                "I don't believe in collecting information. I believe in turning knowledge into action through systems, experimentation, and implementation."
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-8 w-full">
            
            {/* Row 1: Recorded Courses (Primary - Spans 12 columns) */}
            <div className="col-span-12 bg-gray-50/50 border border-[#c2c6d6]/35 rounded-[32px] p-8 md:p-12 shadow-sm hover:border-[#d1f34d] transition-all duration-300">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                
                {/* Left Col: Info panel */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-between items-start">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="step-number-pill shrink-0">01 / LEARN</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0058be] shadow-sm">
                        Recorded Courses
                      </span>
                    </div>
                    
                    {courses.length > 0 ? (
                      <>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] mb-4">
                          Self-Paced Execution Curriculums
                        </h3>
                        <p className="text-sm text-[#424754] font-medium leading-relaxed mb-6">
                          Gain deep technical competence with structured, step-by-step video lessons and direct codebase template downloads.
                        </p>
                        <div className="flex flex-col gap-2.5 text-xs text-[#424754]/85 font-bold mb-8">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full shrink-0"></span>
                            <span>{coursesCount} Interactive Programs Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full shrink-0"></span>
                            <span>Lifetime Access &amp; Updates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full shrink-0"></span>
                            <span>Direct Code &amp; Config Downloads</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] mb-4">
                          Courses Under Development
                        </h3>
                        <p className="text-sm text-[#424754] font-medium leading-relaxed mb-6">
                          The first learning programs are currently being developed. Join the waitlist to be notified when they launch.
                        </p>
                        
                        {/* Waitlist Subscription Box */}
                        <div className="w-full max-w-sm mb-6">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#424754]/60 mb-2">Get notified on launch</p>
                          <form 
                            onSubmit={(e) => handleWaitlistSubmit(e, courseWaitlistEmail, "courses", setCourseWaitlistStatus, setCourseWaitlistError, setCourseWaitlistEmail, "courses-waitlist")}
                            className="flex flex-col sm:flex-row gap-2.5"
                          >
                            <div className="relative flex-grow">
                              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/45" />
                              <input 
                                type="email" 
                                placeholder="Your email..." 
                                value={courseWaitlistEmail}
                                onChange={(e) => setCourseWaitlistEmail(e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-white border border-[#c2c6d6]/35 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] placeholder:text-[#424754]/40"
                              />
                            </div>
                            <button 
                              type="submit"
                              disabled={courseWaitlistStatus === 'loading'}
                              className="px-4 py-2.5 rounded-xl bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black font-extrabold text-[10px] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                            >
                              {courseWaitlistStatus === 'loading' ? '...' : 'Subscribe'}
                            </button>
                          </form>
                          {courseWaitlistStatus === 'success' && (
                            <div className="mt-2 text-[10px] text-[#0b663f] font-bold">Added to waitlist!</div>
                          )}
                          {courseWaitlistStatus === 'error' && (
                            <div className="mt-2 text-[10px] text-red-500 font-bold">{courseWaitlistError}</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {courses.length > 0 && (
                    <Link 
                      to="/mastery" 
                      onClick={() => handlePathwayClick("Recorded Courses")}
                      className="inline-flex items-center justify-center bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Explore Mastery <ArrowRight size={14} className="ml-2" />
                    </Link>
                  )}
                </div>

                {/* Right Col: Course List or Construction info */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-center gap-4">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <Link 
                        key={course.id}
                        to={`/mastery`}
                        onClick={() => handlePathwayClick(`Course: ${course.title}`)}
                        className="group bg-white border border-[#c2c6d6]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-[#d1f34d] transition-all hover:-translate-y-0.5 duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[#0b1c30] text-xs shrink-0 group-hover:bg-[#d1f34d]/20 transition-colors">
                            {course.category || "Web"}
                          </div>
                          <div className="text-left">
                            <h4 className="text-base font-extrabold text-[#0b1c30] group-hover:text-black transition-colors mb-1">
                              {course.title}
                            </h4>
                            <p className="text-xs text-[#424754] font-medium line-clamp-1 max-w-[450px]">
                              {course.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 shrink-0">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-[#424754]/60 uppercase tracking-wider">
                            <span>{course.duration || "4–6 hrs"}</span>
                            <span className="w-1 h-1 bg-[#c2c6d6] rounded-full"></span>
                            <span>{course.lessonsCount || 10} Chapters</span>
                          </div>
                          <span className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center transition-colors">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="w-full bg-white border border-[#c2c6d6]/20 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm select-none">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                        <Code size={28} />
                      </div>
                      <h4 className="text-lg font-extrabold text-[#0b1c30] mb-2">Programs In Construction</h4>
                      <p className="text-xs text-[#424754] font-semibold leading-relaxed max-w-sm mb-6">
                        Curriculums covering Next.js Architecture, Autonomous AI Agents, and Webhook Automation are currently being compiled.
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#424754]/60 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse"></span>
                        First release coming Q3 2026
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Row 2, Card 1: Live Workshops (Secondary - Spans 6 columns) */}
            <div className="col-span-12 md:col-span-6 bg-gray-50/50 border border-[#c2c6d6]/35 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col justify-between hover:border-[#d1f34d] transition-all duration-300">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="step-number-pill shrink-0">02 / PRACTICE</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#a15e00] shadow-sm">
                    Live Workshops
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0b1c30] mb-3">Upcoming Live Workshops</h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                  Interactive sessions, implementation walkthroughs, and Q&A events will be announced here. Join the waitlist to get notified.
                </p>
              </div>

              {/* Waitlist Subscription */}
              <div className="w-full text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#424754]/60 mb-2">Subscribe to workshop updates</p>
                <form 
                  onSubmit={(e) => handleWaitlistSubmit(e, workshopWaitlistEmail, "workshops", setWorkshopWaitlistStatus, setWorkshopWaitlistError, setWorkshopWaitlistEmail, "workshops-waitlist")}
                  className="flex gap-2.5"
                >
                  <div className="relative flex-grow">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/45" />
                    <input 
                      type="email" 
                      placeholder="Your email..." 
                      value={workshopWaitlistEmail}
                      onChange={(e) => setWorkshopWaitlistEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-white border border-[#c2c6d6]/35 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] placeholder:text-[#424754]/40"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={workshopWaitlistStatus === 'loading'}
                    className="px-4 py-2.5 rounded-xl bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black font-extrabold text-[10px] uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                  >
                    {workshopWaitlistStatus === 'loading' ? '...' : 'Notify Me'}
                  </button>
                </form>
                {workshopWaitlistStatus === 'success' && (
                  <div className="mt-2 text-[10px] text-[#0b663f] font-bold">Added to waitlist!</div>
                )}
                {workshopWaitlistStatus === 'error' && (
                  <div className="mt-2 text-[10px] text-red-500 font-bold">{workshopWaitlistError}</div>
                )}
              </div>
            </div>

            {/* Row 2, Card 2: 1-on-1 Mentorship (Secondary - Spans 6 columns) */}
            <div className="col-span-12 md:col-span-6 bg-gray-50/50 border border-[#c2c6d6]/35 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col justify-between hover:border-[#d1f34d] transition-all duration-300">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="step-number-pill shrink-0">03 / GET GUIDANCE</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0b663f] shadow-sm">
                    Direct Guidance
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0b1c30] mb-3">1-on-1 Mentorship</h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                  Work directly with Ayush to configure webhook databases, write custom LLM prompts, and review codebase architectures. Suitable for builders seeking guidance beyond recorded content.
                </p>

                {/* Mentorship Perks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { perk: "Direct Slack Support", desc: "Constant access for query resolution." },
                    { perk: "Weekly Code Review", desc: "Detailed analysis of your PRs." },
                    { perk: "Tailored Curriculum", desc: "Learn what your product requires." },
                    { perk: "System Auditing", desc: "Configure databases & API nodes." }
                  ].map((p, i) => (
                    <div key={i} className="bg-white border border-[#c2c6d6]/15 rounded-xl p-3 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                      <h5 className="text-[11px] font-bold text-[#0b1c30] mb-0.5">{p.perk}</h5>
                      <p className="text-[9px] text-[#424754] font-medium leading-normal">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                to="/collaborate" 
                onClick={() => handlePathwayClick("1-on-1 Mentorship")}
                className="w-full inline-flex items-center justify-center bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Explore Mentorship <ArrowUpRight size={14} className="ml-2" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5b. BLOG & INSIGHTS */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-left mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424754] flex items-center gap-1.5 bg-[#eff4ff] px-4 py-1.5 rounded-full shadow-sm w-fit">
                <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full"></span>
                KNOWLEDGE BASE
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] tracking-tighter leading-tight">
                Insights &amp; Chronicle Logs
              </h2>
              <p className="text-base text-[#424754] font-medium leading-relaxed">
                Reflections on systems design, prompt engineering strategies, and building development workflows in public.
              </p>
            </div>
            <Link className="bg-[#0b1c30] text-[#d1f34d] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#0b1c30]/90 transition-colors" to="/blog">
              VIEW ALL LOGS <ArrowUpRight size={14} />
            </Link>
          </div>

          {loadingBlogs ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-[32px] border border-[#dce9ff] shadow-sm">
              <div className="w-8 h-8 border-2 border-[#0058be]/20 border-t-[#0058be] rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Querying logs...</span>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <Link to={`/blog/${b.slug}`} key={b.id} className="relative group aspect-[4/5] rounded-[32px] overflow-hidden cursor-pointer block border border-[#dce9ff] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                  <img src={b.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"} alt={b.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/90 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-[#000000] shadow-sm">
                      {b.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 z-20 text-left w-full">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      {new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <h3 className="text-white text-xl md:text-2xl font-bold leading-tight line-clamp-2">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-[#c2c6d6] bg-white rounded-[32px] text-center text-gray-400 text-sm">
              No insights published yet. Write them inside the admin workspace.
            </div>
          )}
        </div>
      </section>

      {/* 6. WORK TOGETHER */}
      <section ref={workTogetherSectionRef} className="bg-[#f8f9ff] py-24 px-6 md:px-12 lg:px-24 text-left border-t border-b border-gray-100 mt-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Content and story */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Eyebrow Label */}
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
                STUDIO
              </span>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] mb-6 max-w-2xl">
                Need Help Bringing An Idea To Life?
              </h2>

              {/* Description */}
              <p className="text-base text-[#424754] font-medium leading-relaxed max-w-[650px] mb-8">
                Sometimes learning isn't enough. Sometimes you need help implementing. Partner directly with a builder who helps turn ideas into execution.
              </p>

              {/* Collaboration Areas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[650px] mb-8">
                {[
                  { title: "Website Development", description: "Build high-performance, conversion-optimized Next.js web applications tailored to your product pipeline." },
                  { title: "AI Agent Integration", description: "Integrate autonomous LLM agent systems, custom prompts, and intelligent interfaces directly into your code." },
                  { title: "API Automation", description: "Connect software layers, configure webhook triggers, and automate Make.com scenarios that run without downtime." },
                  { title: "Digital Systems", description: "Deploy secure database schemas, operational checklists, and custom business pipelines." },
                  { title: "Content Platforms", description: "Launch modular markdown chronicle logs, SEO blogs, and searchable documentation repositories." },
                  { title: "Technical Projects", description: "Establish technical roadmaps, audit codebase health, and refine workspace prompt rules." }
                ].map((card, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleCardClick(card.title, index + 1)}
                    className="collaboration-grid-card p-5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full"></span>
                        {card.title}
                      </h4>
                      <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Area */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-[650px] mb-12">
                <Link 
                  to="/collaborate" 
                  onClick={() => trackEvent('work_together_cta_click')}
                  className="pathway-cta-dark-lime px-8 py-4 text-xs font-bold uppercase tracking-widest shadow-md inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Start a Project
                </Link>
                <Link 
                  to="/collaborate" 
                  onClick={() => trackEvent('discussion_cta_click')}
                  className="bg-transparent hover:bg-gray-50 border border-[#c2c6d6]/30 text-[#0b1c30] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Work With Me
                </Link>
              </div>

              {/* Answer Engine Optimization (AEO) Block */}
              <div className="p-6 bg-white border border-[#dce9ff] rounded-[24px] w-full max-w-[650px] text-xs text-[#424754] font-medium space-y-4 shadow-sm">
                <div>
                  <h4 className="font-bold text-[#0b1c30] mb-1">Who is direct collaboration for?</h4>
                  <p className="font-semibold">Founders, creators, builders, students, and small businesses who want to speed up development and deploy production systems without the typical trial-and-error.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1c30] mb-1">What can we build together?</h4>
                  <p className="font-semibold">Custom Next.js websites, autonomous LLM workflows, Make.com webhook integrations, database setups, and online business infrastructures.</p>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Native UI component (Build -> Launch -> Grow sequence) */}
            <div className="lg:col-span-5 w-full flex flex-col gap-6 relative mt-12 lg:mt-0 lg:pt-16">
              {/* Step 1: Build */}
              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">01 / BUILD</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Architect &amp; Develop</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Set up clean Next.js sitemaps, type-safe database schemas, and structured Cursor AI rule configs.
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="w-[2px] h-8 bg-[#d1f34d] ml-12 hidden lg:block"></div>

              {/* Step 2: Launch */}
              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">02 / LAUNCH</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Deploy &amp; Connect</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Configure serverless hosting pipelines, secure API integrations, and automate background Make.com scenario playbooks.
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="w-[2px] h-8 bg-[#d1f34d] ml-12 hidden lg:block"></div>

              {/* Step 3: Grow */}
              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">03 / GROW</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Scale &amp; Optimize</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Deploy structural website SEO indexing, page-speed benchmarks, and automated event log tracking.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <BlueprintsFAQ />

      {/* 8. FINAL CTA */}
      <section className="relative py-28 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col items-center justify-center text-center bg-[#0058be]">
        <div className="absolute inset-0 z-0">
          <img alt="Abstract blue sky" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyop126N11UAjOsPzja9sW7udDguWvdt7SgpzXlhhICDnpKElodTnj8nf7IFCVeYBs6-AIo12dFm8hkni0FG_IMVoaBVY5Sjb7xn6y1eh4uwfSZ7bQKOuW9FuWne9PHqlfOw9LJWWXv_jRoBzXcvtiJv4lfRMPbm7vhkNkS358bE5pnDALyPv7_fIk_Kv_EeRjdJJaVknRDOLjzS95YBUadNKHNideBgvCDHq_K_PGz-xxT3UlarmW9Hhe4RZ1X-zWhrkysUgVj-w" />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 flex items-center gap-1.5 mb-8 bg-black/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-ping"></span>
            NEXT LEVEL
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white tracking-tighter leading-tight max-w-4xl mb-6 text-center">
            Turn Your Next Idea <br /> Into Production Reality
          </h2>
          
          <p className="text-sm md:text-base text-white/90 max-w-xl mb-12 text-center font-semibold leading-relaxed">
            Whether you require ready-to-use boilerplate blueprints, academy modules, or direct implementation support, choose the pathway to construct faster.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch mb-16 text-left">
            {/* Box 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/15 transition-all duration-300">
              <div>
                <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-tight">Registry Blueprints</h3>
                <p className="text-xs text-white/85 leading-relaxed font-semibold mb-8">Download Cursor rules settings, sitemap checklists, and boilerplate directories.</p>
              </div>
              <Link to="/blueprints" className="w-full inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#d1f34d] transition-colors">
                Browse Blueprints
              </Link>
            </div>

            {/* Box 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/15 transition-all duration-300">
              <div>
                <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-tight">Mastery Ecosystem</h3>
                <p className="text-xs text-white/85 leading-relaxed font-semibold mb-8">Acquire modular code structures, prompt guides, and database designs.</p>
              </div>
              <Link to="/mastery" className="w-full inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#d1f34d] transition-colors">
                Explore Mastery
              </Link>
            </div>

            {/* Box 3 */}
            <div className="bg-[#0b1c30] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl pointer-events-none"></div>
              <div>
                <h3 className="text-xl font-extrabold text-[#d1f34d] mb-2 uppercase tracking-tight">Studio</h3>
                <p className="text-xs text-white/90 leading-relaxed font-semibold mb-8">Partner to compile roadmap metrics, setup API webhooks, and build SaaS products.</p>
              </div>
              <Link to="/collaborate" className="w-full inline-flex items-center justify-center bg-[#d1f34d] text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default HomePage;
