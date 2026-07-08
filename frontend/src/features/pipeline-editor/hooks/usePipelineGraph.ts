import { useQuery } from "@tanstack/react-query";

import { getPipelineGraph } from "@/features/pipeline/api/pipelineGraphApi";

export function usePipelineGraph(
  pipelineId: number
) {
  return useQuery({
    queryKey: [
      "pipeline-graph",
      pipelineId,
    ],

    queryFn: () =>
      getPipelineGraph(pipelineId),

    enabled: pipelineId > 0,
  });
}