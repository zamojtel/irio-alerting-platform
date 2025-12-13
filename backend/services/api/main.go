package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"alerting-platform/api/controllers"
	"alerting-platform/api/middleware"
	"alerting-platform/common/config"

	jwt "github.com/appleboy/gin-jwt/v3"
)

func main() {
	if config.GetConfig().Env == config.PROD {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	router.Use(middleware.GetSecurityMiddleware())
	router.Use(middleware.GetCORSMiddleware())

	authMiddleware, err := jwt.New(middleware.GetJWTMiddleware())
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}

	controllers.RegisterRoutes(router, authMiddleware)

	port := config.GetConfig().Port
	if err = http.ListenAndServe(":"+strconv.Itoa(port), router); err != nil {
		log.Fatal(err)
	}
}
