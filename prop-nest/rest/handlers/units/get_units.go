package propertyunit

import (
	"fmt"
	"net/http"
	"propnest/util"
)

func (h *Handler) GetUnits(w http.ResponseWriter, r *http.Request) {
	ownerId := r.Context().Value("userID").(int)

	unitList, err := h.unitRepo.List(ownerId)
	if err != nil {
		fmt.Println(err)

		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, unitList, http.StatusOK)
}
