import {
  BriefcaseBusiness,
  Database,
  FolderKanban,
  Workflow,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { usePipelines } from "@/features/pipeline/hooks/usePipelines";
import { useJobs } from "@/features/jobs/hooks/useJobs";

export default function DashboardPage() {
  const {
    data: workspaces = [],
    isLoading: isWorkspacesLoading,
    isError: isWorkspacesError,
    refetch: refetchWorkspaces,
  } = useWorkspaces();

  const {
    data: pipelines = [],
    isLoading: isPipelinesLoading,
  } = usePipelines();

  const {
    data: jobs = [],
    isLoading: isJobsLoading,
  } = useJobs();

  const recentWorkspaces = workspaces.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}

        <section>
          <h1 className="text-5xl font-black tracking-tight text-slate-800">
            Welcome back 👋
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Manage your data pipelines and workspaces from one place.
          </p>
        </section>

        {/* Statistics */}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Workspaces"
            value={
              isWorkspacesLoading
                ? "..."
                : workspaces.length.toString()
            }
            icon={
              <FolderKanban
                size={28}
                className="text-blue-600"
              />
            }
          />

          <DashboardStatCard
            title="Pipelines"
            value={
              isPipelinesLoading
                ? "..."
                : pipelines.length.toString()
            }
            icon={
              <Workflow
                size={28}
                className="text-violet-600"
              />
            }
          />

          <DashboardStatCard
  title="Jobs"
  value={
    isJobsLoading
      ? "..."
      : jobs.length.toString()
  }
  icon={
    <BriefcaseBusiness
      size={28}
      className="text-emerald-600"
    />
  }
/>

          <DashboardStatCard
            title="Storage"
            value="0 GB"
            icon={
              <Database
                size={28}
                className="text-orange-600"
              />
            }
          />
        </section>

        {/* Recent Workspaces */}

        <section className="rounded-3xl border border-white/60 bg-white/55 p-8 shadow-xl backdrop-blur-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Workspaces
            </h2>

            <p className="mt-2 text-slate-500">
              Your most recently created workspaces.
            </p>
          </div>

          {/* Loading */}

          {isWorkspacesLoading && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl bg-white/60"
                />
              ))}
            </div>
          )}

          {/* Error */}

          {isWorkspacesError && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/70 p-6">
              <h3 className="font-semibold text-red-700">
                Unable to load workspaces
              </h3>

              <p className="mt-2 text-sm text-red-600">
                Workspace data could not be loaded.
              </p>

              <button
                type="button"
                onClick={() => refetchWorkspaces()}
                className="mt-4 cursor-pointer font-semibold text-red-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}

          {!isWorkspacesLoading &&
            !isWorkspacesError &&
            workspaces.length === 0 && (
              <div className="mt-8 flex h-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <FolderKanban
                    size={56}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 text-xl font-semibold text-slate-700">
                    No Workspaces Yet
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Create your first workspace to start building data pipelines.
                  </p>
                </div>
              </div>
            )}

          {/* Recent Workspace Cards */}

          {!isWorkspacesLoading &&
            !isWorkspacesError &&
            recentWorkspaces.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {recentWorkspaces.map((workspace) => (
                  <article
                    key={workspace.id}
                    className="rounded-2xl border border-white/70 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                      <FolderKanban
                        size={23}
                        className="text-blue-600"
                      />
                    </div>

                    <h3 className="mt-5 break-words text-lg font-bold text-slate-800">
                      {workspace.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 break-words text-sm leading-5 text-slate-500">
                      {workspace.description ||
                        "No description provided."}
                    </p>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </DashboardLayout>
  );
}