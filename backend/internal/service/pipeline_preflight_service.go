package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrPipelineHasNoNodes = errors.New("pipeline has no nodes")

var ErrPipelineHasNoSource = errors.New("pipeline has no source node")

var ErrPipelineHasNoDestination = errors.New("pipeline has no destination node")

var ErrPipelineHasOrphanNodes = errors.New(
	"pipeline contains orphan nodes",
)

type PipelinePreflightService struct {
	repo *repository.PipelineGraphRepository
}

func NewPipelinePreflightService() *PipelinePreflightService {
	return &PipelinePreflightService{
		repo: repository.NewPipelineGraphRepository(),
	}
}

func (s *PipelinePreflightService) Validate(
	pipelineID uint,
) error {

	nodes, err :=
		s.repo.GetNodesByPipelineID(
			pipelineID,
		)

	if err != nil {
		return err
	}

	if len(nodes) == 0 {
		return ErrPipelineHasNoNodes
	}

	hasSource := false
	hasDestination := false

	for _, node := range nodes {

		if err := ValidateNodeConfig(
			node.Type,
			node.Config,
		); err != nil {
			return err
		}

		switch node.Type {

		case model.PipelineNodeTypeSource:
			hasSource = true

		case model.PipelineNodeTypeDestination:
			hasDestination = true
		}
	}

	if !hasSource {
		return ErrPipelineHasNoSource
	}

	if !hasDestination {
		return ErrPipelineHasNoDestination
	}

	edges, err := s.repo.GetEdgesByPipelineID(
		pipelineID,
	)

	if err != nil {
		return err
	}

	nodeIDs := make(map[uint]struct{})

	for _, node := range nodes {
		nodeIDs[node.ID] = struct{}{}
	}

	for _, edge := range edges {

		if _, ok := nodeIDs[edge.SourceNodeID]; !ok {
			return ErrGraphInvalidNodes
		}

		if _, ok := nodeIDs[edge.TargetNodeID]; !ok {
			return ErrGraphInvalidNodes
		}
	}

	connected := make(map[uint]bool)

	for _, edge := range edges {
		connected[edge.SourceNodeID] = true
		connected[edge.TargetNodeID] = true
	}

	for _, node := range nodes {
		if !connected[node.ID] {
			return ErrPipelineHasOrphanNodes
		}
	}

	return nil
}
