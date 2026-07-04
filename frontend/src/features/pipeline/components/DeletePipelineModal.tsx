import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Trash2,
  X,
} from "lucide-react";

import NFButton from "@/components/ui/NFButton";

import type { Pipeline } from "../types/pipeline";

interface DeletePipelineModalProps {
  pipeline: Pipeline | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePipelineModal({
  pipeline,
  isDeleting,
  onClose,
  onConfirm,
}: DeletePipelineModalProps) {
  function handleClose() {
    if (isDeleting) {
      return;
    }

    onClose();
  }

  return (
    <AnimatePresence>
      {pipeline && (
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
            className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <Trash2
                  size={26}
                  className="text-red-600"
                />
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                aria-label="Close delete pipeline dialog"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-800">
              Delete Pipeline?
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {pipeline.name}
              </span>
              ? This action cannot be undone from the
              application.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <NFButton
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
              >
                Cancel
              </NFButton>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="h-11 cursor-pointer rounded-2xl bg-red-600 px-5 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Pipeline"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}