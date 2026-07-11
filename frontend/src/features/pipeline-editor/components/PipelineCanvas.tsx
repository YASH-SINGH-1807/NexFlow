import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
  type OnNodeDrag,
} from "@xyflow/react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import "@xyflow/react/dist/style.css";

import type {
  PipelineNodeType,
} from "@/features/pipeline/api/pipelineGraphApi";

import AddNodePanel from "./AddNodePanel";
import PipelineNode from "./PipelineNode";

import NodeConfigPanel from "./NodeConfigPanel";

import { useCreatePipelineEdge } from "../hooks/useCreatePipelineEdge";
import { useCreatePipelineNode } from "../hooks/useCreatePipelineNode";
import { usePipelineGraph } from "../hooks/usePipelineGraph";

import { useDeletePipelineNode } from "../hooks/useDeletePipelineNode";
import { useUpdatePipelineNodePosition } from "../hooks/useUpdatePipelineNodePosition";

import { useUpdatePipelineNode } from "../hooks/useUpdatePipelineNode";

import type {
  PipelineFlowNode,
} from "../types/editor";

import {
  mapPipelineGraphToFlow,
} from "../utils/graphMapper";

const nodeTypes: NodeTypes = {
  pipelineNode: PipelineNode,
};

interface PipelineCanvasProps {
  pipelineId: number;
}

const initialEdges: Edge[] = [];

const nodeNames: Record<
  PipelineNodeType,
  string
> = {
  source: "New Source",
  transform: "New Transform",
  destination: "New Destination",
};

export default function PipelineCanvas({
  pipelineId,
}: PipelineCanvasProps) {
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] =
    useNodesState<PipelineFlowNode>([]);

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

  const [
  selectedNodeId,
  setSelectedNodeId,
] = useState<number | null>(null);

  const createEdgeMutation =
    useCreatePipelineEdge();

  const createNodeMutation =
    useCreatePipelineNode();

    const deleteNodeMutation =
  useDeletePipelineNode();

  const deletingNodeId =
  deleteNodeMutation.isPending
    ? deleteNodeMutation.variables?.nodeId
    : undefined;

  const updateNodePositionMutation =
  useUpdatePipelineNodePosition();

  const updateNodeMutation =
  useUpdatePipelineNode();

 const handleDeleteNode = useCallback(
  (nodeId: number) => {
    deleteNodeMutation.mutate({
      pipelineId,
      nodeId,
    });
  },
  [
    deleteNodeMutation.mutate,
    pipelineId,
  ]
);

  useEffect(() => {
    if (!graph) {
      return;
    }

   const mappedGraph =
  mapPipelineGraphToFlow(
    graph,
    handleDeleteNode,
    deletingNodeId
  );

    setNodes(mappedGraph.nodes);
    setEdges(mappedGraph.edges);
  }, [
  graph,
  setNodes,
  setEdges,
  handleDeleteNode,
  deletingNodeId,
  ]);

  const handleAddNode = useCallback(
    (type: PipelineNodeType) => {
      const nodeIndex = nodes.length;

      createNodeMutation.mutate({
        pipelineId,

        data: {
          name: nodeNames[type],
          type,
          config:
  type === "source"
    ? JSON.stringify({
  connectionType: "postgresql",
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
})

    : type === "transform"
      ? JSON.stringify({
  operation: "filter",
  expression: "true",
})
      : JSON.stringify({
  destinationType: "postgresql",
  host: "localhost",
  port: 5432,
  database: "postgres",
  table: "output_table",
}),

          positionX:
            150 + (nodeIndex % 3) * 300,

          positionY:
            150 +
            Math.floor(nodeIndex / 3) *
              180,
        },
      });
    },
    [
      createNodeMutation,
      nodes.length,
      pipelineId,
    ]
  );

  const handleNodesDelete = useCallback(
  (deletedNodes: PipelineFlowNode[]) => {
    for (const node of deletedNodes) {
      deleteNodeMutation.mutate({
        pipelineId,
        nodeId: Number(node.id),
      });
    }
  },
  [
    deleteNodeMutation,
    pipelineId,
  ]
);



const handleNodeDragStop: OnNodeDrag<PipelineFlowNode> =
  useCallback(
    (_event, node) => {
      updateNodePositionMutation.mutate({
        pipelineId,
        nodeId: Number(node.id),

        data: {
          positionX: node.position.x,
          positionY: node.position.y,
        },
      });
    },
    [
      pipelineId,
      updateNodePositionMutation,
    ]
  );

  const handleNodeClick: NodeMouseHandler<PipelineFlowNode> =
  useCallback(
    (_event, node) => {
      setSelectedNodeId(
        Number(node.id)
      );
    },
    []
  );

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

  const selectedNode =
  graph?.nodes.find(
    (node) => node.id === selectedNodeId
  ) ?? null;

  const handleSaveNode = (data: {
  name: string;
  config: string;
}) => {
  if (!selectedNode) {
    return;
  }

  updateNodeMutation.mutate({
    pipelineId,
    nodeId: selectedNode.id,
    data,
  });
};

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <AddNodePanel
        onAddNode={handleAddNode}
        isCreating={
          createNodeMutation.isPending
        }
      />

      <div className="flex min-h-0 flex-1 gap-4">
  <div
    className="
      min-h-0
      flex-1
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
      onNodesDelete={handleNodesDelete}
      onNodeDragStop={handleNodeDragStop}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      deleteKeyCode={["Backspace", "Delete"]}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>

  {selectedNode && (
    <NodeConfigPanel
      node={selectedNode}
      isSaving={updateNodeMutation.isPending}
      onSave={handleSaveNode}
      onClose={() =>
        setSelectedNodeId(null)
      }
    />
  )}
</div>
    </div>
  );
}