package middlewares

import (
	"net/http"
	"propnest/util"
	"strings"
)

func (m *Middleware) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" {
			http.Error(w, "Unauthorize", http.StatusUnauthorized)
			return 
		}
		
		headerArr := strings.Split(header, " ")
		if len(headerArr) != 2 || headerArr[0] != "JWT" {
			http.Error(w, "Unauthorize", http.StatusUnauthorized)
			return
		}
		
		customClaims, err := util.VerifyJWT(m.cnf.SecretKey, headerArr[1])
		if err != nil {
			http.Error(w, "Unauthorize", http.StatusUnauthorized)
			return
		}
		if customClaims == nil {
			http.Error(w, "Unauthorize", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
