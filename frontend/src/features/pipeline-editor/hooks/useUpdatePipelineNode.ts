import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updatePipelineNode,
  type UpdatePipelineNodePayload,
} from "@/features/pipeline/api/pipelineGraphApi";

interface UpdatePipelineNodeVariables {
  pipelineId: number;
  nodeId: number;
  data: UpdatePipelineNodePayload;
}

export function useUpdatePipelineNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      nodeId,
      data,
    }: UpdatePipelineNodeVariables) =>
      updatePipelineNode(
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