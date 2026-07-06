export type JobAnalysisStatus =
  | "pending"
  | "completed"
  | "failed";

export interface JobAnalysis {
  id: number;
  jobId: number;
  status: JobAnalysisStatus;

  summary: string;
  rootCause: string;
  suggestion: string;

  provider: string;
  modelName: string;

  errorMessage: string;

  createdAt: number;
  updatedAt: number;
}