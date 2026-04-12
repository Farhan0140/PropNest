package renter

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type UpdateRenter struct {
	Id          int    `json:"id"`
	UnitId      *int    `json:"unit_id"`
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	NidNumber   string `json:"nid_number"`
	DateOfBirth string `json:"date_of_birth"`
	Status      string `json:"status"`
}

func (h *Handler) UpdateRenter(w http.ResponseWriter, r *http.Request) {
	var updatedRenterInfo UpdateRenter
	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&updatedRenterInfo)
	if err != nil {
		fmt.Println(err) 
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}
	
	fmt.Println(updatedRenterInfo)
	
	updatedRenter, err := h.renterRepo.Update(repo.Renter{
		Id: updatedRenterInfo.Id,
		UnitId: updatedRenterInfo.UnitId,
		FullName: updatedRenterInfo.FullName,
		PhoneNumber: updatedRenterInfo.PhoneNumber,
		NidNumber: updatedRenterInfo.NidNumber,
		DateOfBirth: updatedRenterInfo.DateOfBirth,
		Status: updatedRenterInfo.Status,
	})
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, updatedRenter, http.StatusOK)
}