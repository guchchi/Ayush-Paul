import { generateInitialGraph } from './seed/initial-seed';
import { IGraphRepository } from './repositories/interface';
import { BaseNode, BaseEdge } from './core/types';
import { GraphQueryApi } from './services/query';
import { UnifiedSearchEngine } from './services/search';
import { SeoProjectionService } from './seo/generator';
import { BlueprintProjection, StepProjection } from './projections/projections';
import { InMemoryContentRepository } from './content/loader';

class KnowledgeGraphSingleton {
  private static instance: KnowledgeGraphSingleton;
  public repository: IGraphRepository;
  public contentRepository: InMemoryContentRepository;
  public query: GraphQueryApi;
  public searchEngine: UnifiedSearchEngine;
  public seoService: SeoProjectionService;
  public blueprintProjection: BlueprintProjection;
  public stepProjection: StepProjection;
  public nodes: BaseNode[];
  public edges: BaseEdge[];

  private constructor() {
    const { repository, nodes, edges } = generateInitialGraph();
    this.repository = repository;
    this.nodes = nodes;
    this.edges = edges;
    this.contentRepository = new InMemoryContentRepository();
    this.query = new GraphQueryApi(repository);
    this.searchEngine = new UnifiedSearchEngine(repository);
    this.seoService = new SeoProjectionService(repository);
    this.blueprintProjection = new BlueprintProjection();
    this.stepProjection = new StepProjection();
  }

  public static getInstance(): KnowledgeGraphSingleton {
    if (!KnowledgeGraphSingleton.instance) {
      KnowledgeGraphSingleton.instance = new KnowledgeGraphSingleton();
    }
    return KnowledgeGraphSingleton.instance;
  }
}

export const getKnowledgeGraph = () => KnowledgeGraphSingleton.getInstance();
