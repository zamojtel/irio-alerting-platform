package controllers

import (
	"alerting-platform/api/db"
	"alerting-platform/api/dto"
	"alerting-platform/api/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateMonitoredService(c *gin.Context) {
	var serviceInput dto.CreateMonitoredServiceRequest

	if err := c.ShouldBind(&serviceInput); err != nil {
		c.JSON(400, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	userIdentity, exists := c.Get(middleware.IdentityKey)
	if !exists {
		c.JSON(500, gin.H{"message": "Failed to get user from context"})
		return
	}

	jwtUser := userIdentity.(*middleware.JWTUser)

	ctx := c.Request.Context()
	conn := db.GetDBConnection()

	_, err := gorm.G[db.MonitoredService](conn).Where("name = ?", serviceInput.Name).First(ctx)
	if err == nil {
		c.JSON(400, gin.H{"message": "Service name already taken"})
		return
	}

	service := db.MonitoredService{
		UserID:              jwtUser.ID,
		Name:                serviceInput.Name,
		URL:                 serviceInput.URL,
		Port:                serviceInput.Port,
		HealthCheckInterval: serviceInput.HealthCheckInterval,
		AlertWindow:         serviceInput.AlertWindow,
		AllowedResponseTime: serviceInput.AllowedResponseTime,
		FirstOncallerEmail:  serviceInput.FirstOncallerEmail,
		SecondOncallerEmail: serviceInput.SecondOncallerEmail,
	}

	err = gorm.G[db.MonitoredService](conn).Create(ctx, &service)
	if err != nil {
		c.JSON(500, gin.H{"message": "Failed to create monitored service", "error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Monitored service created successfully", "service_id": service.ID})
}

func GetMyMonitoredServices(c *gin.Context) {
	userIdentity, exists := c.Get(middleware.IdentityKey)
	if !exists {
		c.JSON(500, gin.H{"message": "Failed to get user from context"})
		return
	}

	jwtUser := userIdentity.(*middleware.JWTUser)

	ctx := c.Request.Context()
	conn := db.GetDBConnection()

	services, err := gorm.G[db.MonitoredService](conn).Where("user_id = ?", jwtUser.ID).Find(ctx)
	if err != nil {
		c.JSON(500, gin.H{"message": "Failed to retrieve monitored services", "error": err.Error()})
		return
	}

	dtos := make([]dto.MonitoredServiceDTO, 0, len(services))

	for _, s := range services {
		dto := dto.MonitoredServiceDTO{
			ID:                  s.ID,
			Name:                s.Name,
			URL:                 s.URL,
			Port:                s.Port,
			HealthCheckInterval: s.HealthCheckInterval,
			AlertWindow:         s.AlertWindow,
			AllowedResponseTime: s.AllowedResponseTime,
			FirstOncallerEmail:  s.FirstOncallerEmail,
			SecondOncallerEmail: s.SecondOncallerEmail,
			Status:              "UP",
		}
		dtos = append(dtos, dto)
	}

	c.JSON(200, dtos)
}
