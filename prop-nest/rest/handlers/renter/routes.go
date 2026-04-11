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

	mux.Handle(
		"PUT /renter",
		manager.With(
			http.HandlerFunc(h.UpdateRenter),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
	
	mux.Handle(
		"DELETE /renter",
		manager.With(
			http.HandlerFunc(h.DeleteRenter),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}
