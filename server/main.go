package main

import (
	"database/sql"
	"log"
	"test-muhammad-anas/cmd"
	"test-muhammad-anas/internal/config"
	"test-muhammad-anas/internal/data"
	"test-muhammad-anas/internal/wire"

	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env vars")
	}

	cfg := config.Load()

	// Setup Database
	db, err := sql.Open("sqlite", cfg.DBPath)
	if err != nil {
		log.Fatalf("DB Error: %v", err)
	}
	defer db.Close()

	// Urusan Data: Migrate Tabel & Seed Awal
	if err := data.Migrate(db); err != nil {
		log.Fatalf("Migration Error: %v", err)
	}
	if err := data.SeedDB(db); err != nil {
		log.Fatalf("Seed Error: %v", err)
	}

	// Rakit Router (Handler, Usecase, Repo) lewat Wire
	r := wire.InitEntityHandler(db)

	// Serahkan Router ke cmd/server.go untuk dinyalakan
	cmd.StartServer(r, cfg.Port)
}
