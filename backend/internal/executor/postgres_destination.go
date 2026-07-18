package executor

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

func (e *DestinationExecutor) executePostgreSQL(
	node service.ExecutionNode,
	cfg model.DestinationNodeConfig,
	ctx *ExecutionContext,
) error {

	if len(node.ParentIDs) == 0 {
		return ErrInvalidExecutionPlan
	}

	input := ctx.GetNodeData(node.ParentIDs[0])

	if len(input) == 0 {
		return nil
	}

	if cfg.Host == "" {
		return ErrInvalidNodeConfig
	}

	if cfg.Database == "" {
		return ErrInvalidNodeConfig
	}

	if cfg.Table == "" {
		return ErrInvalidNodeConfig
	}

	db, err := database.OpenPostgres(cfg)
	if err != nil {
		return err
	}

	tx := db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	err = tx.
		Table(cfg.Table).
		Create(&input).
		Error
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
