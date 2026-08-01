import { BaseNode, BaseEdge, NodeId, RevisionId, EdgeId, LocalizedString, NodeMetadata } from '../core/types';
import { ThePaulXNodeType, ThePaulXRelationType } from '../domain/constants';

export class NodeBuilder<TProps = Record<string, any>> {
  private node: Partial<BaseNode<TProps>> = {
    version: 1,
    status: 'PUBLISHED',
    title: { en: '', es: '', hi: '' },
    slug: { en: '', es: '', hi: '' },
    properties: {} as TProps,
    metadata: {
      createdBy: 'system',
      updatedBy: 'system',
      source: 'HUMAN_AUTHOR',
      confidence: 1.0,
      visibility: 'PUBLIC',
      checksum: 'sha256_placeholder'
    }
  };

  constructor(nodeId: NodeId, nodeType: ThePaulXNodeType) {
    this.node.nodeId = nodeId;
    this.node.revisionId = `rev_${nodeId}_v1`;
    this.node.nodeType = nodeType;
    const now = new Date().toISOString();
    this.node.createdAt = now;
    this.node.updatedAt = now;
    this.node.publishedAt = now;
  }

  setTitle(title: LocalizedString | string): this {
    if (typeof title === 'string') {
      this.node.title = { en: title, es: title, hi: title };
    } else {
      this.node.title = title;
    }
    return this;
  }

  setSlug(slug: LocalizedString | string): this {
    if (typeof slug === 'string') {
      this.node.slug = { en: slug, es: slug, hi: slug };
    } else {
      this.node.slug = slug;
    }
    return this;
  }

  setDescription(desc: LocalizedString | string): this {
    if (typeof desc === 'string') {
      this.node.description = { en: desc, es: desc, hi: desc };
    } else {
      this.node.description = desc;
    }
    return this;
  }

  setStatus(status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'): this {
    this.node.status = status;
    return this;
  }

  setProperties(props: TProps): this {
    this.node.properties = props;
    return this;
  }

  setMetadata(metadata: Partial<NodeMetadata>): this {
    this.node.metadata = { ...this.node.metadata!, ...metadata };
    return this;
  }

  build(): BaseNode<TProps> {
    if (!this.node.nodeId || !this.node.nodeType || !this.node.title?.en || !this.node.slug?.en) {
      throw new Error(`Incomplete node building for ID ${this.node.nodeId}`);
    }
    return this.node as BaseNode<TProps>;
  }
}

export class EdgeBuilder {
  private edge: Partial<BaseEdge> = {
    weight: 1.0,
    metadata: {
      createdBy: 'system',
      updatedBy: 'system',
      source: 'HUMAN_AUTHOR',
      confidence: 1.0,
      visibility: 'PUBLIC',
      checksum: 'sha256_placeholder'
    }
  };

  constructor(edgeId: EdgeId, sourceId: NodeId, targetId: NodeId, relationType: ThePaulXRelationType) {
    this.edge.edgeId = edgeId;
    this.edge.sourceId = sourceId;
    this.edge.targetId = targetId;
    this.edge.relationType = relationType;
    const now = new Date().toISOString();
    this.edge.createdAt = now;
    this.edge.updatedAt = now;
  }

  setWeight(weight: number): this {
    this.edge.weight = weight;
    return this;
  }

  setAnchorText(anchor: LocalizedString | string): this {
    if (typeof anchor === 'string') {
      this.edge.anchorText = { en: anchor, es: anchor, hi: anchor };
    } else {
      this.edge.anchorText = anchor;
    }
    return this;
  }

  setReason(reason: string): this {
    this.edge.reason = reason;
    return this;
  }

  build(): BaseEdge {
    if (!this.edge.edgeId || !this.edge.sourceId || !this.edge.targetId || !this.edge.relationType) {
      throw new Error(`Incomplete edge building for ID ${this.edge.edgeId}`);
    }
    return this.edge as BaseEdge;
  }
}
