import api from "@/services/api";

import type { Job } from "../types/job";

export async function getJobs(): Promise<Job[]> {
  const response = await api.get("/jobs");

  return response.data.data;
}

export async function getJobsByPipeline(
  pipelineId: number
): Promise<Job[]> {
  const response = await api.get(
    `/pipelines/${pipelineId}/jobs`
  );

  return response.data.data;
}

export async function runPipeline(
  pipelineId: number
): Promise<{
  id: number;
  pipelineId: number;
  status: string;
  createdAt: number;
}> {
  const response = await api.post(
    `/pipelines/${pipelineId}/run`
  );

  return response.data.data;
}