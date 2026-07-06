import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { analyzeJobFailure } from "../api/jobAnalysisApi";

export function useAnalyzeJobFailure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeJobFailure,

    onSuccess: (
      analysis,
      jobId
    ) => {
      queryClient.setQueryData(
        [
          "jobAnalysis",
          jobId,
        ],
        analysis
      );
    },
  });
}