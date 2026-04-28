package maintenancerequests

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /maintenance-requests",
		manager.With(
			http.HandlerFunc(h.CreateMaintenance),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /maintenance-requests",
		manager.With(
			http.HandlerFunc(h.GetAll),
			h.middlewares.AuthenticateJWT,
		),
	)
}