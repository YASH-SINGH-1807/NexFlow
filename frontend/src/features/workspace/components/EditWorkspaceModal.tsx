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
  Pencil,
  X,
} from "lucide-react";

import NFButton from "@/components/ui/NFButton";
import NFFormField from "@/components/ui/NFFormField";
import NFInput from "@/components/ui/NFInput";

import { useUpdateWorkspace } from "../hooks/useUpdateWorkspace";
import type { Workspace } from "../types/workspace";

interface EditWorkspaceModalProps {
  workspace: Workspace | null;
  onClose: () => void;
}

export default function EditWorkspaceModal({
  workspace,
  onClose,
}: EditWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");

  const updateMutation = useUpdateWorkspace();

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setDescription(workspace.description ?? "");
      setError("");
    }
  }, [workspace]);

  function handleClose() {
    if (updateMutation.isPending) {
      return;
    }

    setError("");
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!workspace) {
      return;
    }

    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError(
        "Workspace name must be at least 2 characters."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: workspace.id,

        data: {
          name: trimmedName,
          description: description.trim(),
        },
      });

      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to update workspace. Please try again."
      );
    }
  }

  return (
    <AnimatePresence>
      {workspace && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
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
                  <Pencil
                    size={25}
                    className="text-violet-600"
                  />
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-800">
                  Edit Workspace
                </h2>

                <p className="mt-2 text-slate-500">
                  Update the workspace name and description.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={updateMutation.isPending}
                aria-label="Close edit workspace dialog"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <NFFormField label="Workspace Name">
                <NFInput
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Workspace name"
                  maxLength={150}
                  autoFocus
                />
              </NFFormField>

              <NFFormField label="Description">
                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the purpose of this workspace..."
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
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </NFButton>

                <NFButton
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </NFButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}