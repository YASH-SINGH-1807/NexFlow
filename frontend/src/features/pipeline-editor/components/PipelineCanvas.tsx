import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";

import {
  useCallback,
  useEffect,
} from "react";

import "@xyflow/react/dist/style.css";

import PipelineNode from "./PipelineNode";

import { usePipelineGraph } from "../hooks/usePipelineGraph";

import { useCreatePipelineEdge } from "../hooks/useCreatePipelineEdge";

import {
  mapPipelineGraphToFlow,
} from "../utils/graphMapper";

import type {
  PipelineFlowNode,
} from "../types/editor";

const nodeTypes: NodeTypes = {
  pipelineNode: PipelineNode,
};

interface PipelineCanvasProps {
  pipelineId: number;
}

const initialEdges: Edge[] = [];

export default function PipelineCanvas({
  pipelineId,
}: PipelineCanvasProps) {
  const [
  nodes,
  setNodes,
  onNodesChange,
] = useNodesState<PipelineFlowNode>([]);
  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

  const {
    data: graph,
    isLoading,
    isError,
  } = usePipelineGraph(pipelineId);

  const createEdgeMutation =
  useCreatePipelineEdge();

  useEffect(() => {
    if (!graph) {
      return;
    }

    const mappedGraph =
      mapPipelineGraphToFlow(graph);

    setNodes(mappedGraph.nodes);
    setEdges(mappedGraph.edges);
  }, [
    graph,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
  (connection: Connection) => {
    if (
      !connection.source ||
      !connection.target
    ) {
      return;
    }

    createEdgeMutation.mutate({
      pipelineId,

      data: {
        sourceNodeId: Number(
          connection.source
        ),

        targetNodeId: Number(
          connection.target
        ),
      },
    });
  },
  [
    createEdgeMutation,
    pipelineId,
  ]
);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border bg-white">
        <p className="font-medium text-slate-500">
          Loading pipeline graph...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-red-200 bg-red-50">
        <p className="font-medium text-red-600">
          Unable to load pipeline graph.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        h-full
        w-full
        overflow-hidden
        rounded-3xl
        border
        bg-white
      "
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}