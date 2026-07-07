import {
  Database,
  Send,
  WandSparkles,
} from "lucide-react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import type {
  PipelineFlowNode,
  PipelineEditorNodeType,
} from "../types/editor";

function getNodeIcon(
  nodeType: PipelineEditorNodeType
) {
  switch (nodeType) {
    case "source":
      return Database;

    case "transform":
      return WandSparkles;

    case "destination":
      return Send;
  }
}

function getNodeLabel(
  nodeType: PipelineEditorNodeType
) {
  switch (nodeType) {
    case "source":
      return "Source";

    case "transform":
      return "Transform";

    case "destination":
      return "Destination";
  }
}

export default function PipelineNode({
  data,
  selected,
}: NodeProps<PipelineFlowNode>) {
  const Icon = getNodeIcon(data.nodeType);

  return (
    <div
      className={`
        min-w-[220px]
        rounded-2xl
        border
        bg-white
        p-4
        shadow-lg
        transition-all
        ${
          selected
            ? "border-blue-500 ring-4 ring-blue-100"
            : "border-slate-200"
        }
      `}
    >
      {data.nodeType !== "source" && (
        <Handle
          type="target"
          position={Position.Left}
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >
          <Icon size={22} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            {getNodeLabel(data.nodeType)}
          </p>

          <h3 className="text-sm font-bold text-slate-800">
            {data.label}
          </h3>
        </div>
      </div>

      {data.nodeType !== "destination" && (
        <Handle
          type="source"
          position={Position.Right}
        />
      )}
    </div>
  );
}