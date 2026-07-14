package executor

import (
	"encoding/json"
	"log"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type SourceExecutor struct{}

func NewSourceExecutor() *SourceExecutor {
	return &SourceExecutor{}
}

func (e *SourceExecutor) Execute(
	node model.PipelineNode,
	ctx *ExecutionContext,
) error {

	var config model.SourceNodeConfig

	if err := json.Unmarshal(
		[]byte(node.Config),
		&config,
	); err != nil {
		return err
	}

	log.Println("========== SOURCE CONFIG ==========")
	log.Printf("Node ID: %d", node.ID)
	log.Printf("Connection Type: %s", config.ConnectionType)
	log.Printf("Host: %s", config.Host)
	log.Printf("Port: %d", config.Port)
	log.Printf("Database: %s", config.Database)
	log.Printf("Username: %s", config.Username)
	log.Printf("Password: '%s'", config.Password)
	log.Printf("Query: %s", config.Query)
	log.Println("===================================")

	switch config.ConnectionType {

	case model.SourcePostgreSQL:
		return e.executePostgreSQL(
			node.ID,
			config,
			ctx,
		)

	default:
		return ErrUnsupportedSourceType
	}
}