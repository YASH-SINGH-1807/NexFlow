import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateWorkspace } from "../api/workspaceApi";

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspace,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}