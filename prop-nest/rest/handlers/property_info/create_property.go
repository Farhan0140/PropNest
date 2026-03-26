package propertyinfo

import (
	"encoding/json"
	"fmt"
	"net/http"
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
		http.Error(w, "Invalid Request Data", http.StatusBadRequest)
		return
	}

	ownerId := r.Context().Value("userID")
	fmt.Println("Owner Id: ", ownerId, newPropertyInfo.HouseName, newPropertyInfo.BaseRent)
}
