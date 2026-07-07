package dto

import "github.com/YASH-SINGH-1807/nexflow/backend/internal/model"

type CreatePipelineNodeRequest struct {
	Name string `json:"name" binding:"required,min=1,max=150"`

	Type model.PipelineNodeType `json:"type" binding:"required,oneof=source transform destination"`

	Config string `json:"config"`

	PositionX float64 `json:"positionX"`

	PositionY float64 `json:"positionY"`
}

type CreatePipelineEdgeRequest struct {
	SourceNodeID uint `json:"sourceNodeId" binding:"required"`

	TargetNodeID uint `json:"targetNodeId" binding:"required"`
}
