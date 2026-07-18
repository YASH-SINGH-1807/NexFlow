package executor

import "errors"

var ErrUnsupportedSourceType = errors.New(
	"unsupported source type",
)

var ErrUnsupportedDestinationType = errors.New(
	"unsupported destination type",
)

var ErrInvalidExecutionPlan = errors.New(
	"invalid execution plan",
)

var ErrInvalidNodeConfig = errors.New(
	"invalid node configuration",
)
