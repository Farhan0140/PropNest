package renter

import (
	"net/http"
	"propnest/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	// mux.Handle(
	// 	"POST /renter",
	// 	manager.With(),
	// ),
}
