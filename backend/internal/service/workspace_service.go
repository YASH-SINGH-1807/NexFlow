package service

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

type WorkspaceService struct {
	repo *repository.WorkspaceRepository
}

func NewWorkspaceService() *WorkspaceService {
	return &WorkspaceService{
		repo: repository.NewWorkspaceRepository(),
	}
}

func (s *WorkspaceService) Create(workspace *model.Workspace) error {
	return s.repo.Create(workspace)
}

func (s *WorkspaceService) GetByUserID(userID uint) ([]model.Workspace, error) {
	return s.repo.GetByUserID(userID)
}
