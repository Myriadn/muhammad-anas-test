package wire

import (
	"database/sql"
	"net/http"
	"test-muhammad-anas/internal/adaptor"
	"test-muhammad-anas/internal/data/repository"
	"test-muhammad-anas/internal/usecase"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitEntityHandler(db *sql.DB) *gin.Engine {
	entityRepo := repository.NewEntityRepository(db)
	entityUsecase := usecase.NewEntityUsecase(entityRepo)
	entityHandler := adaptor.NewEntityHandler(entityUsecase)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:9002", "http://localhost:4173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.GET("/entities", entityHandler.List)
		api.GET("/entities/:id", entityHandler.Get)
		api.POST("/entities", entityHandler.Create)
		api.PUT("/entities/:id", entityHandler.Update)
		api.DELETE("/entities/:id", entityHandler.Delete)
	}

	return r
}
