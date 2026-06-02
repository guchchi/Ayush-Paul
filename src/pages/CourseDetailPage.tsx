import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Award, CheckCircle, Play, ChevronRight, Lock, ArrowLeft } from "lucide-react";
import { auth, db, doc, getDoc, getDocs, collection, query, where, orderBy, addDoc, serverTimestamp } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        // 1. Fetch course details
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (!courseDoc.exists()) {
          navigate("/academy");
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

  useSEO({
    title: course ? `${course.title} | Ayush Paul Academy` : "Course Details | Academy",
    description: course ? course.description : "Academy course syllabus and progress tracker.",
    url: getCanonicalUrl(`/academy/courses/${courseId}`),
  });

  const handleEnroll = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to enroll in this course.");
      navigate("/dashboard");
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
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-gray-400">Loading course curriculum...</span>
      </div>
    );
  }

  if (!course) return null;

  const progressPercent = calculateProgress();

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#111111] pt-32 pb-24 px-6 md:px-12 selection:bg-blue-600/10 selection:text-blue-600">
      <div className="max-w-4xl mx-auto text-left">
        {/* Back Button */}
        <button
          onClick={() => navigate("/academy")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-[32px] border border-gray-200 p-8 md:p-12 mb-12 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
            <BookOpen size={44} />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-widest">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 text-[10px] font-bold uppercase tracking-widest">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-black leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">{course.description}</p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {enrollment ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-3">
                <div className="flex justify-between items-center gap-8">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Your Progress</span>
                  <span className="text-sm font-extrabold text-black">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-extrabold text-sm rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </div>

        {/* Syllabus / Module List */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-4">
            Course Curriculum
          </h2>

          {modules.length > 0 ? (
            modules.map((mod) => {
              const moduleLessons = lessons.filter((les) => les.moduleId === mod.id);
              return (
                <div key={mod.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Module {mod.order}
                    </span>
                    <h3 className="text-lg font-bold text-black">{mod.title}</h3>
                  </div>

                  <div className="space-y-3 pl-2">
                    {moduleLessons.length > 0 ? (
                      moduleLessons.map((les) => {
                        const isEnrolled = !!enrollment;
                        const isCompleted = enrollment?.progress?.includes(les.id);
                        const isAccessible = isEnrolled || les.isFree;

                        return (
                          <div
                            key={les.id}
                            onClick={() => {
                              if (isAccessible) {
                                navigate(`/academy/courses/${courseId}/lessons/${les.id}`);
                              } else {
                                alert("Please enroll in the course to unlock this lesson.");
                              }
                            }}
                            className={`flex justify-between items-center p-5 bg-white border rounded-2xl transition-all ${
                              isAccessible
                                ? "border-gray-200 hover:border-blue-500/30 hover:shadow-sm cursor-pointer"
                                : "border-gray-100 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                {isCompleted ? (
                                  <CheckCircle size={18} className="text-green-500" />
                                ) : !isAccessible ? (
                                  <Lock size={16} className="text-gray-300" />
                                ) : (
                                  <Play size={16} className="text-blue-500" />
                                )}
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-bold text-black">{les.title}</h4>
                                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                                  {les.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {les.isFree && !isEnrolled && (
                                <span className="px-2.5 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-[9px] font-bold uppercase tracking-wider">
                                  Free Preview
                                </span>
                              )}
                              {isAccessible && <ChevronRight size={16} className="text-gray-300" />}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-400 text-xs italic pl-10">No lessons deployed in this module.</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-[32px] bg-white text-gray-400 text-sm">
              The syllabus is currently being compiled by the instructor. Check back soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
