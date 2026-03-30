package repo

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
)

type Unit struct {
	Id         int     `json:"id" db:"id"`
	UnitName   string  `json:"unit_name" db:"unit_name"`
	RentAmount float64 `json:"rent_amount" db:"rent_amount"`
	Status     string  `json:"status" db:"status"`
}

type UnitRepo interface {
	Create(unit Unit) (*Unit, error)
	List(ownerId int) ([]*Unit, error)
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
	// TODO please complete this part
	return nil, nil
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
