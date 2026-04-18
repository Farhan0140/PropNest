package propertyinfo

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/util"
)

type PropertyID struct {
	Id int `json:"id"`
}

func (h *Handler) DeleteProperty(w http.ResponseWriter, r *http.Request) {
	owner_id := r.Context().Value("userID").(int)
	var propID PropertyID
	
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&propID)

	err := h.propInfoRepo.Delete(propID.Id, owner_id)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, "Property Deleted Successfully!", http.StatusOK)
}
