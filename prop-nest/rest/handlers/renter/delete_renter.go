package renter

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/util"
)

type renterID struct {
	Id int `json:"id"`
}

func (h *Handler) DeleteRenter(w http.ResponseWriter, r *http.Request) {
	var renterId renterID
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&renterId)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Invalid Request Data", http.StatusBadRequest)
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	err = h.renterRepo.Delete(renterId.Id)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Internal Server Error", http.StatusInternalServerError)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Renter Deleted Successfully!", http.StatusOK)
}