package main

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/common"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/config"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/routes"
)

func main() {

	common.InitLogger()
	defer common.Log.Sync()

	cfg := config.LoadConfig()

	database.Connect(cfg)

	common.Log.Info("Starting NexFlow Backend")

	router := gin.Default()

	routes.RegisterRoutes(router)

	common.Log.Info(
		"Server is starting",
		zap.String("port", cfg.ServerPort),
	)

	if err := router.Run(":" + cfg.ServerPort); err != nil {
		common.Log.Fatal(err.Error())
	}
}
