package database

import (
	"fmt"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func OpenPostgres(
	cfg model.DestinationNodeConfig,
) (*gorm.DB, error) {

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		cfg.Host,
		cfg.Username,
		cfg.Password,
		cfg.Database,
		cfg.Port,
	)

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		return nil, err
	}

	return db, nil
}
