package repo

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
)

type Electricity struct {
	Id           int     `json:"id" db:"id"`
	UnitId       int     `json:"unit_id" db:"unit_id"`
	Year         int     `json:"year" db:"year"`
	Month        int     `json:"month" db:"month"`
	ReadingValue float64 `json:"reading_value" db:"reading_value"`
}

type ElectricityRepo interface {
	Create(electricity Electricity) (*Electricity, error)
	Get(unitId int) ([]*Electricity, error)
	List() ([]*Electricity, error)
}

type electricityRepo struct {
	db *sqlx.DB
}

func NewElectricityRepo(db *sqlx.DB) ElectricityRepo {
	return &electricityRepo{
		db: db,
	}
}

func (r *electricityRepo) Create(electricity Electricity) (*Electricity, error) {
	query := `
		INSERT INTO electricity_readings (
			unit_id,
			year,
			month,
			reading_value
		) VALUES (
			$1,
			$2,
			$3,
			$4
		)
		RETURNING id
	`

	err := r.db.QueryRow(query, electricity.UnitId, electricity.Year, electricity.Month, electricity.ReadingValue).Scan(&electricity.Id)
	if err != nil {
		if strings.Contains(err.Error(), "unique_unit_date") {
			return nil, errors.New("electricity reading already exists for this month")
		}
		return nil, err
	}

	return &electricity, nil
}

func (r *electricityRepo) Get(unitId int) ([]*Electricity, error) {
	var electricityList []*Electricity

	query := `
		SELECT 
			id,
			unit_id,
			year,
			month,
			reading_value
		FROM electricity_readings
		WHERE unit_id = $1
	`

	err := r.db.Select(&electricityList, query, unitId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("No Previous history Found")
		}
		return nil, err
	}

	return electricityList, nil
}

func (r *electricityRepo) List() ([]*Electricity, error) {
	var electricityList []*Electricity

	query := `
		SELECT 
			id,
			unit_id,
			year,
			month,
			reading_value
		FROM electricity_readings
	`

	err := r.db.Select(&electricityList, query)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("No Previous history Found")
		}
		return nil, err
	}

	return electricityList, nil
}

// TODO finish this
// func (r *electricityRepo) Update(unitId int, electricity Electricity) (*Electricity, error) {
// 	query := `
// 		SELECT 
// 			id,
// 			unit_id,
// 			year,
// 			month,
// 			reading_value
// 		FROM electricity_readings
// 		WHERE unit_id = $1
// 		ORDER BY year DESC, month DESC
// 		LIMIT 1
// 	`

// 	var last Electricity

// 	err := r.db.QueryRow(query, unitId).Scan(
// 		&last.Id,
// 		&last.UnitId,
// 		&last.Year,
// 		&last.Month,
// 		&last.ReadingValue,
// 	)

// 	if err != nil {
// 		if err != sql.ErrNoRows {
// 			return nil, err
// 		}
// 		// no previous record → safe to insert
// 	}

// 	// 🔥 Compare
// 	if last.Year == electricity.Year && last.Month == electricity.Month {
// 		// same month found
// 		return nil, errors.New("reading for this month already exists")
// 	}

// 	// otherwise proceed insert/update
// 	return &electricity, nil
// }