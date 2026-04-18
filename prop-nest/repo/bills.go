package repo

import "github.com/jmoiron/sqlx"

type BillsRepo interface {
	// Create() ()
}

type billsRepo struct {
	db *sqlx.DB
}

func NewBillsRepo(db *sqlx.DB) BillsRepo {
	return &billsRepo{
		db: db,
	}
}