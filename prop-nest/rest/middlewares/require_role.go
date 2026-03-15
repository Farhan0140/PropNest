package middlewares

import (
	"fmt"
	"net/http"
)

func (m *Middleware) RequireRole(roles ...string) Middlewares {

	return func(next http.Handler) http.Handler {

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			role := r.Context().Value("role")
			fmt.Println(role)

			if role == nil {
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}

			userRole := role.(string)

			for _, allowedRole := range roles {

				if userRole == allowedRole {
					next.ServeHTTP(w, r)
					return
				}
			}

			http.Error(w, "Access Denied", http.StatusForbidden)

		})
	}
}
