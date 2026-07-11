package service

import (
	"encoding/json"
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

var ErrInvalidNodeConfig = errors.New("invalid node configuration")

func ValidateNodeConfig(
	nodeType model.PipelineNodeType,
	configJSON string,
) error {

	switch nodeType {

	case model.PipelineNodeTypeSource:

		var cfg model.SourceNodeConfig

		if err := json.Unmarshal(
			[]byte(configJSON),
			&cfg,
		); err != nil {
			return ErrInvalidNodeConfig
		}

		return validateSourceConfig(cfg)

	case model.PipelineNodeTypeTransform:

		var cfg model.TransformNodeConfig

		if err := json.Unmarshal(
			[]byte(configJSON),
			&cfg,
		); err != nil {
			return ErrInvalidNodeConfig
		}

		return validateTransformConfig(cfg)

	case model.PipelineNodeTypeDestination:

		var cfg model.DestinationNodeConfig

		if err := json.Unmarshal(
			[]byte(configJSON),
			&cfg,
		); err != nil {
			return ErrInvalidNodeConfig
		}

		return validateDestinationConfig(cfg)
	}

	return ErrInvalidNodeConfig
}
