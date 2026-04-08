package renter

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /renter",
		manager.With(
			http.HandlerFunc(h.CreateRenter),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /renter",
		manager.With(
			http.HandlerFunc(h.GetRenters),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}
