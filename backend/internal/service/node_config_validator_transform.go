package service

import (
	"strings"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func validateTransformConfig(
	cfg model.TransformNodeConfig,
) error {

	switch cfg.Operation {

	case model.TransformFilter,
		model.TransformMap:

		if strings.TrimSpace(cfg.Expression) == "" {
			return ErrInvalidNodeConfig
		}

	case model.TransformAggregate:

		if len(cfg.GroupBy) == 0 {
			return ErrInvalidNodeConfig
		}

	case model.TransformSort:

		if strings.TrimSpace(cfg.SortField) == "" {
			return ErrInvalidNodeConfig
		}

		if cfg.SortDirection != "asc" &&
			cfg.SortDirection != "desc" {
			return ErrInvalidNodeConfig
		}

	default:
		return ErrInvalidNodeConfig
	}

	return nil
}
