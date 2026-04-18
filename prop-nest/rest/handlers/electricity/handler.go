package electricity

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	electricityRepo repo.ElectricityRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	electricityRepo repo.ElectricityRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		electricityRepo: electricityRepo,
	}
}
