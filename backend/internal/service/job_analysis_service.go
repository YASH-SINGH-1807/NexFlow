package service

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/ai"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrAnalysisJobNotFound = errors.New(
	"job not found or access denied",
)

var ErrAnalysisJobNotFailed = errors.New(
	"only failed jobs can be analyzed",
)

var ErrJobAnalysisNotFound = errors.New(
	"job analysis not found",
)

type JobAnalysisService struct {
	analysisRepo *repository.JobAnalysisRepository
	jobRepo      *repository.JobRepository
	logRepo      *repository.JobLogRepository
	analyzer     ai.FailureAnalyzer
}

func NewJobAnalysisService(
	analyzer ai.FailureAnalyzer,
) *JobAnalysisService {
	return &JobAnalysisService{
		analysisRepo: repository.NewJobAnalysisRepository(),
		jobRepo:      repository.NewJobRepository(),
		logRepo:      repository.NewJobLogRepository(),
		analyzer:     analyzer,
	}
}

func (s *JobAnalysisService) Analyze(
	ctx context.Context,
	jobID uint,
	userID uint,
) (*model.JobAnalysis, error) {
	job, err := s.jobRepo.GetByIDAndUserID(
		jobID,
		userID,
	)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrAnalysisJobNotFound
	}

	if err != nil {
		return nil, err
	}

	if job.Status != model.JobStatusFailed {
		return nil, ErrAnalysisJobNotFailed
	}

	existingAnalysis, err :=
		s.analysisRepo.GetByJobID(jobID)

	if err == nil {
		return existingAnalysis, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	logs, err := s.logRepo.GetByJobIDAndUserID(
		jobID,
		userID,
	)

	if err != nil {
		return nil, err
	}

	analysis := &model.JobAnalysis{
		JobID:  jobID,
		Status: model.JobAnalysisStatusPending,
	}

	if err := s.analysisRepo.Create(analysis); err != nil {
		return nil, err
	}

	result, err := s.analyzer.AnalyzeFailure(
		ctx,
		ai.FailureAnalysisInput{
			JobID:        job.ID,
			PipelineName: job.Pipeline.Name,
			ErrorMessage: job.ErrorMessage,
			Logs:         logs,
		},
	)

	if err != nil {
		updateErr := s.analysisRepo.UpdateFailed(
			jobID,
			err.Error(),
		)

		if updateErr != nil {
			return nil, updateErr
		}

		return nil, err
	}

	err = s.analysisRepo.UpdateCompleted(
		jobID,
		result.Summary,
		result.RootCause,
		result.Suggestion,
		result.Provider,
		result.ModelName,
	)

	if err != nil {
		return nil, err
	}

	return s.analysisRepo.GetByJobIDAndUserID(
		jobID,
		userID,
	)
}

func (s *JobAnalysisService) GetByJobID(
	jobID uint,
	userID uint,
) (*model.JobAnalysis, error) {
	analysis, err :=
		s.analysisRepo.GetByJobIDAndUserID(
			jobID,
			userID,
		)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return analysis, nil
}
