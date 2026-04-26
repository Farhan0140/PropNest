package rentinvoice

import (
	"encoding/json"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

func (h *Handler) CreateRentInvoice(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req repo.CreateInvoiceRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if req.Scope == "" {
		http.Error(w, "scope is required", http.StatusBadRequest)
		return
	}

	switch req.Scope {

	case "property":
		if req.TargetPropertyID == nil {
			http.Error(w, "target_property_id required", http.StatusBadRequest)
			return
		}

	case "unit":
		if req.TargetUnitID == nil {
			http.Error(w, "target_unit_id required", http.StatusBadRequest)
			return
		}

	case "all":

	default:
		http.Error(w, "invalid scope", http.StatusBadRequest)
		return
	}

	res, err := h.rentInvoiceRepo.Create(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.SendData(w, res, http.StatusCreated)
}