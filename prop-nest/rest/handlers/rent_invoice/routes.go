package rentinvoice

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /rent-invoices",
		manager.With(
			http.HandlerFunc(h.CreateRentInvoice),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /rent-invoices",
		manager.With(
			http.HandlerFunc(h.ListRentInvoices),
			h.middlewares.RequireRole("admin"),
			h.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /rent-invoice",
		manager.With(
			http.HandlerFunc(h.GetInvoiceByRenterID),
			h.middlewares.AuthenticateJWT,
		),
	)
}