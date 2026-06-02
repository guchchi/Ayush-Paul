import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Code,
  Settings,
  ArrowRight,
  BookOpen,
  Layers,
  CheckCircle2,
  User,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { getPublishedProducts } from "../lib/product-utils";
import { getDynamicBlogs, BlogPost } from "../lib/blog-utils";
import { db, collection, query, orderBy, limit, getDocs } from "../firebase";
import { Product } from "../types";
import { WaitlistForm } from "../components/ui/WaitlistForm";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingMilestones, setLoadingMilestones] = useState(true);

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
        const updatesSnap = await getDocs(
          query(collection(db, "updates"), orderBy("date", "desc"), limit(4))
        );
        setMilestones(updatesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Failed to load milestones:", e);
      } finally {
        setLoadingMilestones(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="w-full bg-[#FAFAFA] text-[#111111] min-h-screen selection:bg-blue-600/10 selection:text-blue-600">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center py-24 px-6 border-b border-gray-200 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.02),transparent_70%)]">
        <div className="max-w-5xl w-full mx-auto text-center flex flex-col items-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Active Ecosystem Builder</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-tight leading-[0.95] text-black"
          >
            Build Scalable <br />
            <span className="text-blue-600">Digital Engines.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Blueprints, step-by-step video courses, and technical configurations designed to accelerate development, improve SEO, and build automated growth workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 pt-6"
          >
            <Link
              to="/systems"
              className="px-8 h-12 inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all"
            >
              Unlock Blueprints <ArrowRight size={14} className="ml-2" />
            </Link>
            <Link
              to="/academy"
              className="px-8 h-12 inline-flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-600/30 hover:text-blue-600 font-extrabold text-xs uppercase tracking-wider transition-all bg-white text-black"
            >
              Explore Academy
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR PATH (Journey Map) */}
      <section className="py-24 px-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Journey Map</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">Choose Your Path</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Unlock different tiers of the ecosystem framework based on your current operational objectives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Learn */}
            <Link
              to="/academy"
              className="p-8 md:p-10 rounded-[32px] border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-600/30 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-8">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black group-hover:text-blue-600 transition-colors">1. Learn Frameworks</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Master Next.js development, advanced automation scenario builds, and technical SEO structure through structured, project-based video courses.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1 mt-auto">
                Visit Academy <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Build */}
            <Link
              to="/systems"
              className="p-8 md:p-10 rounded-[32px] border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-600/30 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-8">
                <Layers size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black group-hover:text-blue-600 transition-colors">2. Browse Blueprints</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Download ready-to-run website code bases, custom Cursor AI configs, crawl checklists, and Make.com automation blueprints.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1 mt-auto">
                Explore Registry <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Partner */}
            <Link
              to="/collaborate"
              className="p-8 md:p-10 rounded-[32px] border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-600/30 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-8">
                <Cpu size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black group-hover:text-blue-600 transition-colors">3. Partner Together</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Let's scope out growth systems, automated SaaS integrations, prompt alignment frameworks, or custom MVP implementations together.
              </p>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1 mt-auto">
                Partner with Ayush <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BLUEPRINTS (Ecosystem Products) */}
      <section className="py-24 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Blueprint Registry</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">Featured Blueprints</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed">
                Production-ready boilerplates, automation templates, and checklists to bypass bootstrap friction.
              </p>
            </div>
            <Link
              to="/systems"
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              All Blueprints <ArrowRight size={14} />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-blue-600/25 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Loading blueprints...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((p) => (
                <Link
                  to={`/systems/${p.slug}`}
                  key={p.id}
                  className="group flex flex-col rounded-[32px] border border-gray-200 hover:border-blue-600/30 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="aspect-video bg-gray-50 relative overflow-hidden">
                    <img
                      src={p.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-black shadow-sm">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 text-left">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors leading-snug mb-3 text-black">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                        {p.type === "paid" ? `Premium Tier` : "Free Access"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                        Get Blueprint <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-dashed border-gray-200 bg-white rounded-[32px] text-center text-gray-400 text-sm">
              No blueprints deployed yet. Create records inside the dashboard.
            </div>
          )}
        </div>
      </section>

      {/* 4. LATEST BLOG ARTICLES */}
      <section className="py-24 px-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Knowledge Feed</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">Engineering Insights</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed">
                Reflections on systems design, AI tooling architectures, and building products in public.
              </p>
            </div>
            <Link
              to="/blog"
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              All Articles <ArrowRight size={14} />
            </Link>
          </div>

          {loadingBlogs ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-blue-600/25 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Loading curriculum logs...</span>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <Link
                  to={`/blog/${b.slug}`}
                  key={b.id}
                  className="group flex flex-col rounded-[32px] border border-gray-200 hover:border-blue-600/30 bg-gray-50/50 hover:bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="aspect-video bg-gray-50 relative overflow-hidden">
                    <img
                      src={b.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-black shadow-sm">
                        {b.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 text-left">
                    <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <span>
                        {new Date(b.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>By {b.author}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors leading-snug mb-3 line-clamp-2 text-black">
                      {b.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {b.description || b.excerpt}
                    </p>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 flex items-center gap-1 mt-auto">
                      Read Guide <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-dashed border-gray-200 bg-white rounded-[32px] text-center text-gray-400 text-sm">
              No guides written yet. Publish blogs from your admin workspace.
            </div>
          )}
        </div>
      </section>

      {/* 5. BUILDING IN PUBLIC (Milestones Console) */}
      <section className="py-24 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 text-left">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Live Sprints
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">Building in Public</h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Real-time deployment updates, development sprints, and architecture updates logs.
              </p>
            </div>
            <Link
              to="/milestones"
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1.5 shrink-0 transition-colors"
            >
              Full Console Logs <ArrowRight size={14} />
            </Link>
          </div>

          {loadingMilestones ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-blue-600/25 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Syncing timeline logs...</span>
            </div>
          ) : milestones.length > 0 ? (
            <div className="space-y-4 text-left">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-blue-600/20 transition-all"
                >
                  <div className="flex items-start md:items-center gap-6 flex-1">
                    <div className="hidden md:block w-24 text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
                      {milestone.date}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
                            milestone.statusTag === "Shipped"
                              ? "text-green-600 border-green-200 bg-green-50"
                              : milestone.statusTag === "Building"
                              ? "text-blue-600 border-blue-200 bg-blue-50"
                              : "text-gray-500 border-gray-200 bg-gray-50"
                          }`}
                        >
                          {milestone.statusTag || "LOG"}
                        </span>
                        <h4 className="text-base font-extrabold text-black">{milestone.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 leading-normal">{milestone.text}</p>
                    </div>
                  </div>
                  {milestone.relatedProject && (
                    <span className="shrink-0 px-3.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      {milestone.relatedProject}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-dashed border-gray-200 bg-white rounded-[32px] text-center text-gray-400 text-sm">
              Console backlog empty. Submit updates in your Creator Studio.
            </div>
          )}
        </div>
      </section>

      {/* 6. ABOUT AYUSH */}
      <section className="py-24 px-6 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center text-left">
          <div className="w-36 h-36 sm:w-48 sm:h-48 shrink-0 rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center">
            <img
              src="/founder.png"
              alt="Ayush Paul"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML =
                  '<div class="text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
              }}
            />
          </div>

          <div className="flex-1 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Architect</span>
            <h3 className="text-3xl font-extrabold text-black">Hey, I'm Ayush Paul.</h3>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              I am a developer and systems builder. I design dynamic web apps, build structured learning resources, and connect services through reliable automations.
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              My goal is to help other builders, developers, and founders launch platforms with speed and technical authority. All templates, configs, and syllabus modules are engineered with that in mind.
            </p>
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
              >
                Profile &amp; Stack Registry <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SIGN-UP */}
      <section className="py-24 px-6 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Newsletter</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">Subscribe to the Newsletter</h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Get high-signal system logs, Cursor rules configurations, and newly published free blueprints delivered directly to your inbox.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            <WaitlistForm context="home-newsletter" variant="compact" interest="general" />
          </div>
        </div>
      </section>

      {/* 8. COLLABORATE CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-[40px] p-8 md:p-16 text-center text-white space-y-8 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />
            
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Collaboration Engine</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Have a System to Build?</h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Connect directly with Ayush Paul to scope custom MVPs, configure webhook pipelines, or integrate AI prompts.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Link
                to="/collaborate"
                className="px-10 h-14 inline-flex items-center justify-center rounded-2xl bg-white text-gray-900 font-extrabold text-sm uppercase tracking-wider hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-lg"
              >
                Start Collaboration <ArrowRight size={16} className="ml-2 text-blue-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
