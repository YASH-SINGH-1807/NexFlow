package handler

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
)

func Profile(c *gin.Context) {

	userID, _ := c.Get("userID")

	response.OK(
		c,
		"Profile fetched successfully",
		gin.H{
			"userId": userID,
		},
	)
}
