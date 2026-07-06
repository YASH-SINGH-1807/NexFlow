package ai

import (
	"context"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type FailureAnalysisInput struct {
	JobID        uint
	PipelineName string
	ErrorMessage string
	Logs         []model.JobLog
}

type FailureAnalysisResult struct {
	Summary    string
	RootCause  string
	Suggestion string
	Provider   string
	ModelName  string
}

type FailureAnalyzer interface {
	AnalyzeFailure(
		ctx context.Context,
		input FailureAnalysisInput,
	) (*FailureAnalysisResult, error)
}
