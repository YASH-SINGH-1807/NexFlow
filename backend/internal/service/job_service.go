package service

import (
	"errors"
	"time"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
)

var ErrJobPipelineNotFound = errors.New(
	"pipeline not found or access denied",
)

var ErrInvalidJobTransition = errors.New(
	"invalid job status transition",
)

type JobService struct {
	repo *repository.JobRepository
}

func NewJobService() *JobService {
	return &JobService{
		repo: repository.NewJobRepository(),
	}
}

func (s *JobService) RunPipeline(
	pipelineID uint,
	userID uint,
) (*model.Job, error) {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			pipelineID,
			userID,
		)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, ErrJobPipelineNotFound
	}

	job := &model.Job{
		PipelineID: pipelineID,
		Status:     model.JobStatusQueued,
	}

	if err := s.repo.Create(job); err != nil {
		return nil, err
	}

	return job, nil
}

func (s *JobService) GetByUserID(
	userID uint,
) ([]model.Job, error) {
	return s.repo.GetByUserID(userID)
}

func (s *JobService) GetByPipelineID(
	pipelineID uint,
	userID uint,
) ([]model.Job, error) {
	allowed, err :=
		s.repo.PipelineBelongsToUser(
			pipelineID,
			userID,
		)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, ErrJobPipelineNotFound
	}

	return s.repo.GetByPipelineIDAndUserID(
		pipelineID,
		userID,
	)
}

func (s *JobService) MarkRunning(
	jobID uint,
) error {
	startedAt := time.Now().UnixMilli()

	updated, err := s.repo.MarkRunning(
		jobID,
		startedAt,
	)

	if err != nil {
		return err
	}

	if !updated {
		return ErrInvalidJobTransition
	}

	return nil
}

func (s *JobService) MarkSucceeded(
	jobID uint,
) error {
	finishedAt := time.Now().UnixMilli()

	updated, err := s.repo.MarkSucceeded(
		jobID,
		finishedAt,
	)

	if err != nil {
		return err
	}

	if !updated {
		return ErrInvalidJobTransition
	}

	return nil
}

func (s *JobService) MarkFailed(
	jobID uint,
	errorMessage string,
) error {
	finishedAt := time.Now().UnixMilli()

	updated, err := s.repo.MarkFailed(
		jobID,
		finishedAt,
		errorMessage,
	)

	if err != nil {
		return err
	}

	if !updated {
		return ErrInvalidJobTransition
	}

	return nil
}
