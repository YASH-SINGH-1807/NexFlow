package database

import (
	"fmt"
	"log"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/config"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(cfg *config.Config) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
		cfg.DBSSLMode,
	)

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		log.Fatal(err)
	}

	DB = db

	log.Println("✅ PostgreSQL connected successfully")

	if err := DB.AutoMigrate(
		&model.User{},
		&model.Workspace{},
		&model.Pipeline{},
	); err != nil {
		log.Fatal(err)
	}

	log.Println("✅ Database migration completed")
}
