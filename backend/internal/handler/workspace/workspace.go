package workspace

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

var workspaceService = service.NewWorkspaceService()

func getUserID(c *gin.Context) (uint, bool) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return 0, false
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		response.Unauthorized(c, "Unauthorized")
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

func Create(c *gin.Context) {
	var req dto.CreateWorkspaceRequest

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

	workspace := model.Workspace{
		Name:        req.Name,
		Description: req.Description,
		UserID:      userID,
	}

	if err := workspaceService.Create(&workspace); err != nil {
		response.InternalServerError(
			c,
			"Unable to create workspace",
		)
		return
	}

	response.Created(
		c,
		"Workspace created successfully",
		gin.H{
			"id": workspace.ID,
		},
	)
}

func List(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		return
	}

	workspaces, err := workspaceService.GetByUserID(userID)
	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch workspaces",
		)
		return
	}

	response.OK(
		c,
		"Workspaces fetched successfully",
		workspaces,
	)
}

func Update(c *gin.Context) {
	workspaceID, ok := parseWorkspaceID(c)
	if !ok {
		return
	}

	userID, ok := getUserID(c)
	if !ok {
		return
	}

	var req dto.UpdateWorkspaceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	err := workspaceService.Update(
		workspaceID,
		userID,
		req.Name,
		req.Description,
	)

	if errors.Is(err, service.ErrWorkspaceNotFound) {
		response.Error(
			c,
			http.StatusNotFound,
			"Workspace not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to update workspace",
		)
		return
	}

	response.OK(
		c,
		"Workspace updated successfully",
		nil,
	)
}

func Delete(c *gin.Context) {
	workspaceID, ok := parseWorkspaceID(c)
	if !ok {
		return
	}

	userID, ok := getUserID(c)
	if !ok {
		return
	}

	err := workspaceService.Delete(
		workspaceID,
		userID,
	)

	if errors.Is(err, service.ErrWorkspaceNotFound) {
		response.Error(
			c,
			http.StatusNotFound,
			"Workspace not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to delete workspace",
		)
		return
	}

	response.OK(
		c,
		"Workspace deleted successfully",
		nil,
	)
}
