package repo

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type Unit struct {
	PropertyId int     `json:"property_id" db:"property_id"`
	Id         int     `json:"id" db:"id"`
	UnitName   string  `json:"unit_name" db:"unit_name"`
	RentAmount float64 `json:"rent_amount" db:"rent_amount"`
	Status     string  `json:"status" db:"status"`
}

type UnitWithRenter struct {
	PropertyId int     `json:"property_id" db:"property_id"`
	Id         int     `json:"id" db:"id"`
	UnitName   string  `json:"unit_name" db:"unit_name"`
	RentAmount float64 `json:"rent_amount" db:"rent_amount"`
	Status     string  `json:"status" db:"status"`
	RenterName string  `json:"full_name" db:"full_name"`
}

type UnitRepo interface {
	Create(unit Unit) (*Unit, error)
	List(ownerId int) ([]*UnitWithRenter, error)
	Update(unit Unit, ownerID int) (*Unit, error)
	Delete(unit_id int, ownerID int) error
}

type unitRepo struct {
	db *sqlx.DB
}

func NewUnitRepo(db *sqlx.DB) UnitRepo {
	return &unitRepo{
		db: db,
	}
}

func (r *unitRepo) Create(unit Unit) (*Unit, error) {
	query := `
		INSERT INTO units (
			property_id,
			unit_name,
			rent_amount,
			status
		) VALUES (
			$1,
			$2,
			$3,
			$4
		)
		RETURNING id
	`

	row := r.db.QueryRow(query, unit.PropertyId, unit.UnitName, unit.RentAmount, unit.Status)
	err := row.Scan(&unit.Id)
	if err != nil {
		return nil, err
	}

	return &unit, nil
}

func (r *unitRepo) List(ownerId int) ([]*UnitWithRenter, error) {
	var unitList []*UnitWithRenter

	query := `
		SELECT 
			u.id, 
			u.property_id,
			u.unit_name, 
			u.rent_amount, 
			u.status
		FROM units AS u
		JOIN properties p ON u.property_id = p.id
		WHERE p.owner_id = $1
	`

	err := r.db.Select(&unitList, query, ownerId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return unitList, nil
}

func (r *unitRepo) Update(unit Unit, ownerID int) (*Unit, error) {
	query := `
		UPDATE units
		SET 
			unit_name = $1,
			rent_amount = $2,
			status = $3
		FROM properties
		WHERE units.property_id = properties.id
		AND units.id = $4
		AND properties.owner_id = $5
	`

	result, err := r.db.Exec(query, unit.UnitName, unit.RentAmount, unit.Status, unit.Id, ownerID)
	if err != nil {
		return nil, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}
	if rowsAffected == 0 {
		return nil, fmt.Errorf("Unit not found")
	}

	return &unit, nil
}

func (r *unitRepo) Delete(unit_id int, owner_id int) error {
	query := `
		DELETE FROM units
		WHERE id = $1
		AND property_id IN (
			SELECT id FROM properties WHERE owner_id = $2
		);
	`

	result, err := r.db.Exec(query, unit_id, owner_id)
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
		return fmt.Errorf("Unit not found")
	}

	return nil
}
