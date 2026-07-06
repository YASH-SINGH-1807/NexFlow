import { useQuery } from "@tanstack/react-query";

import { getJobAnalysis } from "../api/jobAnalysisApi";

export function useJobAnalysis(
  jobId: number | null
) {
  return useQuery({
    queryKey: [
      "jobAnalysis",
      jobId,
    ],

    queryFn: () =>
      getJobAnalysis(jobId as number),

    enabled: jobId !== null,
    retry: false,
  });
}