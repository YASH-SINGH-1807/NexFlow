package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type PipelineRepository struct{}

func NewPipelineRepository() *PipelineRepository {
	return &PipelineRepository{}
}

func (r *PipelineRepository) WorkspaceBelongsToUser(
	workspaceID uint,
	userID uint,
) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.Workspace{}).
		Where(
			"id = ? AND user_id = ?",
			workspaceID,
			userID,
		).
		Count(&count).
		Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *PipelineRepository) Create(
	pipeline *model.Pipeline,
) error {
	return database.DB.
		Create(pipeline).
		Error
}

func (r *PipelineRepository) GetByUserID(
	userID uint,
) ([]model.Pipeline, error) {
	var pipelines []model.Pipeline

	err := database.DB.
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"workspaces.user_id = ?",
			userID,
		).
		Order(
			"pipelines.created_at DESC",
		).
		Find(&pipelines).
		Error

	return pipelines, err
}

func (r *PipelineRepository) GetByWorkspaceIDAndUserID(
	workspaceID uint,
	userID uint,
) ([]model.Pipeline, error) {
	var pipelines []model.Pipeline

	err := database.DB.
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"pipelines.workspace_id = ? AND workspaces.user_id = ?",
			workspaceID,
			userID,
		).
		Order(
			"pipelines.created_at DESC",
		).
		Find(&pipelines).
		Error

	return pipelines, err
}

func (r *PipelineRepository) UpdateByIDAndUserID(
	pipelineID uint,
	userID uint,
	name string,
	description string,
	status string,
) (bool, error) {
	result := database.DB.
		Model(&model.Pipeline{}).
		Where(
			`id = ? AND EXISTS (
				SELECT 1
				FROM workspaces
				WHERE workspaces.id = pipelines.workspace_id
				AND workspaces.user_id = ?
			)`,
			pipelineID,
			userID,
		).
		Updates(map[string]interface{}{
			"name":        name,
			"description": description,
			"status":      status,
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *PipelineRepository) DeleteByIDAndUserID(
	pipelineID uint,
	userID uint,
) (bool, error) {
	result := database.DB.
		Where(
			`id = ? AND EXISTS (
				SELECT 1
				FROM workspaces
				WHERE workspaces.id = pipelines.workspace_id
				AND workspaces.user_id = ?
			)`,
			pipelineID,
			userID,
		).
		Delete(&model.Pipeline{})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}
