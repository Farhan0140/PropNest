package cmd

import (
	"propnest/config"
	"propnest/rest/middlewares"
)

func Serve() {
	cnf := config.GetConfig()

	middlewares := middlewares.NewMiddleware(cnf)
}
