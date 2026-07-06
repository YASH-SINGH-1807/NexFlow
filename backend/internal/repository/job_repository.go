package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type JobRepository struct{}

func NewJobRepository() *JobRepository {
	return &JobRepository{}
}

func (r *JobRepository) PipelineBelongsToUser(
	pipelineID uint,
	userID uint,
) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.Pipeline{}).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"pipelines.id = ? AND workspaces.user_id = ?",
			pipelineID,
			userID,
		).
		Count(&count).
		Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *JobRepository) Create(
	job *model.Job,
) error {
	return database.DB.
		Create(job).
		Error
}

func (r *JobRepository) GetByUserID(
	userID uint,
) ([]model.Job, error) {
	var jobs []model.Job

	err := database.DB.
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"workspaces.user_id = ?",
			userID,
		).
		Order(
			"jobs.created_at DESC",
		).
		Find(&jobs).
		Error

	return jobs, err
}

func (r *JobRepository) GetByPipelineIDAndUserID(
	pipelineID uint,
	userID uint,
) ([]model.Job, error) {
	var jobs []model.Job

	err := database.DB.
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"jobs.pipeline_id = ? AND workspaces.user_id = ?",
			pipelineID,
			userID,
		).
		Order(
			"jobs.created_at DESC",
		).
		Find(&jobs).
		Error

	return jobs, err
}

func (r *JobRepository) MarkRunning(
	jobID uint,
	startedAt int64,
) (bool, error) {
	result := database.DB.
		Model(&model.Job{}).
		Where(
			"id = ? AND status = ?",
			jobID,
			model.JobStatusQueued,
		).
		Updates(map[string]interface{}{
			"status":     model.JobStatusRunning,
			"started_at": startedAt,
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *JobRepository) MarkSucceeded(
	jobID uint,
	finishedAt int64,
) (bool, error) {
	result := database.DB.
		Model(&model.Job{}).
		Where(
			"id = ? AND status = ?",
			jobID,
			model.JobStatusRunning,
		).
		Updates(map[string]interface{}{
			"status":        model.JobStatusSucceeded,
			"finished_at":   finishedAt,
			"error_message": "",
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *JobRepository) MarkFailed(
	jobID uint,
	finishedAt int64,
	errorMessage string,
) (bool, error) {
	result := database.DB.
		Model(&model.Job{}).
		Where(
			"id = ? AND status = ?",
			jobID,
			model.JobStatusRunning,
		).
		Updates(map[string]interface{}{
			"status":        model.JobStatusFailed,
			"finished_at":   finishedAt,
			"error_message": errorMessage,
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *JobRepository) JobBelongsToUser(
	jobID uint,
	userID uint,
) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.Job{}).
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"jobs.id = ? AND workspaces.user_id = ?",
			jobID,
			userID,
		).
		Count(&count).
		Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *JobRepository) GetByIDAndUserID(
	jobID uint,
	userID uint,
) (*model.Job, error) {
	var job model.Job

	err := database.DB.
		Preload("Pipeline").
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"jobs.id = ? AND workspaces.user_id = ?",
			jobID,
			userID,
		).
		First(&job).
		Error

	if err != nil {
		return nil, err
	}

	return &job, nil
}
