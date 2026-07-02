package handler

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
)

func Home(c *gin.Context) {
	response.OK(
		c,
		"Welcome to NexFlow API",
		gin.H{
			"version": "v1",
		},
	)
}

func Health(c *gin.Context) {
	response.OK(
		c,
		"Server is healthy",
		gin.H{
			"status": "UP",
		},
	)
}
