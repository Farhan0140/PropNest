package rentinvoice

import (
	"fmt"
	"net/http"
	"propnest/util"
)

func (h *Handler) ListRentInvoices(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	invoices, err := h.rentInvoiceRepo.List()
	if err != nil {
		fmt.Println(err)

		util.SendError(w, map[string]string{
			"error": "Failed to fetch invoices",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, invoices, http.StatusOK)
}