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

import { useUpdatePipeline } from "../hooks/useUpdatePipeline";

import type {
  Pipeline,
  PipelineStatus,
} from "../types/pipeline";

interface EditPipelineModalProps {
  pipeline: Pipeline | null;
  onClose: () => void;
}

export default function EditPipelineModal({
  pipeline,
  onClose,
}: EditPipelineModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<PipelineStatus>("draft");

  const [error, setError] = useState("");

  const updateMutation = useUpdatePipeline();

  useEffect(() => {
    if (!pipeline) {
      return;
    }

    setName(pipeline.name);
    setDescription(
      pipeline.description ?? ""
    );
    setStatus(pipeline.status);
    setError("");
  }, [pipeline]);

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

    if (!pipeline) {
      return;
    }

    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError(
        "Pipeline name must be at least 2 characters."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: pipeline.id,

        data: {
          name: trimmedName,
          description: description.trim(),
          status,
        },
      });

      onClose();
    } catch (err: unknown) {
      const fallbackMessage =
        "Unable to update pipeline. Please try again.";

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
      {pipeline && (
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
                  Edit Pipeline
                </h2>

                <p className="mt-2 text-slate-500">
                  Update pipeline details and lifecycle
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={updateMutation.isPending}
                aria-label="Close edit pipeline dialog"
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
                  placeholder="Pipeline name"
                  maxLength={150}
                  autoFocus
                />
              </NFFormField>

              <NFFormField label="Status">
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as PipelineStatus
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 px-4 text-slate-800 shadow-sm outline-none backdrop-blur-xl transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="paused">
                    Paused
                  </option>
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
                  placeholder="Describe what this pipeline does..."
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