import {
  Database,
  Send,
  WandSparkles,
} from "lucide-react";

import type { PipelineNodeType } from "@/features/pipeline/api/pipelineGraphApi";

interface Props {
  onAddNode: (
    type: PipelineNodeType
  ) => void;

  isCreating?: boolean;
}

const nodeOptions = [
  {
    type: "source" as const,
    label: "Source",
    icon: Database,
  },
  {
    type: "transform" as const,
    label: "Transform",
    icon: WandSparkles,
  },
  {
    type: "destination" as const,
    label: "Destination",
    icon: Send,
  },
];

export default function AddNodePanel({
  onAddNode,
  isCreating = false,
}: Props) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white/80
        p-3
        shadow-sm
        backdrop-blur-xl
      "
    >
      <span
        className="
          mr-1
          text-sm
          font-bold
          text-slate-700
        "
      >
        Add Node
      </span>

      {nodeOptions.map((option) => {
        const Icon = option.icon;

        return (
          <button
            key={option.type}
            type="button"
            disabled={isCreating}
            onClick={() =>
              onAddNode(option.type)
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:text-blue-600
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Icon size={16} />

            {option.label}
          </button>
        );
      })}
    </div>
  );
}