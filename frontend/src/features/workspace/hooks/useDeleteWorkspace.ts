import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteWorkspace } from "../api/workspaceApi";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkspace,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}