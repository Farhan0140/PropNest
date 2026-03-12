package rest

import (
	"fmt"
	"net/http"
	"os"
	"propnest/config"
	"propnest/rest/handlers/user"
	"propnest/rest/middlewares"
	"strconv"
)

type Server struct {
	cnf         *config.Config
	userHandler *user.Handler
}

func NewServer(
	cnf *config.Config,
	userHandler *user.Handler,
) *Server {
	return &Server{
		cnf: cnf,
		userHandler: userHandler,
	}
}

func (server *Server) Start() {
	manager := middlewares.NewManager()
	manager.Use(
		middlewares.Preflight,
		middlewares.Cors,
		middlewares.Logger,
	)

	mux := http.NewServeMux()
	wrappedMux := manager.WrapMux(mux)

	server.userHandler.RegisterRoutes(mux, manager)

	addr := ":" + strconv.Itoa(server.cnf.HttpPort)
	fmt.Println("Server is Running on port ", addr)
	err := http.ListenAndServe(addr, wrappedMux)
	if err != nil {
		fmt.Println("Error Occurred while starting the server: ", err)
		os.Exit(1)
	}
}
