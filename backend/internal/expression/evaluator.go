package expression

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

var (
	ErrInvalidExpression = errors.New(
		"invalid filter expression",
	)

	ErrUnsupportedOperator = errors.New(
		"unsupported operator",
	)
)

type Evaluator struct{}

func NewEvaluator() *Evaluator {
	return &Evaluator{}
}

func (e *Evaluator) Evaluate(
	row map[string]any,
	expression string,
) (bool, error) {

	expression = strings.TrimSpace(
		expression,
	)

	fmt.Printf("Expression: %q\n", expression)
	fmt.Printf("Parts: %#v\n", strings.Fields(expression))

	if expression == "" {
		return true, nil
	}

	parts := strings.Fields(expression)

	fmt.Printf("Token Count: %d\n", len(parts))
	if len(parts) != 3 {
		return false,
			ErrInvalidExpression
	}

	column := parts[0]
	operator := parts[1]
	value := parts[2]

	rowValue, exists := row[column]
	fmt.Printf("Column=%q Exists=%v Value=%#v\n", column, exists, rowValue)

	if !exists {
		return false, nil
	}

	switch operator {

	case ">":
		return compareGreater(
			rowValue,
			value,
		)

	default:
		return false,
			ErrUnsupportedOperator
	}
}

func compareGreater(
	left any,
	right string,
) (bool, error) {

	leftNumber, err := ToFloat64(left)

	if err != nil {
		return false, err
	}

	rightNumber, err :=
		parseNumber(right)

	if err != nil {
		return false, err
	}

	return leftNumber > rightNumber,
		nil
}

func ToFloat64(
	value any,
) (float64, error) {

	switch v := value.(type) {

	case int:
		return float64(v), nil

	case int32:
		return float64(v), nil

	case int64:
		return float64(v), nil

	case float32:
		return float64(v), nil

	case float64:
		return v, nil

	case string:
		return parseNumber(v)

	case []byte:
		return parseNumber(string(v))

	default:
		return 0,
			fmt.Errorf(
				"unsupported type %T",
				value,
			)
	}
}

func parseNumber(
	value string,
) (float64, error) {

	return strconv.ParseFloat(
		value,
		64,
	)
}
