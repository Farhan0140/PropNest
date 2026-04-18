package electricity

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type Electricity struct {
	UnitId       int     `json:"unit_id"`
	Year         int     `json:"year"`
	Month        int     `json:"month"`
	ReadingValue float64 `json:"reading_value"`
}

func (h *Handler) CreateElectricityUnit(w http.ResponseWriter, r *http.Request) {
	var newElectricityUnit Electricity

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newElectricityUnit)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Invalid Request Data",
		}, http.StatusBadRequest)
		return
	}

	if newElectricityUnit.Month < 1 || newElectricityUnit.Month > 12 {
		util.SendError(w, map[string]string{
			"error": "invalid month",
		}, http.StatusBadRequest)
		return
	}

	created_new_info, err := h.electricityRepo.Create(repo.Electricity{
		UnitId: newElectricityUnit.UnitId,
		Year: newElectricityUnit.Year,
		Month: newElectricityUnit.Month,
		ReadingValue: newElectricityUnit.ReadingValue,
	})
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, created_new_info, http.StatusCreated)
}
