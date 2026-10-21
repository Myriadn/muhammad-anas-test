package store

import (
	"database/sql"
	"test-muhammad-anas/internal/model"
	"time"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

func New(dbPath string) (*Store, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}
	if err := migrate(db); err != nil {
		return nil, err
	}
	return &Store{db: db}, nil
}

func migrate(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS entities (
		id          INTEGER PRIMARY KEY AUTOINCREMENT,
		name        TEXT NOT NULL,
		type        TEXT NOT NULL,
		status      TEXT NOT NULL,
		latitude    REAL NOT NULL,
		longitude   REAL NOT NULL,
		description TEXT NOT NULL DEFAULT '',
		created_at  DATETIME NOT NULL,
		updated_at  DATETIME NOT NULL
	);`
	_, err := db.Exec(schema)
	return err
}

func (s *Store) List() ([]model.Entity, error) {
	rows, err := s.db.Query(`SELECT id,name,type,status,latitude,longitude,description,created_at,updated_at FROM entities ORDER BY id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.Entity
	for rows.Next() {
		var e model.Entity
		if err := rows.Scan(&e.ID, &e.Name, &e.Type, &e.Status, &e.Latitude, &e.Longitude, &e.Description, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, e)
	}
	return out, nil
}

func (s *Store) Create(e *model.Entity) error {
	now := time.Now().UTC()
	e.CreatedAt = now
	e.UpdatedAt = now
	res, err := s.db.Exec(`INSERT INTO entities (name,type,status,latitude,longitude,description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`,
		e.Name, e.Type, e.Status, e.Latitude, e.Longitude, e.Description, e.CreatedAt, e.UpdatedAt)
	if err != nil {
		return err
	}
	e.ID, _ = res.LastInsertId()
	return nil
}

func (s *Store) SeedData() error {
	var count int
	if err := s.db.QueryRow(`SELECT COUNT(*) FROM entities`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	seeds := []model.Entity{
		{Name: "Truk Logistik 01", Type: "vehicle", Status: "active", Latitude: -6.2000, Longitude: 106.8166, Description: "Truk pengiriman Jakarta"},
		{Name: "Sensor Suhu Gudang A", Type: "iot", Status: "active", Latitude: -6.9175, Longitude: 107.6191, Description: "IoT sensor Bandung"},
		{Name: "Fasilitas Gudang Surabaya", Type: "facility", Status: "maintenance", Latitude: -7.2575, Longitude: 112.7521, Description: "Gudang utama regional timur"},
		{Name: "Drone Patroli 02", Type: "vehicle", Status: "inactive", Latitude: -8.6500, Longitude: 115.2167, Description: "Drone monitoring Bali"},
		{Name: "Sensor Kualitas Udara", Type: "iot", Status: "active", Latitude: -6.9667, Longitude: 110.4167, Description: "AQM node Semarang"},
	}
	for i := range seeds {
		if err := s.Create(&seeds[i]); err != nil {
			return err
		}
	}
	return nil
}
