package ai

import (
	"net/http"
	"strings"
	"time"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/config"
)

func NewFailureAnalyzerFromConfig(
	cfg *config.Config,
) FailureAnalyzer {
	devAnalyzer :=
		NewDevFailureAnalyzer()

	switch strings.ToLower(
		strings.TrimSpace(cfg.AIProvider),
	) {
	case "groq":
		groqAnalyzer :=
			NewGroqFailureAnalyzer(
				cfg.GroqAPIKey,
				cfg.GroqBaseURL,
				cfg.GroqModel,
				&http.Client{
					Timeout: 25 * time.Second,
				},
			)

		return NewFallbackFailureAnalyzer(
			groqAnalyzer,
			devAnalyzer,
		)

	case "development", "":
		return devAnalyzer

	default:
		return devAnalyzer
	}
}
