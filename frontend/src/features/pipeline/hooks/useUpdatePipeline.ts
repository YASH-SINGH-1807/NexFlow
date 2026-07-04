import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updatePipeline } from "../api/pipelineApi";

export function useUpdatePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePipeline,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });
}