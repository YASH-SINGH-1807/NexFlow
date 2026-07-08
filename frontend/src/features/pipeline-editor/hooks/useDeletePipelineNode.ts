import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deletePipelineNode,
} from "@/features/pipeline/api/pipelineGraphApi";

interface DeletePipelineNodeVariables {
  pipelineId: number;
  nodeId: number;
}

export function useDeletePipelineNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      nodeId,
    }: DeletePipelineNodeVariables) =>
      deletePipelineNode(
        pipelineId,
        nodeId
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