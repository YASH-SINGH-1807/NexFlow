import api from "@/services/api";

export type PipelineNodeType =
  | "source"
  | "transform"
  | "destination";

export interface PipelineNode {
  id: number;
  pipelineId: number;
  name: string;
  type: PipelineNodeType;
  config: string;
  positionX: number;
  positionY: number;
}

export interface PipelineEdge {
  id: number;
  pipelineId: number;
  sourceNodeId: number;
  targetNodeId: number;
}

export interface PipelineGraph {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export interface CreatePipelineNodePayload {
  name: string;
  type: PipelineNodeType;
  config?: string;
  positionX: number;
  positionY: number;
}

export interface CreatePipelineEdgePayload {
  sourceNodeId: number;
  targetNodeId: number;
}

export async function getPipelineGraph(
  pipelineId: number
): Promise<PipelineGraph> {
  const response = await api.get(
    `/pipelines/${pipelineId}/graph`
  );

  return response.data.data;
}

export async function createPipelineNode(
  pipelineId: number,
  data: CreatePipelineNodePayload
): Promise<PipelineNode> {
  const response = await api.post(
    `/pipelines/${pipelineId}/nodes`,
    data
  );

  return response.data.data;
}

export async function deletePipelineNode(
  pipelineId: number,
  nodeId: number
): Promise<void> {
  await api.delete(
    `/pipelines/${pipelineId}/nodes/${nodeId}`
  );
}

export async function createPipelineEdge(
  pipelineId: number,
  data: CreatePipelineEdgePayload
): Promise<PipelineEdge> {
  const response = await api.post(
    `/pipelines/${pipelineId}/edges`,
    data
  );

  return response.data.data;
}

export async function deletePipelineEdge(
  pipelineId: number,
  edgeId: number
): Promise<void> {
  await api.delete(
    `/pipelines/${pipelineId}/edges/${edgeId}`
  );
}