package maintenancerequests

import (
	"encoding/json"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

func (h *Handler) CreateMaintenance(w http.ResponseWriter, r *http.Request) {
	var req repo.MaintenanceRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Status == "" {
		req.Status = "pending"
	}
	if req.Priority == "" {
		req.Priority = "low"
	}

	res, err := h.maintenanceRequestsRepo.Create(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.SendData(w, res, http.StatusCreated)
}