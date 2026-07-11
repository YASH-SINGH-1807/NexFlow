package service

import (
	"strings"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func validateSourceConfig(
	cfg model.SourceNodeConfig,
) error {

	switch cfg.ConnectionType {

	case model.SourcePostgreSQL,
		model.SourceMySQL:

		if strings.TrimSpace(cfg.Host) == "" {
			return ErrInvalidNodeConfig
		}

		if cfg.Port <= 0 {
			return ErrInvalidNodeConfig
		}

		if strings.TrimSpace(cfg.Database) == "" {
			return ErrInvalidNodeConfig
		}

	case model.SourceCSV:

		if strings.TrimSpace(cfg.FilePath) == "" {
			return ErrInvalidNodeConfig
		}

	case model.SourceRESTAPI:

		if strings.TrimSpace(cfg.URL) == "" {
			return ErrInvalidNodeConfig
		}

	default:
		return ErrInvalidNodeConfig
	}

	return nil
}
