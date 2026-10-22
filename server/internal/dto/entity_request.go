package dto

type EntityRequest struct {
	Name        string   `json:"name" binding:"required,min=3,max=100"`
	Type        string   `json:"type" binding:"required,oneof=vehicle iot facility"`
	Status      string   `json:"status" binding:"required,oneof=active inactive maintenance"`
	Latitude    *float64 `json:"latitude" binding:"required,gte=-90,lte=90"`
	Longitude   *float64 `json:"longitude" binding:"required,gte=-180,lte=180"`
	Description string   `json:"description" binding:"max=500"`
}
