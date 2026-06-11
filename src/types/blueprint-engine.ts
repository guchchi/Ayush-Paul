export interface BlueprintActionStep {
  id: string;
  title: string;
  description: string;
  details: string;
}

export interface BlueprintPrompt {
  id: string;
  title: string;
  text: string;
}

export interface BlueprintTemplate {
  id: string;
  title: string;
  description: string;
  url?: string;
  downloadUrl?: string;
}

export interface BlueprintChecklistItem {
  id: string;
  label: string;
}

export interface BlueprintResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'tool' | 'article' | 'video' | 'reference';
}

export interface BlueprintModule {
  id: string;
  title: string;
  description: string;
  outcome: string[];
  workflow: { label: string; description?: string }[];
  steps: BlueprintActionStep[];
  prompts: BlueprintPrompt[];
  templates: BlueprintTemplate[];
  checklist: BlueprintChecklistItem[];
  resources: BlueprintResource[];
}

export interface BlueprintEngineData {
  id: string;
  title: string;
  description: string;
  outcome: string;
  estimatedTime: string;
  difficulty: string;
  version: string;
  lastUpdated: string;
  category: string;
  tags: string[];
  modules: BlueprintModule[];
}

export interface BlueprintProgress {
  completedModules: string[];
  completedChecklistItems: string[];
  lastVisitedModule: string | null;
  overallProgress: number;
}
