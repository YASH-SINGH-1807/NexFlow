import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updatePipelineNodePosition,
  type UpdatePipelineNodePositionPayload,
} from "@/features/pipeline/api/pipelineGraphApi";

interface UpdateNodePositionVariables {
  pipelineId: number;
  nodeId: number;
  data: UpdatePipelineNodePositionPayload;
}

export function useUpdatePipelineNodePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      nodeId,
      data,
    }: UpdateNodePositionVariables) =>
      updatePipelineNodePosition(
        pipelineId,
        nodeId,
        data
      ),

    onSuccess: async (
      _result,
      variables
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "pipeline-graph",
          variables.pipelineId,
        ],
      });
    },
  });
}