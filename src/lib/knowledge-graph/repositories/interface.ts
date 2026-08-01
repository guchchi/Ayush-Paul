import { BaseNode, BaseEdge, NodeId, EdgeId, LanguageCode } from '../core/types';

export interface IGraphRepository {
  getNode(id: NodeId): Promise<BaseNode | null>;
  getNodeBySlug(slug: string, lang: LanguageCode): Promise<BaseNode | null>;
  getAllNodes(): Promise<BaseNode[]>;
  saveNode(node: BaseNode): Promise<void>;
  deleteNode(id: NodeId): Promise<void>;

  getEdge(id: EdgeId): Promise<BaseEdge | null>;
  getEdgesForNode(nodeId: NodeId, direction?: 'INCOMING' | 'OUTGOING' | 'BOTH'): Promise<BaseEdge[]>;
  getAllEdges(): Promise<BaseEdge[]>;
  saveEdge(edge: BaseEdge): Promise<void>;
  deleteEdge(id: EdgeId): Promise<void>;
}
