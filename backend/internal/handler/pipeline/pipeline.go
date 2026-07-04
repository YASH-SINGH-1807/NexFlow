package pipeline

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/dto"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var pipelineService = service.NewPipelineService()

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

func parseWorkspaceID(c *gin.Context) (uint, bool) {
	workspaceID64, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil || workspaceID64 == 0 {
		response.BadRequest(
			c,
			"Invalid workspace ID",
			nil,
		)
		return 0, false
	}

	return uint(workspaceID64), true
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

func Create(c *gin.Context) {
	var req dto.CreatePipelineRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	pipeline := model.Pipeline{
		Name:        req.Name,
		Description: req.Description,
		Status:      "draft",
		WorkspaceID: req.WorkspaceID,
	}

	err := pipelineService.Create(
		&pipeline,
		userID,
	)

	if errors.Is(
		err,
		service.ErrPipelineWorkspaceNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Workspace not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to create pipeline",
		)
		return
	}

	response.Created(
		c,
		"Pipeline created successfully",
		gin.H{
			"id": pipeline.ID,
		},
	)
}

func List(c *gin.Context) {
	userID, ok := getUserID(c)

	if !ok {
		return
	}

	pipelines, err :=
		pipelineService.GetByUserID(userID)

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch pipelines",
		)
		return
	}

	response.OK(
		c,
		"Pipelines fetched successfully",
		pipelines,
	)
}

func ListByWorkspace(c *gin.Context) {
	workspaceID, ok := parseWorkspaceID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	pipelines, err :=
		pipelineService.GetByWorkspaceID(
			workspaceID,
			userID,
		)

	if errors.Is(
		err,
		service.ErrPipelineWorkspaceNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Workspace not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch pipelines",
		)
		return
	}

	response.OK(
		c,
		"Pipelines fetched successfully",
		pipelines,
	)
}

func Update(c *gin.Context) {
	pipelineID, ok := parsePipelineID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	var req dto.UpdatePipelineRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	err := pipelineService.Update(
		pipelineID,
		userID,
		req.Name,
		req.Description,
		req.Status,
	)

	if errors.Is(
		err,
		service.ErrPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to update pipeline",
		)
		return
	}

	response.OK(
		c,
		"Pipeline updated successfully",
		nil,
	)
}

func Delete(c *gin.Context) {
	pipelineID, ok := parsePipelineID(c)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	err := pipelineService.Delete(
		pipelineID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to delete pipeline",
		)
		return
	}

	response.OK(
		c,
		"Pipeline deleted successfully",
		nil,
	)
}
