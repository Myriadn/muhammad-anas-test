package model

import "time"

type Entity struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`   // veehicle, iot, facility
	Status      string    `json:"status"` // active, inactive, maintenance
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
