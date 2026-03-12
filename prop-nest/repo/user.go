package repo

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        int    `json:"id" db:"id"`
	Full_Name string `json:"full_name" db:"full_name"`
	Email     string `json:"email" db:"email"`
	Password  string `json:"password" db:"password"`
	Role      string `json:"role" db:"role"`
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
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	query := `
		INSERT INTO users (
			full_name,
			email,
			password
		) VALUES (
			$1,
			$2,
			$3
		)
		RETURNING id
	`

	row := r.db.QueryRow(query, user.Full_Name, user.Email, user.Password)
	err = row.Scan(&user.ID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Find(email, password string) (*User, error) {
	var user User
	query := `
		SELECT id, full_name, email, password, role
		FROM users
		WHERE email = $1
		LIMIT 1
	`
	err := r.db.Get(&user, query, email)
	if err != nil {
		fmt.Println(err)
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)
	if err != nil {
		fmt.Println(err)
		return nil, nil
	}

	return &user, nil
}
