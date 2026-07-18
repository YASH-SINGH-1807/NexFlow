package executor

import (
	"fmt"
	"strings"
)

func groupRows(
	input []map[string]any,
	fields []string,
) map[string][]map[string]any {

	groups := make(
		map[string][]map[string]any,
	)

	for _, row := range input {

		keyParts := make([]string, 0)

		for _, field := range fields {

			keyParts = append(
				keyParts,
				fmt.Sprint(row[field]),
			)
		}

		key := strings.Join(
			keyParts,
			"|",
		)

		groups[key] = append(
			groups[key],
			row,
		)
	}

	return groups
}
