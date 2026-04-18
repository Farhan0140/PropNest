package cmd

import (
	"fmt"
	"os"
	"propnest/config"
	"propnest/infra/db"
	"propnest/repo"
	"propnest/rest"
	"propnest/rest/handlers/bills"
	"propnest/rest/handlers/electricity"
	property "propnest/rest/handlers/property"
	"propnest/rest/handlers/renter"
	units "propnest/rest/handlers/units"
	"propnest/rest/handlers/user"
	"propnest/rest/middlewares"
)

func Serve() {
	cnf := config.GetConfig()
	dbCon, err := db.NewConnection(cnf.DB)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

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

	userHandler := user.NewHandler(cnf, userRepo, middlewares)
	propertyHandler := property.NewHandler(middlewares, propertyRepo)
	unitHandler := units.NewHandler(middlewares, unitRepo);
	renterHandler := renter.NewHandler(middlewares, renterRepo)
	billsHandler := bills.NewHandler(middlewares, billsRepo)
	electricityHandler := electricity.NewHandler(middlewares, electricityRepo)
	
	server := rest.NewServer(
		cnf,
		userHandler,
		propertyHandler,
		unitHandler,
		renterHandler,
		billsHandler,
		electricityHandler,
	)
	server.Start()
}
