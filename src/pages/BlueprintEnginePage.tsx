import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, BarChart3, ArrowRight, Layers, Zap, Lock } from 'lucide-react';
import { BlueprintLayout } from '../components/blueprint-engine/BlueprintLayout';
import { OutcomeCard } from '../components/blueprint-engine/OutcomeCard';
import { WorkflowCard } from '../components/blueprint-engine/WorkflowCard';
import { ActionStepCard } from '../components/blueprint-engine/ActionStepCard';
import { PromptCard } from '../components/blueprint-engine/PromptCard';
import { TemplateCard } from '../components/blueprint-engine/TemplateCard';
import { ChecklistCard } from '../components/blueprint-engine/ChecklistCard';
import { ResourceCard } from '../components/blueprint-engine/ResourceCard';
import { CompletionCard } from '../components/blueprint-engine/CompletionCard';
import { WorkspaceLoadingState } from '../components/workspace/WorkspaceLoadingState';
import { getBlueprint } from '../content/blueprints';
import { cn } from '../lib/utils';
import type { BlueprintEngineData, BlueprintProgress } from '../types/blueprint-engine';
import { auth, db, doc, getDoc, setDoc, onAuthStateChanged, serverTimestamp } from '../firebase';

function calculateProgress(
  completedModules: string[],
  totalModules: number,
  completedChecklist: string[],
  totalChecklistItems: number,
): number {
  const moduleWeight = 0.6;
  const checklistWeight = 0.4;
  const moduleProgress = totalModules > 0 ? completedModules.length / totalModules : 0;
  const checklistProgress = totalChecklistItems > 0 ? completedChecklist.length / totalChecklistItems : 0;
  return (moduleProgress * moduleWeight + checklistProgress * checklistWeight) * 100;
}

export function BlueprintEnginePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [data, setData] = useState<BlueprintEngineData | undefined>(undefined);
  const [contentLoading, setContentLoading] = useState(true);
  const [progress, setProgress] = useState<BlueprintProgress>({
    completedModules: [],
    completedChecklistItems: [],
    lastVisitedModule: null,
    overallProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setContentLoading(false);
      return;
    }
    getBlueprint(slug).then((blueprint) => {
      setData(blueprint);
      setContentLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);

      if (currentUser) {
        try {
          const profileSnap = await getDoc(doc(db, 'users', currentUser.uid));
          const profileData = profileSnap.exists() ? profileSnap.data() : {};
          setProfile(profileData);

          if (data) {
            const snap = await getDoc(doc(db, 'blueprint_progress', `${currentUser.uid}_${data.id}`));
            if (snap.exists()) {
              const saved = snap.data() as BlueprintProgress;
              setProgress(saved);
            }
          }
        } catch {
          // ignore
        }
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [data]);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const initial = progress.lastVisitedModule || data.modules[0]?.id;
      setActiveModuleId(initial);
    }
  }, [data, progress.lastVisitedModule]);

  const activeModule = useMemo(
    () => data?.modules.find((m) => m.id === activeModuleId) || null,
    [data, activeModuleId],
  );

  const totalChecklistItems = useMemo(
    () => data?.modules.reduce((sum, m) => sum + m.checklist.length, 0) || 0,
    [data],
  );

  const overallProgress = useMemo(
    () => calculateProgress(
      progress.completedModules,
      data?.modules.length || 0,
      progress.completedChecklistItems,
      totalChecklistItems,
    ),
    [progress, data, totalChecklistItems],
  );

  const saveProgress = useCallback(async (updated: BlueprintProgress) => {
    setProgress(updated);
    if (user && data) {
      try {
        await setDoc(doc(db, 'blueprint_progress', `${user.uid}_${data.id}`), {
          ...updated,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch {
        // ignore
      }
    }
  }, [user, data]);

  const currentModuleIndex = useMemo(
    () => data?.modules.findIndex((m) => m.id === activeModuleId) ?? -1,
    [data, activeModuleId],
  );

  const nextModule = useMemo(
    () => (currentModuleIndex >= 0 && data && currentModuleIndex < data.modules.length - 1
      ? data.modules[currentModuleIndex + 1]
      : null),
    [data, currentModuleIndex],
  );

  const handleModuleChange = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
    saveProgress({ ...progress, lastVisitedModule: moduleId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [progress, saveProgress]);

  const handleChecklistToggle = useCallback((itemId: string) => {
    const updated = progress.completedChecklistItems.includes(itemId)
      ? progress.completedChecklistItems.filter((id) => id !== itemId)
      : [...progress.completedChecklistItems, itemId];
    saveProgress({ ...progress, completedChecklistItems: updated });
  }, [progress, saveProgress]);

  const handleMarkModuleComplete = useCallback(() => {
    if (!activeModule) return;
    const alreadyDone = progress.completedModules.includes(activeModule.id);
    const updated = alreadyDone
      ? progress.completedModules
      : [...progress.completedModules, activeModule.id];
    saveProgress({ ...progress, completedModules: updated });
  }, [activeModule, progress, saveProgress]);

  const handleResetModule = useCallback(() => {
    if (!activeModule) return;
    const updatedModules = progress.completedModules.filter((id) => id !== activeModule.id);
    const updatedChecklist = progress.completedChecklistItems.filter(
      (id) => !activeModule.checklist.some((c) => c.id === id),
    );
    saveProgress({ ...progress, completedModules: updatedModules, completedChecklistItems: updatedChecklist });
  }, [activeModule, progress, saveProgress]);

  if (loading || contentLoading) {
    return <WorkspaceLoadingState fullScreen message="Loading Engine..." />;
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-center px-6">
        <Layers size={32} className="text-white/20 mb-4" />
        <h2 className="text-h3 text-white mb-2">Blueprint Not Found</h2>
        <p className="text-body-sm text-white/40 mb-6">This blueprint does not exist or has not been published yet.</p>
        <button
          onClick={() => navigate('/blueprints')}
          className="btn-base bg-white text-black hover:bg-white/90"
        >
          Return to Blueprints
        </button>
      </div>
    );
  }

  if (!user || !authChecked) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Lock size={20} className="text-white/40" />
        </div>
        <h2 className="text-h3 text-white mb-2">Authentication Required</h2>
        <p className="text-body-sm text-white/40 mb-6">Sign in to access this blueprint engine.</p>
        <button
          onClick={() => navigate(`/blueprints/${slug}`)}
          className="btn-base bg-white text-black hover:bg-white/90"
        >
          Sign in to Access
        </button>
      </div>
    );
  }

  const ownedMap = profile?.ownedProducts || {};
  const ownsBlueprint = data?.id ? ownedMap[data.id] !== undefined : false;

  if (!ownsBlueprint && slug !== 'get-your-first-3-clients') {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Lock size={20} className="text-white/40" />
        </div>
        <h2 className="text-h3 text-white mb-2">Blueprint Locked</h2>
        <p className="text-body-sm text-white/40 mb-6 max-w-md">
          You haven't unlocked <span className="text-white/60 font-semibold">{data.title}</span> yet. Purchase or download it to access the interactive execution engine.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/blueprints/${slug}`)}
            className="btn-base bg-white text-black hover:bg-white/90"
          >
            View Blueprint
          </button>
          <button
            onClick={() => navigate('/vault')}
            className="btn-base bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80"
          >
            Go to Vault
          </button>
        </div>
      </div>
    );
  }

  const moduleCompletedChecklist = activeModule
    ? activeModule.checklist.filter((c) => progress.completedChecklistItems.includes(c.id))
    : [];

  return (
    <BlueprintLayout
      title={data.title}
      description={data.description}
      modules={data.modules}
      activeModuleId={activeModuleId || data.modules[0]?.id}
      completedModules={progress.completedModules}
      onModuleChange={handleModuleChange}
      overallProgress={overallProgress}
    >
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <Zap size={10} className="text-brand-primary" />
          </span>
          <p className="text-caption text-brand-primary/80">{data.title}</p>
        </div>

        <h1 className="text-h1 text-white mb-3">{activeModule?.title || 'Loading...'}</h1>
        <p className="text-body-lg text-white/50 mb-6">{data.outcome}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-caption text-white/30">
            <Clock size={12} />
            {data.estimatedTime}
          </div>
          <div className="flex items-center gap-2 text-caption text-white/30">
            <BarChart3 size={12} />
            {data.difficulty}
          </div>
          <div className="flex items-center gap-2 text-caption text-white/30">
            <Layers size={12} />
            {progress.completedModules.length}/{data.modules.length} modules
          </div>
          <div className="flex items-center gap-2 text-caption text-brand-primary">
            <Zap size={12} />
            {Math.round(overallProgress)}% complete
          </div>
        </div>

        {progress.lastVisitedModule && progress.lastVisitedModule !== activeModuleId && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setActiveModuleId(progress.lastVisitedModule)}
            className={cn(
              'btn-base text-[11px] gap-2 mb-6',
              'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
              'hover:bg-brand-primary/20 cursor-pointer',
            )}
          >
            <ArrowRight size={12} />
            Continue where you left off
          </motion.button>
        )}
      </div>

      {activeModule && (
        <motion.div
          key={activeModule.id}
          id={`module-${activeModule.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <p className="text-body-sm text-white/40 leading-relaxed">{activeModule.description}</p>

          <OutcomeCard items={activeModule.outcome} />

          <WorkflowCard steps={activeModule.workflow} />

          {activeModule.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/5" />
                <p className="text-caption text-white/40 tracking-widest uppercase">Action Steps</p>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                {activeModule.steps.map((step, i) => (
                  <ActionStepCard key={step.id} step={step} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeModule.prompts.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/5" />
                <p className="text-caption text-white/40 tracking-widest uppercase">Prompts</p>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                {activeModule.prompts.map((prompt, i) => (
                  <PromptCard key={prompt.id} prompt={prompt} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeModule.templates.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/5" />
                <p className="text-caption text-white/40 tracking-widest uppercase">Templates</p>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                {activeModule.templates.map((template, i) => (
                  <TemplateCard key={template.id} template={template} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeModule.checklist.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/5" />
                <p className="text-caption text-white/40 tracking-widest uppercase">Checklist</p>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <ChecklistCard
                items={activeModule.checklist}
                completed={moduleCompletedChecklist.map((c) => c.id)}
                onToggle={handleChecklistToggle}
              />
            </div>
          )}

          {activeModule.resources.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/5" />
                <p className="text-caption text-white/40 tracking-widest uppercase">Resources</p>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <ResourceCard resources={activeModule.resources} />
            </div>
          )}

          <CompletionCard
            moduleTitle={activeModule.title}
            completedChecklist={moduleCompletedChecklist.length}
            totalChecklist={activeModule.checklist.length}
            isModuleComplete={progress.completedModules.includes(activeModule.id)}
            onMarkComplete={handleMarkModuleComplete}
            onReset={handleResetModule}
            nextModuleTitle={nextModule?.title}
            onNextModule={nextModule ? () => handleModuleChange(nextModule.id) : undefined}
          />

          {slug === 'get-your-first-3-clients' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="ds-card p-6 lg:p-8 mt-6"
            >
              <div className="flex flex-col items-center text-center">
                <p className="text-body-md font-semibold text-text-primary mb-1">
                  Ready to Start?
                </p>
                <p className="text-body-sm text-text-secondary mb-6">
                  Launch the interactive workspace to choose your track, define your market, and craft your positioning statement.
                </p>
                <button
                  onClick={() => navigate('/workspace/client-acquisition')}
                  className="btn-base bg-brand-primary text-white hover:bg-brand-secondary gap-2"
                >
                  Launch Module 1: Direction
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </BlueprintLayout>
  );
}

export default BlueprintEnginePage;
