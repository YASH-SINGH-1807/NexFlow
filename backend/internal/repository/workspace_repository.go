package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type WorkspaceRepository struct{}

func NewWorkspaceRepository() *WorkspaceRepository {
	return &WorkspaceRepository{}
}

func (r *WorkspaceRepository) Create(
	workspace *model.Workspace,
) error {
	return database.DB.Create(workspace).Error
}

func (r *WorkspaceRepository) GetByUserID(
	userID uint,
) ([]model.Workspace, error) {
	var workspaces []model.Workspace

	err := database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&workspaces).
		Error

	return workspaces, err
}

func (r *WorkspaceRepository) UpdateByIDAndUserID(
	workspaceID uint,
	userID uint,
	name string,
	description string,
) (bool, error) {
	result := database.DB.
		Model(&model.Workspace{}).
		Where(
			"id = ? AND user_id = ?",
			workspaceID,
			userID,
		).
		Updates(map[string]interface{}{
			"name":        name,
			"description": description,
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *WorkspaceRepository) DeleteByIDAndUserID(
	workspaceID uint,
	userID uint,
) (bool, error) {
	result := database.DB.
		Where(
			"id = ? AND user_id = ?",
			workspaceID,
			userID,
		).
		Delete(&model.Workspace{})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}
