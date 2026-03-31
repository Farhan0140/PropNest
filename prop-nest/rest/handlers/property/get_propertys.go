package propertyinfo

import (
	"fmt"
	"net/http"
	"propnest/util"
)

func (h *Handler) GetPropertyList(w http.ResponseWriter, r *http.Request) {
	ownerId := r.Context().Value("userID").(int)

	propertyLst, err := h.propInfoRepo.List(ownerId)
	if err != nil {
		fmt.Println(err)

		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, propertyLst, http.StatusOK)
}
