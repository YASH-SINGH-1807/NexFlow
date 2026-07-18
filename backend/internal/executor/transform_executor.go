package executor

import (
	"encoding/json"
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var ErrUnsupportedTransform = errors.New("unsupported transform operation")

type TransformExecutor struct{}

func NewTransformExecutor() *TransformExecutor {
	return &TransformExecutor{}
}

func (e *TransformExecutor) Execute(
	node service.ExecutionNode,
	ctx *ExecutionContext,
) error {

	var config model.TransformNodeConfig

	if err := json.Unmarshal(
		[]byte(node.Node.Config),
		&config,
	); err != nil {
		return err
	}

	switch config.Operation {

	case model.TransformFilter:
		return e.executeFilter(
			node,
			config,
			ctx,
		)

	case model.TransformMap:
		return e.executeMap(
			node,
			config,
			ctx,
		)
	case model.TransformAggregate:
		return e.executeAggregate(
			node,
			config,
			ctx,
		)
	case model.TransformSort:
		return e.executeSort(
			node,
			config,
			ctx,
		)

	default:
		return ErrUnsupportedTransform
	}
}
