package executor

import (
	"fmt"
	"strings"
)

func compareValues(
	left any,
	right any,
) (int, error) {

	switch leftValue := left.(type) {

	case string:

		rightValue, ok := right.(string)
		if !ok {
			return 0, nil
		}

		leftStr := strings.ToLower(leftValue)
		rightStr := strings.ToLower(rightValue)

		switch {
		case leftStr < rightStr:
			return -1, nil
		case leftStr > rightStr:
			return 1, nil
		default:
			return 0, nil
		}

	case int:

		rightValue, ok := right.(int)
		if !ok {
			return 0, nil
		}

		switch {
		case leftValue < rightValue:
			return -1, nil
		case leftValue > rightValue:
			return 1, nil
		default:
			return 0, nil
		}

	case int64:

		rightValue, ok := right.(int64)
		if !ok {
			return 0, nil
		}

		switch {
		case leftValue < rightValue:
			return -1, nil
		case leftValue > rightValue:
			return 1, nil
		default:
			return 0, nil
		}

	case float64:

		rightValue, ok := right.(float64)
		if !ok {
			return 0, nil
		}

		switch {
		case leftValue < rightValue:
			return -1, nil
		case leftValue > rightValue:
			return 1, nil
		default:
			return 0, nil
		}

	}

	return 0, fmt.Errorf(
		"unsupported sort type: %T",
		left,
	)
}
