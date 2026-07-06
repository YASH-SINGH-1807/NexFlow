package ai

import "context"

type FallbackFailureAnalyzer struct {
	primary  FailureAnalyzer
	fallback FailureAnalyzer
}

func NewFallbackFailureAnalyzer(
	primary FailureAnalyzer,
	fallback FailureAnalyzer,
) *FallbackFailureAnalyzer {
	return &FallbackFailureAnalyzer{
		primary:  primary,
		fallback: fallback,
	}
}

func (a *FallbackFailureAnalyzer) AnalyzeFailure(
	ctx context.Context,
	input FailureAnalysisInput,
) (*FailureAnalysisResult, error) {
	result, err := a.primary.AnalyzeFailure(
		ctx,
		input,
	)

	if err == nil {
		return result, nil
	}

	return a.fallback.AnalyzeFailure(
		ctx,
		input,
	)
}

var _ FailureAnalyzer = (*FallbackFailureAnalyzer)(nil)
