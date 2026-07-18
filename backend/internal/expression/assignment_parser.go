package expression

import (
	"errors"
	"strings"
)

var ErrInvalidAssignment = errors.New("invalid map assignment")

type Assignment struct {
	Target string
	Value  string
}

type AssignmentParser struct{}

func NewAssignmentParser() *AssignmentParser {
	return &AssignmentParser{}
}

func (p *AssignmentParser) Parse(
	expression string,
) (*Assignment, error) {

	parts := strings.SplitN(
		expression,
		"=",
		2,
	)

	if len(parts) != 2 {
		return nil, ErrInvalidAssignment
	}

	target := strings.TrimSpace(parts[0])
	value := strings.TrimSpace(parts[1])

	if target == "" || value == "" {
		return nil, ErrInvalidAssignment
	}

	return &Assignment{
		Target: target,
		Value:  value,
	}, nil
}
