package executor

import (
	"log"
	"sort"
	"strings"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/expression"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

func (e *TransformExecutor) executeFilter(
	node service.ExecutionNode,
	cfg model.TransformNodeConfig,
	ctx *ExecutionContext,
) error {

	// Every filter currently supports
	// exactly one parent.

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	input := ctx.GetNodeData(
		node.ParentIDs[0],
	)

	log.Printf("========== FILTER ==========")
	log.Printf("Expression: %s", cfg.Expression)
	log.Printf("Input rows: %d", len(input))

	filtered := make(
		[]map[string]any,
		0,
		len(input),
	)

	evaluator :=
		expression.NewEvaluator()

	for _, row := range input {

		ok, err := evaluator.Evaluate(
			row,
			cfg.Expression,
		)

		if err != nil {
			return err
		}

		if ok {
			filtered = append(
				filtered,
				row,
			)
		}
	}

	log.Printf("Filtered rows: %d", len(filtered))
	log.Printf("============================")

	ctx.SetNodeData(
		node.Node.ID,
		filtered,
	)

	return nil
}

func (e *TransformExecutor) executeMap(
	node service.ExecutionNode,
	cfg model.TransformNodeConfig,
	ctx *ExecutionContext,
) error {

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	input := ctx.GetNodeData(
		node.ParentIDs[0],
	)

	parser := expression.NewAssignmentParser()

	assignment, err := parser.Parse(
		cfg.Expression,
	)

	if err != nil {
		return err
	}

	output := make(
		[]map[string]any,
		0,
		len(input),
	)

	for _, row := range input {

		newRow := make(map[string]any)

		// Copy all existing columns
		for key, value := range row {
			newRow[key] = value
		}

		// Remove surrounding quotes from literal strings
		value := strings.Trim(
			assignment.Value,
			`"'`,
		)

		// If assignment value is another column,
		// copy that column's value.
		if existing, ok := row[assignment.Value]; ok {
			newRow[assignment.Target] = existing
		} else {
			newRow[assignment.Target] = value
		}

		output = append(
			output,
			newRow,
		)
	}

	ctx.SetNodeData(
		node.Node.ID,
		output,
	)

	return nil
}

func (e *TransformExecutor) executeAggregate(
	node service.ExecutionNode,
	cfg model.TransformNodeConfig,
	ctx *ExecutionContext,
) error {

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	input := ctx.GetNodeData(
		node.ParentIDs[0],
	)

	parser := expression.NewAggregateParser()

	definition, err := parser.Parse(cfg)
	if err != nil {
		return err
	}

	// -----------------------------
	// GROUP BY
	// -----------------------------
	if len(definition.GroupBy) > 0 {

		groups := groupRows(
			input,
			definition.GroupBy,
		)

		var output []map[string]any

		for _, rows := range groups {

			result, err := calculateAggregate(
				rows,
				definition.Field,
				definition.Function,
			)

			if err != nil {
				return err
			}

			// Restore GROUP BY columns
			for _, field := range definition.GroupBy {
				result[field] = rows[0][field]
			}

			output = append(
				output,
				result,
			)
		}

		ctx.SetNodeData(
			node.Node.ID,
			output,
		)

		return nil
	}

	// -----------------------------
	// NORMAL AGGREGATE
	// -----------------------------

	var output []map[string]any

	result, err := calculateAggregate(
		input,
		definition.Field,
		definition.Function,
	)

	if err != nil {
		return err
	}

	output = []map[string]any{
		result,
	}

	ctx.SetNodeData(
		node.Node.ID,
		output,
	)

	return nil
}

func (e *TransformExecutor) executeSort(
	node service.ExecutionNode,
	cfg model.TransformNodeConfig,
	ctx *ExecutionContext,
) error {

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	input := ctx.GetNodeData(
		node.ParentIDs[0],
	)

	sort.SliceStable(input, func(i, j int) bool {

		left := input[i][cfg.SortField]
		right := input[j][cfg.SortField]

		result, _ := compareValues(left, right)

		if cfg.SortDirection == "desc" {
			return result > 0
		}

		return result < 0
	})

	ctx.SetNodeData(
		node.Node.ID,
		input,
	)

	return nil
}
