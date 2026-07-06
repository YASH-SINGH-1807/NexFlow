package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrJobLogJobNotFound = errors.New(
	"job not found or access denied",
)

type JobLogService struct {
	repo    *repository.JobLogRepository
	jobRepo *repository.JobRepository
}

func NewJobLogService() *JobLogService {
	return &JobLogService{
		repo:    repository.NewJobLogRepository(),
		jobRepo: repository.NewJobRepository(),
	}
}

func (s *JobLogService) Info(
	jobID uint,
	message string,
) error {
	jobLog := model.JobLog{
		JobID:   jobID,
		Level:   model.JobLogLevelInfo,
		Message: message,
	}

	return s.repo.Create(&jobLog)
}

func (s *JobLogService) Error(
	jobID uint,
	message string,
) error {
	jobLog := model.JobLog{
		JobID:   jobID,
		Level:   model.JobLogLevelError,
		Message: message,
	}

	return s.repo.Create(&jobLog)
}

func (s *JobLogService) GetByJobID(
	jobID uint,
	userID uint,
) ([]model.JobLog, error) {
	allowed, err := s.jobRepo.JobBelongsToUser(
		jobID,
		userID,
	)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, ErrJobLogJobNotFound
	}

	return s.repo.GetByJobIDAndUserID(
		jobID,
		userID,
	)
}
