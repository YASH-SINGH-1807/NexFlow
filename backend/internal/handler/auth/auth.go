package auth

import (
	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/dto"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var userService = service.NewUserService()

func Register(c *gin.Context) {

	var req dto.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	user := model.User{
		Name:         req.Name,
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: req.Password,
	}

	if err := userService.Register(&user); err != nil {
		response.BadRequest(
			c,
			err.Error(),
			nil,
		)
		return
	}

	response.Created(
		c,
		"User registered successfully",
		gin.H{
			"id": user.ID,
		},
	)
}

func Login(c *gin.Context) {

	var req dto.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	token, err := userService.Login(
		req.Login,
		req.Password,
	)

	if err != nil {
		response.Unauthorized(
			c,
			err.Error(),
		)
		return
	}

	response.OK(
		c,
		"Login successful",
		gin.H{
			"token": token,
		},
	)
}
