package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrGraphPipelineNotFound = errors.New(
	"pipeline not found or access denied",
)

var ErrGraphNodeNotFound = errors.New(
	"node not found",
)

var ErrGraphEdgeNotFound = errors.New(
	"edge not found",
)

var ErrGraphInvalidNodes = errors.New(
	"source or target node does not belong to pipeline",
)

var ErrGraphSelfLoop = errors.New(
	"node cannot connect to itself",
)

var ErrGraphCycleDetected = errors.New(
	"edge would create a cycle",
)

type PipelineGraphService struct {
	repo *repository.PipelineGraphRepository
}

func NewPipelineGraphService() *PipelineGraphService {
	return &PipelineGraphService{
		repo: repository.NewPipelineGraphRepository(),
	}
}

func (s *PipelineGraphService) CreateNode(
	node *model.PipelineNode,
	userID uint,
) error {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			node.PipelineID,
			userID,
		)

	if err != nil {
		return err
	}

	if !allowed {
		return ErrGraphPipelineNotFound
	}

	return s.repo.CreateNode(node)
}

func (s *PipelineGraphService) GetGraph(
	pipelineID uint,
	userID uint,
) (
	[]model.PipelineNode,
	[]model.PipelineEdge,
	error,
) {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			pipelineID,
			userID,
		)

	if err != nil {
		return nil, nil, err
	}

	if !allowed {
		return nil, nil, ErrGraphPipelineNotFound
	}

	nodes, err :=
		s.repo.GetNodesByPipelineID(
			pipelineID,
		)

	if err != nil {
		return nil, nil, err
	}

	edges, err :=
		s.repo.GetEdgesByPipelineID(
			pipelineID,
		)

	if err != nil {
		return nil, nil, err
	}

	return nodes, edges, nil
}

func (s *PipelineGraphService) DeleteNode(
	pipelineID uint,
	nodeID uint,
	userID uint,
) error {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			pipelineID,
			userID,
		)

	if err != nil {
		return err
	}

	if !allowed {
		return ErrGraphPipelineNotFound
	}

	deleted, err :=
		s.repo.DeleteNode(
			nodeID,
			pipelineID,
		)

	if err != nil {
		return err
	}

	if !deleted {
		return ErrGraphNodeNotFound
	}

	return nil
}

func (s *PipelineGraphService) CreateEdge(
	edge *model.PipelineEdge,
	userID uint,
) error {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			edge.PipelineID,
			userID,
		)

	if err != nil {
		return err
	}

	if !allowed {
		return ErrGraphPipelineNotFound
	}

	if edge.SourceNodeID ==
		edge.TargetNodeID {
		return ErrGraphSelfLoop
	}

	nodesValid, err :=
		s.repo.NodesBelongToPipeline(
			edge.PipelineID,
			edge.SourceNodeID,
			edge.TargetNodeID,
		)

	if err != nil {
		return err
	}

	if !nodesValid {
		return ErrGraphInvalidNodes
	}

	edges, err :=
		s.repo.GetEdgesByPipelineID(
			edge.PipelineID,
		)

	if err != nil {
		return err
	}

	if wouldCreateCycle(
		edges,
		edge.SourceNodeID,
		edge.TargetNodeID,
	) {
		return ErrGraphCycleDetected
	}

	return s.repo.CreateEdge(edge)
}

func (s *PipelineGraphService) DeleteEdge(
	pipelineID uint,
	edgeID uint,
	userID uint,
) error {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			pipelineID,
			userID,
		)

	if err != nil {
		return err
	}

	if !allowed {
		return ErrGraphPipelineNotFound
	}

	deleted, err :=
		s.repo.DeleteEdge(
			edgeID,
			pipelineID,
		)

	if err != nil {
		return err
	}

	if !deleted {
		return ErrGraphEdgeNotFound
	}

	return nil
}

func wouldCreateCycle(
	edges []model.PipelineEdge,
	sourceNodeID uint,
	targetNodeID uint,
) bool {
	adjacency :=
		make(map[uint][]uint)

	for _, edge := range edges {
		adjacency[edge.SourceNodeID] =
			append(
				adjacency[edge.SourceNodeID],
				edge.TargetNodeID,
			)
	}

	adjacency[sourceNodeID] =
		append(
			adjacency[sourceNodeID],
			targetNodeID,
		)

	visited := make(map[uint]bool)

	var canReachSource func(uint) bool

	canReachSource = func(
		current uint,
	) bool {
		if current == sourceNodeID {
			return true
		}

		if visited[current] {
			return false
		}

		visited[current] = true

		for _, next := range adjacency[current] {
			if canReachSource(next) {
				return true
			}
		}

		return false
	}

	return canReachSource(
		targetNodeID,
	)
}
