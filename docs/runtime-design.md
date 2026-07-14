# NexFlow Runtime Engine

## Execution Flow

1. User clicks Run Pipeline.
2. Backend creates a Job with status = queued.
3. JobExecutor starts a background goroutine.
4. Job status changes to running.
5. PipelineRuntime validates the pipeline.
6. PipelineRuntime builds an execution plan.
7. PipelineExecutor executes each node in topological order.
8. Source executors load data into the ExecutionContext.
9. Transform executors modify data in the ExecutionContext.
10. Destination executors write data to the target.
11. Job status changes to succeeded.
12. If any step fails, Job status changes to failed and the error is logged.

## Runtime Responsibilities

### JobExecutor

- Manage job lifecycle.
- Update job status.
- Write logs.
- Call PipelineRuntime.

### PipelineRuntime

- Validate pipeline.
- Build execution plan.
- Execute pipeline.

### PipelineExecutor

- Execute nodes sequentially.
- Dispatch Source executors.
- Dispatch Transform executors.
- Dispatch Destination executors.

### ExecutionContext

- Hold intermediate datasets.
- Share data between nodes.
- Store runtime variables.

## Sprint 2 Goal

PostgreSQL Source → CSV Destination