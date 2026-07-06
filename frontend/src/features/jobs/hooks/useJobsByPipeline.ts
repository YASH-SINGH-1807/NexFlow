import { useQuery } from "@tanstack/react-query";

import { getJobsByPipeline } from "../api/jobApi";

export function useJobsByPipeline(
  pipelineId: number | null
) {
  return useQuery({
    queryKey: [
      "jobs",
      "pipeline",
      pipelineId,
    ],

    queryFn: () =>
      getJobsByPipeline(
        pipelineId as number
      ),

    enabled: pipelineId !== null,
  });
}