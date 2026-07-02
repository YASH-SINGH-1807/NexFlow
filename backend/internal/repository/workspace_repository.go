package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type WorkspaceRepository struct{}

func NewWorkspaceRepository() *WorkspaceRepository {
	return &WorkspaceRepository{}
}

func (r *WorkspaceRepository) Create(workspace *model.Workspace) error {
	return database.DB.Create(workspace).Error
}

func (r *WorkspaceRepository) GetByUserID(userID uint) ([]model.Workspace, error) {

	var workspaces []model.Workspace

	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&workspaces).Error

	return workspaces, err
}
