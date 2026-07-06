package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type GroqFailureAnalyzer struct {
	apiKey  string
	baseURL string
	model   string
	client  *http.Client
}

func NewGroqFailureAnalyzer(
	apiKey string,
	baseURL string,
	modelName string,
	client *http.Client,
) *GroqFailureAnalyzer {
	return &GroqFailureAnalyzer{
		apiKey: apiKey,
		baseURL: strings.TrimRight(
			baseURL,
			"/",
		),
		model:  modelName,
		client: client,
	}
}

type groqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type groqRequest struct {
	Model string `json:"model"`

	Messages []groqMessage `json:"messages"`

	Temperature float64 `json:"temperature"`

	ResponseFormat groqResponseFormat `json:"response_format"`
}

type groqResponseFormat struct {
	Type string `json:"type"`
}

type groqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type groqErrorResponse struct {
	Error struct {
		Message string `json:"message"`
		Type    string `json:"type"`
	} `json:"error"`
}

type failureAnalysisJSON struct {
	Summary    string `json:"summary"`
	RootCause  string `json:"rootCause"`
	Suggestion string `json:"suggestion"`
}

func (a *GroqFailureAnalyzer) AnalyzeFailure(
	ctx context.Context,
	input FailureAnalysisInput,
) (*FailureAnalysisResult, error) {
	if strings.TrimSpace(a.apiKey) == "" {
		return nil, errors.New(
			"Groq API key is not configured",
		)
	}

	if strings.TrimSpace(a.baseURL) == "" {
		return nil, errors.New(
			"Groq base URL is not configured",
		)
	}

	if strings.TrimSpace(a.model) == "" {
		return nil, errors.New(
			"Groq model is not configured",
		)
	}

	prompt := buildFailureAnalysisPrompt(
		input,
	)

	requestBody := groqRequest{
		Model: a.model,

		Messages: []groqMessage{
			{
				Role: "system",
				Content: `You are NexFlow's pipeline failure analysis engine.

Analyze failed data pipeline executions using only the supplied evidence.

Return a JSON object with exactly these fields:
{
  "summary": "short failure summary",
  "rootCause": "specific technical root cause based on evidence",
  "suggestion": "clear actionable fix"
}

Do not use markdown.
Do not add fields.
Do not invent missing facts.
If evidence is insufficient, explicitly say so in the relevant field.`,
			},
			{
				Role:    "user",
				Content: prompt,
			},
		},

		Temperature: 0.1,

		ResponseFormat: groqResponseFormat{
			Type: "json_object",
		},
	}

	bodyBytes, err := json.Marshal(
		requestBody,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"encode Groq request: %w",
			err,
		)
	}

	endpoint :=
		a.baseURL + "/chat/completions"

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		endpoint,
		bytes.NewReader(bodyBytes),
	)

	if err != nil {
		return nil, fmt.Errorf(
			"create Groq request: %w",
			err,
		)
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+a.apiKey,
	)

	req.Header.Set(
		"Content-Type",
		"application/json",
	)

	resp, err := a.client.Do(req)

	if err != nil {
		return nil, fmt.Errorf(
			"Groq request failed: %w",
			err,
		)
	}

	defer resp.Body.Close()

	responseBytes, err := io.ReadAll(
		io.LimitReader(
			resp.Body,
			2<<20,
		),
	)

	if err != nil {
		return nil, fmt.Errorf(
			"read Groq response: %w",
			err,
		)
	}

	if resp.StatusCode < 200 ||
		resp.StatusCode >= 300 {
		var errorResponse groqErrorResponse

		if json.Unmarshal(
			responseBytes,
			&errorResponse,
		) == nil &&
			errorResponse.Error.Message != "" {
			return nil, fmt.Errorf(
				"Groq API error (%d): %s",
				resp.StatusCode,
				errorResponse.Error.Message,
			)
		}

		return nil, fmt.Errorf(
			"Groq API returned status %d",
			resp.StatusCode,
		)
	}

	var apiResponse groqResponse

	if err := json.Unmarshal(
		responseBytes,
		&apiResponse,
	); err != nil {
		return nil, fmt.Errorf(
			"decode Groq response: %w",
			err,
		)
	}

	if len(apiResponse.Choices) == 0 {
		return nil, errors.New(
			"Groq returned no analysis choices",
		)
	}

	content := strings.TrimSpace(
		apiResponse.Choices[0].
			Message.
			Content,
	)

	if content == "" {
		return nil, errors.New(
			"Groq returned empty analysis content",
		)
	}

	var analysis failureAnalysisJSON

	if err := json.Unmarshal(
		[]byte(content),
		&analysis,
	); err != nil {
		return nil, fmt.Errorf(
			"decode Groq analysis JSON: %w",
			err,
		)
	}

	analysis.Summary =
		strings.TrimSpace(analysis.Summary)

	analysis.RootCause =
		strings.TrimSpace(analysis.RootCause)

	analysis.Suggestion =
		strings.TrimSpace(analysis.Suggestion)

	if analysis.Summary == "" ||
		analysis.RootCause == "" ||
		analysis.Suggestion == "" {
		return nil, errors.New(
			"Groq analysis contains empty required fields",
		)
	}

	return &FailureAnalysisResult{
		Summary: analysis.Summary,

		RootCause: analysis.RootCause,

		Suggestion: analysis.Suggestion,

		Provider: "groq",

		ModelName: a.model,
	}, nil
}

func buildFailureAnalysisPrompt(
	input FailureAnalysisInput,
) string {
	var builder strings.Builder

	fmt.Fprintf(
		&builder,
		"Job ID: %d\n",
		input.JobID,
	)

	fmt.Fprintf(
		&builder,
		"Pipeline: %s\n",
		input.PipelineName,
	)

	fmt.Fprintf(
		&builder,
		"Reported error: %s\n\n",
		input.ErrorMessage,
	)

	builder.WriteString(
		"Execution logs:\n",
	)

	for _, jobLog := range input.Logs {
		fmt.Fprintf(
			&builder,
			"- [%s] %s\n",
			jobLog.Level,
			jobLog.Message,
		)
	}

	return builder.String()
}

var _ FailureAnalyzer = (*GroqFailureAnalyzer)(nil)
