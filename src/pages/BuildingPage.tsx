import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Terminal, ChevronRight, ArrowRight } from "lucide-react";
import { db, collection, query, where, orderBy, getDocs, limit } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { getCanonicalUrl } from "../lib/domain";
import { MagneticButton } from "../components/ui/MagneticButton";

interface MomentumLog {
  id: string;
  title: string;
  text: string;
  statusTag: string;
  date: string;
  isPublic: boolean;
  timestamp: any;
}

export const BuildingPage = () => {
  const [logs, setLogs] = useState<MomentumLog[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Building in Public | Antigravity Velocity Feed",
    description: "The live engineering and systems log. Updates from the lab as we construct AI systems, robotics blueprints, and web platforms.",
    url: getCanonicalUrl("/building"),
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "updates"),
          where("isPublic", "==", true),
          orderBy("timestamp", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as MomentumLog))
          .filter((item) => {
            const t = (item.title || "").toLowerCase();
            const txt = (item.text || "").toLowerCase();
            return !t.includes("test") && !txt.includes("test");
          });
        setLogs(data);
      } catch (err) {
        console.error("Error fetching building logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-bg-primary text-[#0b1c30] pt-24 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Block */}
        <header className="border-b border-[#c2c6d6]/20 pb-12 mb-16">
          <div className="inline-block px-3 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[#0058be] text-[10px] font-bold uppercase tracking-wider mb-6 shadow-sm">
            In Public
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-[#0b1c30]">
            Building in Public
          </h1>
          <p className="text-base text-[#424754] max-w-2xl leading-relaxed font-semibold">
            A chronological ledger of development, system deployments, and R&D updates. Documenting our journey transparently.
          </p>
        </header>

        {/* Timeline Content */}
        <div className="space-y-12">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-[#c2c6d6]/25 rounded-[32px] p-6 bg-white shadow-sm">
                  <div className="h-4 w-32 bg-bg-secondary rounded mb-4" />
                  <div className="h-6 w-3/4 bg-bg-secondary rounded mb-2" />
                  <div className="h-4 w-5/6 bg-bg-secondary rounded" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center rounded-[32px] border border-dashed border-[#c2c6d6]/35 bg-white shadow-sm">
              <Terminal size={32} className="text-[#424754]/20 mx-auto mb-4" />
              <p className="text-[#424754]/40 font-bold uppercase tracking-wider text-xs">
                No logs recorded on this frequency.
              </p>
            </div>
          ) : (
            <div className="relative border-l border-[#c2c6d6]/25 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-16">
              {logs.map((log) => (
                <article key={log.id} className="relative group text-left">
                  
                  {/* Bullet Indicator */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-bg-primary border-2 border-[#c2c6d6]/50 group-hover:border-[#0058be] group-hover:bg-[#0058be] transition-all duration-300" />

                  {/* Header metadata */}
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-[#424754]/60">
                    <time dateTime={log.date} className="font-bold text-[#424754]">
                      {log.date}
                    </time>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2c6d6]/50" />
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] border border-[#dce9ff] text-[9px] font-bold uppercase tracking-wide text-[#0058be]">
                      {log.statusTag || "Log"}
                    </span>
                  </div>

                  {/* Card content */}
                  <h3 className="text-lg font-extrabold text-[#0b1c30] mb-2 group-hover:text-[#0058be] transition-colors tracking-tight">
                    {log.title}
                  </h3>
                  <p className="text-sm text-[#424754] leading-relaxed max-w-3xl whitespace-pre-wrap font-semibold">
                    {log.text}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 group-hover:text-[#0058be] transition-colors cursor-pointer">
                    Verify Output <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Footer */}
        {!loading && logs.length > 0 && (
          <div className="mt-20 border-t border-[#c2c6d6]/20 pt-16">
            <div className="bg-white border border-[#c2c6d6]/35 p-8 rounded-[32px] max-w-2xl shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#0058be]" />
              <h4 className="text-base font-extrabold mb-2 text-[#0b1c30]">Subscribe to building updates</h4>
              <p className="text-xs text-[#424754]/60 mb-6 font-semibold">
                Receive notifications when new technical logs, blueprints, or course modules are released.
              </p>
              <form 
                onSubmit={(e) => e.preventDefault()} 
                className="flex flex-col sm:flex-row gap-3"
              >
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  className="flex-1 bg-bg-secondary border border-[#c2c6d6]/35 rounded-full px-5 py-3 text-xs text-[#0b1c30] outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/10 transition-colors placeholder:text-[#424754]/40 font-semibold h-11"
                />
                <MagneticButton>
                  <button className="px-6 py-3 bg-[#0b1c30] hover:bg-[#0058be] text-white font-bold rounded-full text-xs uppercase tracking-wider h-11 shadow-sm transition-colors cursor-pointer">
                    Join Newsletter
                  </button>
                </MagneticButton>
              </form>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default BuildingPage;
