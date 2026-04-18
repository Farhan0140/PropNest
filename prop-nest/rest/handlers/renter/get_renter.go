package renter

import (
	"fmt"
	"net/http"
	"propnest/util"
)

func (h *Handler) GetRenters(w http.ResponseWriter, r *http.Request) {
	renterLst, err := h.renterRepo.List()
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Internal Server Error", http.StatusInternalServerError)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, renterLst, http.StatusOK)
}
