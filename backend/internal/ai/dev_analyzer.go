package ai

import (
	"context"
	"errors"
	"strings"
)

type DevFailureAnalyzer struct{}

func NewDevFailureAnalyzer() *DevFailureAnalyzer {
	return &DevFailureAnalyzer{}
}

func (a *DevFailureAnalyzer) AnalyzeFailure(
	ctx context.Context,
	input FailureAnalysisInput,
) (*FailureAnalysisResult, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()

	default:
	}

	if input.ErrorMessage == "" {
		return nil, errors.New(
			"job error message is empty",
		)
	}

	summary :=
		"The pipeline execution failed during processing."

	rootCause :=
		"The failure was caused by the reported execution error: " +
			input.ErrorMessage

	suggestion :=
		"Review the pipeline configuration and execution logs, correct the reported issue, and run the pipeline again."

	if strings.Contains(
		strings.ToLower(input.ErrorMessage),
		"validation",
	) {
		summary =
			"The pipeline failed during configuration validation."

		rootCause =
			"The pipeline configuration did not pass validation. Reported error: " +
				input.ErrorMessage

		suggestion =
			"Review the pipeline configuration fields and dependencies, correct the invalid configuration, and retry the pipeline."
	}

	return &FailureAnalysisResult{
		Summary:    summary,
		RootCause:  rootCause,
		Suggestion: suggestion,
		Provider:   "development",
		ModelName:  "rule-based-v1",
	}, nil
}
