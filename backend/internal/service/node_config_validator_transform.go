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

		// COUNT can work without an aggregate field.
		if cfg.AggregateFunction != "count" &&
			strings.TrimSpace(cfg.AggregateField) == "" {
			return ErrInvalidNodeConfig
		}

		switch cfg.AggregateFunction {

		case "count",
			"sum",
			"avg",
			"min",
			"max":
			// valid

		default:
			return ErrInvalidNodeConfig
		}

		// GroupBy is optional.
		// If provided, make sure field names are not empty.
		for _, field := range cfg.GroupBy {
			if strings.TrimSpace(field) == "" {
				return ErrInvalidNodeConfig
			}
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
