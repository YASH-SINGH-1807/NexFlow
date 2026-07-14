import { useQuery } from "@tanstack/react-query";

import { getJobAnalysis } from "../api/jobAnalysisApi";

export function useJobAnalysis(
  jobId: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ["jobAnalysis", jobId],

    queryFn: async () => {
      return await getJobAnalysis(jobId as number);
    },

    enabled: jobId !== null && enabled,

    retry: false,

    staleTime: Infinity,
  });
}