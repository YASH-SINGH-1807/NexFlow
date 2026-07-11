package service

import (
	"strings"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func validateDestinationConfig(
	cfg model.DestinationNodeConfig,
) error {

	switch cfg.DestinationType {

	case model.DestinationPostgreSQL,
		model.DestinationMySQL:

		if strings.TrimSpace(cfg.Host) == "" {
			return ErrInvalidNodeConfig
		}

		if cfg.Port <= 0 {
			return ErrInvalidNodeConfig
		}

		if strings.TrimSpace(cfg.Database) == "" {
			return ErrInvalidNodeConfig
		}

		if strings.TrimSpace(cfg.Table) == "" {
			return ErrInvalidNodeConfig
		}

	case model.DestinationCSV:

		if strings.TrimSpace(cfg.FilePath) == "" {
			return ErrInvalidNodeConfig
		}

	case model.DestinationRESTAPI:

		if strings.TrimSpace(cfg.URL) == "" {
			return ErrInvalidNodeConfig
		}

	default:
		return ErrInvalidNodeConfig
	}

	return nil
}
