package user

import (
	"propnest/config"
	"propnest/repo"
	"propnest/rest/middlewares"
)

type Handler struct {
	cnf      *config.Config
	userRepo repo.UserRepo
	middlewares *middlewares.Middleware
}

func NewHandler(
	cnf *config.Config,
	userRepo repo.UserRepo,
	middlewares *middlewares.Middleware,
) *Handler {
	return &Handler{
		cnf:      cnf,
		userRepo: userRepo,
		middlewares: middlewares,
	}
}
