import { useState } from "react";

import {
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

import DashboardLayout from "@/layouts/DashboardLayout";
import NFButton from "@/components/ui/NFButton";

import CreateWorkspaceModal from "@/features/workspace/components/CreateWorkspaceModal";
import DeleteWorkspaceModal from "@/features/workspace/components/DeleteWorkspaceModal";
import EditWorkspaceModal from "@/features/workspace/components/EditWorkspaceModal";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useDeleteWorkspace } from "@/features/workspace/hooks/useDeleteWorkspace";

import type { Workspace } from "@/features/workspace/types/workspace";

export default function WorkspacePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [
    workspaceToEdit,
    setWorkspaceToEdit,
  ] = useState<Workspace | null>(null);

  const [
    workspaceToDelete,
    setWorkspaceToDelete,
  ] = useState<Workspace | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const {
    data: workspaces = [],
    isLoading,
    isError,
    refetch,
  } = useWorkspaces();

  const deleteMutation = useDeleteWorkspace();

  const filteredWorkspaces = workspaces.filter(
    (workspace) => {
      const query = searchQuery
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        workspace.name
          .toLowerCase()
          .includes(query) ||
        workspace.description
          .toLowerCase()
          .includes(query)
      );
    }
  );

  async function handleDeleteWorkspace() {
    if (!workspaceToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(
        workspaceToDelete.id
      );

      setWorkspaceToDelete(null);
    } catch {
      // Keep modal open if deletion fails.
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              Workspaces
            </h1>

            <p className="mt-3 text-slate-500">
              Organize your pipelines, jobs, and data
              projects.
            </p>
          </div>

          <NFButton
            className="gap-2"
            onClick={() =>
              setIsCreateModalOpen(true)
            }
          >
            <Plus size={19} />

            Create Workspace
          </NFButton>
        </section>

        {/* Search */}

        {!isLoading &&
          !isError &&
          workspaces.length > 0 && (
            <div className="relative max-w-md">
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
                placeholder="Search workspaces..."
                className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 pl-12 pr-4 text-slate-800 shadow-sm outline-none backdrop-blur-xl transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          )}

        {/* Loading State */}

        {isLoading && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-3xl border border-white/60 bg-white/50 shadow-lg backdrop-blur-2xl"
              />
            ))}
          </section>
        )}

        {/* API Error State */}

        {isError && (
          <section className="rounded-3xl border border-red-200 bg-red-50/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-red-700">
              Unable to load workspaces
            </h2>

            <p className="mt-2 text-red-600">
              The workspace data could not be loaded.
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

        {/* Empty Workspace State */}

        {!isLoading &&
          !isError &&
          workspaces.length === 0 && (
            <section className="flex min-h-80 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
                  <FolderKanban
                    size={38}
                    className="text-blue-600"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-800">
                  No workspaces yet
                </h2>

                <p className="mt-3 text-slate-500">
                  Create your first workspace to
                  organize pipelines and start building
                  data workflows.
                </p>

                <NFButton
                  className="mt-6 gap-2"
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                >
                  <Plus size={18} />

                  Create First Workspace
                </NFButton>
              </div>
            </section>
          )}

        {/* Search No Results State */}

        {!isLoading &&
          !isError &&
          workspaces.length > 0 &&
          filteredWorkspaces.length === 0 && (
            <section className="flex min-h-64 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 p-10 backdrop-blur-2xl">
              <div className="text-center">
                <Search
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <h2 className="mt-5 text-2xl font-bold text-slate-800">
                  No matching workspaces
                </h2>

                <p className="mt-2 text-slate-500">
                  Try searching with a different name or
                  description.
                </p>
              </div>
            </section>
          )}

        {/* Workspace Cards */}

        {!isLoading &&
          !isError &&
          filteredWorkspaces.length > 0 && (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkspaces.map(
                (workspace, index) => (
                  <motion.article
                    key={workspace.id}
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
                    className="group relative rounded-3xl border border-white/60 bg-white/55 p-7 shadow-xl backdrop-blur-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                        <FolderKanban
                          size={25}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                        {/* Edit Button */}

                        <button
                          type="button"
                          onClick={() =>
                            setWorkspaceToEdit(
                              workspace
                            )
                          }
                          aria-label={`Edit ${workspace.name}`}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600 focus:opacity-100"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* Delete Button */}

                        <button
                          type="button"
                          onClick={() =>
                            setWorkspaceToDelete(
                              workspace
                            )
                          }
                          aria-label={`Delete ${workspace.name}`}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </div>

                    <h2 className="mt-6 break-words text-xl font-bold text-slate-800">
                      {workspace.name}
                    </h2>

                    <p className="mt-2 min-h-12 break-words text-sm leading-6 text-slate-500">
                      {workspace.description ||
                        "No description provided."}
                    </p>
                  </motion.article>
                )
              )}
            </section>
          )}
      </div>

      {/* Create Modal */}

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
      />

      {/* Edit Modal */}

      <EditWorkspaceModal
        workspace={workspaceToEdit}
        onClose={() =>
          setWorkspaceToEdit(null)
        }
      />

      {/* Delete Modal */}

      <DeleteWorkspaceModal
        workspace={workspaceToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() =>
          setWorkspaceToDelete(null)
        }
        onConfirm={handleDeleteWorkspace}
      />
    </DashboardLayout>
  );
}