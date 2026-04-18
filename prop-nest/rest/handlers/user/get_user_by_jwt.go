package user

import (
	"net/http"
	"propnest/util"
	"strings"
)

func (h *Handler) GetUserByJWT(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	authToken := strings.Split(authHeader, " ")
	if len(authToken) != 2 || authToken[0] != "JWT" {
		util.SendError(w, map[string]string{
			"error": "Unauthorize",
		}, http.StatusUnauthorized)
		return
	}

	claims, err := util.VerifyJWT(h.cnf.SecretKey, authToken[1])
	if err != nil {
		util.SendError(w, map[string]string{
			"error": "Internal Server Error",
		}, http.StatusInternalServerError)
		return
	}

	util.SendData(w, claims, http.StatusOK)
}
