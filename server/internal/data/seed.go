package data

import (
	"database/sql"
	"test-muhammad-anas/internal/data/model"

	"time"
)

func SeedDB(db *sql.DB) error {
	var count int
	if err := db.QueryRow(`SELECT COUNT(*) FROM entities`).Scan(&count); err != nil {
		return err
	}

	// Kalau data kosong, baru kita insert
	if count == 0 {
		now := time.Now().UTC()
		seeds := []model.Entity{
			{Name: "Truk Logistik 01", Type: "vehicle", Status: "active", Latitude: -6.2000, Longitude: 106.8166, Description: "Truk pengiriman Jakarta", CreatedAt: now, UpdatedAt: now},
			{Name: "Sensor Suhu Gudang A", Type: "iot", Status: "active", Latitude: -6.9175, Longitude: 107.6191, Description: "IoT sensor Bandung", CreatedAt: now, UpdatedAt: now},
			{Name: "Fasilitas Gudang Surabaya", Type: "facility", Status: "maintenance", Latitude: -7.2575, Longitude: 112.7521, Description: "Gudang utama regional timur", CreatedAt: now, UpdatedAt: now},
			{Name: "Drone Patroli 02", Type: "vehicle", Status: "inactive", Latitude: -8.6500, Longitude: 115.2167, Description: "Drone monitoring Bali", CreatedAt: now, UpdatedAt: now},
			{Name: "Sensor Kualitas Udara", Type: "iot", Status: "active", Latitude: -6.9667, Longitude: 110.4167, Description: "AQM node Semarang", CreatedAt: now, UpdatedAt: now},
		}

		for _, e := range seeds {
			_, err := db.Exec(`INSERT INTO entities (name, type, status, latitude, longitude, description, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)`,
				e.Name, e.Type, e.Status, e.Latitude, e.Longitude, e.Description, e.CreatedAt, e.UpdatedAt)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
