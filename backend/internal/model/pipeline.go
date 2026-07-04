package model

type Pipeline struct {
	BaseModel

	Name string `gorm:"size:150;not null" json:"name"`

	Description string `gorm:"type:text" json:"description"`

	Status string `gorm:"size:30;not null;default:'draft';index" json:"status"`

	WorkspaceID uint `gorm:"not null;index" json:"workspaceId"`

	Workspace Workspace `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}
