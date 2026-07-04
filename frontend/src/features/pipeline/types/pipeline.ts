export type PipelineStatus =
  | "draft"
  | "active"
  | "paused";

export interface Pipeline {
  id: number;
  name: string;
  description: string;
  status: PipelineStatus;
  workspaceId: number;
  createdAt: number;
  updatedAt: number;
}