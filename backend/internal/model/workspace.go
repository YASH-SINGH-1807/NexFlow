package model

type Workspace struct {
	BaseModel

	Name string `gorm:"size:150;not null"`

	Description string `gorm:"type:text"`

	UserID uint `gorm:"not null"`

	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
