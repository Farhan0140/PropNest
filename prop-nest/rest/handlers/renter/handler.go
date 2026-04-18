package renter

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	renterRepo repo.RenterRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	renterRepo repo.RenterRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		renterRepo: renterRepo,
	}
}