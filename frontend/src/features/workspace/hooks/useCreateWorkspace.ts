import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createWorkspace } from "../api/workspaceApi";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}