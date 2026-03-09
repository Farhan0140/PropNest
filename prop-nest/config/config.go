package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/lpernett/godotenv"
)

type Config struct {
	Version     string
	ServiceName string
	HttpPort    int
	SecretKey   string
}

var configuration *Config

func loadConfig() {
	err := godotenv.Load()	// The Load() function automatically loads the .env file from the root folder
	if err != nil {		// If the Load() function cannot find the .env file, it returns an error
		fmt.Println("Failed to load .env file", err)
		os.Exit(1)
	}

	// Loads all .env variables one by one
	version := os.Getenv("VERSION")
	if version == ""  {
		fmt.Println("Version is Required")
		os.Exit(1)
	}

	serviceName := os.Getenv("SERVICENAME")
	if serviceName == "" {
		fmt.Println("Service Name is Required")
		os.Exit(1)
	}

	httpPortStr := os.Getenv("HTTPPORT")
	if httpPortStr == "" {
		fmt.Println("HTTP Port is Required")
		os.Exit(1)
	}
	httpPort, err := strconv.Atoi(httpPortStr)
	if err != nil {
		fmt.Println("Failed to convert the httpPort String to Int", err)
		os.Exit(1)
	}

	secretKey := os.Getenv("SECRETKEY")
	if secretKey == "" {
		fmt.Println("Secret Key is Required")
		os.Exit(1)
	}

	configuration = &Config{
		Version: version,
		ServiceName: serviceName,
		HttpPort: httpPort,
		SecretKey: secretKey,
	}
}

func GetConfig() *Config {
	if configuration == nil {
		loadConfig()
	}

	return configuration
}