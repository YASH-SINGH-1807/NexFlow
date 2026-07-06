import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { runPipeline } from "../api/jobApi";

export function useRunPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runPipeline,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}