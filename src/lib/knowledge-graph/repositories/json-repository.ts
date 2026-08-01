import { IGraphRepository } from './interface';
import { BaseNode, BaseEdge, NodeId, EdgeId, LanguageCode } from '../core/types';

export class JsonRepository implements IGraphRepository {
  private nodes: Map<NodeId, BaseNode> = new Map();
  private edges: Map<EdgeId, BaseEdge> = new Map();

  constructor(initialNodes: BaseNode[] = [], initialEdges: BaseEdge[] = []) {
    initialNodes.forEach(node => this.nodes.set(node.nodeId, node));
    initialEdges.forEach(edge => this.edges.set(edge.edgeId, edge));
  }

  async getNode(id: NodeId): Promise<BaseNode | null> {
    return this.nodes.get(id) || null;
  }

  async getNodeBySlug(slug: string, lang: LanguageCode): Promise<BaseNode | null> {
    for (const node of this.nodes.values()) {
      if (node.slug[lang] === slug) {
        return node;
      }
    }
    return null;
  }

  async getAllNodes(): Promise<BaseNode[]> {
    return Array.from(this.nodes.values());
  }

  async saveNode(node: BaseNode): Promise<void> {
    this.nodes.set(node.nodeId, node);
  }

  async deleteNode(id: NodeId): Promise<void> {
    this.nodes.delete(id);
    // Remove connected edges
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.sourceId === id || edge.targetId === id) {
        this.edges.delete(edgeId);
      }
    }
  }

  async getEdge(id: EdgeId): Promise<BaseEdge | null> {
    return this.edges.get(id) || null;
  }

  async getEdgesForNode(nodeId: NodeId, direction: 'INCOMING' | 'OUTGOING' | 'BOTH' = 'BOTH'): Promise<BaseEdge[]> {
    const result: BaseEdge[] = [];
    for (const edge of this.edges.values()) {
      if (direction === 'OUTGOING' && edge.sourceId === nodeId) {
        result.push(edge);
      } else if (direction === 'INCOMING' && edge.targetId === nodeId) {
        result.push(edge);
      } else if (direction === 'BOTH' && (edge.sourceId === nodeId || edge.targetId === nodeId)) {
        result.push(edge);
      }
    }
    return result;
  }

  async getAllEdges(): Promise<BaseEdge[]> {
    return Array.from(this.edges.values());
  }

  async saveEdge(edge: BaseEdge): Promise<void> {
    this.edges.set(edge.edgeId, edge);
  }

  async deleteEdge(id: EdgeId): Promise<void> {
    this.edges.delete(id);
  }

  exportSnapshot(): { nodes: BaseNode[]; edges: BaseEdge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values())
    };
  }
}
