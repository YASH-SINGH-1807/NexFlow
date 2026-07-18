package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/expression"
)

func extractNumericValues(
	input []map[string]any,
	field string,
) ([]float64, error) {

	values := make([]float64, 0)

	for _, row := range input {

		value, ok := row[field]

		if !ok {
			continue
		}

		number, err := expression.ToFloat64(value)

		if err != nil {
			return nil, err
		}

		values = append(values, number)
	}

	return values, nil
}
