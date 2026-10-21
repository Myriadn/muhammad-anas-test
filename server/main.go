package main

import (
	"net/http"
	"test-muhammad-anas/internal/handler"
	"test-muhammad-anas/internal/store"

	"github.com/gin-gonic/gin"
)

func main() {
	st, err := store.New("./data/app.db")
	if err != nil {
		panic(err)
	}
	if err := st.SeedData(); err != nil {
		panic(err)
	}

	h := handler.New(st)

	r := gin.Default()

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "fine:)",
		})
	})

	api := r.Group("/api")
	{
		api.GET("/entities", h.List)
		api.GET("/entities/:id", h.Get)
		api.POST("/entities", h.Create)
		api.PUT("/entities/:id", h.Update)
		api.DELETE("/entities/:id", h.Delete)
	}

	r.Run(":9002")
}
