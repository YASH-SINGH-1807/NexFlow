import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Workflow,
  X,
} from "lucide-react";

import NFButton from "@/components/ui/NFButton";
import NFFormField from "@/components/ui/NFFormField";
import NFInput from "@/components/ui/NFInput";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useCreatePipeline } from "../hooks/useCreatePipeline";

interface CreatePipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePipelineModal({
  isOpen,
  onClose,
}: CreatePipelineModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [workspaceId, setWorkspaceId] =
    useState("");

  const [error, setError] = useState("");

  const {
    data: workspaces = [],
    isLoading: isLoadingWorkspaces,
  } = useWorkspaces();

  const createMutation = useCreatePipeline();

  useEffect(() => {
    if (
      isOpen &&
      !workspaceId &&
      workspaces.length > 0
    ) {
      setWorkspaceId(
        workspaces[0].id.toString()
      );
    }
  }, [
    isOpen,
    workspaceId,
    workspaces,
  ]);

  function resetForm() {
    setName("");
    setDescription("");
    setWorkspaceId("");
    setError("");
  }

  function handleClose() {
    if (createMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError(
        "Pipeline name must be at least 2 characters."
      );
      return;
    }

    const selectedWorkspaceId =
      Number(workspaceId);

    if (
      !Number.isInteger(selectedWorkspaceId) ||
      selectedWorkspaceId <= 0
    ) {
      setError(
        "Please select a valid workspace."
      );
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        description: description.trim(),
        workspaceId: selectedWorkspaceId,
      });

      resetForm();
      onClose();
    } catch (err: unknown) {
      const fallbackMessage =
        "Unable to create pipeline. Please try again.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const responseError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          responseError.response?.data?.message ??
            fallbackMessage
        );

        return;
      }

      setError(fallbackMessage);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-md"
          onMouseDown={handleClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.97,
            }}
            transition={{
              duration: 0.25,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                  <Workflow
                    size={27}
                    className="text-violet-600"
                  />
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-800">
                  Create Pipeline
                </h2>

                <p className="mt-2 text-slate-500">
                  Create a pipeline inside one of your
                  workspaces.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={createMutation.isPending}
                aria-label="Close create pipeline dialog"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <NFFormField label="Pipeline Name">
                <NFInput
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Customer Data Pipeline"
                  maxLength={150}
                  autoFocus
                />
              </NFFormField>

              <NFFormField label="Workspace">
                <select
                  value={workspaceId}
                  onChange={(event) =>
                    setWorkspaceId(
                      event.target.value
                    )
                  }
                  disabled={
                    isLoadingWorkspaces ||
                    workspaces.length === 0
                  }
                  className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 px-4 text-slate-800 shadow-sm outline-none backdrop-blur-xl transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {workspaces.length === 0 && (
                    <option value="">
                      No workspaces available
                    </option>
                  )}

                  {workspaces.map((workspace) => (
                    <option
                      key={workspace.id}
                      value={workspace.id}
                    >
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </NFFormField>

              <NFFormField label="Description">
                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what this pipeline will do..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-slate-800 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </NFFormField>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <NFButton
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </NFButton>

                <NFButton
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    workspaces.length === 0
                  }
                >
                  {createMutation.isPending
                    ? "Creating..."
                    : "Create Pipeline"}
                </NFButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}