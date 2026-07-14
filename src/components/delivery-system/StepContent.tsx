import { lazy, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { DeliverySystemStep } from '../../types/delivery-system';
import { useDeliverySystemStore } from '../../lib/delivery-system';

const ProjectIntakeStep = lazy(() => import('./steps/ProjectIntakeStep').then(m => ({ default: m.ProjectIntakeStep })));
const ScopeSuccessStep = lazy(() => import('./steps/ScopeSuccessStep').then(m => ({ default: m.ScopeSuccessStep })));
const DeliveryPlanStep = lazy(() => import('./steps/DeliveryPlanStep').then(m => ({ default: m.DeliveryPlanStep })));
const ExecutionWorkspaceStep = lazy(() => import('./steps/ExecutionWorkspaceStep').then(m => ({ default: m.ExecutionWorkspaceStep })));
const CommunicationUpdatesStep = lazy(() => import('./steps/CommunicationUpdatesStep').then(m => ({ default: m.CommunicationUpdatesStep })));
const FeedbackRevisionStep = lazy(() => import('./steps/FeedbackRevisionStep').then(m => ({ default: m.FeedbackRevisionStep })));
const HandoffCloseoutStep = lazy(() => import('./steps/HandoffCloseoutStep').then(m => ({ default: m.HandoffCloseoutStep })));

const STEP_COMPONENTS: Partial<Record<DeliverySystemStep, React.LazyExoticComponent<React.ComponentType>>> = {
  project_intake: ProjectIntakeStep,
  scope_success: ScopeSuccessStep,
  delivery_plan: DeliveryPlanStep,
  execution_workspace: ExecutionWorkspaceStep,
  communication_updates: CommunicationUpdatesStep,
  feedback_revision: FeedbackRevisionStep,
  handoff_closeout: HandoffCloseoutStep,
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
        <span className="text-xs text-zinc-500 font-medium">Loading step…</span>
      </div>
    </div>
  );
}

function ErrorFallback({ step }: { step: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={20} className="text-red-400" />
      </div>
      <h3 className="text-sm font-bold text-white/80 mb-1">Step Not Found</h3>
      <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
        The component for &ldquo;{step.replace(/_/g, ' ')}&rdquo; could not be loaded. This step may not be implemented yet.
      </p>
    </div>
  );
}

export function StepContent() {
  const currentStep = useDeliverySystemStore((s) => s.currentStep);

  const StepComponent = STEP_COMPONENTS[currentStep];

  if (!StepComponent) {
    return <ErrorFallback step={currentStep} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <StepComponent />
    </Suspense>
  );
}
