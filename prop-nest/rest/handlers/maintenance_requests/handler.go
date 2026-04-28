package maintenancerequests

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	maintenanceRequestsRepo  repo.MaintenanceRequestsRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	maintenanceRequestsRepo repo.MaintenanceRequestsRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		maintenanceRequestsRepo: maintenanceRequestsRepo,
	}
}