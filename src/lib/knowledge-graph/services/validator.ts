import { IGraphRepository } from '../repositories/interface';
import { EDGE_CONSTRAINTS, ThePaulXRelationType } from '../domain/constants';
import { NODE_SPECIFICATIONS } from '../domain/schemas';

export interface ValidationError {
  type: 'ORPHAN_NODE' | 'INVALID_EDGE_CONSTRAINT' | 'DUPLICATE_SLUG' | 'MISSING_LOCALIZATION' | 'CIRCULAR_DEPENDENCY' | 'MISSING_PARENT' | 'BROKEN_REFERENCE' | 'SCHEMA_VIOLATION';
  message: string;
  targetId: string;
}

export class GraphValidator {
  constructor(private repo: IGraphRepository) {}

  async validateGraph(): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const nodes = await this.repo.getAllNodes();
    const edges = await this.repo.getAllEdges();

    const nodeMap = new Map(nodes.map(n => [n.nodeId, n]));
    const slugMap = new Map<string, string>(); // slug -> nodeId

    // 1. Validate Nodes
    for (const node of nodes) {
      // Check Slug Uniqueness
      const slugEn = node.slug?.en;
      if (!slugEn) {
        errors.push({
          type: 'MISSING_LOCALIZATION',
          message: `Node ${node.nodeId} missing English slug`,
          targetId: node.nodeId
        });
      } else {
        if (slugMap.has(slugEn)) {
          errors.push({
            type: 'DUPLICATE_SLUG',
            message: `Duplicate slug "${slugEn}" found on node ${node.nodeId} and ${slugMap.get(slugEn)}`,
            targetId: node.nodeId
          });
        } else {
          slugMap.set(slugEn, node.nodeId);
        }
      }

      // Check Title Localization
      if (!node.title?.en) {
        errors.push({
          type: 'MISSING_LOCALIZATION',
          message: `Node ${node.nodeId} missing English title`,
          targetId: node.nodeId
        });
      }

      // Check Schema Validation
      const spec = NODE_SPECIFICATIONS[node.nodeType];
      if (spec && spec.validateProperties) {
        const schemaErrors = spec.validateProperties(node.properties);
        schemaErrors.forEach(err => {
          errors.push({
            type: 'SCHEMA_VIOLATION',
            message: `Node ${node.nodeId} schema error: ${err}`,
            targetId: node.nodeId
          });
        });
      }

      // Check Parent Requirements (MODULE and STEP must have parent or HAS_PARENT edge)
      if (['MODULE', 'STEP'].includes(node.nodeType)) {
        const nodeEdges = await this.repo.getEdgesForNode(node.nodeId, 'OUTGOING');
        const hasParentEdge = nodeEdges.some(e => e.relationType === 'HAS_PARENT');
        if (!hasParentEdge) {
          errors.push({
            type: 'MISSING_PARENT',
            message: `${node.nodeType} node ${node.nodeId} missing HAS_PARENT edge`,
            targetId: node.nodeId
          });
        }
      }
    }

    // 2. Validate Edges
    const connectedNodeIds = new Set<string>();

    for (const edge of edges) {
      const sourceNode = nodeMap.get(edge.sourceId);
      const targetNode = nodeMap.get(edge.targetId);

      if (!sourceNode) {
        errors.push({
          type: 'BROKEN_REFERENCE',
          message: `Edge ${edge.edgeId} references missing source node ${edge.sourceId}`,
          targetId: edge.edgeId
        });
        continue;
      }

      if (!targetNode) {
        errors.push({
          type: 'BROKEN_REFERENCE',
          message: `Edge ${edge.edgeId} references missing target node ${edge.targetId}`,
          targetId: edge.edgeId
        });
        continue;
      }

      connectedNodeIds.add(edge.sourceId);
      connectedNodeIds.add(edge.targetId);

      // Check Edge Constraints
      const constraint = EDGE_CONSTRAINTS[edge.relationType as ThePaulXRelationType];
      if (constraint) {
        if (!constraint.allowedSources.includes(sourceNode.nodeType as any)) {
          errors.push({
            type: 'INVALID_EDGE_CONSTRAINT',
            message: `Edge ${edge.relationType} cannot originate from source type ${sourceNode.nodeType} (${sourceNode.nodeId})`,
            targetId: edge.edgeId
          });
        }
        if (!constraint.allowedTargets.includes(targetNode.nodeType as any)) {
          errors.push({
            type: 'INVALID_EDGE_CONSTRAINT',
            message: `Edge ${edge.relationType} cannot point to target type ${targetNode.nodeType} (${targetNode.nodeId})`,
            targetId: edge.edgeId
          });
        }
      }
    }

    // 3. Orphan Node Check (Skip BRAND node)
    for (const node of nodes) {
      if (node.nodeType !== 'BRAND' && !connectedNodeIds.has(node.nodeId)) {
        errors.push({
          type: 'ORPHAN_NODE',
          message: `Node ${node.nodeId} (${node.nodeType}) is an orphan with no connected edges`,
          targetId: node.nodeId
        });
      }
    }

    // 4. Circular Prerequisite Check (REQUIRES)
    const circularErrors = await this.detectCircularDependencies(nodes, edges);
    errors.push(...circularErrors);

    return errors;
  }

  private async detectCircularDependencies(nodes: any[], edges: any[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const requiresGraph = new Map<string, string[]>();

    edges.filter(e => e.relationType === 'REQUIRES').forEach(e => {
      if (!requiresGraph.has(e.sourceId)) requiresGraph.set(e.sourceId, []);
      requiresGraph.get(e.sourceId)!.push(e.targetId);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const neighbors = requiresGraph.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          errors.push({
            type: 'CIRCULAR_DEPENDENCY',
            message: `Circular REQUIRES dependency detected: ${path.join(' -> ')} -> ${neighbor}`,
            targetId: nodeId
          });
        }
      }

      recStack.delete(nodeId);
    };

    for (const node of nodes) {
      if (!visited.has(node.nodeId)) {
        dfs(node.nodeId, []);
      }
    }

    return errors;
  }
}
