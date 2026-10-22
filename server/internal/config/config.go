package config

import "os"

type Config struct {
	Port   string
	DBPath string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9002"
	}
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./internal/data/app.db"
	}
	return &Config{
		Port:   port,
		DBPath: dbPath,
	}
}
