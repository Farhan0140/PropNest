package propertyunit

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/util"
)

type UnitID struct {
	Id int `json:"id"`
}

func (h *Handler) DeleteUnit(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userID").(int)
	var newUnit UnitID

	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&newUnit)

	err := h.unitRepo.Delete(newUnit.Id, userId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Unit Successfully Deleted", http.StatusOK)
}
