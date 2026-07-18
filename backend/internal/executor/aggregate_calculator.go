package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func calculateAggregate(
	rows []map[string]any,
	field string,
	function model.AggregateFunction,
) (map[string]any, error) {

	result := make(map[string]any)

	switch function {

	case model.AggregateCount:

		result["count"] = len(rows)

	case model.AggregateSum:

		values, err := extractNumericValues(rows, field)
		if err != nil {
			return nil, err
		}

		var total float64

		for _, value := range values {
			total += value
		}

		result["sum"] = total

	case model.AggregateAvg:

		values, err := extractNumericValues(rows, field)
		if err != nil {
			return nil, err
		}

		if len(values) == 0 {
			result["avg"] = 0
			break
		}

		var total float64

		for _, value := range values {
			total += value
		}

		result["avg"] = total / float64(len(values))

	case model.AggregateMin:

		values, err := extractNumericValues(rows, field)
		if err != nil {
			return nil, err
		}

		if len(values) == 0 {
			result["min"] = 0
			break
		}

		minimum := values[0]

		for _, value := range values {
			if value < minimum {
				minimum = value
			}
		}

		result["min"] = minimum

	case model.AggregateMax:

		values, err := extractNumericValues(rows, field)
		if err != nil {
			return nil, err
		}

		if len(values) == 0 {
			result["max"] = 0
			break
		}

		maximum := values[0]

		for _, value := range values {
			if value > maximum {
				maximum = value
			}
		}

		result["max"] = maximum

	default:

		return nil, ErrUnsupportedTransform
	}

	return result, nil
}
