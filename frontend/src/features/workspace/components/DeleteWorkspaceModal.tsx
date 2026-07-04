import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

import NFButton from "@/components/ui/NFButton";
import type { Workspace } from "../types/workspace";

interface DeleteWorkspaceModalProps {
  workspace: Workspace | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteWorkspaceModal({
  workspace,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteWorkspaceModalProps) {
  function handleClose() {
    if (!isDeleting) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {workspace && (
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
            className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <AlertTriangle
                  size={27}
                  className="text-red-600"
                />
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-800">
              Delete Workspace?
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {workspace.name}
              </span>
              ? This workspace will be removed from your active workspace list.
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

              <NFButton
                type="button"
                variant="danger"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Workspace"}
              </NFButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}