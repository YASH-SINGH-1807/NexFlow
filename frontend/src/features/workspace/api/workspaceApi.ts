import api from "@/services/api";
import type { Workspace } from "../types/workspace";

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get("/workspaces");

  return response.data.data;
}

export async function createWorkspace(data: {
  name: string;
  description: string;
}) {
  const response = await api.post("/workspaces", data);

  return response.data.data;
}

export async function deleteWorkspace(id: string): Promise<void> {
  await api.delete(`/workspaces/${id}`);
}