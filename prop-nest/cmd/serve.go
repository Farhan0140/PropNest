package cmd

import (
	"fmt"
	"os"
	"propnest/config"
	"propnest/infra/db"
	"propnest/repo"
	"propnest/rest"
	property "propnest/rest/handlers/property"
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

	userHandler := user.NewHandler(cnf, userRepo, middlewares)
	propertyHandler := property.NewHandler(middlewares, propertyRepo)
	unitHandler := units.NewHandler(middlewares, unitRepo);
	
	server := rest.NewServer(
		cnf,
		userHandler,
		propertyHandler,
		unitHandler,
	)
	server.Start()
}
