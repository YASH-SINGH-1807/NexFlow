import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createPipeline } from "../api/pipelineApi";

export function useCreatePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPipeline,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });
}