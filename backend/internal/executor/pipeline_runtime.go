package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

type PipelineRuntime struct {
	preflight *service.PipelinePreflightService
	planner   *service.PipelineExecutionPlanner
	executor  *PipelineExecutor
}

func NewPipelineRuntime() *PipelineRuntime {
	return &PipelineRuntime{
		preflight: service.NewPipelinePreflightService(),
		planner:   service.NewPipelineExecutionPlanner(),
		executor:  NewPipelineExecutor(),
	}
}

func (r *PipelineRuntime) Execute(
	pipelineID uint,
) error {

	if err := r.preflight.Validate(
		pipelineID,
	); err != nil {
		return err
	}

	plan, err := r.planner.BuildExecutionPlan(
		pipelineID,
	)

	if err != nil {
		return err
	}

	return r.executor.Execute(
		plan.Nodes,
	)
}
