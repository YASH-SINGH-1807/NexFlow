import { useQuery } from "@tanstack/react-query";

import { getPipelines } from "../api/pipelineApi";

export function usePipelines() {
  return useQuery({
    queryKey: ["pipelines"],
    queryFn: getPipelines,
  });
}