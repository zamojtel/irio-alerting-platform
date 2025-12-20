package controllers

import (
	"alerting-platform/api/db"
	"alerting-platform/api/dto"
	"alerting-platform/api/utils"

	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {
	var registerInput dto.RegisterRequest

	if err := c.ShouldBind(&registerInput); err != nil {
		c.JSON(400, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	passwordHash, err := utils.HashPassword(registerInput.Password)
	if err != nil {
		c.JSON(500, gin.H{"message": "Failed to hash password", "error": err.Error()})
		return
	}

	user := db.User{
		Email:        registerInput.Email,
		PasswordHash: passwordHash,
	}

	conn := db.GetDBConnection()
	result := conn.Create(&user)
	if result.Error != nil {
		c.JSON(500, gin.H{"message": "Failed to create user", "error": result.Error.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "User registered successfully"})
}
