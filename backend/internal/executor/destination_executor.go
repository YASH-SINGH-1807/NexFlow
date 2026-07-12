package executor

import (
	"encoding/json"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type DestinationExecutor struct{}

func NewDestinationExecutor() *DestinationExecutor {
	return &DestinationExecutor{}
}

func (e *DestinationExecutor) Execute(
	node model.PipelineNode,
	ctx *ExecutionContext,
) error {

	var config model.DestinationNodeConfig

	if err := json.Unmarshal(
		[]byte(node.Config),
		&config,
	); err != nil {
		return err
	}

	switch config.DestinationType {

	case model.DestinationCSV:
		return e.executeCSV(
			node.ID,
			config,
			ctx,
		)

	default:
		return ErrUnsupportedDestinationType
	}
}
