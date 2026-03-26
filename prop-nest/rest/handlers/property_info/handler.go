package propertyinfo

import "propnest/rest/middlewares"

type Handler struct {
	middlewares *middlewares.Middleware
}

func NewHandler() *Handler {
	return &Handler{}
}
