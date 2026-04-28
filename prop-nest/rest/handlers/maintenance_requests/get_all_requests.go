package maintenancerequests

import (
	"net/http"
	"propnest/util"
)

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.maintenanceRequestsRepo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.SendData(w, data, http.StatusOK)
}