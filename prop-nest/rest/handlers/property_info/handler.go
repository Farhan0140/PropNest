package propertyinfo

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	propInfoRepo repo.PropertyInfoRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	propInfoRepo repo.PropertyInfoRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		propInfoRepo: propInfoRepo,
	}
}
