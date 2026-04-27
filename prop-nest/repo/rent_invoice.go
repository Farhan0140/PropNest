package repo

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type InvoiceItem struct {
	Type        string   `json:"type"`
	Note        *string  `json:"note"`
	TotalAmount *float64 `json:"total_amount"`
}

type CreateInvoiceRequest struct {
	Scope            string        `json:"scope"` // property | all | unit
	TargetUnitID     *int          `json:"target_unit_id"`
	TargetPropertyID *int          `json:"target_property_id"`
	Items            []InvoiceItem `json:"items"`
}

type InvoiceItemResponse struct {
	ID          int     `json:"id" db:"id"`
	ItemType    string  `json:"item_type" db:"item_type"`
	Amount      float64 `json:"amount" db:"amount"`
	Description *string `json:"description" db:"description"`
}

type RentInvoiceResponse struct {
	ID              int64                 `json:"id" db:"id"`
	RenterID        int                   `json:"renter_id" db:"renter_id"`
	UnitID          int                   `json:"unit_id" db:"unit_id"`
	Month           int                   `json:"month" db:"month"`
	Year            int                   `json:"year" db:"year"`
	Status          string                `json:"status" db:"status"`
	TotalAmount     float64               `json:"total_amount" db:"total_amount"`
	TotalPaidAmount float64               `json:"total_paid_amount" db:"total_paid_amount"`
	Items           []InvoiceItemResponse `json:"items"`
}

type RentInvoiceRepo interface {
	Create(req CreateInvoiceRequest) ([]RentInvoiceResponse, error)
	List() ([]RentInvoiceResponse, error)
}

type rentInvoiceRepo struct {
	db *sqlx.DB
}

func NewBillsRepo(db *sqlx.DB) RentInvoiceRepo {
	return &rentInvoiceRepo{
		db: db,
	}
}

func (r *rentInvoiceRepo) Create(req CreateInvoiceRequest) ([]RentInvoiceResponse, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	now := time.Now()
	year := now.Year()
	month := int(now.Month())

	// =========================
	// 🔹 Step 1: Get Units
	// =========================
	var unitIDs []int

	switch req.Scope {

	case "property":
		if req.TargetPropertyID == nil {
			return nil, fmt.Errorf("property_id required")
		}

		err = tx.Select(&unitIDs, `
			SELECT u.id
			FROM units u
			JOIN renters r ON r.unit_id = u.id AND r.status = 'active'
			WHERE u.property_id = $1 AND u.status = 'occupied'
		`, *req.TargetPropertyID)

	case "all":
		err = tx.Select(&unitIDs, `
			SELECT u.id
			FROM units u
			JOIN renters r ON r.unit_id = u.id AND r.status = 'active'
			WHERE u.status = 'occupied'
		`)

	case "unit":
		if req.TargetUnitID == nil {
			return nil, fmt.Errorf("unit_id required")
		}

		err = tx.Select(&unitIDs, `
			SELECT u.id
			FROM units u
			JOIN renters r ON r.unit_id = u.id AND r.status = 'active'
			WHERE u.id = $1 AND u.status = 'occupied'
		`, *req.TargetUnitID)

	default:
		return nil, fmt.Errorf("invalid scope")
	}

	if err != nil {
		return nil, err
	}

	if len(unitIDs) == 0 {
		return nil, fmt.Errorf("no valid units found")
	}

	// =========================
	// 🔹 Step 2: Loop Units
	// =========================
	for _, unitID := range unitIDs {

		// 🔸 Prevent duplicate invoice
		var exists int
		err = tx.Get(&exists, `
			SELECT COUNT(1)
			FROM rent_invoices
			WHERE unit_id=$1 AND month=$2 AND year=$3
		`, unitID, month, year)

		if err != nil {
			return nil, err
		}
		if exists > 0 {
			continue
		}

		// 🔸 Get rent amount
		var rentAmount float64
		err = tx.Get(&rentAmount, `
			SELECT rent_amount FROM units WHERE id=$1
		`, unitID)
		if err != nil {
			return nil, err
		}

		// 🔸 Get renter_id
		var renterID int
		err = tx.Get(&renterID, `
			SELECT id FROM renters
			WHERE unit_id=$1 AND status='active'
			LIMIT 1
		`, unitID)

		if err != nil {
			continue
		}

		// =========================
		// 🔹 Create Invoice FIRST
		// =========================
		var invoiceID int64
		var totalAmount float64 = 0

		err = tx.QueryRow(`
			INSERT INTO rent_invoices (renter_id, unit_id, month, year, status, total_amount)
			VALUES ($1,$2,$3,$4,'unpaid',0)
			RETURNING id
		`,
			renterID,
			unitID,
			month,
			year,
		).Scan(&invoiceID)

		if err != nil {
			return nil, err
		}

		// =========================
		// 🔹 Add Rent
		// =========================
		totalAmount += rentAmount

		_, err = tx.Exec(`
			INSERT INTO invoice_items
			(invoice_id, item_type, amount, description)
			VALUES ($1,'rent',$2,'Monthly Rent')
		`, invoiceID, rentAmount)

		if err != nil {
			return nil, err
		}

		// =========================
		// 🔹 Add Electricity (optional)
		// =========================
		var elecAmount float64

		err = tx.Get(&elecAmount, `
			SELECT total_amount
			FROM electricity_bills
			WHERE unit_id=$1 AND year=$2 AND month=$3
		`, unitID, year, month)

		if err == nil {
			totalAmount += elecAmount

			_, err = tx.Exec(`
				INSERT INTO invoice_items
				(invoice_id, item_type, amount, description)
				VALUES ($1,'electricity',$2,'Electricity Bill')
			`, invoiceID, elecAmount)

			if err != nil {
				return nil, err
			}
		}

		// =========================
		// 🔹 Add Other Items
		// =========================
		for _, item := range req.Items {

			if item.TotalAmount == nil {
				continue
			}

			amount := *item.TotalAmount
			totalAmount += amount

			_, err = tx.Exec(`
				INSERT INTO invoice_items
				(invoice_id, item_type, amount, description)
				VALUES ($1,$2,$3,$4)
			`,
				invoiceID,
				item.Type,
				amount,
				item.Note,
			)

			if err != nil {
				return nil, err
			}
		}

		// =========================
		// 🔹 Update Total
		// =========================
		_, err = tx.Exec(`
			UPDATE rent_invoices
			SET total_amount = $1
			WHERE id = $2
		`, totalAmount, invoiceID)

		if err != nil {
			return nil, err
		}
	}

	var responses []RentInvoiceResponse
	for _, unitID := range unitIDs {

		var invoice RentInvoiceResponse

		err = tx.Get(&invoice, `
			SELECT id, renter_id, unit_id, month, year, status, total_amount
			FROM rent_invoices
			WHERE unit_id=$1 AND month=$2 AND year=$3
		`, unitID, month, year)

		if err != nil {
			continue
		}

		var items []InvoiceItemResponse

		err = tx.Select(&items, `
			SELECT id, item_type, amount, description
			FROM invoice_items
			WHERE invoice_id=$1
		`, invoice.ID)

		if err != nil {
			return nil, err
		}

		invoice.Items = items
		responses = append(responses, invoice)
	}

	return responses, tx.Commit()
}

func (r *rentInvoiceRepo) List() ([]RentInvoiceResponse, error) {

	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var invoices []RentInvoiceResponse

	// 🔹 Step 1: Get all invoices
	err = tx.Select(&invoices, `
		SELECT 
			id,
			renter_id,
			unit_id,
			month,
			year,
			status,
			total_amount,
			total_paid_amount
		FROM rent_invoices
		ORDER BY year DESC, month DESC, id DESC
	`)
	if err != nil {
		return nil, err
	}

	// 🔹 Step 2: Attach items
	for i := range invoices {

		var items []InvoiceItemResponse

		err = tx.Select(&items, `
			SELECT 
				id,
				item_type,
				amount,
				description
			FROM invoice_items
			WHERE invoice_id = $1
		`, invoices[i].ID)

		if err != nil {
			return nil, err
		}

		invoices[i].Items = items
	}

	// 🔹 Commit (important even for read tx)
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return invoices, nil
}
