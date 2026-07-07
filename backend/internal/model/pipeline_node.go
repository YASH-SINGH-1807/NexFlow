package model

type PipelineNodeType string

const (
	PipelineNodeTypeSource      PipelineNodeType = "source"
	PipelineNodeTypeTransform   PipelineNodeType = "transform"
	PipelineNodeTypeDestination PipelineNodeType = "destination"
)

type PipelineNode struct {
	BaseModel

	PipelineID uint `gorm:"not null;index" json:"pipelineId"`

	Pipeline Pipeline `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	Name string `gorm:"size:150;not null" json:"name"`

	Type PipelineNodeType `gorm:"type:varchar(30);not null;index" json:"type"`

	Config string `gorm:"type:jsonb;not null;default:'{}'" json:"config"`

	PositionX float64 `gorm:"not null;default:0" json:"positionX"`

	PositionY float64 `gorm:"not null;default:0" json:"positionY"`
}
