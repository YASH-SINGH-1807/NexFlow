package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/handler"
)

func RegisterRoutes(router *gin.Engine) {

	router.GET("/", handler.Home)

	router.GET("/health", handler.Health)

}
