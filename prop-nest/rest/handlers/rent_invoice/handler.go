package rentinvoice

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares     *middlewares.Middleware
	rentInvoiceRepo repo.RentInvoiceRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	rentInvoiceRepo repo.RentInvoiceRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		rentInvoiceRepo:   rentInvoiceRepo,
	}
}
