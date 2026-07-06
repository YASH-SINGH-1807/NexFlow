package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type JobAnalysisRepository struct{}

func NewJobAnalysisRepository() *JobAnalysisRepository {
	return &JobAnalysisRepository{}
}

func (r *JobAnalysisRepository) Create(
	analysis *model.JobAnalysis,
) error {
	return database.DB.
		Create(analysis).
		Error
}

func (r *JobAnalysisRepository) GetByJobIDAndUserID(
	jobID uint,
	userID uint,
) (*model.JobAnalysis, error) {
	var analysis model.JobAnalysis

	err := database.DB.
		Joins(
			"JOIN jobs ON jobs.id = job_analyses.job_id",
		).
		Joins(
			"JOIN pipelines ON pipelines.id = jobs.pipeline_id",
		).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"job_analyses.job_id = ? AND workspaces.user_id = ?",
			jobID,
			userID,
		).
		First(&analysis).
		Error

	if err != nil {
		return nil, err
	}

	return &analysis, nil
}

func (r *JobAnalysisRepository) UpdateCompleted(
	jobID uint,
	summary string,
	rootCause string,
	suggestion string,
	provider string,
	modelName string,
) error {
	return database.DB.
		Model(&model.JobAnalysis{}).
		Where("job_id = ?", jobID).
		Updates(map[string]interface{}{
			"status":        model.JobAnalysisStatusCompleted,
			"summary":       summary,
			"root_cause":    rootCause,
			"suggestion":    suggestion,
			"provider":      provider,
			"model_name":    modelName,
			"error_message": "",
		}).
		Error
}

func (r *JobAnalysisRepository) UpdateFailed(
	jobID uint,
	errorMessage string,
) error {
	return database.DB.
		Model(&model.JobAnalysis{}).
		Where("job_id = ?", jobID).
		Updates(map[string]interface{}{
			"status":        model.JobAnalysisStatusFailed,
			"error_message": errorMessage,
		}).
		Error
}

func (r *JobAnalysisRepository) GetByJobID(
	jobID uint,
) (*model.JobAnalysis, error) {
	var analysis model.JobAnalysis

	err := database.DB.
		Where("job_id = ?", jobID).
		First(&analysis).
		Error

	if err != nil {
		return nil, err
	}

	return &analysis, nil
}
