package executor

type ExecutionContext struct {
	NodeData  map[uint][]map[string]any
	Variables map[string]any
}

func NewExecutionContext() *ExecutionContext {
	return &ExecutionContext{
		NodeData:  make(map[uint][]map[string]any),
		Variables: make(map[string]any),
	}
}
