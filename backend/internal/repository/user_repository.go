package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) Create(user *model.User) error {
	return database.DB.Create(user).Error
}

func (r *UserRepository) GetByEmail(email string) (*model.User, error) {
	var user model.User

	err := database.DB.
		Where("email = ?", email).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetByUsernameOrEmail(login string) (*model.User, error) {
	var user model.User

	err := database.DB.
		Where("email = ? OR username = ?", login, login).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) ExistsByEmail(email string) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.User{}).
		Where("email = ?", email).
		Count(&count).Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *UserRepository) ExistsByUsername(username string) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.User{}).
		Where("username = ?", username).
		Count(&count).Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}
