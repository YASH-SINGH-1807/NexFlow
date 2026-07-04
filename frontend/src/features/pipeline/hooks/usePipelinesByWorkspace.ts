import { useQuery } from "@tanstack/react-query";

import { getPipelinesByWorkspace } from "../api/pipelineApi";

export function usePipelinesByWorkspace(
  workspaceId: number | null
) {
  return useQuery({
    queryKey: [
      "pipelines",
      "workspace",
      workspaceId,
    ],

    queryFn: () =>
      getPipelinesByWorkspace(
        workspaceId as number
      ),

    enabled: workspaceId !== null,
  });
}