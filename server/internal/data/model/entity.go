package model

import "time"

type Entity struct {
	ID          int64
	Name        string
	Type        string // veehicle, iot, facility
	Status      string // active, inactive, maintenance
	Latitude    float64
	Longitude   float64
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
