package repo

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        int    `json:"id" db:"id"`
	Full_Name string `json:"full_name" db:"full_name"`
	Email_OR_Nid     string `json:"email_or_nid" db:"email_or_nid"`
	Password  string `json:"password" db:"password"`
	Role      string `json:"role" db:"role"`
}

type UserRepo interface {
	Create(user User) (*User, error)
	Find(email_or_nid, password string) (*User, error)
}

type userRepo struct {
	db *sqlx.DB
}

var ErrUserExists = errors.New("user already exists")

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
			email_or_nid,
			password
		) VALUES (
			$1,
			$2,
			$3
		)
		RETURNING id
	`

	row := r.db.QueryRow(query, user.Full_Name, user.Email_OR_Nid, user.Password)
	err = row.Scan(&user.ID)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" {
				return nil, ErrUserExists
			}
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Find(email_or_nid, password string) (*User, error) {
	var user User
	query := `
		SELECT id, full_name, email_or_nid, password, role
		FROM users
		WHERE email_or_nid = $1
		LIMIT 1
	`
	err := r.db.Get(&user, query, email_or_nid)
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
