import { useState } from "react";

import {
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  Workflow,
} from "lucide-react";

import { motion } from "framer-motion";

import DashboardLayout from "@/layouts/DashboardLayout";
import NFButton from "@/components/ui/NFButton";

import CreatePipelineModal from "@/features/pipeline/components/CreatePipelineModal";
import EditPipelineModal from "@/features/pipeline/components/EditPipelineModal";
import DeletePipelineModal from "@/features/pipeline/components/DeletePipelineModal";


import { usePipelines } from "@/features/pipeline/hooks/usePipelines";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import type { Pipeline } from "@/features/pipeline/types/pipeline";
import { useDeletePipeline } from "@/features/pipeline/hooks/useDeletePipeline";
import { useRunPipeline } from "@/features/jobs/hooks/useRunPipeline";

export default function PipelinePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [
  pipelineToEdit,
  setPipelineToEdit,
] = useState<Pipeline | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [workspaceFilter, setWorkspaceFilter] =
    useState("all");
  
  const [
   pipelineToDelete,
   setPipelineToDelete,
] = useState<Pipeline | null>(null);

  const {
    data: pipelines = [],
    isLoading,
    isError,
    refetch,
  } = usePipelines();

  const {
    data: workspaces = [],
  } = useWorkspaces();

  const deleteMutation = useDeletePipeline();
  const runMutation = useRunPipeline();

  const workspaceNameById = new Map(
    workspaces.map((workspace) => [
      workspace.id,
      workspace.name,
    ])
  );

  const filteredPipelines = pipelines.filter(
    (pipeline) => {
      const query = searchQuery
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        pipeline.name
          .toLowerCase()
          .includes(query) ||
        pipeline.description
          .toLowerCase()
          .includes(query);

      const matchesWorkspace =
        workspaceFilter === "all" ||
        pipeline.workspaceId ===
          Number(workspaceFilter);

      return (
        matchesSearch &&
        matchesWorkspace
      );
    }
  );

  async function handleDeletePipeline() {
  if (!pipelineToDelete) {
    return;
  }

  try {
    await deleteMutation.mutateAsync(
      pipelineToDelete.id
    );

    setPipelineToDelete(null);
  } catch {
    // Keep the modal open if deletion fails.
  }
}

async function handleRunPipeline(
  pipelineId: number
) {
  try {
    await runMutation.mutateAsync(
      pipelineId
    );
  } catch {
    // The Jobs UI will handle detailed run errors later.
  }
}

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              Pipelines
            </h1>

            <p className="mt-3 text-slate-500">
              Design, manage, and monitor your data
              pipelines.
            </p>
          </div>

          <NFButton
            className="gap-2"
            onClick={() =>
              setIsCreateModalOpen(true)
            }
            disabled={workspaces.length === 0}
          >
            <Plus size={19} />
            Create Pipeline
          </NFButton>
        </section>

        {/* Search and Filter */}

        {!isLoading &&
          !isError &&
          pipelines.length > 0 && (
            <section className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search pipelines..."
                  className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 pl-12 pr-4 text-slate-800 shadow-sm outline-none backdrop-blur-xl transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <select
                value={workspaceFilter}
                onChange={(event) =>
                  setWorkspaceFilter(
                    event.target.value
                  )
                }
                className="h-12 min-w-56 rounded-2xl border border-white/60 bg-white/60 px-4 text-slate-700 shadow-sm outline-none backdrop-blur-xl transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">
                  All Workspaces
                </option>

                {workspaces.map((workspace) => (
                  <option
                    key={workspace.id}
                    value={workspace.id}
                  >
                    {workspace.name}
                  </option>
                ))}
              </select>
            </section>
          )}

        {/* Loading */}

        {isLoading && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-60 animate-pulse rounded-3xl border border-white/60 bg-white/50 shadow-lg backdrop-blur-2xl"
              />
            ))}
          </section>
        )}

        {/* Error */}

        {isError && (
          <section className="rounded-3xl border border-red-200 bg-red-50/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-red-700">
              Unable to load pipelines
            </h2>

            <p className="mt-2 text-red-600">
              Pipeline data could not be loaded.
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

        {/* No Workspaces */}

        {!isLoading &&
          !isError &&
          workspaces.length === 0 && (
            <section className="flex min-h-80 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="max-w-md text-center">
                <Workflow
                  size={48}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-5 text-2xl font-bold text-slate-800">
                  Create a workspace first
                </h2>

                <p className="mt-3 text-slate-500">
                  Pipelines belong to workspaces. Create
                  a workspace before creating your first
                  pipeline.
                </p>
              </div>
            </section>
          )}

        {/* Empty Pipeline State */}

        {!isLoading &&
          !isError &&
          workspaces.length > 0 &&
          pipelines.length === 0 && (
            <section className="flex min-h-80 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100">
                  <Workflow
                    size={38}
                    className="text-violet-600"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-800">
                  No pipelines yet
                </h2>

                <p className="mt-3 text-slate-500">
                  Create your first pipeline and connect
                  it to one of your workspaces.
                </p>

                <NFButton
                  className="mt-6 gap-2"
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                >
                  <Plus size={18} />
                  Create First Pipeline
                </NFButton>
              </div>
            </section>
          )}

        {/* No Search Results */}

        {!isLoading &&
          !isError &&
          pipelines.length > 0 &&
          filteredPipelines.length === 0 && (
            <section className="flex min-h-64 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="text-center">
                <Search
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <h2 className="mt-5 text-2xl font-bold text-slate-800">
                  No matching pipelines
                </h2>

                <p className="mt-2 text-slate-500">
                  Try a different search or workspace
                  filter.
                </p>
              </div>
            </section>
          )}

        {/* Pipeline Cards */}

        {!isLoading &&
          !isError &&
          filteredPipelines.length > 0 && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPipelines.map(
                (pipeline, index) => (
                  <motion.article
                    key={pipeline.id}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(
                        index * 0.06,
                        0.3
                      ),
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    className="rounded-3xl border border-white/60 bg-white/55 p-7 shadow-xl backdrop-blur-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
    <Workflow
      size={26}
      className="text-violet-600"
    />
  </div>

  <div className="flex items-center gap-2">
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
      {pipeline.status}
    </span>

    <button
      type="button"
      onClick={() =>
        setPipelineToEdit(pipeline)
      }
      aria-label={`Edit ${pipeline.name}`}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600"
    >
      <Pencil size={18} />
    </button>
    <button
  type="button"
  onClick={() =>
    setPipelineToDelete(pipeline)
  }
  aria-label={`Delete ${pipeline.name}`}
  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
>
  <Trash2 size={18} />
</button>
  </div>
</div>

                    <h2 className="mt-6 break-words text-xl font-bold text-slate-800">
                      {pipeline.name}
                    </h2>

                    <p className="mt-2 min-h-12 break-words text-sm leading-6 text-slate-500">
                      {pipeline.description ||
                        "No description provided."}
                    </p>

                    <div className="mt-6 border-t border-slate-200/70 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                      </p>

                      <p className="mt-1 truncate font-medium text-slate-700">
                        {workspaceNameById.get(
                          pipeline.workspaceId
                        ) ?? "Unknown Workspace"}
                      </p>
                    </div>
                    <NFButton
  className="mt-5 w-full gap-2"
  onClick={() =>
    handleRunPipeline(pipeline.id)
  }
  disabled={runMutation.isPending}
>
  <Play size={17} />

  {runMutation.isPending
    ? "Queuing..."
    : "Run Pipeline"}
</NFButton>
                  </motion.article>
                )
              )}
            </section>
          )}
      </div>

      <CreatePipelineModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
      />

      <EditPipelineModal
  pipeline={pipelineToEdit}
  onClose={() =>
    setPipelineToEdit(null)
  }
/>

<DeletePipelineModal
  pipeline={pipelineToDelete}
  isDeleting={deleteMutation.isPending}
  onClose={() =>
    setPipelineToDelete(null)
  }
  onConfirm={handleDeletePipeline}
/>
    </DashboardLayout>
  );
}