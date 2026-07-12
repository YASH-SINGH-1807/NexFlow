package executor

import "github.com/YASH-SINGH-1807/nexflow/backend/internal/model"

type NodeExecutor interface {
	Execute(
		node model.PipelineNode,
		ctx *ExecutionContext,
	) error
}
