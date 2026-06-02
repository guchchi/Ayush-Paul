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
        const lesson = lessonsList.find((l) => l.id === lessonId);
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
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-gray-400">Booting lesson streaming server...</span>
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const isCompleted = enrollment?.progress?.includes(currentLesson.id);
  const videoEmbed = getEmbedUrl(currentLesson.videoUrl);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#111111] pt-24 flex flex-col selection:bg-blue-600/10 selection:text-blue-600">
      {/* Top Navbar */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/academy/courses/${courseId}`)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Syllabus
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <h2 className="text-sm font-bold text-black line-clamp-1">{course.title}</h2>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Main Lesson Content */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl mx-auto space-y-8 w-full text-left">
          {/* Video Player */}
          {videoEmbed ? (
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-black">
              <iframe
                src={videoEmbed}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-3xl border border-gray-200 bg-white flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <Play size={48} className="text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-black mb-2">No Video Available</h3>
              <p className="text-gray-400 text-sm max-w-xs">This lesson contains documentation and downloadable blueprints below.</p>
            </div>
          )}

          {/* Lesson Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">
                {currentLesson.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2">{currentLesson.description}</p>
            </div>

            {enrollment && (
              <button
                onClick={handleToggleComplete}
                className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shadow-sm ${
                  isCompleted
                    ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-500/30 hover:text-blue-600"
                }`}
              >
                <CheckCircle size={16} />
                {isCompleted ? "Completed" : "Mark as Complete"}
              </button>
            )}
          </div>

          {/* Downloadable Resources */}
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black">Lesson Blueprints &amp; Configs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentLesson.resources.map((res: any, idx: number) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between items-center p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-500/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <BookOpen size={16} />
                      </div>
                      <span className="text-sm font-bold text-black">{res.title}</span>
                    </div>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Syllabus Navigation */}
        <div
          className={`lg:w-80 w-full bg-white border-l border-gray-200 flex flex-col absolute lg:static inset-y-0 right-0 z-30 lg:z-10 transition-transform duration-300 transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-200 text-left">
            <h3 className="font-bold text-black">Course Curriculum</h3>
            <p className="text-xs text-gray-400 mt-1">Jump to any module or lesson</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
            {modules.map((mod) => {
              const moduleLessons = lessons.filter((les) => les.moduleId === mod.id);
              return (
                <div key={mod.id} className="space-y-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                    Mod {mod.order}: {mod.title}
                  </div>

                  <div className="space-y-2">
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
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? "bg-blue-600/5 border-blue-500/20 text-blue-600 font-bold"
                              : isAccessible
                              ? "bg-transparent border-transparent hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer"
                              : "bg-transparent border-transparent text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <div className="shrink-0">
                            {isLesCompleted ? (
                              <CheckCircle size={14} className="text-green-500" />
                            ) : !isAccessible ? (
                              <Lock size={12} className="text-gray-300" />
                            ) : (
                              <Play size={12} className={isSelected ? "text-blue-600" : "text-gray-400"} />
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
