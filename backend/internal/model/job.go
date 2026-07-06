package model

type JobStatus string

const (
	JobStatusQueued    JobStatus = "queued"
	JobStatusRunning   JobStatus = "running"
	JobStatusSucceeded JobStatus = "succeeded"
	JobStatusFailed    JobStatus = "failed"
	JobStatusCancelled JobStatus = "cancelled"
)

type Job struct {
	BaseModel

	PipelineID uint `gorm:"not null;index" json:"pipelineId"`

	Pipeline Pipeline `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	Status JobStatus `gorm:"type:varchar(20);not null;default:'queued';index" json:"status"`

	StartedAt *int64 `json:"startedAt"`

	FinishedAt *int64 `json:"finishedAt"`

	ErrorMessage string `gorm:"type:text" json:"errorMessage"`
}
