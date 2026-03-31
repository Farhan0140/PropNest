package repo

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
)

type Unit struct {
	PropertyId int     `json:"property_id" db:"property_id"`
	Id         int     `json:"id" db:"id"`
	UnitName   string  `json:"unit_name" db:"unit_name"`
	RentAmount float64 `json:"rent_amount" db:"rent_amount"`
	Status     string  `json:"status" db:"status"`
}

type UnitRepo interface {
	Create(unit Unit) (*Unit, error)
	List(ownerId int) ([]*Unit, error)
	Delete(unit_id int) error
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

func (r *unitRepo) List(ownerId int) ([]*Unit, error) {
	var unitList []*Unit

	query := `
		SELECT 
			u.id, 
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

func (r *unitRepo) Delete(unit_id int) error {
	query := `
		DELETE FROM units
		WHERE id = $1
	`

	_, err := r.db.Exec(query, unit_id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}

		return err
	}

	return nil
}
