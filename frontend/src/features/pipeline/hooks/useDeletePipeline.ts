import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deletePipeline } from "../api/pipelineApi";

export function useDeletePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePipeline,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });
}