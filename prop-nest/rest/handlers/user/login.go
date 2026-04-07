package user

import (
	"encoding/json"
	"fmt"
	"net/http"
	"propnest/util"
)

type requestLogin struct {
	Email_OR_Nid    string `json:"email_or_nid" db:"email_or_nid"`
	Password string `json:"password" db:"password"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var reqLogin requestLogin

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&reqLogin)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	usr, err := h.userRepo.Find(reqLogin.Email_OR_Nid, reqLogin.Password)
	if usr == nil {
		http.Error(w, "Internal Server Error", http.StatusBadRequest)
		return
	}
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	access_token, err := util.CreateJWT(h.cnf.SecretKey, util.CustomClaims{
		ID:        usr.ID,
		Full_Name: usr.Full_Name,
		Email_OR_Nid:     usr.Email_OR_Nid,
		Role:      usr.Role,
	})
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	util.SendData(w, access_token, http.StatusCreated)
}
