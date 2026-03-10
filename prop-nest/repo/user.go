package repo

import "github.com/jmoiron/sqlx"

type User struct {
	ID        int    `json:"id"`
	Full_Name string `json:"full_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UserRepo interface {
	Create(user User) (*User, error)
	Find(email, password string) (*User, error)
}

type userRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) Create(user User) (*User, error) {
	return nil, nil
}

func (r *userRepo) Find(email, password string) (*User, error) {
	return nil, nil
}
