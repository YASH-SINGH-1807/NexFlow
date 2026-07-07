import type { Node } from "@xyflow/react";

export type PipelineEditorNodeType =
  | "source"
  | "transform"
  | "destination";

export type PipelineNodeData = {
  label: string;
  nodeType: PipelineEditorNodeType;
};

export type PipelineFlowNode = Node<
  PipelineNodeData,
  "pipelineNode"
>;