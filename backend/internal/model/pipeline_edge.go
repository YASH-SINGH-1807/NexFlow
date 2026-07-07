package model

type PipelineEdge struct {
	BaseModel

	PipelineID uint `gorm:"not null;index" json:"pipelineId"`

	Pipeline Pipeline `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	SourceNodeID uint `gorm:"not null;index" json:"sourceNodeId"`

	SourceNode PipelineNode `gorm:"foreignKey:SourceNodeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	TargetNodeID uint `gorm:"not null;index" json:"targetNodeId"`

	TargetNode PipelineNode `gorm:"foreignKey:TargetNodeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}
