package electricity

import (
	"fmt"
	"net/http"
	"propnest/util"
	"strconv"
)

type UnitID struct {
	UnitId int `json:"unit_id"`
}

func (h *Handler) GetPreviousUnitHistory(w http.ResponseWriter, r *http.Request) {
	var unitId = r.PathValue("id")
	uId, err := strconv.Atoi(unitId)
	if err != nil {
		util.SendError(w, map[string]string{
			"error": "Enter Valid Unit Id",
		}, http.StatusBadRequest)
		return
	}

	historyLst, err := h.electricityRepo.Get(uId)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, historyLst, http.StatusOK)
}
