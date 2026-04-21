package electricity

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /electricity",
		manager.With(
			http.HandlerFunc(h.CreateElectricityUnit),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /electricity/{id}",
		manager.With(
			http.HandlerFunc(h.GetPreviousUnitHistory),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /electricity",
		manager.With(
			http.HandlerFunc(h.GetAllUnitHistory),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}
