package analysis

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/ai"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/config"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var analysisConfig = config.LoadConfig()

var failureAnalyzer = ai.NewFailureAnalyzerFromConfig(
	analysisConfig,
)

var jobAnalysisService = service.NewJobAnalysisService(
	failureAnalyzer,
)

func getUserID(
	c *gin.Context,
) (uint, bool) {
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

func parseJobID(
	c *gin.Context,
) (uint, bool) {
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

func Analyze(c *gin.Context) {
	jobID, ok := parseJobID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	ctx, cancel := timeContext(
		c,
	)

	defer cancel()

	analysisResult, err :=
		jobAnalysisService.Analyze(
			ctx,
			jobID,
			userID,
		)

	if errors.Is(
		err,
		service.ErrAnalysisJobNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Job not found or access denied",
			nil,
		)
		return
	}

	if errors.Is(
		err,
		service.ErrAnalysisJobNotFailed,
	) {
		response.BadRequest(
			c,
			"Only failed jobs can be analyzed",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to analyze job failure",
		)
		return
	}

	response.OK(
		c,
		"Job failure analyzed successfully",
		analysisResult,
	)
}

func Get(c *gin.Context) {
	jobID, ok := parseJobID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	analysisResult, err :=
		jobAnalysisService.GetByJobID(
			jobID,
			userID,
		)

	if errors.Is(
		err,
		service.ErrJobAnalysisNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Job analysis not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch job analysis",
		)
		return
	}

	response.OK(
		c,
		"Job analysis fetched successfully",
		analysisResult,
	)
}

func timeContext(
	c *gin.Context,
) (
	context.Context,
	context.CancelFunc,
) {
	return context.WithTimeout(
		c.Request.Context(),
		30*time.Second,
	)
}
