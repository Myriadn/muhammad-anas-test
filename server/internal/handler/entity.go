package handler

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"test-muhammad-anas/internal/model"
	"test-muhammad-anas/internal/store"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Store *store.Store
}

func New(s *store.Store) *Handler {
	return &Handler{Store: s}
}

// DTO: field yang dikirim client. Tidak semua field Entity boleh di-set client (id, timestamps).
type EntityInput struct {
	Name        string   `json:"name"        binding:"required,min=3,max=100"`
	Type        string   `json:"type"        binding:"required,oneof=vehicle iot facility"`
	Status      string   `json:"status"      binding:"required,oneof=active inactive maintenance"`
	Latitude    *float64 `json:"latitude"    binding:"required,gte=-90,lte=90"`
	Longitude   *float64 `json:"longitude"   binding:"required,gte=-180,lte=180"`
	Description string   `json:"description" binding:"max=500"`
}

func (h *Handler) List(c *gin.Context) {
	list, err := h.Store.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

func (h *Handler) Get(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}
	e, err := h.Store.GetByID(id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "entity not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": e})
}

func (h *Handler) Create(c *gin.Context) {
	var in EntityInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	e := &model.Entity{
		Name:        in.Name,
		Type:        in.Type,
		Status:      in.Status,
		Latitude:    *in.Latitude,
		Longitude:   *in.Longitude,
		Description: in.Description,
	}
	if err := h.Store.Create(e); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": e})
}

func (h *Handler) Update(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}
	var in EntityInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	e := &model.Entity{
		ID:          id,
		Name:        in.Name,
		Type:        in.Type,
		Status:      in.Status,
		Latitude:    *in.Latitude,
		Longitude:   *in.Longitude,
		Description: in.Description,
	}
	if err := h.Store.Update(e); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "entity not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Re-fetch untuk balikin created_at yang asli
	updated, err := h.Store.GetByID(id)
	if err == nil {
		e = updated
	}
	c.JSON(http.StatusOK, gin.H{"data": e})
}

func (h *Handler) Delete(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}
	if err := h.Store.Delete(id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "entity not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func parseID(c *gin.Context) (int64, bool) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return 0, false
	}
	return id, true
}
