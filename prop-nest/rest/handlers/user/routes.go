package user

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /users",
		manager.With(
			http.HandlerFunc(h.CreateUser),
		),
	)

	mux.Handle(
		"POST /users/login",
		manager.With(
			http.HandlerFunc(h.Login),
		),
	)

	mux.Handle(
		"GET /users/me",
		manager.With(
			http.HandlerFunc(h.GetUserByJWT),
			h.middlewares.AuthenticateJWT,
		),
	)
}