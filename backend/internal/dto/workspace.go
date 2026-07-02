package dto

type CreateWorkspaceRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=150"`
	Description string `json:"description"`
}
