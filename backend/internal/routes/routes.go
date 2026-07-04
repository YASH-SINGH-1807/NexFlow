package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/handler"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/handler/auth"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/handler/pipeline"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/handler/workspace"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/middleware"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET(
		"/",
		handler.Home,
	)

	router.GET(
		"/health",
		handler.Health,
	)

	api := router.Group("/api/v1")

	// Public authentication routes

	authRoutes := api.Group("/auth")
	{
		authRoutes.POST(
			"/register",
			auth.Register,
		)

		authRoutes.POST(
			"/login",
			auth.Login,
		)
	}

	// Protected routes

	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Profile

		protected.GET(
			"/profile",
			handler.Profile,
		)

		// Workspace routes

		protected.POST(
			"/workspaces",
			workspace.Create,
		)

		protected.GET(
			"/workspaces",
			workspace.List,
		)

		protected.PUT(
			"/workspaces/:id",
			workspace.Update,
		)

		protected.DELETE(
			"/workspaces/:id",
			workspace.Delete,
		)

		// Pipeline routes

		protected.POST(
			"/pipelines",
			pipeline.Create,
		)

		protected.GET(
			"/pipelines",
			pipeline.List,
		)

		protected.PUT(
			"/pipelines/:id",
			pipeline.Update,
		)

		protected.DELETE(
			"/pipelines/:id",
			pipeline.Delete,
		)
		protected.GET(
			"/workspaces/:id/pipelines",
			pipeline.ListByWorkspace,
		)
	}
}
