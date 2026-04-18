package propertyinfo

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type PropertyInfo struct {
	OwnerId        int     `json:"owner_id"`
	HouseName      string  `json:"house_name"`
	Address        string  `json:"address"`
	City           string  `json:"city"`
	PostalCode     string  `json:"postal_code"`
	NumberOfFloors int     `json:"number_of_floors"`
	TotalUnits     int     `json:"total_units"`
	BaseRent       float64 `json:"base_rent"`
	Description    string  `json:"description"`
}

func (h *Handler) CreatePropertyInfo(w http.ResponseWriter, r *http.Request) {
	var newPropertyInfo PropertyInfo

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newPropertyInfo)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Invalid Request Data", http.StatusBadRequest)
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	ownerId := r.Context().Value("userID").(int)
	newPropertyInfo.OwnerId = ownerId

	created_prop_info, err := h.propInfoRepo.Create(repo.PropertyInfo{
		OwnerId: newPropertyInfo.OwnerId,
		HouseName: newPropertyInfo.HouseName,
		Address: newPropertyInfo.Address,
		City: newPropertyInfo.City,
		PostalCode: newPropertyInfo.PostalCode,
		NumberOfFloors: newPropertyInfo.NumberOfFloors,
		TotalUnits: newPropertyInfo.TotalUnits,
		BaseRent: newPropertyInfo.BaseRent,
		Description: newPropertyInfo.Description,
	})
	if err != nil {
		fmt.Println(err)
		util.SendError(w, "Internal Server Error", http.StatusInternalServerError)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, created_prop_info, http.StatusCreated)
}
