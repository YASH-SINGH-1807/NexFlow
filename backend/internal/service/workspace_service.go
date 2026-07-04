package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrWorkspaceNotFound = errors.New(
	"workspace not found",
)

type WorkspaceService struct {
	repo *repository.WorkspaceRepository
}

func NewWorkspaceService() *WorkspaceService {
	return &WorkspaceService{
		repo: repository.NewWorkspaceRepository(),
	}
}

func (s *WorkspaceService) Create(
	workspace *model.Workspace,
) error {
	return s.repo.Create(workspace)
}

func (s *WorkspaceService) GetByUserID(
	userID uint,
) ([]model.Workspace, error) {
	return s.repo.GetByUserID(userID)
}

func (s *WorkspaceService) Update(
	workspaceID uint,
	userID uint,
	name string,
	description string,
) error {
	updated, err := s.repo.UpdateByIDAndUserID(
		workspaceID,
		userID,
		name,
		description,
	)

	if err != nil {
		return err
	}

	if !updated {
		return ErrWorkspaceNotFound
	}

	return nil
}

func (s *WorkspaceService) Delete(
	workspaceID uint,
	userID uint,
) error {
	deleted, err := s.repo.DeleteByIDAndUserID(
		workspaceID,
		userID,
	)

	if err != nil {
		return err
	}

	if !deleted {
		return ErrWorkspaceNotFound
	}

	return nil
}
