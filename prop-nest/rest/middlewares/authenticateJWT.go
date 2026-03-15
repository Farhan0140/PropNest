package middlewares

import (
	"context"
	"fmt"
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

		fmt.Println("A jwt ", customClaims.Role)

		ctx := context.WithValue(r.Context(), "userID", customClaims.ID)
		ctx = context.WithValue(ctx, "role", customClaims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
