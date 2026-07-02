package model

type User struct {
	BaseModel

	Name         string `gorm:"size:100;not null"`
	Username     string `gorm:"size:50;uniqueIndex;not null"`
	Email        string `gorm:"size:150;uniqueIndex;not null"`
	PasswordHash string `gorm:"size:255;not null"`
}
