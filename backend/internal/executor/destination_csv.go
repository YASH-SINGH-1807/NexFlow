package executor

import (
	"encoding/csv"
	"os"
	"sort"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func (e *DestinationExecutor) executeCSV(
	nodeID uint,
	config model.DestinationNodeConfig,
	ctx *ExecutionContext,
) error {

	var rows []map[string]any

	for _, data := range ctx.NodeData {
		rows = data
		break
	}

	if len(rows) == 0 {
		return nil
	}

	file, err := os.Create(config.FilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := make([]string, 0, len(rows[0]))
	for key := range rows[0] {
		headers = append(headers, key)
	}

	sort.Strings(headers)

	if err := writer.Write(headers); err != nil {
		return err
	}

	for _, row := range rows {

		record := make([]string, len(headers))

		for i, header := range headers {
			if value, ok := row[header]; ok {
				record[i] = toString(value)
			}
		}

		if err := writer.Write(record); err != nil {
			return err
		}
	}

	return writer.Error()
}
