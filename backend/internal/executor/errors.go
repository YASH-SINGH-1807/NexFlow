package executor

import "errors"

var ErrUnsupportedSourceType = errors.New(
	"unsupported source type",
)
var ErrUnsupportedDestinationType = errors.New(
	"unsupported destination type",
)
