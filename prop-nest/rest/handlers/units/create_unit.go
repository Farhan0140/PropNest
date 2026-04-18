package propertyunit

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type Unit struct {
	PropertyId int     `json:"property_id"`
	UnitName   string  `json:"unit_name"`
	RentAmount float64 `json:"rent_amount"`
	Status     string  `json:"status"`
}

func (h *Handler) CreateUnit(w http.ResponseWriter, r *http.Request) {
	var newUnit Unit

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newUnit)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Invalid Request Data", http.StatusBadRequest)
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	createdUnit, err := h.unitRepo.Create(repo.Unit{
		PropertyId: newUnit.PropertyId,
		UnitName: newUnit.UnitName,
		RentAmount: newUnit.RentAmount,
		Status: newUnit.Status,
	})
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Internal Server Error", http.StatusInternalServerError)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, createdUnit, http.StatusCreated)
}
