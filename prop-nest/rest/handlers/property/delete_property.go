package propertyinfo

import (
	"fmt"
	"net/http"
	"propnest/util"
	"strconv"
)

func (h *Handler) DeleteProperty(w http.ResponseWriter, r *http.Request) {
	owner_id := r.Context().Value("userID").(int)

	property_id := r.PathValue("id")
	propertyId, err := strconv.Atoi(property_id)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = h.propInfoRepo.Delete(propertyId, owner_id)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Property Deleted Successfully!", http.StatusOK)
}
