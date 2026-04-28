package cmd

import (
	"fmt"
	"os"
	"propnest/config"
	"propnest/infra/db"
	"propnest/repo"
	"propnest/rest"
	"propnest/rest/handlers/electricity"
	maintenancerequests "propnest/rest/handlers/maintenance_requests"
	property "propnest/rest/handlers/property"
	rentinvoice "propnest/rest/handlers/rent_invoice"
	"propnest/rest/handlers/renter"
	units "propnest/rest/handlers/units"
	"propnest/rest/handlers/user"
	"propnest/rest/middlewares"
	"time"
)

func Serve() {
	cnf := config.GetConfig()
	dbCon, err := db.NewConnection(cnf.NeonDBconnStr)
	// dbCon, err := db.NewConnectionOffline(cnf.DB)
	
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	dbCon.SetMaxOpenConns(10)
	dbCon.SetMaxIdleConns(5)
	dbCon.SetConnMaxLifetime(time.Minute * 5)

	err = db.MigrateDB(dbCon, "./migrations")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	middlewares := middlewares.NewMiddleware(cnf)

	userRepo := repo.NewUserRepo(dbCon)
	propertyRepo := repo.NewPropertyInfoRepo(dbCon)
	unitRepo := repo.NewUnitRepo(dbCon)
	renterRepo := repo.NewRenterRepo(dbCon)
	billsRepo := repo.NewBillsRepo(dbCon)
	electricityRepo := repo.NewElectricityRepo(dbCon)
	maintenanceRequestsRepo := repo.NewMaintenanceRequestsRepo(dbCon)

	userHandler := user.NewHandler(cnf, userRepo, middlewares)
	propertyHandler := property.NewHandler(middlewares, propertyRepo)
	unitHandler := units.NewHandler(middlewares, unitRepo);
	renterHandler := renter.NewHandler(middlewares, renterRepo)
	rentInvoiceHandler := rentinvoice.NewHandler(middlewares, billsRepo)
	electricityHandler := electricity.NewHandler(middlewares, electricityRepo)
	maintenanceRequestsHandler := maintenancerequests.NewHandler(middlewares, maintenanceRequestsRepo)
	
	server := rest.NewServer(
		cnf,
		userHandler,
		propertyHandler,
		unitHandler,
		renterHandler,
		rentInvoiceHandler,
		electricityHandler,
		maintenanceRequestsHandler,
	)
	server.Start()
}
