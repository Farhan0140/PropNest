package propertyinfo

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /properties",
		manager.With(
			http.HandlerFunc(h.CreatePropertyInfo),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /properties",
		manager.With(
			http.HandlerFunc(h.GetPropertyList),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"PUT /properties", 
		manager.With(
			http.HandlerFunc(h.UpdateProperty),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"DELETE /properties",
		manager.With(
			http.HandlerFunc(h.DeleteProperty),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}