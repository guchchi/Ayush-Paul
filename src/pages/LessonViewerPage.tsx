import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, Play, ChevronRight, Lock, ArrowLeft, ExternalLink, Menu, X } from "lucide-react";
import { auth, db, doc, getDoc, getDocs, collection, query, where, updateDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";

export const LessonViewerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!courseId || !lessonId) return;

      try {
        // 1. Load course details
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (!courseDoc.exists()) {
          navigate("/academy");
          return;
        }
        setCourse({ id: courseDoc.id, ...courseDoc.data() });

        // 2. Load modules
        const modSnap = await getDocs(
          query(collection(db, "modules"), where("courseId", "==", courseId))
        );
        const modulesList = modSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setModules(modulesList);

        // 3. Load lessons
        const lesSnap = await getDocs(
          query(collection(db, "lessons"), where("courseId", "==", courseId))
        );
        const lessonsList = lesSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setLessons(lessonsList);

        // 4. Find current lesson
        const lesson = lessonsList.find((l) => l.id === lessonId) as any;
        if (!lesson) {
          navigate(`/academy/courses/${courseId}`);
          return;
        }
        setCurrentLesson(lesson);

        // 5. Load enrollment
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
          } else if (!lesson.isFree) {
            // Not enrolled and not free: reject
            navigate(`/academy/courses/${courseId}`);
            return;
          }
        } else if (!lesson.isFree) {
          // Not authenticated and not free: reject
          navigate(`/academy/courses/${courseId}`);
          return;
        }
      } catch (err) {
        console.error("Failed to load curriculum:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [courseId, lessonId, navigate]);

  useSEO({
    title: currentLesson && course ? `${currentLesson.title} | ${course.title}` : "Lesson Player | Academy",
    description: currentLesson ? currentLesson.description : "Academy interactive lesson workspace.",
    url: getCanonicalUrl(`/academy/courses/${courseId}/lessons/${lessonId}`),
  });

  const handleToggleComplete = async () => {
    if (!enrollment || !currentLesson) return;

    const currentProgress = enrollment.progress || [];
    let updatedProgress: string[];

    if (currentProgress.includes(currentLesson.id)) {
      updatedProgress = currentProgress.filter((id: string) => id !== currentLesson.id);
    } else {
      updatedProgress = [...currentProgress, currentLesson.id];
    }

    try {
      const isCourseCompleted = updatedProgress.length === lessons.length;
      await updateDoc(doc(db, "enrollments", enrollment.id), {
        progress: updatedProgress,
        completed: isCourseCompleted,
        updatedAt: serverTimestamp(),
      });

      setEnrollment((prev: any) => ({
        ...prev,
        progress: updatedProgress,
        completed: isCourseCompleted,
      }));
    } catch (err) {
      console.error("Failed to toggle completion status:", err);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let embedUrl = url;

    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    return embedUrl;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4 text-[#000000]">
        <div className="w-6 h-6 border-2 border-[#0058be]/20 border-t-[#0058be] rounded-full animate-spin" />
        <span className="text-[10px] font-semibold text-[#424754]/40 tracking-wider">Booting lesson streaming server...</span>
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const isCompleted = enrollment?.progress?.includes(currentLesson.id);
  const videoEmbed = getEmbedUrl(currentLesson.videoUrl);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#000000] pt-20 flex flex-col selection:bg-[#0058be]/35 selection:text-white relative overflow-hidden">
      
      {/* Background Soft Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      {/* Top Navbar */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between sticky top-20 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/academy/courses/${courseId}`)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 hover:text-[#000000] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            <ArrowLeft size={14} className="text-[#0058be]" /> Syllabus
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <h2 className="text-xs font-bold text-[#000000] line-clamp-1 uppercase tracking-wider">{course.title}</h2>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-[#f8f9ff] border border-gray-200 hover:bg-gray-50 text-[#000000] transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Main Lesson Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl mx-auto space-y-6 w-full text-left">
          {/* Video Player */}
          {videoEmbed ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm">
              <iframe
                src={videoEmbed}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <Play size={36} className="text-[#0058be] mb-4 animate-pulse" />
              <h3 className="text-sm font-bold text-[#000000] mb-1">No Video Available</h3>
              <p className="text-[#424754] text-xs max-w-xs font-medium">This lesson contains documentation and downloadable blueprints below.</p>
            </div>
          )}

          {/* Lesson Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-200">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#000000] leading-tight">
                {currentLesson.title}
              </h1>
              <p className="text-[#424754] text-xs mt-1.5 font-medium">{currentLesson.description}</p>
            </div>

            {enrollment && (
              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isCompleted
                    ? "bg-green-500/10 border-green-200 text-green-700 hover:bg-green-500/20"
                    : "bg-white border-gray-200 text-[#424754] hover:border-gray-300 hover:text-[#000000]"
                }`}
              >
                <CheckCircle size={14} />
                {isCompleted ? "Completed" : "Mark Complete"}
              </button>
            )}
          </div>

          {/* Downloadable Resources */}
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#424754]/70">Lesson Blueprints &amp; Configs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentLesson.resources.map((res: any, idx: number) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#adc6ff] hover:shadow-md transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#f8f9ff] border border-gray-100 flex items-center justify-center text-[#0058be]">
                        <BookOpen size={14} />
                      </div>
                      <span className="text-xs font-bold text-[#000000]">{res.title}</span>
                    </div>
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Syllabus Navigation */}
        <div
          className={`lg:w-72 w-full bg-white border-l border-gray-200 flex flex-col absolute lg:static inset-y-0 right-0 z-30 lg:z-10 transition-transform duration-300 transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-gray-200 text-left">
            <h3 className="font-bold text-[#000000] text-sm uppercase tracking-wider">Course Syllabus</h3>
            <p className="text-[10px] text-[#424754]/60 mt-0.5 font-medium">Jump to any module or lesson</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-left custom-scrollbar bg-white">
            {modules.map((mod) => {
              const moduleLessons = lessons.filter((les) => les.moduleId === mod.id);
              return (
                <div key={mod.id} className="space-y-2">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#0058be]/75">
                    Mod {mod.order}: {mod.title}
                  </div>

                  <div className="space-y-1">
                    {moduleLessons.map((les) => {
                      const isEnrolled = !!enrollment;
                      const isLesCompleted = enrollment?.progress?.includes(les.id);
                      const isAccessible = isEnrolled || les.isFree;
                      const isSelected = les.id === lessonId;

                      return (
                        <div
                          key={les.id}
                          onClick={() => {
                            if (isAccessible) {
                              navigate(`/academy/courses/${courseId}/lessons/${les.id}`);
                              setSidebarOpen(false);
                            }
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] transition-all ${
                            isSelected
                              ? "bg-[#eff4ff] border-[#dce9ff] text-[#0058be] font-bold"
                              : isAccessible
                              ? "bg-transparent border-transparent hover:bg-gray-50 text-[#424754] font-semibold hover:text-[#000000] cursor-pointer"
                              : "bg-transparent border-transparent text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <div className="shrink-0">
                            {isLesCompleted ? (
                                <CheckCircle size={12} className="text-green-500" />
                            ) : !isAccessible ? (
                              <Lock size={10} className="text-gray-300" />
                            ) : (
                              <Play size={10} className={isSelected ? "text-[#0058be]" : "text-gray-400"} />
                            )}
                          </div>
                          <span className="line-clamp-1">{les.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewerPage;
