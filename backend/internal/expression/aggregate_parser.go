package expression

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

var ErrInvalidAggregate = errors.New("invalid aggregate configuration")

type AggregateDefinition struct {
	GroupBy  []string
	Field    string
	Function model.AggregateFunction
}

type AggregateParser struct{}

func NewAggregateParser() *AggregateParser {
	return &AggregateParser{}
}

func (p *AggregateParser) Parse(
	cfg model.TransformNodeConfig,
) (*AggregateDefinition, error) {

	if cfg.AggregateFunction == "" {
		return nil, ErrInvalidAggregate
	}

	return &AggregateDefinition{
		GroupBy:  cfg.GroupBy,
		Field:    cfg.AggregateField,
		Function: cfg.AggregateFunction,
	}, nil
}
