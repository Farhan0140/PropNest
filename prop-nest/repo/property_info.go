package repo

import (
	"github.com/jmoiron/sqlx"
)

type PropertyInfo struct {
	OwnerId        int     `json:"owner_id" db:"owner_id"`
	HouseName      string  `json:"house_name" db:"house_name"`
	Address        string  `json:"address" db:"address"`
	City           string  `json:"city" db:"city"`
	PostalCode     string  `json:"postal_code" db:"postal_code"`
	NumberOfFloors int     `json:"number_of_floors" db:"number_of_floors"`
	TotalUnits     int     `json:"total_units" db:"total_units"`
	BaseRent       float64 `json:"base_rent" db:"base_rent"`
	Description    string  `json:"description" db:"description"`
}

type PropertyInfoRepo interface {
	Create(propInfo PropertyInfo) (*PropertyInfo, error)
}

type propertyInfoRepo struct {
	db *sqlx.DB
}

func NewPropertyInfoRepo(db *sqlx.DB) PropertyInfoRepo {
	return &propertyInfoRepo{
		db: db,
	}
}

func (r *propertyInfoRepo) Create(propInfo PropertyInfo) (*PropertyInfo, error) {
	query := `
		INSERT INTO properties (
			owner_id,
			house_name,
			address,
			city,
			postal_code,
			number_of_floors,
			total_units,
			base_rent,
			description
		) VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9
		)
	`

	_, err := r.db.Exec(query, propInfo.OwnerId, propInfo.HouseName, propInfo.Address, propInfo.City, propInfo.PostalCode, propInfo.NumberOfFloors, propInfo.TotalUnits, propInfo.BaseRent, propInfo.Description)
	if err != nil {
		return nil, err
	}

	return &propInfo, nil
}
