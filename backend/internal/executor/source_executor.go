package executor

import (
	"encoding/json"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type SourceExecutor struct{}

func NewSourceExecutor() *SourceExecutor {
	return &SourceExecutor{}
}

func (e *SourceExecutor) Execute(
	node model.PipelineNode,
	ctx *ExecutionContext,
) error {

	var config model.SourceNodeConfig

	if err := json.Unmarshal(
		[]byte(node.Config),
		&config,
	); err != nil {
		return err
	}

	switch config.ConnectionType {

	case model.SourcePostgreSQL:
		return e.executePostgreSQL(
			node.ID,
			config,
			ctx,
		)

	default:
		return ErrUnsupportedSourceType
	}
}
