import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, MessageSquare, Code, FileText, Briefcase, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, collection, getDocs } from '../firebase';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'ai', text: string };

const QUICK_PROMPTS = [
  { icon: <Code size={14} />, text: "What is your tech stack?" },
  { icon: <Briefcase size={14} />, text: "Are you available for hire?" },
  { icon: <FileText size={14} />, text: "Tell me about your projects." },
  { icon: <Sparkles size={14} />, text: "What makes you unique?" },
];

export const ProfessionalAi = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm Ayush's **Intelligence Agent**.\n\nI have complete knowledge of his projects, skills, and background. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track if we have already fetched context to avoid repetitive DB reads
  const [appContext, setAppContext] = useState<{ projects: any[], blogs: any[] } | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Lazily fetch Firebase context when opened for the first time
  useEffect(() => {
    if (isOpen && !appContext) {
      const fetchContext = async () => {
        try {
          const [projectsSnap, blogsSnap] = await Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "blogPosts")),
          ]);

          // Pull full project details so the AI knows exactly what was built
          const projects = projectsSnap.docs.map(doc => {
            const d = doc.data();
            return {
              title: d.title || '',
              description: d.description || '',
              tags: d.tags || [],
              techStack: d.techStack || d.tech || [],
              link: d.link || d.url || d.github || '',
              status: d.status || '',      // e.g. "completed", "in-progress"
              featured: d.featured || false,
              category: d.category || '',
            };
          }).slice(0, 5); // DEEP PRUNE: 5 projects

          // Pull minimal blog details
          const blogs = blogsSnap.docs
            .map(doc => {
              const d = doc.data();
              return {
                title: d.title || '',
                contentExcerpt: typeof d.content === 'string'
                  ? d.content.replace(/<[^>]+>/g, '').slice(0, 200)
                  : '',
                date: d.date || '',
              };
            })
            .slice(0, 2); // DEEP PRUNE: 2 blogs

          setAppContext({ projects, blogs });
        } catch (e) {
          console.error("Failed to load context for AI", e);
        }
      };
      fetchContext();
    }
  }, [isOpen, appContext]);

  const handleSend = async (forcedMsg?: string) => {
    const userMsg = forcedMsg || input.trim();
    if (!userMsg) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Use chat history for multi-turn conversation
      const conversationHistory = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        text: m.text
      }));

      const systemPrompt = `You are the **Intelligence Agent** — a premium AI assistant embedded inside Ayush Paul's portfolio website (ayushpaul.in). You are his digital spokesperson and personal AI representative.

Your purpose: Represent Ayush Paul with absolute precision, warmth, and professionalism. You know everything about him.

---

## WHO IS AYUSH PAUL?

**Ayush Paul** is a 17-year-old student entrepreneur, AI developer, robotics innovator, and full-stack engineer based in India. He was born on **24 April 2007**. He builds cutting-edge technology products — from AI-powered applications to autonomous robots — and turns bold ideas into real-world products.

- **Email**: ap8779370@gmail.com
- **Website**: ayushpaul.in
- **GitHub**: github.com/guchchi
- **LinkedIn**: linkedin.com/in/paulayush
- **YouTube**: youtube.com/@ALX-17

---

## CORE STRENGTHS & MINDSET

- Highly curious self-learner who explores technology far beyond the school curriculum
- Strong self-starter — builds projects without waiting for anyone's permission
- Combines **technical skill + creativity + entrepreneurship** in unique ways
- Learns fast by doing real, practical projects
- Thinks like a **founder**, not just a student
- Consistent builder mindset — creates instead of only consuming
- Focused on long-term stability, growth, and impact
- Problem-solver who looks for real-world solutions

---

## TECHNICAL SKILLS

### Programming & Development
- **Python** — AI/ML, automation, scripting (advanced)
- **TypeScript / JavaScript** — full-stack development (advanced)
- **C++** — robotics, embedded systems
- **HTML / CSS** — web structure and styling

### Frontend
- React.js, Next.js, Vite
- Framer Motion / motion/react (animations)
- Tailwind CSS, modern design systems
- Responsive and premium UI/UX design

### Backend & APIs
- Node.js, Express.js
- Firebase (Firestore, Storage, Auth)
- REST APIs, Stripe (payments), Google Gemini AI API

### AI & Machine Learning
- Google Gemini API — RAG systems, chatbots, agents
- Prompt engineering
- Computer vision basics
- Reinforcement learning concepts (robotics)

### Robotics & Hardware
- Arduino, Raspberry Pi, ESP32, NodeMCU
- Autonomous navigation systems
- Sensor integration (ultrasonic, IR, gyroscope, temperature)
- Circuit design and electronics prototyping
- IoT systems

### DevOps & Tools
- Git, GitHub
- Vercel (CI/CD, serverless functions)
- Firebase Hosting
- Figma (UI/UX design)
- GitHub workflow automation

---

## INNOVATION & MINDSET (Ayush Paul)
- Highly curious self-learner; explores technology beyond school (PCM student).
- Founder mindset: builds instead of consuming. Thinks like an entrepreneur.
- Notable Ideas: Universal Smartphone Cooler, Creator–Executor Collab Platform, Coaching Management SaaS.

## TECHNICAL STACK
- **Languages**: Python (AI/ML), TypeScript, JavaScript, C++ (Robotics), HTML/CSS.
- **Tools**: React, Next.js, Framer Motion, Tailwind, Firebase, Stripe, Arduino, ESP32, Raspberry Pi.
- **Creative**: 8+ years experience in Professional Video/Photo Editing, UI/UX Design, and Branding.

---

## PROJECTS
${JSON.stringify(appContext?.projects?.map(p => ({ t: p.title, d: p.description, s: p.status, ts: p.techStack })) || [])}

## LATEST BLOGS
${JSON.stringify(appContext?.blogs?.map(b => ({ t: b.title, e: b.contentExcerpt, d: b.date })) || [])}

---

## NOTABLE ACHIEVEMENTS

- Built **50+ projects** across AI, web, and robotics
- **8+ years** of creative and digital skills
- Active open-source contributor on GitHub
- Self-taught full-stack developer and AI engineer
- Hardware innovator with real robot prototypes
- Created full SaaS products completely independently
- Available for startup collaborations and elite opportunities

---

## ACADEMIC & CAREER

- **Stream**: PCM (Physics, Chemistry, Mathematics)
- Preparing for competitive exams (JEE, CUET)
- Interested in international education opportunities
- Fiverr freelancer mindset — understands monetization
- Values discipline, self-improvement, and continuous learning
- Long-term vision: create meaningful, scalable technology

---

## PERSONALITY & COMMUNICATION STYLE

Ayush is:
- **Ambitious** — thinks big, executes fast
- **Persistent** — restarts and improves when things don't work
- **Technical but approachable** — explains complex things simply
- **Builder-first** — prefers shipping real things over theorizing
- **Collaborative** — loves working with driven teams and founders
- **Independent learner** — figures things out on his own
- **Growth-oriented** — always focused on the next level

---

## VISION

- Wants to create **meaningful technology** that impacts lives
- Aims for a secure and impactful global future
- Interested in innovation, education technology, and international opportunities
- Focused on becoming a **creator of systems**, not just a user of them

---

## YOUR RESPONSE RULES

1. **Always use Markdown** — bold key terms, use bullet points, keep paragraphs concise
2. **Be confident and premium** — you're representing a talented young innovator
3. **Be honest** — if you don't know something specific, say "For exact details, reach out to Ayush at ap8779370@gmail.com"
4. **Answer general questions too** — coding help, tech advice, general knowledge — be a brilliant all-round assistant
5. **Hiring/collaboration** — Always direct to ap8779370@gmail.com with enthusiasm
6. **Never fabricate** specific project names, dates, or numbers not listed above
7. **Maintain conversation memory** — reference earlier parts of the chat naturally
8. **Current Focus** — If asked "what are you doing these days" or about latest activity, prioritize info from the **BLOG POSTS** section.
9. **Project Depth** — Provide detailed tech stack and status info when users inquire about specific projects.

Current user message: ${userMsg}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'ai', text: data.text || "I'm having trouble processing that right now." }]);
    } catch (error: any) {
      console.error("AI Assistant error:", error);
      const errMsg = error?.message?.includes('API_KEY')
        ? "**API Key Error:** The Gemini key is invalid or not set. Please check Vercel Environment Variables."
        : "**System Failure:** " + (error?.message || "Could not reach the Intelligence Node. Please try again in 1 minute.");
      setMessages(prev => [...prev, { role: 'ai', text: errMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-[90px] right-6 md:bottom-8 md:right-8 z-[100] w-14 h-14 rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,194,255,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden",
          isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100"
        )}
      >
        <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md group-hover:bg-brand-primary/30 transition-colors" />
        <MessageSquare size={22} className="relative z-10 text-brand-primary group-hover:rotate-12 transition-transform" />
        <span className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 -translate-x-[150%] animate-[shimmer_3s_infinite] pointer-events-none" />
        {/* Glow orb */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(0,194,255,1)] animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-[1000] w-[calc(100vw-48px)] sm:w-[450px] h-[650px] max-h-[85vh] glass-card rounded-[32px] border border-white/10 flex flex-col overflow-hidden shadow-2xl backdrop-blur-2xl bg-[#0A0A0A]/80 flex-shrink-0"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.05] to-transparent shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 border border-brand-primary/20">
                  <Bot size={22} className="text-brand-primary drop-shadow-[0_0_8px_rgba(0,194,255,0.8)]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg tracking-tight">Intelligence Node</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/70">Online & Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 ml-1 text-white/40">
                      <Sparkles size={12} className="text-brand-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Agent Response</span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="flex items-center gap-2 mb-2 mr-1 text-white/40">
                      <User size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">You</span>
                    </div>
                  )}

                  <div className={cn(
                    "max-w-[85%] p-4 text-sm leading-relaxed",
                    msg.role === 'user'
                      ? "bg-white text-black font-medium rounded-2xl rounded-tr-sm"
                      : "bg-white/5 border border-white/10 text-white/90 rounded-2xl rounded-tl-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/10 prose-a:text-brand-primary"
                  )}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 ml-1 text-white/40">
                    <Sparkles size={12} className="text-brand-primary animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Synthesizing...</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent border-t border-white/10 shrink-0">
              {messages.length === 1 && !isTyping && (
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt.text)}
                      className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-white/70 transition-all shrink-0 hover:text-white"
                    >
                      <span className="text-brand-primary">{prompt.icon}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-brand-primary/50 focus-within:bg-white/10 rounded-2xl p-2 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Query the system..."
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-white/30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-white text-black disabled:bg-white/10 disabled:text-white/30 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  {input.trim() ? <Send size={18} /> : <CornerDownLeft size={18} />}
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">
                  Powered by Gemini Neural Engine
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
