package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

type PipelineExecutor struct {
	sourceExecutor      *SourceExecutor
	transformExecutor   *TransformExecutor
	destinationExecutor *DestinationExecutor
}

func NewPipelineExecutor() *PipelineExecutor {
	return &PipelineExecutor{
		sourceExecutor:      NewSourceExecutor(),
		transformExecutor:   NewTransformExecutor(),
		destinationExecutor: NewDestinationExecutor(),
	}
}

func (e *PipelineExecutor) Execute(
	plan []service.ExecutionNode,
) error {

	ctx := NewExecutionContext()

	for _, executionNode := range plan {

		node := executionNode.Node

		switch node.Type {

		case model.PipelineNodeTypeSource:

			if err := e.sourceExecutor.Execute(
				node,
				ctx,
			); err != nil {
				return err
			}

		case model.PipelineNodeTypeTransform:

			if err := e.transformExecutor.Execute(
				executionNode,
				ctx,
			); err != nil {
				return err
			}

		case model.PipelineNodeTypeDestination:

			if err := e.destinationExecutor.Execute(
				executionNode,
				ctx,
			); err != nil {
				return err
			}

		}
	}

	return nil
}
