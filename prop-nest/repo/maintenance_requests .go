package repo

import (
	"github.com/jmoiron/sqlx"
)

type MaintenanceRequest struct {
	ID              int        `db:"id" json:"id"`
	RenterID        int        `db:"renter_id" json:"renter_id"`
	PropertyID      int        `db:"property_id" json:"property_id"`
	UnitID          int        `db:"unit_id" json:"unit_id"`
	Title           string     `db:"title" json:"title"`
	Description     string     `db:"description" json:"description"`
	Priority        string     `db:"priority" json:"priority"`
	ImageAttachment string     `db:"image_attachment" json:"image_attachment"`
	Status          string     `db:"status" json:"status"`
}

type MaintenanceRequestsRepo interface {
	Create(req *MaintenanceRequest) (*MaintenanceRequest, error)
	GetAll() ([]MaintenanceRequest, error)
}

type maintenanceRequestsRepo struct {
	db *sqlx.DB
}

func NewMaintenanceRequestsRepo(db *sqlx.DB) MaintenanceRequestsRepo {
	return &maintenanceRequestsRepo{
		db: db,
	}
}

func (r *maintenanceRequestsRepo) Create(req *MaintenanceRequest) (*MaintenanceRequest, error) {
	query := `
	INSERT INTO maintenance_requests (
		renter_id, property_id, unit_id,
		title, description, priority, status
	) VALUES (
		:renter_id, :property_id, :unit_id,
		:title, :description, :priority,
		:status
	) RETURNING id
	`

	rows, err := r.db.NamedQuery(query, req)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		rows.Scan(&req.ID)
	}

	return req, nil
}


func (r *maintenanceRequestsRepo) GetAll() ([]MaintenanceRequest, error) {
	var requests []MaintenanceRequest

	query := `
	SELECT 
		id, renter_id, property_id, unit_id, title, description, priority, status 
		FROM maintenance_requests 
		ORDER BY created_at DESC
	`

	err := r.db.Select(&requests, query)
	return requests, err
}
