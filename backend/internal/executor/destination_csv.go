package executor

import (
	"encoding/csv"
	"log"
	"os"
	"sort"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

func (e *DestinationExecutor) executeCSV(
	node service.ExecutionNode,
	config model.DestinationNodeConfig,
	ctx *ExecutionContext,
) error {

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	rows := ctx.GetNodeData(
		node.ParentIDs[0],
	)

	log.Printf("========== DESTINATION ==========")
	log.Printf("Rows received: %d", len(rows))
	log.Printf("Output file: %s", config.FilePath)
	log.Printf("=================================")

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
