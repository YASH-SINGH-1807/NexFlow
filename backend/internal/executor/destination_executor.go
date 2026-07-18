package executor

import (
	"encoding/json"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

type DestinationExecutor struct{}

func NewDestinationExecutor() *DestinationExecutor {
	return &DestinationExecutor{}
}

func (e *DestinationExecutor) Execute(
	node service.ExecutionNode,
	ctx *ExecutionContext,
) error {

	var config model.DestinationNodeConfig

	if err := json.Unmarshal(
		[]byte(node.Node.Config),
		&config,
	); err != nil {
		return err
	}

	switch config.DestinationType {

	case model.DestinationCSV:
		return e.executeCSV(
			node,
			config,
			ctx,
		)

	case model.DestinationPostgreSQL:
		return e.executePostgreSQL(
			node,
			config,
			ctx,
		)

	default:
		return ErrUnsupportedDestinationType
	}
}
