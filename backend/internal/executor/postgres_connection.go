package executor

import (
	"fmt"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func buildPostgresDSN(
	cfg model.SourceNodeConfig,
) string {

	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Host,
		cfg.Port,
		cfg.Username,
		cfg.Password,
		cfg.Database,
	)
}
