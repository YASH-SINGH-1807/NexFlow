export type JobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface Job {
  id: number;
  pipelineId: number;
  status: JobStatus;
  startedAt: number | null;
  finishedAt: number | null;
  errorMessage: string;
  createdAt: number;
  updatedAt: number;
}