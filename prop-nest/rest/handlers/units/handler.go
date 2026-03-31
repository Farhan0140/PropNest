package propertyunit

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	unitRepo    repo.UnitRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	unitRepo repo.UnitRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		unitRepo:    unitRepo,
	}
}
