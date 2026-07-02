package service

import (
	"errors"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/repository"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: repository.NewUserRepository(),
	}
}

func (s *UserService) Register(user *model.User) error {

	emailExists, err := s.repo.ExistsByEmail(user.Email)
	if err != nil {
		return err
	}

	if emailExists {
		return errors.New("email already exists")
	}

	usernameExists, err := s.repo.ExistsByUsername(user.Username)
	if err != nil {
		return err
	}

	if usernameExists {
		return errors.New("username already exists")
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(user.PasswordHash),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	user.PasswordHash = string(hash)

	return s.repo.Create(user)
}

func (s *UserService) GetByEmail(email string) (*model.User, error) {
	return s.repo.GetByEmail(email)
}

func (s *UserService) Login(login, password string) (string, error) {

	user, err := s.repo.GetByUsernameOrEmail(login)
	if err != nil {
		return "", errors.New("invalid username/email or password")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)

	if err != nil {
		return "", errors.New("invalid username/email or password")
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}
