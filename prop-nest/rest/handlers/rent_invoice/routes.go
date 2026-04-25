package rentinvoice

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /create-rent-invoice",
		manager.With(
			http.HandlerFunc(h.CreateRentInvoice),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)
}