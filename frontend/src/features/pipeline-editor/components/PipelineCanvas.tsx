import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";

import { useCallback } from "react";

import "@xyflow/react/dist/style.css";

import PipelineNode from "./PipelineNode";

const nodeTypes: NodeTypes = {
  pipelineNode: PipelineNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "pipelineNode",
    position: {
      x: 100,
      y: 150,
    },
    data: {
      label: "Input Database",
      nodeType: "source",
    },
  },
  {
    id: "2",
    type: "pipelineNode",
    position: {
      x: 400,
      y: 150,
    },
    data: {
      label: "Clean Data",
      nodeType: "transform",
    },
  },
  {
    id: "3",
    type: "pipelineNode",
    position: {
      x: 700,
      y: 150,
    },
    data: {
      label: "Output Storage",
      nodeType: "destination",
    },
  },
];

const initialEdges: Edge[] = [];

export default function PipelineCanvas() {
 const [
  nodes,
  ,
  onNodesChange,
] = useNodesState(initialNodes);
  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges)
      );
    },
    [setEdges]
  );

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