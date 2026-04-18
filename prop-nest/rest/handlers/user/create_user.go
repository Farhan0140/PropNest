package user

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"propnest/repo"
	"propnest/util"
)

type User struct {
	ID        int    `json:"id"`
	Full_Name string `json:"full_name"`
	Email_OR_Nid     string `json:"email_or_nid"`
	Password  string `json:"password"`
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var newUser User

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newUser)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, map[string]string{
			"error": "Invalid Request Data",
		}, http.StatusBadRequest)
		return
	}

	createdUser, err := h.userRepo.Create(repo.User{
		Full_Name: newUser.Full_Name,
		Email_OR_Nid: newUser.Email_OR_Nid,
		Password: newUser.Password,
	})
	if err != nil {
		fmt.Println(err)
		if errors.Is(err, repo.ErrUserExists) {
			util.SendError(w, map[string]string{
				"error": "User already exists with this email",
			}, http.StatusConflict)
			return
		}
		
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
	}

	util.SendData(w, createdUser, http.StatusCreated)
}
