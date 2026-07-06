import {
  BriefcaseBusiness,
  Clock3,
  Workflow,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import NFButton from "@/components/ui/NFButton";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import { usePipelines } from "@/features/pipeline/hooks/usePipelines";

import type {
  Job,
  JobStatus,
} from "@/features/jobs/types/job";

function getStatusClasses(
  status: JobStatus
): string {
  switch (status) {
    case "queued":
      return "bg-amber-100 text-amber-700";

    case "running":
      return "bg-blue-100 text-blue-700";

    case "succeeded":
      return "bg-emerald-100 text-emerald-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "cancelled":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatJobTime(
  timestamp: number
): string {
  if (!timestamp) {
    return "Unknown";
  }

  return new Date(timestamp).toLocaleString();
}

export default function JobsPage() {
  const {
    data: jobs = [],
    isLoading,
    isError,
    refetch,
  } = useJobs();

  const {
    data: pipelines = [],
  } = usePipelines();

  const pipelineNameById = new Map(
    pipelines.map((pipeline) => [
      pipeline.id,
      pipeline.name,
    ])
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <section>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">
            Jobs
          </h1>

          <p className="mt-3 text-slate-500">
            Monitor pipeline executions and job status.
          </p>
        </section>

        {/* Loading */}

        {isLoading && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-3xl border border-white/60 bg-white/50 shadow-lg backdrop-blur-2xl"
              />
            ))}
          </section>
        )}

        {/* Error */}

        {isError && (
          <section className="rounded-3xl border border-red-200 bg-red-50/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-red-700">
              Unable to load jobs
            </h2>

            <p className="mt-2 text-red-600">
              Job history could not be loaded.
            </p>

            <NFButton
              className="mt-5"
              variant="outline"
              onClick={() => refetch()}
            >
              Try Again
            </NFButton>
          </section>
        )}

        {/* Empty State */}

        {!isLoading &&
          !isError &&
          jobs.length === 0 && (
            <section className="flex min-h-80 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100">
                  <BriefcaseBusiness
                    size={38}
                    className="text-emerald-600"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-800">
                  No jobs yet
                </h2>

                <p className="mt-3 text-slate-500">
                  Run a pipeline to create your first
                  execution job.
                </p>
              </div>
            </section>
          )}

        {/* Job Cards */}

        {!isLoading &&
          !isError &&
          jobs.length > 0 && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job: Job) => (
                <article
                  key={job.id}
                  className="rounded-3xl border border-white/60 bg-white/55 p-7 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                      <BriefcaseBusiness
                        size={26}
                        className="text-emerald-600"
                      />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <h2 className="mt-6 break-words text-xl font-bold text-slate-800">
                    {pipelineNameById.get(
                      job.pipelineId
                    ) ?? "Unknown Pipeline"}
                  </h2>

                  <div className="mt-5 space-y-4 border-t border-slate-200/70 pt-5">
                    <div className="flex items-center gap-3">
                      <Workflow
                        size={17}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Job ID
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          #{job.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock3
                        size={17}
                        className="text-slate-400"
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatJobTime(
                            job.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {job.errorMessage && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
                      <p className="text-sm leading-6 text-red-700">
                        {job.errorMessage}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
      </div>
    </DashboardLayout>
  );
}