package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type JobLogRepository struct{}

func NewJobLogRepository() *JobLogRepository {
	return &JobLogRepository{}
}

func (r *JobLogRepository) Create(
	jobLog *model.JobLog,
) error {
	return database.DB.
		Create(jobLog).
		Error
}

func (r *JobLogRepository) GetByJobIDAndUserID(
	jobID uint,
	userID uint,
) ([]model.JobLog, error) {
	var logs []model.JobLog

	err := database.DB.
		Joins(
			"JOIN jobs ON jobs.id = job_logs.job_id",
		).
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"job_logs.job_id = ? AND workspaces.user_id = ?",
			jobID,
			userID,
		).
		Order(
			"job_logs.created_at ASC",
		).
		Find(&logs).
		Error

	return logs, err
}
