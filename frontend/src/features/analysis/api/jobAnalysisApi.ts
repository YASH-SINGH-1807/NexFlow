import api from "@/services/api";

import type { JobAnalysis } from "../types/jobAnalysis";

export async function analyzeJobFailure(
  jobId: number
): Promise<JobAnalysis> {
  const response = await api.post(
    `/jobs/${jobId}/analysis`
  );

  return response.data.data;
}

export async function getJobAnalysis(
  jobId: number
): Promise<JobAnalysis | null> {
  try {
    const response = await api.get(
      `/jobs/${jobId}/analysis`
    );

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}