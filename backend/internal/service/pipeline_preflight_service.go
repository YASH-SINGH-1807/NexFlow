package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrPipelineHasNoNodes = errors.New("pipeline has no nodes")

var ErrPipelineHasNoSource = errors.New("pipeline has no source node")

var ErrPipelineHasNoDestination = errors.New("pipeline has no destination node")

type PipelinePreflightService struct {
	repo *repository.PipelineGraphRepository
}

func NewPipelinePreflightService() *PipelinePreflightService {
	return &PipelinePreflightService{
		repo: repository.NewPipelineGraphRepository(),
	}
}
