package executor

import (
	"errors"
	"log"
	"time"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

type JobExecutor struct {
	jobService    *service.JobService
	jobLogService *service.JobLogService

	runtime *PipelineRuntime
}

func NewJobExecutor(
	jobService *service.JobService,
	jobLogService *service.JobLogService,
) *JobExecutor {

	return &JobExecutor{
		jobService:    jobService,
		jobLogService: jobLogService,

		runtime: NewPipelineRuntime(),
	}
}
func (e *JobExecutor) Execute(
	jobID uint,
	forceFailure bool,
) {
	go e.execute(
		jobID,
		forceFailure,
	)
}

func (e *JobExecutor) execute(
	jobID uint,
	forceFailure bool,
) {
	if err := e.jobService.MarkRunning(jobID); err != nil {
		log.Printf(
			"job %d failed to enter running state: %v",
			jobID,
			err,
		)
		return
	}

	if err := e.jobLogService.Info(
		jobID,
		"Job execution started",
	); err != nil {
		log.Printf(
			"job %d failed to write start log: %v",
			jobID,
			err,
		)
	}

	if err := e.run(
		jobID,
		forceFailure,
	); err != nil {
		if logErr := e.jobLogService.Error(
			jobID,
			err.Error(),
		); logErr != nil {
			log.Printf(
				"job %d failed to write error log: %v",
				jobID,
				logErr,
			)
		}

		if markErr := e.jobService.MarkFailed(
			jobID,
			err.Error(),
		); markErr != nil {
			log.Printf(
				"job %d failed to enter failed state: %v",
				jobID,
				markErr,
			)
			return
		}

		log.Printf(
			"job %d execution failed: %v",
			jobID,
			err,
		)
		return
	}

	if err := e.jobLogService.Info(
		jobID,
		"Pipeline execution completed successfully",
	); err != nil {
		log.Printf(
			"job %d failed to write completion log: %v",
			jobID,
			err,
		)
	}

	if err := e.jobService.MarkSucceeded(jobID); err != nil {
		log.Printf(
			"job %d failed to enter succeeded state: %v",
			jobID,
			err,
		)
		return
	}

	log.Printf(
		"job %d completed successfully",
		jobID,
	)
}

func (e *JobExecutor) run(
	jobID uint,
	forceFailure bool,
) error {
	if jobID == 0 {
		return errors.New(
			"invalid job ID",
		)
	}

	if err := e.jobLogService.Info(
		jobID,
		"Initializing pipeline execution environment",
	); err != nil {
		return err
	}

	job, err := e.jobService.GetByID(jobID)
	if err != nil {
		return err
	}

	_ = job

	time.Sleep(1 * time.Second)

	if err := e.jobLogService.Info(
		jobID,
		"Validating pipeline configuration",
	); err != nil {
		return err
	}

	time.Sleep(1 * time.Second)

	if forceFailure {
		return errors.New(
			"pipeline configuration validation failed: controlled test failure",
		)
	}

	if err := e.jobLogService.Info(
		jobID,
		"Executing pipeline workflow",
	); err != nil {
		return err
	}

	time.Sleep(1 * time.Second)

	if err := e.jobLogService.Info(
		jobID,
		"Finalizing pipeline execution",
	); err != nil {
		return err
	}

	time.Sleep(1 * time.Second)

	return nil
}
