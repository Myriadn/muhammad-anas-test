package data

import "database/sql"

func Migrate(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS entities (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL, type TEXT NOT NULL, status TEXT NOT NULL,
		latitude REAL NOT NULL, longitude REAL NOT NULL, description TEXT NOT NULL DEFAULT '',
		created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL
	);`
	_, err := db.Exec(schema)
	return err
}
