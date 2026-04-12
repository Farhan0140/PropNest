package renter

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type RenterInfo struct {
	UnitId      *int    `json:"unit_id"`
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	NidNumber   string `json:"nid_number"`
	DateOfBirth string `json:"date_of_birth"`
	Status      string `json:"status"`
}

func (h *Handler) CreateRenter(w http.ResponseWriter, r *http.Request) {
	var newRenter RenterInfo
	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newRenter)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid Data", http.StatusBadRequest)
		return
	}

	created_renter, err := h.renterRepo.Create(repo.Renter{
		UnitId: newRenter.UnitId,
		FullName: newRenter.FullName,
		PhoneNumber: newRenter.PhoneNumber,
		NidNumber: newRenter.NidNumber,
		DateOfBirth: newRenter.DateOfBirth,
		Status: newRenter.Status,
	})
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, created_renter, http.StatusCreated)
}