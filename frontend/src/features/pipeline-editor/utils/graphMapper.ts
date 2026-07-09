import type {
  Edge,
} from "@xyflow/react";

import type {
  PipelineEdge,
  PipelineGraph,
  PipelineNode,
} from "@/features/pipeline/api/pipelineGraphApi";

import type {
  PipelineFlowNode,
} from "../types/editor";

export function mapPipelineNodeToFlowNode(
  node: PipelineNode,
  onDelete?: (nodeId: number) => void,
  deletingNodeId?: number
): PipelineFlowNode {
  return {
    id: String(node.id),
    type: "pipelineNode",

    position: {
      x: node.positionX,
      y: node.positionY,
    },

    data: {
  label: node.name,
  nodeType: node.type,
  onDelete,
  isDeleting: deletingNodeId === node.id,
},
  };
}

export function mapPipelineEdgeToFlowEdge(
  edge: PipelineEdge
): Edge {
  return {
    id: String(edge.id),
    source: String(edge.sourceNodeId),
    target: String(edge.targetNodeId),
  };
}

export function mapPipelineGraphToFlow(
  graph: PipelineGraph,
  onDelete?: (nodeId: number) => void,
  deletingNodeId?: number
): {
  nodes: PipelineFlowNode[];
  edges: Edge[];
} {
  return {
    nodes: graph.nodes.map((node) =>
      mapPipelineNodeToFlowNode(
  node,
  onDelete,
  deletingNodeId
)
    ),

    edges: graph.edges.map(
      mapPipelineEdgeToFlowEdge
    ),
  };
}