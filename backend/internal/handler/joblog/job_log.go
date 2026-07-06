package joblog

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var jobLogService = service.NewJobLogService()

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

func parseJobID(c *gin.Context) (uint, bool) {
	jobID64, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil || jobID64 == 0 {
		response.BadRequest(
			c,
			"Invalid job ID",
			nil,
		)
		return 0, false
	}

	return uint(jobID64), true
}

func ListByJob(c *gin.Context) {
	jobID, ok := parseJobID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	logs, err := jobLogService.GetByJobID(
		jobID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrJobLogJobNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Job not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch job logs",
		)
		return
	}

	response.OK(
		c,
		"Job logs fetched successfully",
		logs,
	)
}
