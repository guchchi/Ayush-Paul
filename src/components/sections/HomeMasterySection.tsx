import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowUpRight, Code } from "lucide-react";
import { db, collection, query, getDocs, where, addDoc, serverTimestamp } from "../../firebase";
import { useAnalytics } from "../../hooks/useAnalytics";
import { Workshop } from "../../types";

interface HomeMasterySectionProps {
  courses: any[];
  coursesCount: number;
  loadingCourses: boolean;
  workshops: Workshop[];
  loadingWorkshops: boolean;
}

export const HomeMasterySection = ({ courses, coursesCount, loadingCourses, workshops, loadingWorkshops }: HomeMasterySectionProps) => {
  const { trackEvent } = useAnalytics();

  const [courseWaitlistEmail, setCourseWaitlistEmail] = useState("");
  const [courseWaitlistStatus, setCourseWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [courseWaitlistError, setCourseWaitlistError] = useState("");

  const [workshopWaitlistEmail, setWorkshopWaitlistEmail] = useState("");
  const [workshopWaitlistStatus, setWorkshopWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [workshopWaitlistError, setWorkshopWaitlistError] = useState("");

  const handlePathwayClick = (formatName: string) => {
    trackEvent("learn_pathway_click", { format: formatName });
  };

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

  return (
    <>
      <style>{`
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

      <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-left mt-0">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Main Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block">
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
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0b1c30] shadow-sm">
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
                        to={`/mastery/courses/${course.id}`}
                        onClick={() => handlePathwayClick(`Course: ${course.title}`)}
                        className="group bg-white border border-[#c2c6d6]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-[#d1f34d] hover:shadow-md transition-all hover:-translate-y-0.5 duration-300"
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
              {loadingWorkshops ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-6 h-6 border-2 border-[#0b1c30]/20 border-t-[#0b1c30] rounded-full animate-spin" />
                  <span className="text-xs text-gray-400">Loading workshops...</span>
                </div>
              ) : workshops.length > 0 ? (
                <>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="step-number-pill shrink-0">02 / PRACTICE</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                        Live Workshops
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0b1c30] mb-3">Upcoming Live Workshops</h3>
                    <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                      Interactive sessions, implementation walkthroughs, and Q&A events.
                    </p>
                    <div className="flex flex-col gap-3 mb-8">
                      {workshops.slice(0, 2).map((workshop) => (
                        <div key={workshop.id} className="flex items-start gap-3 bg-white border border-[#c2c6d6]/15 rounded-2xl p-4 hover:border-[#d1f34d] hover:shadow-sm transition-all duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[#0b1c30] text-xs shrink-0">
                            {workshop.category?.slice(0, 2).toUpperCase() || "WS"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-extrabold text-[#0b1c30] mb-0.5">{workshop.title}</h4>
                            <p className="text-[10px] text-[#424754] font-medium line-clamp-1">{workshop.topic || workshop.description}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-[#424754]/60">
                              <span>{workshop.date}</span>
                              {workshop.duration ? <><span className="w-0.5 h-0.5 bg-[#c2c6d6] rounded-full"></span><span>{workshop.duration}</span></> : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link 
                    to="/mastery" 
                    onClick={() => handlePathwayClick("Live Workshops")}
                    className="w-full inline-flex items-center justify-center bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    View All Workshops <ArrowRight size={14} className="ml-2" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="step-number-pill shrink-0">02 / PRACTICE</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                        Live Workshops
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0b1c30] mb-3">Upcoming Live Workshops</h3>
                    <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                      Interactive sessions, implementation walkthroughs, and Q&A events will be announced here. Join the waitlist to get notified.
                    </p>
                  </div>
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
                </>
              )}
            </div>

            {/* Row 2, Card 2: 1-on-1 Mentorship (Secondary - Spans 6 columns) */}
            <div className="col-span-12 md:col-span-6 bg-gray-50/50 border border-[#c2c6d6]/35 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col justify-between hover:border-[#d1f34d] transition-all duration-300">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="step-number-pill shrink-0">03 / GET GUIDANCE</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/20 text-[9px] font-extrabold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                    Direct Guidance
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0b1c30] mb-3">1-on-1 Mentorship</h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                  Work directly with Ayush to configure webhook databases, write custom LLM prompts, and review codebase architectures. Suitable for builders seeking guidance beyond recorded content.
                </p>

                {/* Mentorship availability */}
                <div className="bg-white border border-[#c2c6d6]/15 rounded-xl p-4 mb-8 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                  <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                    Mentorship is available through the Studio. Reach out directly to discuss architecture reviews, code audits, and guided implementation for your project.
                  </p>
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
    </>
  );
};
