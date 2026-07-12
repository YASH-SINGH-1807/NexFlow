package executor

import (
	"database/sql"

	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func (e *SourceExecutor) executePostgreSQL(
	nodeID uint,
	config model.SourceNodeConfig,
	ctx *ExecutionContext,
) error {

	dsn := buildPostgresDSN(config)

	db, err := sql.Open(
		"pgx",
		dsn,
	)

	if err != nil {
		return err
	}

	defer db.Close()

	rows, err := db.Query(config.Query)

	if err != nil {
		return err
	}

	defer rows.Close()

	columns, err := rows.Columns()

	if err != nil {
		return err
	}

	result := make([]map[string]any, 0)

	for rows.Next() {

		values := make([]any, len(columns))
		pointers := make([]any, len(columns))

		for i := range values {
			pointers[i] = &values[i]
		}

		if err := rows.Scan(
			pointers...,
		); err != nil {
			return err
		}

		record := make(map[string]any)

		for i, column := range columns {
			record[column] = values[i]
		}

		result = append(
			result,
			record,
		)
	}

	ctx.NodeData[nodeID] = result

	return rows.Err()
}
