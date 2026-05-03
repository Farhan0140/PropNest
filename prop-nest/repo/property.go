package repo

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
)

type PropertyInfo struct {
	Id             int     `json:"id" db:"id"`
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
	List(ownerId int) ([]*PropertyInfo, error)
	Update(propInfo PropertyInfo, ownerId int) (*PropertyInfo, error)
	Delete(propertyId int, ownerId int) error
}

type propertyInfoRepo struct {
	db *sqlx.DB
}

func NewPropertyInfoRepo(db *sqlx.DB) PropertyInfoRepo {
	return &propertyInfoRepo{
		db: db,
	}
}


func getPrefix(name string) string {
	words := strings.Fields(name)

	prefix := ""
	for _, w := range words {
		prefix += strings.ToUpper(string(w[0]))
	}

	return prefix
}

func (r *propertyInfoRepo) Create(propInfo PropertyInfo) (*PropertyInfo, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err 
	}

	defer tx.Rollback()

	property_query := `
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
		RETURNING id
	`

	var property_id int

	err = tx.QueryRow(property_query, propInfo.OwnerId, propInfo.HouseName, propInfo.Address, propInfo.City, propInfo.PostalCode, propInfo.NumberOfFloors, propInfo.TotalUnits, propInfo.BaseRent, propInfo.Description).Scan(&property_id)
	if err != nil {
		return nil, err
	}

	var units []map[string]interface{}
	prefix := getPrefix(propInfo.HouseName)

	for floor := 1; floor <= propInfo.NumberOfFloors; floor++ {
		for unit_no := 1; unit_no <= propInfo.TotalUnits; unit_no++ {

			unitName := fmt.Sprintf("%s %d%02d", prefix, floor, unit_no)

			units = append(units, map[string]interface{}{
				"property_id": property_id,
				"unit_name":   unitName,
				"rent_amount":  propInfo.BaseRent,
				"status":       "available",
			})
		}
	}

	bulk_query := `
		INSERT INTO units (
			property_id, unit_name, rent_amount, status
		) VALUES (:property_id, :unit_name, :rent_amount, :status)
	`

	_, err = tx.NamedExec(bulk_query, units)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &propInfo, nil
}


func (r *propertyInfoRepo) List(ownerId int) ([]*PropertyInfo, error) {
	var propertyLst []*PropertyInfo

	query := `
		SELECT 
			id,
			house_name,
			address,
			city,
			postal_code,
			number_of_floors,
			total_units,
			base_rent,
			description
		FROM 
			properties
		WHERE
			owner_id = $1
	`

	err := r.db.Select(&propertyLst, query, ownerId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return propertyLst, nil
}

func (r *propertyInfoRepo) Update(propInfo PropertyInfo, ownerId int) (*PropertyInfo, error) {
	query := `
		UPDATE properties
		SET 
			house_name = $1, 
			address = $2,
			city = $3,
			postal_code = $4,
			number_of_floors = $5,
			total_units = $6,
			base_rent = $7
		WHERE id = $8 AND owner_id = $9
	`

	result, err := r.db.Exec(query, propInfo.HouseName, propInfo.Address, propInfo.City, propInfo.PostalCode, propInfo.NumberOfFloors, propInfo.TotalUnits, propInfo.BaseRent, propInfo.Id, ownerId)
	if err != nil {
		return nil, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}
	if rowsAffected == 0 {
		return nil, fmt.Errorf("Property not found")
	}

	return &propInfo, nil
}

func (r *propertyInfoRepo) Delete(propertyId int, ownerId int) error {
	query := `
		DELETE FROM properties
		WHERE id = $1 AND owner_id = $2
	`

	result, err := r.db.Exec(query, propertyId, ownerId)
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
		return fmt.Errorf("Property not found")
	}
	return nil
}
