package db

import (
	"alerting-platform/common/config"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func GetRawDBConnection() *sql.DB {
	connectionString := GetConnectionString()
	db, err := sql.Open("pgx", connectionString)

	if err != nil {
		log.Fatal("Failed to connect to DB: ", err)
	}

	return db
}

func GetConnectionString() string {
	config := config.GetConfig()

	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		config.PostgresHost,
		config.PostgresUser,
		config.PostgresPassword,
		config.PostgresDB,
		config.PostgresPort,
	)
}
