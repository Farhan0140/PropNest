package rest

import (
	"fmt"
	"net/http"
	"os"
	"propnest/config"
	propertyinfo "propnest/rest/handlers/property_info"
	propertyunit "propnest/rest/handlers/property_unit"
	"propnest/rest/handlers/user"
	"propnest/rest/middlewares"
	"strconv"
)

type Server struct {
	cnf                 *config.Config
	userHandler         *user.Handler
	propertyinfoHandler *propertyinfo.Handler
	unitHandler         *propertyunit.Handler
}

func NewServer(
	cnf *config.Config,
	userHandler *user.Handler,
	propertyinfoHandler *propertyinfo.Handler,
	unitHandler *propertyunit.Handler,
) *Server {
	return &Server{
		cnf:                 cnf,
		userHandler:         userHandler,
		propertyinfoHandler: propertyinfoHandler,
		unitHandler:         unitHandler,
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
	server.propertyinfoHandler.RegisterRoutes(mux, manager)
	server.unitHandler.RegisterRoutes(mux, manager)

	addr := ":" + strconv.Itoa(server.cnf.HttpPort)
	fmt.Println("Server is Running on port ", addr)
	err := http.ListenAndServe(addr, wrappedMux)
	if err != nil {
		fmt.Println("Error Occurred while starting the server: ", err)
		os.Exit(1)
	}
}
