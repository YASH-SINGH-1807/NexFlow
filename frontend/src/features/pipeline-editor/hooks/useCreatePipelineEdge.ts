import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPipelineEdge,
  type CreatePipelineEdgePayload,
} from "@/features/pipeline/api/pipelineGraphApi";

interface CreatePipelineEdgeVariables {
  pipelineId: number;
  data: CreatePipelineEdgePayload;
}

export function useCreatePipelineEdge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pipelineId,
      data,
    }: CreatePipelineEdgeVariables) =>
      createPipelineEdge(
        pipelineId,
        data
      ),

    onSuccess: async (
      _createdEdge,
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