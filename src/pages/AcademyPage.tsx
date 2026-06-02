import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Award, PlayCircle, Search, ShieldCheck } from "lucide-react";
import { auth, db, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";

export const AcademyPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load courses
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useSEO({
    title: "Ayush Paul Academy | Elite Education Hub",
    description: "Learn web engineering, SaaS bootstrapping, advanced automation, and AI workflows through structured, project-based video courses.",
    keywords: "Ayush Paul, Courses, React, Next.js, Make.com, Automation, AI Engineering, Bootstrapping SaaS",
    url: getCanonicalUrl("/academy"),
  });

  const handleEnroll = async (courseId: string) => {
    if (!auth.currentUser) {
      alert("Please sign in or go to dashboard to authenticate before enrolling.");
      navigate("/dashboard");
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
      }
      navigate(`/academy/courses/${courseId}`);
    } catch (err) {
      console.error("Failed to enroll user:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#111111] pt-32 pb-24 px-6 md:px-12 selection:bg-brand-primary/20 selection:text-brand-primary">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-semibold uppercase tracking-wider mb-8">
            <Award size={14} /> Academy Learning Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-black">
            Ayush Paul <span className="text-blue-600">Academy.</span>
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Acquire developer skills that produce returns. Build SaaS boilerplates, structure high-performance web systems, and automate operational workflows.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white border-gray-200 text-gray-400 hover:text-black hover:border-gray-300"
                }`}
              >
                {cat === "all" ? "All Courses" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search academy catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full text-sm text-black outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* Courses Listing Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-400 tracking-wider">Synchronizing classrooms...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-50">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <BookOpen size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 border border-gray-100 text-black text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {c.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">
                    {c.category}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-black leading-snug">{c.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{c.description}</p>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <ShieldCheck size={14} className="text-blue-500" />
                      <span>{c.instructor}</span>
                    </div>

                    {userEnrollments[c.id] ? (
                      <button
                        onClick={() => navigate(`/academy/courses/${c.id}`)}
                        className="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-full hover:bg-black transition-colors flex items-center gap-1.5"
                      >
                        <PlayCircle size={14} /> Resume Course
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(c.id)}
                        className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-gray-200 bg-white rounded-[32px]">
            <BookOpen size={40} className="text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-black mb-2">No Courses Found</h3>
            <p className="text-gray-500 text-sm max-w-sm">The queried parameters did not match any currently active academy courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};
