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
	
	mux.Handle(
		"POST /units",
		manager.With(
			http.HandlerFunc(h.CreateUnit),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"PUT /units",
		manager.With(
			http.HandlerFunc(h.UpdateUnit),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
	
	mux.Handle(
		"DELETE /units/{id}",
		manager.With(
			http.HandlerFunc(h.DeleteUnit),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}
