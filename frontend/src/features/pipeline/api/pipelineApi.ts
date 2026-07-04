import api from "@/services/api";

import type {
  Pipeline,
  PipelineStatus,
} from "../types/pipeline";

export interface CreatePipelinePayload {
  name: string;
  description: string;
  workspaceId: number;
}

export interface UpdatePipelinePayload {
  name: string;
  description: string;
  status: PipelineStatus;
}

export async function getPipelines(): Promise<Pipeline[]> {
  const response = await api.get("/pipelines");

  return response.data.data;
}

export async function getPipelinesByWorkspace(
  workspaceId: number
): Promise<Pipeline[]> {
  const response = await api.get(
    `/workspaces/${workspaceId}/pipelines`
  );

  return response.data.data;
}

export async function createPipeline(
  data: CreatePipelinePayload
): Promise<{ id: number }> {
  const response = await api.post(
    "/pipelines",
    data
  );

  return response.data.data;
}

export async function updatePipeline({
  id,
  data,
}: {
  id: number;
  data: UpdatePipelinePayload;
}): Promise<void> {
  await api.put(`/pipelines/${id}`, data);
}

export async function deletePipeline(
  id: number
): Promise<void> {
  await api.delete(`/pipelines/${id}`);
}