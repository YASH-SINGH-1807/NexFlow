package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type PipelineExecutor struct {
	sourceExecutor      *SourceExecutor
	destinationExecutor *DestinationExecutor
}

func NewPipelineExecutor() *PipelineExecutor {
	return &PipelineExecutor{
		sourceExecutor:      NewSourceExecutor(),
		destinationExecutor: NewDestinationExecutor(),
	}
}

func (e *PipelineExecutor) Execute(
	plan []model.PipelineNode,
) error {

	ctx := NewExecutionContext()

	for _, node := range plan {

		switch node.Type {

		case model.PipelineNodeTypeSource:

			if err := e.sourceExecutor.Execute(
				node,
				ctx,
			); err != nil {
				return err
			}

		case model.PipelineNodeTypeDestination:

			if err := e.destinationExecutor.Execute(
				node,
				ctx,
			); err != nil {
				return err
			}

		}
	}

	return nil
}
