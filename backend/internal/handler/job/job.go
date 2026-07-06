package job

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/executor"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var jobService = service.NewJobService()

var jobLogService = service.NewJobLogService()

var jobExecutor = executor.NewJobExecutor(
	jobService,
	jobLogService,
)

func getUserID(c *gin.Context) (uint, bool) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return 0, false
	}

	userID, ok := userIDValue.(uint)

	if !ok {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return 0, false
	}

	return userID, true
}

func parsePipelineID(c *gin.Context) (uint, bool) {
	pipelineID64, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil || pipelineID64 == 0 {
		response.BadRequest(
			c,
			"Invalid pipeline ID",
			nil,
		)
		return 0, false
	}

	return uint(pipelineID64), true
}

func RunPipeline(c *gin.Context) {
	pipelineID, ok := parsePipelineID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	createdJob, err := jobService.RunPipeline(
		pipelineID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrJobPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to start pipeline run",
		)
		return
	}

	forceFailure :=
	c.Query("forceFailure") == "true"

	jobExecutor.Execute(
		createdJob.ID,
		forceFailure,
	)

	response.Created(
		c,
		"Pipeline run queued successfully",
		gin.H{
			"id":         createdJob.ID,
			"pipelineId": createdJob.PipelineID,
			"status":     createdJob.Status,
			"createdAt":  createdJob.CreatedAt,
		},
	)
}

func List(c *gin.Context) {
	userID, ok := getUserID(c)

	if !ok {
		return
	}

	jobs, err := jobService.GetByUserID(
		userID,
	)

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch jobs",
		)
		return
	}

	response.OK(
		c,
		"Jobs fetched successfully",
		jobs,
	)
}

func ListByPipeline(c *gin.Context) {
	pipelineID, ok := parsePipelineID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	jobs, err := jobService.GetByPipelineID(
		pipelineID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrJobPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch pipeline jobs",
		)
		return
	}

	response.OK(
		c,
		"Pipeline jobs fetched successfully",
		jobs,
	)
}
