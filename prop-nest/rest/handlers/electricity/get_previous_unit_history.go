package electricity

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/util"
)

type UnitID struct {
	UnitId int `json:"unit_id"`
}

func (h *Handler) GetPreviousUnitHistory(w http.ResponseWriter, r *http.Request) {
	var unitId UnitID

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&unitId)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Invalid Request Data",
		}, http.StatusBadRequest)
		return
	}

	historyLst, err := h.electricityRepo.List(unitId.UnitId)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, historyLst, http.StatusOK)
}
