package db

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null"`
	PasswordHash string `gorm:"not null"`
}

type MonitoredService struct {
	gorm.Model
	UserID              uint   `gorm:"not null;index"`
	User                User   `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE;"`
	Name                string `gorm:"not null;unique"`
	URL                 string `gorm:"not null"`
	Port                int    `gorm:"not null"`
	HealthCheckInterval int    `gorm:"not null"` // in seconds
	AlertWindow         int    `gorm:"not null"` // in seconds
	AllowedResponseTime int    `gorm:"not null"` // in minutes
	FirstOncallerEmail  string `gorm:"not null"`
	SecondOncallerEmail *string
	// FirstOncallerID     uint   `gorm:"not null"`
	// FirstOncaller       User   `gorm:"foreignKey:FirstOncallerID;references:ID"`
	// SecondOncallerID    *uint  `gorm:"index"`
	// SecondOncaller      *User  `gorm:"foreignKey:SecondOncallerID;references:ID"`
}
