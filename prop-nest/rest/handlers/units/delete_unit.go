package propertyunit

import (
	"fmt"
	"net/http"
	"propnest/util"
	"strconv"
)

func (h *Handler) DeleteUnit(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userID").(int)
	unitId := r.PathValue("id")

	untId, err := strconv.Atoi(unitId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = h.unitRepo.Delete(untId, userId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Unit Successfully Deleted", http.StatusOK)
}
