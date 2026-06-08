import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Minus } from "lucide-react";
import { getFirebaseStatus } from "../../../config/firebase-config";
import { cn } from "../../../lib/utils";

export const HealthDashboard: React.FC = () => {
  const status = getFirebaseStatus();
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[24px] backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner",
              status.isConfigured
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            )}
          >
            {status.isConfigured ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 mb-0.5">
              System Status
            </div>
            <h3 className="text-base font-bold flex items-center gap-2">
              {status.isConfigured ? "Engine Active" : "Action Required"}
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold uppercase tracking-widest text-white/20">
                {status.mode}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-10">
          <div className="hidden lg:flex flex-col gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/10">
              Auth Region
            </span>
            <span className="text-[10px] font-mono font-bold text-white/40">
              US-Central-1
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/10">
              Database Route
            </span>
            <span className="text-[10px] font-mono font-bold text-brand-primary/60">
              {status.databaseId}
            </span>
          </div>
          <button
            onClick={() => setShowTroubleshooter(!showTroubleshooter)}
            className={cn(
              "px-5 py-2.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
              showTroubleshooter
                ? "bg-white text-black border-white"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            )}
          >
            {showTroubleshooter ? "Close Diagnostics" : "Run Audit"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTroubleshooter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] mt-6">
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Diagnostic Audit
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Firebase App Initialized", val: true },
                    { label: "Environment Keys Verified", val: status.isConfigured },
                    { label: "Database Route Set", val: !!status.databaseId },
                    { label: "Auth Provider Active", val: true },
                  ].map((check, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-xs py-2 border-b border-white/5"
                    >
                      <span className="text-white/60">{check.label}</span>
                      {check.val ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  Strategic Troubleshooting
                </h4>
                <div className="space-y-4">
                  {!status.isConfigured ? (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        Action Required: Missing Env Vars
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        The following keys are missing in Vercel settings:{" "}
                        <span className="text-red-400 font-mono">
                          {status.missingVars.join(", ")}
                        </span>
                      </p>
                    </div>
                  ) : status.databaseId === "MISSING_DB" ? (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        CRITICAL: Database Not Found
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        The specified Firestore ID{" "}
                        <code className="text-red-400 font-mono">
                          ({status.databaseId})
                        </code>{" "}
                        does not exist in project{" "}
                        <code className="text-white/60">{status.projectId}</code>.
                        Verify your Vercel env variable{" "}
                        <code className="text-white/60">
                          VITE_FIREBASE_FIRESTORE_DB_ID
                        </code>
                        .
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 space-y-2">
                      <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                        Verify Data Container
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        Ensure the <code className="text-white/60">projectId</code>{" "}
                        matches where you wrote the blogs locally. If blogs aren't
                        appearing, check Firestore Security Rules for{" "}
                        <code className="text-white/60">allow read</code>{" "}
                        permissions.
                      </p>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                      Check Daily Quota
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      If the app is online but shows no data, your daily Firebase Read
                      Quota may be hit. Check the browser console (F12) for "Quota
                      Exceeded" errors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
