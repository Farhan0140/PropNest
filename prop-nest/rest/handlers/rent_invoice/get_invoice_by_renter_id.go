package rentinvoice

import (
	"fmt"
	"net/http"
	"propnest/util"
	"strconv"
)

type renterID struct {
	Id int `json:"renter_id"`
}

func (h *Handler) GetInvoiceByRenterID(w http.ResponseWriter, r *http.Request) {

	renterId := r.URL.Query().Get("renter_id")
	rId, err := strconv.Atoi(renterId)
	if err != nil {
		fmt.Println("Conversion Failed String to Int in renterID", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	fmt.Println(rId)
	

	invoices, err := h.rentInvoiceRepo.Get(rId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.SendData(w, invoices, http.StatusOK)
}