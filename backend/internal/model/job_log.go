package model

type JobLogLevel string

const (
	JobLogLevelInfo  JobLogLevel = "info"
	JobLogLevelError JobLogLevel = "error"
)

type JobLog struct {
	BaseModel

	JobID uint `gorm:"not null;index" json:"jobId"`

	Job Job `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	Level JobLogLevel `gorm:"type:varchar(20);not null;index" json:"level"`

	Message string `gorm:"type:text;not null" json:"message"`
}
