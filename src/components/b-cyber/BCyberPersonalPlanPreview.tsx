import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Clock,
  RotateCcw,
  Sliders,
  Award,
  Zap,
} from 'lucide-react';
import { useBCyberPlannerStore } from '../../lib/b-cyber-compass/store';
import { cn } from '../../lib/utils';

export function BCyberPersonalPlanPreview() {
  const { inputs, updateInputs, generatedPlan } = useBCyberPlannerStore();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Product Banner */}
      <div className="rounded-2xl border border-brand-primary/25 bg-gradient-to-br from-white via-indigo-50/20 to-brand-primary/5 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 09 · Premium Execution System</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized Execution System (₹199 / ₹299 One-Time)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              The free roadmap teaches you <em>what</em> to learn. The paid system converts that knowledge into an individualized, executable weekly schedule matching your current skills, hardware setup, and exam calendar.
            </p>
          </div>

          <div className="text-right sm:text-left shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Transparent Pricing
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              ₹249 <span className="text-xs font-normal text-slate-500">/ 12 Months Access</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              Includes future 2027 entrance test syllabus updates
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Deliverables Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          5 Concrete Deliverables Delivered in Your Personal Workspace
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Deliverable 1 */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h5 className="font-bold text-sm text-slate-900">Custom Starting Point</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explicit diagnostic placement. If you already know Linux bash, you skip Stage 0 and start directly at Stage 1 networking without wasting hours.
            </p>
          </div>

          {/* Deliverable 2 */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h5 className="font-bold text-sm text-slate-900">Weekly Task Queue</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sequenced weekly tasks with realistic effort bounds (e.g. &ldquo;Week 3: 4 hrs Wireshark PCAP inspection + 2 hrs Bandit&rdquo;) and unambiguous completion criteria.
            </p>
          </div>

          {/* Deliverable 3 */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h5 className="font-bold text-sm text-slate-900">Direct Resource Pairings</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every task is linked to pinpointed modules with free alternatives and verified setup tips, removing &ldquo;which tutorial should I watch?&rdquo; friction.
            </p>
          </div>

          {/* Deliverable 4 */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h5 className="font-bold text-sm text-slate-900">Adaptive Delay Recovery</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Missed a week due to school or college exams? The 1-click recalibration engine reshuffles remaining milestones across your timeline without guilt.
            </p>
          </div>

          {/* Deliverable 5 */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h5 className="font-bold text-sm text-slate-900">Evidence Tasks (FAQ 22)</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specific assignments to document your work in public GitHub repositories, creating verifiable technical evidence aligned with selection expectations.
            </p>
          </div>

          {/* Deliverable 6: Guarantee */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <h5 className="font-bold text-sm text-emerald-950">Future Cycle Guarantee</h5>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              When IIT Kanpur announces the upcoming entrance test syllabus, your plan automatically re-aligns free of charge. Full 7-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Free vs Paid Feature Comparison Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Feature Comparison: Free Roadmap vs. Paid Execution System
        </h4>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="py-2.5 px-3 font-bold text-slate-700">Capability</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">Free Core Roadmap</th>
                <th className="py-2.5 px-3 font-bold text-brand-primary">Paid Execution System (₹249)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-medium">5-Stage Detailed Learning Syllabus</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included (100% Free)</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Curated Tool Library &amp; Access Badges</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included (All Links)</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Readiness Diagnostic</td>
                <td className="py-2.5 px-3 text-slate-600">Calculates Starting Stage</td>
                <td className="py-2.5 px-3 text-indigo-700 font-semibold">Individualized Gap Priorities</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Weekly Study Schedule</td>
                <td className="py-2.5 px-3 text-slate-600">Generic Sample Benchmarks (2/4/8h)</td>
                <td className="py-2.5 px-3 text-indigo-700 font-semibold">Custom Calendar &amp; Task Queue</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Task Assignment</td>
                <td className="py-2.5 px-3 text-slate-600">User selects from syllabus</td>
                <td className="py-2.5 px-3 text-indigo-700 font-semibold">Assigned sequence based on gaps</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Missed-Week Recovery</td>
                <td className="py-2.5 px-3 text-slate-600">General 60-min emergency routine</td>
                <td className="py-2.5 px-3 text-indigo-700 font-semibold">Automated Schedule Recalibration</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Progress Tracking</td>
                <td className="py-2.5 px-3 text-slate-600">Local browser storage</td>
                <td className="py-2.5 px-3 text-indigo-700 font-semibold">Cloud synced progress &amp; notes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Future Cycle Factual Updates</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included (Never paywalled)</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl border border-brand-primary/30 bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Guaranteed Risk-Free Trial</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold tracking-tight">
            Ready to turn generic advice into an executable plan?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            ₹249 one-time payment for 12 months access. Zero automatic renewals. Full 7-day no-questions-asked refund if it doesn&rsquo;t save you at least 20 hours of planning.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckoutModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/90 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Unlock Personal Execution Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Checkout Modal (Informational Preview) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <h4 className="font-bold text-sm text-slate-900">Personalized Execution Workspace</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>B.Cyber Execution System Pass (12 Months)</span>
                  <span className="font-mono text-brand-primary">₹249</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Includes adaptive schedule recalibration, individual weekly task queue, curated resource links, and future cycle syllabus update guarantee.
                </p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>One-time fee · Zero auto-renewing subscriptions</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant access to your dynamic schedule</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>7-Day Money-Back Guarantee</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-[11px]">
                Payment gateway checkout (Razorpay/UPI) is being enabled for the upcoming admission cycle. You can continue using all 5 stages of the free roadmap immediately below.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
