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
	Create(e Electricity) (*Electricity, error)
	Get(unitId int) ([]*Electricity, error)
	List() ([]*Electricity, error)
}

type electricityRepo struct {
	db *sqlx.DB
}

func NewElectricityRepo(db *sqlx.DB) ElectricityRepo {
	return &electricityRepo{db: db}
}

// 🔥 GET price (simple: fixed for now)
func (r *electricityRepo) getPerUnitPrice() float64 {
	return 10 // later you can fetch from DB
}

func (r *electricityRepo) Create(e Electricity) (*Electricity, error) {

	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// 🔹 insert reading
	query := `
		INSERT INTO electricity_readings (
			unit_id, year, month, reading_value
		) VALUES ($1,$2,$3,$4)
		RETURNING id
	`

	err = tx.QueryRow(query, e.UnitId, e.Year, e.Month, e.ReadingValue).Scan(&e.Id)
	if err != nil {
		if strings.Contains(err.Error(), "unique_unit_date") {
			return nil, errors.New("reading already exists for this month")
		}
		return nil, err
	}

	// 🔹 get previous reading
	var prevReading float64

	err = tx.Get(&prevReading, `
		SELECT reading_value
		FROM electricity_readings
		WHERE unit_id=$1 AND (year < $2 OR (year=$2 AND month < $3))
		ORDER BY year DESC, month DESC
		LIMIT 1
	`, e.UnitId, e.Year, e.Month)

	if err != nil {
		if err == sql.ErrNoRows {
			prevReading = 0
		} else {
			return nil, err
		}
	}

	// 🔹 calculate
	unitUsed := e.ReadingValue - prevReading
	if unitUsed < 0 {
		return nil, errors.New("invalid reading (negative usage)")
	}

	price := r.getPerUnitPrice()
	total := unitUsed * price

	// 🔹 insert electricity_bill
	_, err = tx.Exec(`
		INSERT INTO electricity_bills (
			unit_id, year, month,
			previous_reading, current_reading,
			unit_used, per_unit_price, total_amount
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
	`,
		e.UnitId,
		e.Year,
		e.Month,
		prevReading,
		e.ReadingValue,
		unitUsed,
		price,
		total,
	)

	if err != nil {
		return nil, err
	}

	return &e, tx.Commit()
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