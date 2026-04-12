package repo

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type Renter struct {
	Id          int    `json:"id" db:"id"`
	UnitId      *int    `json:"unit_id" db:"unit_id"`
	FullName    string `json:"full_name" db:"full_name"`
	PhoneNumber string `json:"phone_number" db:"phone_number"`
	NidNumber   string `json:"nid_number" db:"nid_number"`
	DateOfBirth string `json:"date_of_birth" db:"date_of_birth"`
	Status      string `json:"status" db:"status"`
}

type RenterWithUnit struct {
	Id          int    `db:"id" json:"id"`
	UnitId      *int    `db:"unit_id" json:"unit_id"`
	FullName    string `db:"full_name" json:"full_name"`
	PhoneNumber string `db:"phone_number" json:"phone_number"`
	NidNumber   string `db:"nid_number" json:"nid_number"`
	DateOfBirth string `db:"date_of_birth" json:"date_of_birth"`
	Status      string `db:"status" json:"status"`

	UnitName   *string  `db:"unit_name" json:"unit_name"`
	RentAmount *float64 `db:"rent_amount" json:"rent_amount"`
}

type RenterRepo interface {
	Create(renter Renter) (*Renter, error)
	List() ([]*RenterWithUnit, error)
	Update(renter Renter) (*Renter, error)
	Delete(renterId int) error 
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

func (r *renterRepo) List() ([]*RenterWithUnit, error) {
	var renterList []*RenterWithUnit

	query := `
		SELECT 
			r.id,
			r.unit_id,
			r.full_name,
			r.phone_number,
			r.nid_number,
			r.status,
			r.date_of_birth
		FROM renters as r
	`

	err := r.db.Select(&renterList, query)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return renterList, nil
}

func (r *renterRepo) Update(renter Renter) (*Renter, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}

	defer tx.Rollback()
	
	// If the renter status is 'left,' skipped the update process.
	var oldRenter Renter

	query := `
		SELECT id, unit_id, full_name, phone_number, nid_number, date_of_birth, status
		FROM renters
		WHERE id = $1
	`
	err = tx.Get(&oldRenter, query, renter.Id)
	if err != nil {
		return nil, err
	}

	
	if oldRenter.Status == "left" && renter.Status == "left" {
		return nil, fmt.Errorf("Update is'nt available for left renter")
	}

	// When a status changes from 'active' to 'left,' trigger a renter update and set the unit status to 'Available
	if oldRenter.Status == "active" && renter.Status == "left" {
		// For unit occupied to available
		update_unit_query_1 := `
			UPDATE units
			SET status = 'available'
			WHERE id = $1
		`

		_, err = tx.Exec(update_unit_query_1, renter.UnitId)
		if err != nil {
			return nil, err
		}

		update_renter_query := `
			UPDATE renters
			SET 
				unit_id = NULL,
				full_name = $1,
				phone_number = $2,
				nid_number = $3,
				status = $4,
				date_of_birth = $5
			WHERE 
				id = $6;
		`
		_, err = tx.Exec(update_renter_query, renter.FullName, renter.PhoneNumber, renter.NidNumber, renter.Status, renter.DateOfBirth, renter.Id)
		if err != nil {
			return nil, err
		}

		if err := tx.Commit(); err != nil {
			return nil, err
		}

		return &renter, nil
	}


	// If both the previous and new statuses are 'Active,' update the entire table

	var oldUnitId = oldRenter.UnitId

	// First Check Given Unit is available or not
	if oldUnitId != renter.UnitId {
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

		// For unit occupied to available
		update_unit_query_1 := `
			UPDATE units
			SET status = 'available'
			WHERE id = $1
		`
		_, err = tx.Exec(update_unit_query_1, oldUnitId)
		if err != nil {
			return nil, err
		}

		// Update the unit available to occupied
		update_unit_query_2 := `
			UPDATE units
			SET 
				status = 'occupied'
			WHERE id = $1;
		`
		_, err = tx.Exec(update_unit_query_2, renter.UnitId)
		if err != nil {
			return nil, err
		}
	}

	update_renter_query := `
		UPDATE renters
		SET 
			unit_id = $1,
			full_name = $2,
			phone_number = $3,
			nid_number = $4,
			status = $5,
			date_of_birth = $6
		WHERE 
			id = $7;
	`
	_, err = tx.Exec(update_renter_query, renter.UnitId, renter.FullName, renter.PhoneNumber, renter.NidNumber, renter.Status, renter.DateOfBirth, renter.Id)
	if err != nil {
		return nil, err
	}

	
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &renter, nil
}

func (r *renterRepo) Delete(renterId int) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	var unitId *int
	findUnitId := `
		SELECT unit_id FROM renters WHERE id = $1
	`
	err = tx.QueryRow(findUnitId, renterId).Scan(&unitId)
	if err != nil {
		return err
	}

	// For unit occupied to available
	update_unit_query_1 := `
		UPDATE units
		SET status = 'available'
		WHERE id = $1
	`
	if unitId != nil {
		_, err = tx.Exec(update_unit_query_1, unitId)
		if err != nil {
			return err
		}
	}


	query := `
		DELETE FROM renters
		WHERE id = $1
	`

	result, err := tx.Exec(query, renterId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}

		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("Renter not found")
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}