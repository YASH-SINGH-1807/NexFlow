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

func (c *ExecutionContext) GetNodeData(
	nodeID uint,
) []map[string]any {

	return c.NodeData[nodeID]
}

func (c *ExecutionContext) SetNodeData(
	nodeID uint,
	data []map[string]any,
) {

	c.NodeData[nodeID] = data
}
