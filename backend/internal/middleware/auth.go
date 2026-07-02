package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/utils"
)

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			response.Unauthorized(
				c,
				"Authorization header is required",
			)
			c.Abort()
			return
		}

		const bearer = "Bearer "

		if !strings.HasPrefix(authHeader, bearer) {
			response.Unauthorized(
				c,
				"Invalid authorization header",
			)
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, bearer)

		claims, err := utils.ValidateToken(token)
		if err != nil {
			response.Unauthorized(
				c,
				"Invalid or expired token",
			)
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)

		c.Next()
	}
}
