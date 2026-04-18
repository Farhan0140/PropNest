package bills

import (
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	middlewares *middlewares.Middleware
	billsRepo repo.BillsRepo
}

func NewHandler(
	middlewares *middlewares.Middleware,
	billsRepo repo.BillsRepo,
) *Handler {
	return &Handler{
		middlewares: middlewares,
		billsRepo: billsRepo,
	}
}
