package cmd

import (
	"fmt"
	"os"
	"propnest/config"
	"propnest/infra/db"
	"propnest/repo"
	"propnest/rest"
	propertyinfo "propnest/rest/handlers/property_info"
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
	propertyInfoRepo := repo.NewPropertyInfoRepo(dbCon)

	userHandler := user.NewHandler(cnf, userRepo, middlewares)
	propertyinfoHandler := propertyinfo.NewHandler(middlewares, propertyInfoRepo)
	
	server := rest.NewServer(
		cnf,
		userHandler,
		propertyinfoHandler,
	)
	server.Start()
}
