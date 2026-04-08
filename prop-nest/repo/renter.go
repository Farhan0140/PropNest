package repo

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type Renter struct {
	Id          int    `json:"id" db:"id"`
	UnitId      int    `json:"unit_id" db:"unit_id"`
	FullName    string `json:"full_name" db:"full_name"`
	PhoneNumber string `json:"phone_number" db:"phone_number"`
	NidNumber   string `json:"nid_number" db:"nid_number"`
	DateOfBirth string `json:"date_of_birth" db:"date_of_birth"`
	Status      string `json:"status" db:"status"`
}

type RenterRepo interface {
	Create(renter Renter) (*Renter, error)
}

type renterRepo struct {
	db *sqlx.DB
}

func NewRenterRepo(db *sqlx.DB) RenterRepo {
	return &renterRepo{
		db: db,
	}
}

func (r *renterRepo) Create(renter Renter) (*Renter, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	// First Check Given Unit is available or not
	var exists bool

	checking_query := `
		SELECT EXISTS (
			SELECT 1 FROM units
			WHERE id = $1 AND status = 'available'
		)
	`
	err = tx.QueryRow(checking_query, renter.UnitId).Scan(&exists)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, fmt.Errorf("Unit is already occupied!")
	}
	
	// Creating Renter
	renter_query := `
		INSERT INTO renters (
			unit_id, 
			full_name, 
			phone_number, 
			nid_number,
			date_of_birth
		) VALUES (
			$1, 
			$2, 
			$3, 
			$4,
			$5
		)
		RETURNING id
	`
	
	err = tx.QueryRow(renter_query, renter.UnitId, renter.FullName, renter.PhoneNumber, renter.NidNumber, renter.DateOfBirth).Scan(&renter.Id)
	if err != nil {
		return nil, err
	}

	// Update the unit available to occupied
	unit_update_query := `
		UPDATE units
		SET 
			status = 'occupied'
		WHERE id = $1;
	`
	_, err = tx.Exec(unit_update_query, renter.UnitId)
	if err != nil {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(renter.PhoneNumber),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, err
	}
	renter_user_password := string(hashedPassword)

	for_user_query := `
		INSERT INTO users (
			full_name,
			email_or_nid,
			password,
			role
		) VALUES (
			$1,
			$2,
			$3,
			$4
		)
	`

	_, err = tx.Exec(for_user_query, renter.FullName, renter.NidNumber, renter_user_password, "renter")
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &renter, nil
}
