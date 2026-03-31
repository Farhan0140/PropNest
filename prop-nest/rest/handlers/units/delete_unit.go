package propertyunit

import (
	"fmt"
	"net/http"
	"propnest/util"
	"strconv"
)

func (h *Handler) DeleteUnit(w http.ResponseWriter, r *http.Request) {
	unitId := r.PathValue("id")

	uId, err := strconv.Atoi(unitId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = h.unitRepo.Delete(uId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Unit Successfully Deleted", http.StatusOK)
}
