package propertyunit

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"GET /units",
		manager.With(
			http.HandlerFunc(h.GetUnits),
			// h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}
