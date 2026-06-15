import { motion } from 'motion/react';
import { Check, ArrowRight, AlertCircle, Users, Plus, Trash2, Sparkles } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import { cn } from '../../lib/utils';

const BEGINNER_ACTIONS = [
  'Create one sample project from scratch',
  'Publish one process breakdown post',
  'Ask a mentor or teacher for a skill reference (no fake claims)',
  'Offer beta work to 1-2 people and ask for honest feedback',
  'Share a before/after mockup on LinkedIn or X',
];

const INTERMEDIATE_ACTIONS = [
  'Write a mini case study based on a real project',
  'Request a LinkedIn recommendation from a past client',
  'Publish a teardown post of your own work',
  'Create a portfolio page with 3 completed projects',
  'Share a result screenshot with context',
];

const EXPERIENCED_ACTIONS = [
  'Write a full case study with metrics',
  'Collect and publish 3 client testimonials (with permission)',
  'Create a portfolio highlight reel',
  'Publish a thought leadership post in your niche',
  'Record a client results walkthrough video',
];

const LEVEL_ACTIONS: Record<string, string[]> = {
  beginner: BEGINNER_ACTIONS,
  intermediate: INTERMEDIATE_ACTIONS,
  experienced: EXPERIENCED_ACTIONS,
};

export function SocialProofStrategyStep() {
  const rawPlan = useAuthoritySystemStore((s) => s.socialProofPlan);
  const plan = rawPlan ?? { currentProof: '', missingProof: '', nextActions: [] };
  const setPlan = useAuthoritySystemStore((s) => s.setSocialProofPlan);
  const credibilityLevel = useAuthoritySystemStore((s) => s.credibilityLevel);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('social_proof_strategy');

  const isValid = plan.currentProof.trim().length > 0 || plan.nextActions.length > 0;

  const generatePlan = () => {
    const level = credibilityLevel || 'beginner';
    const actions = LEVEL_ACTIONS[level] || BEGINNER_ACTIONS;
    setPlan({
      currentProof: level === 'beginner'
        ? 'I am building my first proof assets. No client results yet — working on samples and process docs.'
        : level === 'intermediate'
        ? 'I have a few completed projects and some work samples available.'
        : 'I have multiple completed projects, client feedback, and proven results to showcase.',
      missingProof: level === 'beginner'
        ? 'No real client testimonials, no case study, no published portfolio yet.'
        : level === 'intermediate'
        ? 'No published case studies, limited social proof content, no video testimonials.'
        : 'No full case studies with metrics, no video testimonials, limited thought leadership content.',
      nextActions: actions,
    });
  };

  const addAction = () => {
    setPlan({ ...plan, nextActions: [...plan.nextActions, ''] });
  };

  const updateAction = (i: number, v: string) => {
    const actions = [...plan.nextActions];
    actions[i] = v;
    setPlan({ ...plan, nextActions: actions });
  };

  const removeAction = (i: number) => {
    setPlan({ ...plan, nextActions: plan.nextActions.filter((_, idx) => idx !== i) });
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Social Proof Strategy</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Build proof ethically. Document what you already have, identify gaps, and plan your next 3 actions.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/15">
        <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.1em]">No Fake Claims</p>
          <p className="text-[10px] text-amber-400/70 mt-0.5">
            Never fake testimonials or client results. Use ethical proof: walkthroughs, samples, breakdowns, learning logs.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Users size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Social Proof Plan</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Be honest about what proof you have today and what you need to build.
          </p>
        </div>
      </div>

      {plan.currentProof === '' && plan.missingProof === '' && plan.nextActions.length === 0 && (
        <button
          onClick={generatePlan}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Social Proof Plan
        </button>
      )}

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Current Proof Available</p>
        <textarea
          value={plan.currentProof}
          onChange={(e) => setPlan({ ...plan, currentProof: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder="e.g. I have 2 sample projects, a process doc, and a mock before/after breakdown"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Missing Proof</p>
        <textarea
          value={plan.missingProof}
          onChange={(e) => setPlan({ ...plan, missingProof: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder="e.g. No real client testimonials yet, no case study"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Next 3 Proof-Building Actions</p>
          <button onClick={addAction} className="flex items-center gap-1 text-[10px] text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
            <Plus size={10} /> Add action
          </button>
        </div>
        {plan.nextActions.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">Add at least one action you can take this week.</p>
        ) : (
          <div className="space-y-2">
            {plan.nextActions.map((action, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary/15 text-[8px] font-bold text-brand-primary shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => updateAction(i, e.target.value)}
                  className="flex-1 h-9 px-3 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                  placeholder="e.g. Create a process walkthrough video this weekend"
                />
                <button onClick={() => removeAction(i)} className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Social proof plan saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
            isValid
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          <ArrowRight size={14} />
          Continue to Content Assets
        </motion.button>
      )}
    </div>
  );
}
