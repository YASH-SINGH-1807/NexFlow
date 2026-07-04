import api from "@/services/api";
import type { Workspace } from "../types/workspace";

export interface WorkspacePayload {
  name: string;
  description: string;
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get("/workspaces");

  return response.data.data;
}

export async function createWorkspace(
  data: WorkspacePayload
): Promise<{ id: number }> {
  const response = await api.post("/workspaces", data);

  return response.data.data;
}

export async function updateWorkspace({
  id,
  data,
}: {
  id: number;
  data: WorkspacePayload;
}): Promise<void> {
  await api.put(`/workspaces/${id}`, data);
}

export async function deleteWorkspace(
  id: number
): Promise<void> {
  await api.delete(`/workspaces/${id}`);
}