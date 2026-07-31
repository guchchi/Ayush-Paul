import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Award, CheckCircle, Play, ChevronRight, Lock, ArrowLeft, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { auth, db, doc, getDoc, getDocs, collection, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { AuthModal } from "../components/ui/AuthModal";
import { MagneticButton } from "../components/ui/MagneticButton";
import { BackButton } from "../components/ui/back-button";

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        // 1. Fetch course details
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (!courseDoc.exists()) {
          navigate("/mastery");
          return;
        }
        setCourse({ id: courseDoc.id, ...courseDoc.data() });

        // 2. Fetch modules
        const modSnap = await getDocs(
          query(collection(db, "modules"), where("courseId", "==", courseId))
        );
        const modulesList = modSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setModules(modulesList);

        // 3. Fetch lessons
        const lesSnap = await getDocs(
          query(collection(db, "lessons"), where("courseId", "==", courseId))
        );
        const lessonsList = lesSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setLessons(lessonsList);

        // 4. Fetch user enrollment
        if (auth.currentUser) {
          const enrollSnap = await getDocs(
            query(
              collection(db, "enrollments"),
              where("userId", "==", auth.currentUser.uid),
              where("courseId", "==", courseId)
            )
          );
          if (!enrollSnap.empty) {
            setEnrollment({ id: enrollSnap.docs[0].id, ...enrollSnap.docs[0].data() });
          }
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  // Sync enrollment if user authenticates via modal
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser && courseId) {
        try {
          const enrollSnap = await getDocs(
            query(
              collection(db, "enrollments"),
              where("userId", "==", currentUser.uid),
              where("courseId", "==", courseId)
            )
          );
          if (!enrollSnap.empty) {
            setEnrollment({ id: enrollSnap.docs[0].id, ...enrollSnap.docs[0].data() });
          }
        } catch (err) {
          console.error("Failed to sync enrollment on login change:", err);
        }
      } else {
        setEnrollment(null);
      }
    });
    return () => unsubscribe();
  }, [courseId]);

  const canonical = getCanonicalUrl(`/mastery/courses/${courseId}`);

  useSEO({
    title: course ? `${course.title} | Ayush Paul Academy` : "Course Details | Academy",
    description: course ? course.description : "Academy course syllabus and progress tracker.",
    url: canonical,
    schema: course ? [
      {
        "@type": "Course",
        "@id": `${canonical}#course`,
        "name": course.title,
        "description": course.description,
        "provider": {
          "@id": `${getCanonicalUrl()}/#organization`
        },
        "url": canonical,
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "instructor": {
            "@type": "Person",
            "name": "Ayush Paul"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": getCanonicalUrl()
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Academy",
            "item": getCanonicalUrl("/mastery")
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": course.title,
            "item": canonical
          }
        ]
      }
    ] : null
  });

  const handleEnroll = async () => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const enrollmentRef = collection(db, "enrollments");
      const newEnrollData = {
        userId: auth.currentUser.uid,
        courseId,
        progress: [],
        completed: false,
        enrolledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(enrollmentRef, newEnrollData);
      setEnrollment({ id: docRef.id, ...newEnrollData });
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!enrollment || lessons.length === 0) return 0;
    const completedCount = enrollment.progress?.length || 0;
    return Math.round((completedCount / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center space-y-4 text-[#0b1c30]">
        <div className="w-6 h-6 border-2 border-[#0058be]/20 border-t-[#0058be] rounded-full animate-spin" />
        <span className="text-[10px] font-semibold text-[#424754]/50 tracking-wider font-bold">Loading course curriculum...</span>
      </div>
    );
  }

  if (!course) return null;

  const progressPercent = calculateProgress();

  return (
    <div className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-24 pb-24 px-6 relative overflow-hidden text-left">
      
      {/* Background Soft Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,28,48,0.02)_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton to="/mastery" label="Back to Courses" />
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-[32px] border border-[#c2c6d6]/30 p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be] shrink-0">
            <BookOpen size={28} />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#0058be] border border-[#dce9ff] text-[9px] font-bold uppercase tracking-wider shadow-sm">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#424754] border border-[#c2c6d6]/35 text-[9px] font-bold uppercase tracking-wider shadow-sm font-semibold">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-[#424754] text-xs leading-relaxed font-semibold">{course.description}</p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {enrollment ? (
              <div className="bg-[#eff4ff] rounded-2xl border border-[#dce9ff] p-4 space-y-2.5 w-full md:w-56 shadow-sm">
                <div className="flex justify-between items-center gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be]/75">Your Progress</span>
                  <span className="text-xs font-bold text-[#0b1c30]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0058be] h-full transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <MagneticButton>
                <button
                  onClick={handleEnroll}
                  className="w-full md:w-auto px-6 py-3 bg-[#0b1c30] text-white hover:bg-[#0058be] font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer h-11"
                >
                  Enroll in Course
                </button>
              </MagneticButton>
            )}
          </div>
        </div>

        {/* Syllabus / Module List */}
        <div className="space-y-8">
          <h2 className="text-xl font-extrabold text-[#0b1c30] border-b border-[#c2c6d6]/20 pb-3 tracking-tight">
            Course Curriculum
          </h2>

          {modules.length > 0 ? (
            modules.map((mod) => {
              const moduleLessons = lessons.filter((les) => les.moduleId === mod.id);
              return (
                <div key={mod.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#0058be] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#dce9ff] shadow-sm">
                      Module {mod.order}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight">{mod.title}</h3>
                  </div>

                  <div className="space-y-3 pl-2">
                    {moduleLessons.filter(l => l.title && !l.title.startsWith('[Coming Soon]')).length > 0 ? (
                      moduleLessons.map((les) => {
                        const isEnrolled = !!enrollment;
                        const isCompleted = enrollment?.progress?.includes(les.id);
                        const isAccessible = isEnrolled || les.isFree;
                        const isEmptyLesson = !les.videoUrl && (!les.content || les.content.trim() === '') && (!les.resources || les.resources.length === 0);

                        if (isEmptyLesson) {
                          return (
                            <div
                              key={les.id}
                              className="flex justify-between items-center p-5 bg-white border border-[#c2c6d6]/10 rounded-2xl opacity-60"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-[#fff8e1] flex items-center justify-center text-[#f57f17] shrink-0 border border-[#ffe082]">
                                  <Clock size={12} />
                                </div>
                                <div className="text-left">
                                  <h4 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">{les.title}</h4>
                                  <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f57f17]">
                                    <Sparkles size={9} /> Coming Soon
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={les.id}
                            onClick={() => {
                              if (isAccessible) {
                                navigate(`/mastery/courses/${courseId}/lessons/${les.id}`);
                              } else {
                                alert("Please enroll in the course to unlock this lesson.");
                              }
                            }}
                            className={`flex justify-between items-center p-5 bg-white border rounded-2xl transition-all shadow-sm ${
                              isAccessible
                                ? "border-[#c2c6d6]/30 hover:border-[#adc6ff] hover:shadow-ambient hover:scale-[1.005] cursor-pointer"
                                : "border-[#c2c6d6]/10 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] shrink-0 border border-[#dce9ff]">
                                {isCompleted ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : !isAccessible ? (
                                  <Lock size={12} className="text-[#424754]/40" />
                                ) : (
                                  <Play size={12} className="text-[#0058be]" />
                                )}
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">{les.title}</h4>
                                <p className="text-[#424754] text-xs mt-0.5 line-clamp-1 font-semibold">
                                  {les.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {les.isFree && !isEnrolled && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f0fdf4] border border-[#bde84c] text-[#131f00] text-[8px] font-bold uppercase tracking-wider">
                                  Free Preview
                                </span>
                              )}
                              {isAccessible && <ChevronRight size={14} className="text-[#c2c6d6]" />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 bg-white border border-dashed border-[#ffe082] rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#fff8e1] flex items-center justify-center text-[#f57f17] shrink-0 border border-[#ffe082]">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">Lessons Coming Soon</h4>
                          <p className="text-[#424754] text-[11px] font-medium mt-0.5">
                            This module is in production. Lessons are being recorded and will appear here once published.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border border-dashed border-[#ffe082] rounded-2xl bg-white text-[#424754]/70 text-xs shadow-sm font-semibold flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff8e1] flex items-center justify-center border border-[#ffe082]">
                <Sparkles size={16} className="text-[#f57f17]" />
              </div>
              <span className="font-extrabold text-sm text-[#0b1c30]">Curriculum in Production</span>
              <span className="text-[#424754]/60">Modules and lessons are being structured. Check back soon.</span>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default CourseDetailPage;
