package service

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

type ExecutionNode struct {
	Node model.PipelineNode

	ParentIDs []uint
	ChildIDs  []uint
}

type ExecutionPlan struct {
	Nodes []ExecutionNode
}

type PipelineExecutionPlanner struct {
	repo *repository.PipelineGraphRepository
}

func NewPipelineExecutionPlanner() *PipelineExecutionPlanner {
	return &PipelineExecutionPlanner{
		repo: repository.NewPipelineGraphRepository(),
	}
}

func (p *PipelineExecutionPlanner) BuildExecutionPlan(
	pipelineID uint,
) (*ExecutionPlan, error) {

	nodes, err :=
		p.repo.GetNodesByPipelineID(
			pipelineID,
		)

	if err != nil {
		return nil, err
	}

	edges, err :=
		p.repo.GetEdgesByPipelineID(
			pipelineID,
		)

	if err != nil {
		return nil, err
	}

	adjacency := make(map[uint][]uint)
	inDegree := make(map[uint]int)

	for _, node := range nodes {
		inDegree[node.ID] = 0
	}

	for _, edge := range edges {
		adjacency[edge.SourceNodeID] = append(
			adjacency[edge.SourceNodeID],
			edge.TargetNodeID,
		)

		inDegree[edge.TargetNodeID]++
	}

	queue := make([]uint, 0)

	for nodeID, degree := range inDegree {
		if degree == 0 {
			queue = append(queue, nodeID)
		}
	}

	sortedIDs := make([]uint, 0, len(nodes))

	for len(queue) > 0 {

		current := queue[0]
		queue = queue[1:]

		sortedIDs = append(
			sortedIDs,
			current,
		)

		for _, next := range adjacency[current] {

			inDegree[next]--

			if inDegree[next] == 0 {
				queue = append(
					queue,
					next,
				)
			}
		}
	}

	if len(sortedIDs) != len(nodes) {
		return nil, ErrGraphCycleDetected
	}

	nodeMap := make(map[uint]model.PipelineNode)

	for _, node := range nodes {
		nodeMap[node.ID] = node
	}

	orderedNodes := make(
		[]ExecutionNode,
		0,
		len(sortedIDs),
	)

	for _, id := range sortedIDs {

		executionNode := ExecutionNode{
			Node:      nodeMap[id],
			ParentIDs: []uint{},
			ChildIDs:  []uint{},
		}

		for _, edge := range edges {

			if edge.TargetNodeID == id {
				executionNode.ParentIDs = append(
					executionNode.ParentIDs,
					edge.SourceNodeID,
				)
			}

			if edge.SourceNodeID == id {
				executionNode.ChildIDs = append(
					executionNode.ChildIDs,
					edge.TargetNodeID,
				)
			}
		}

		orderedNodes = append(
			orderedNodes,
			executionNode,
		)
	}

	return &ExecutionPlan{
		Nodes: orderedNodes,
	}, nil
}
