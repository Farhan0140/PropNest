package rest

import (
	"fmt"
	"net/http"
	"os"
	"propnest/config"
	"propnest/rest/handlers/bills"
	"propnest/rest/handlers/electricity"
	property "propnest/rest/handlers/property"
	"propnest/rest/handlers/renter"
	units "propnest/rest/handlers/units"
	"propnest/rest/handlers/user"
	"propnest/rest/middlewares"
	"strconv"
)

type Server struct {
	cnf                *config.Config
	userHandler        *user.Handler
	propertyHandler    *property.Handler
	unitHandler        *units.Handler
	renterHandler      *renter.Handler
	billsHandler       *bills.Handler
	electricityHandler *electricity.Handler
}

func NewServer(
	cnf *config.Config,
	userHandler *user.Handler,
	propertyHandler *property.Handler,
	unitHandler *units.Handler,
	renterHandler *renter.Handler,
	billsHandler *bills.Handler,
	electricityHandler *electricity.Handler,
) *Server {
	return &Server{
		cnf:             cnf,
		userHandler:     userHandler,
		propertyHandler: propertyHandler,
		unitHandler:     unitHandler,
		renterHandler:   renterHandler,
		billsHandler:    billsHandler,
		electricityHandler: electricityHandler,
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
	server.propertyHandler.RegisterRoutes(mux, manager)
	server.unitHandler.RegisterRoutes(mux, manager)
	server.renterHandler.RegisterRoutes(mux, manager)
	server.billsHandler.RegisterRoutes(mux, manager)
	server.electricityHandler.RegisterRoutes(mux, manager)

	// addr := ":" + strconv.Itoa(server.cnf.HttpPort)
	// fmt.Println("Server is Running on port ", addr)
	port := os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(server.cnf.HttpPort) // fallback for local dev
	}

	addr := ":" + port

	fmt.Println("Server is Running on port", addr)
	err := http.ListenAndServe(addr, wrappedMux)
	if err != nil {
		fmt.Println("Error Occurred while starting the server: ", err)
		os.Exit(1)
	}
}
