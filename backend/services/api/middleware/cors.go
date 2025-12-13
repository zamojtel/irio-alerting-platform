package middleware

import (
	"alerting-platform/common/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func GetCORSMiddleware() gin.HandlerFunc {
	corsConfig := cors.DefaultConfig()

	if config.GetConfig().Env == config.DEV {
		corsConfig.AllowAllOrigins = true
		return cors.New(corsConfig)
	}

	corsConfig.AllowOrigins = []string{"https://your-production-domain.com"}

	return cors.New(corsConfig)
}
