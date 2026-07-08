import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPipelineNode,
  type CreatePipelineNodePayload,
} from "@/features/pipeline/api/pipelineGraphApi";

interface CreatePipelineNodeVariables {
  pipelineId: number;
  data: CreatePipelineNodePayload;
}

export function useCreatePipelineNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      data,
    }: CreatePipelineNodeVariables) =>
      createPipelineNode(
        pipelineId,
        data
      ),

    onSuccess: async (
      _createdNode,
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