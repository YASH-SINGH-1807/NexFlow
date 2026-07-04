package model

type Workspace struct {
	BaseModel

	Name string `gorm:"size:150;not null" json:"name"`

	Description string `gorm:"type:text" json:"description"`

	UserID uint `gorm:"not null" json:"userId"`

	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}
