package workspace

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/dto"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var workspaceService = service.NewWorkspaceService()

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

	userIDValue, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return
	}

	userID := userIDValue.(uint)

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

	userIDValue, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return
	}

	userID := userIDValue.(uint)

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
