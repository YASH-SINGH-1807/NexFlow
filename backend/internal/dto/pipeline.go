package dto

type CreatePipelineRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=150"`
	Description string `json:"description"`
	WorkspaceID uint   `json:"workspaceId" binding:"required"`
}

type UpdatePipelineRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=150"`
	Description string `json:"description"`
	Status      string `json:"status" binding:"required,oneof=draft active paused"`
}
