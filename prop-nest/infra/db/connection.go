package db

import (
	"fmt"
	"propnest/config"

	"github.com/jmoiron/sqlx"
)

func getConnectionString(cnf *config.DBConfig) string {
	connStr := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s", 
		cnf.User,
		cnf.Password,
		cnf.Host,
		cnf.Port,
		cnf.DBName,
	)

	if !cnf.EnableSSLMode {
		connStr += " sslmode=disable"
	}

	return connStr
}

func NewConnection(cnf *config.DBConfig) (*sqlx.DB, error) {
	dbSource := getConnectionString(cnf)

	dbCon, err := sqlx.Connect("postgres", dbSource)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return dbCon, nil
}
