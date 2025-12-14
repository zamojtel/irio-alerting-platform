package db

import (
	"log"
	"sync"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	db_utils "alerting-platform/common/db"
)

var (
	dbConn *gorm.DB
	once   sync.Once
)

func GetDBConnection() *gorm.DB {
	once.Do(func() {
		connectionString := db_utils.GetConnectionString()
		conn, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to DB: ", err)
		}

		dbConn = conn
	})
	return dbConn
}
