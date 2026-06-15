import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import type { ClientPipelineStep } from '../../types/client-pipeline-system';
import { ClientSourceMapStep } from './ClientSourceMapStep';
import { IdealClientCriteriaStep } from './IdealClientCriteriaStep';
import { ProspectTypeSelectorStep } from './ProspectTypeSelectorStep';
import { SearchQueryBuilderStep } from './SearchQueryBuilderStep';
import { LeadQualificationScoreStep } from './LeadQualificationScoreStep';
import { PipelineListBuilderStep } from './PipelineListBuilderStep';
import { PriorityPlanStep } from './PriorityPlanStep';
import { ClientPipelineReportStep } from './ClientPipelineReportStep';

const STEP_COMPONENTS: Partial<Record<ClientPipelineStep, React.FC>> = {
  client_source_map: ClientSourceMapStep,
  ideal_client_criteria: IdealClientCriteriaStep,
  prospect_type_selector: ProspectTypeSelectorStep,
  search_query_builder: SearchQueryBuilderStep,
  lead_qualification_score: LeadQualificationScoreStep,
  pipeline_list_builder: PipelineListBuilderStep,
  priority_plan: PriorityPlanStep,
  client_pipeline_report: ClientPipelineReportStep,
};

export function StepContent() {
  const currentStep = useClientPipelineStore((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];
  if (!Component) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Unknown step: {currentStep}</p>
      </div>
    );
  }
  return <Component />;
}
