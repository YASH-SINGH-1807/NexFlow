package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrPipelineWorkspaceNotFound = errors.New(
	"workspace not found or access denied",
)

var ErrPipelineNotFound = errors.New(
	"pipeline not found",
)

type PipelineService struct {
	repo *repository.PipelineRepository
}

func NewPipelineService() *PipelineService {
	return &PipelineService{
		repo: repository.NewPipelineRepository(),
	}
}

func (s *PipelineService) Create(
	pipeline *model.Pipeline,
	userID uint,
) error {
	allowed, err :=
		s.repo.WorkspaceBelongsToUser(
			pipeline.WorkspaceID,
			userID,
		)

	if err != nil {
		return err
	}

	if !allowed {
		return ErrPipelineWorkspaceNotFound
	}

	return s.repo.Create(pipeline)
}

func (s *PipelineService) GetByUserID(
	userID uint,
) ([]model.Pipeline, error) {
	return s.repo.GetByUserID(userID)
}

func (s *PipelineService) GetByWorkspaceID(
	workspaceID uint,
	userID uint,
) ([]model.Pipeline, error) {
	allowed, err :=
		s.repo.WorkspaceBelongsToUser(
			workspaceID,
			userID,
		)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, ErrPipelineWorkspaceNotFound
	}

	return s.repo.GetByWorkspaceIDAndUserID(
		workspaceID,
		userID,
	)
}

func (s *PipelineService) Update(
	pipelineID uint,
	userID uint,
	name string,
	description string,
	status string,
) error {
	updated, err :=
		s.repo.UpdateByIDAndUserID(
			pipelineID,
			userID,
			name,
			description,
			status,
		)

	if err != nil {
		return err
	}

	if !updated {
		return ErrPipelineNotFound
	}

	return nil
}

func (s *PipelineService) Delete(
	pipelineID uint,
	userID uint,
) error {
	deleted, err :=
		s.repo.DeleteByIDAndUserID(
			pipelineID,
			userID,
		)

	if err != nil {
		return err
	}

	if !deleted {
		return ErrPipelineNotFound
	}

	return nil
}
