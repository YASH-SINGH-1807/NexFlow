package model

type JobAnalysisStatus string

const (
	JobAnalysisStatusPending   JobAnalysisStatus = "pending"
	JobAnalysisStatusCompleted JobAnalysisStatus = "completed"
	JobAnalysisStatusFailed    JobAnalysisStatus = "failed"
)

type JobAnalysis struct {
	BaseModel

	JobID uint `gorm:"not null;uniqueIndex" json:"jobId"`

	Job Job `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	Status JobAnalysisStatus `gorm:"type:varchar(20);not null;index" json:"status"`

	Summary string `gorm:"type:text" json:"summary"`

	RootCause string `gorm:"type:text" json:"rootCause"`

	Suggestion string `gorm:"type:text" json:"suggestion"`

	Provider string `gorm:"size:50" json:"provider"`

	ModelName string `gorm:"size:100" json:"modelName"`

	ErrorMessage string `gorm:"type:text" json:"errorMessage"`
}
