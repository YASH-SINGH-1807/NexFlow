import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import NFButton from "@/components/ui/NFButton";
import NFFormField from "@/components/ui/NFFormField";
import NFInput from "@/components/ui/NFInput";

import { useCreateWorkspace } from "../hooks/useCreateWorkspace";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createMutation = useCreateWorkspace();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        description: description.trim(),
      });

      setName("");
      setDescription("");
      setError("");
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to create workspace. Please try again."
      );
    }
  }

  function handleClose() {
    if (createMutation.isPending) {
      return;
    }

    setName("");
    setDescription("");
    setError("");
    onClose();
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
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-800">
                  Create Workspace
                </h2>

                <p className="mt-2 text-slate-500">
                  Create a new space for your pipelines and data projects.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={createMutation.isPending}
                aria-label="Close create workspace dialog"
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
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Sales Analytics"
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
                  disabled={createMutation.isPending}
                >
                  Cancel
                </NFButton>

                <NFButton
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? "Creating..."
                    : "Create Workspace"}
                </NFButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}