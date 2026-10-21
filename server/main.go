package main

import (
	"net/http"
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

	r := gin.Default()

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "fine:)",
		})
	})

	r.GET("/api/entities", func(c *gin.Context) {
		list, err := st.List()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": list})
	})

	r.Run(":9002")
}
