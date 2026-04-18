package propertyunit

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type UnitUpdate struct {
	Id         int     `json:"id"`
	PropertyId int     `json:"property_id"`
	UnitName   string  `json:"unit_name"`
	RentAmount float64 `json:"rent_amount"`
	Status     string  `json:"status"`
}

func (h *Handler) UpdateUnit(w http.ResponseWriter, r *http.Request) {
	ownerID := r.Context().Value("userID").(int)
	var newUpdatedUnit UnitUpdate

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newUpdatedUnit)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Invalid Request Data", http.StatusBadRequest)
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	updatedUnit, err := h.unitRepo.Update(repo.Unit{
		PropertyId: newUpdatedUnit.PropertyId,
		Id:         newUpdatedUnit.Id,
		UnitName:   newUpdatedUnit.UnitName,
		RentAmount: newUpdatedUnit.RentAmount,
		Status:     newUpdatedUnit.Status,
	}, ownerID)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Internal Server Error", http.StatusInternalServerError)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, updatedUnit, http.StatusOK)
}
