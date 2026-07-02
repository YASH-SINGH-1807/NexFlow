package model

import "gorm.io/gorm"

type BaseModel struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt int64          `gorm:"autoCreateTime:milli"`
	UpdatedAt int64          `gorm:"autoUpdateTime:milli"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
