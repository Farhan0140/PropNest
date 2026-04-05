package propertyinfo

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type PropertyUpdateInfo struct {
	Id             int     `json:"id"`
	HouseName      string  `json:"house_name"`
	Address        string  `json:"address"`
	City           string  `json:"city"`
	PostalCode     string  `json:"postal_code"`
	NumberOfFloors int     `json:"number_of_floors"`
	TotalUnits     int     `json:"total_units"`
	BaseRent       float64 `json:"base_rent"`
	Description    string  `json:"description"`
}

func (h *Handler) UpdateProperty(w http.ResponseWriter, r *http.Request) {
	owner_id := r.Context().Value("userID").(int)
	var newUpdatedPropertyInfo PropertyUpdateInfo

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newUpdatedPropertyInfo)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	updatedPropInfo, err := h.propInfoRepo.Update(repo.PropertyInfo{
		Id:             newUpdatedPropertyInfo.Id,
		HouseName:      newUpdatedPropertyInfo.HouseName,
		Address:        newUpdatedPropertyInfo.Address,
		City:           newUpdatedPropertyInfo.City,
		PostalCode:     newUpdatedPropertyInfo.PostalCode,
		NumberOfFloors: newUpdatedPropertyInfo.NumberOfFloors,
		TotalUnits:     newUpdatedPropertyInfo.TotalUnits,
		BaseRent:       newUpdatedPropertyInfo.BaseRent,
	}, owner_id)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, updatedPropInfo, http.StatusOK)
}
