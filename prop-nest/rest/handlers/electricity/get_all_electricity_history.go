package electricity

import (
	"fmt"
	"net/http"
	"propnest/util"
)

func (h *Handler) GetAllUnitHistory(w http.ResponseWriter, r *http.Request) {

	historyLst, err := h.electricityRepo.List()
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, historyLst, http.StatusOK)
}
