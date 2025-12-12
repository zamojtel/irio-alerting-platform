package main

import (
	"alerting-platform/common/db"
	"context"

	"github.com/gin-gonic/gin"
)

func main() {
	db := db.GetRawDBConnection()
	defer db.Close()

	var count int

	row := db.QueryRowContext(context.Background(), "SELECT COUNT(*) FROM services WHERE deleted_at IS NULL")
	err := row.Scan(&count)

	if err != nil {
		panic(err)
	}

	println("Active services count:", count)

	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": db.Stats().InUse,
		})
	})
	router.Run() // listens on 0.0.0.0:8080 by default
}
