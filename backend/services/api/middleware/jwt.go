package middleware

import (
	"alerting-platform/api/dto"
	"alerting-platform/api/models"
	"alerting-platform/common/config"
	"time"

	jwt "github.com/appleboy/gin-jwt/v3"
	"github.com/gin-gonic/gin"
	jwt_go "github.com/golang-jwt/jwt/v5"
)

const identityKey = "identity"

func GetJWTMiddleware() *jwt.GinJWTMiddleware {
	authMiddleware, _ := jwt.New(&jwt.GinJWTMiddleware{
		IdentityKey:     identityKey,
		Key:             []byte(config.GetConfig().Secret),
		Timeout:         time.Minute * 15,
		MaxRefresh:      time.Hour * 24,
		Authenticator:   authenticator(),
		IdentityHandler: identityHandler(),
		PayloadFunc:     payloadFunc(),
	})

	return authMiddleware
}

func authenticator() func(c *gin.Context) (any, error) {
	return func(c *gin.Context) (any, error) {
		var loginVals dto.LoginInput
		if err := c.ShouldBind(&loginVals); err != nil {
			return "", jwt.ErrMissingLoginValues
		}

		email := loginVals.Email
		password := loginVals.Password

		// TODO: tu trzeba pobrać użytkownika z bazy danych. Czy to trzeba będzie cachować?
		if (email == "admin@g.com" && password == "password") || (email == "test@g.com" && password == "password") {
			return &models.User{
				Email: email,
			}, nil
		}

		return nil, jwt.ErrFailedAuthentication
	}
}

func identityHandler() func(c *gin.Context) any {
	return func(c *gin.Context) any {
		claims := jwt.ExtractClaims(c)
		return &models.User{
			Email: claims[identityKey].(string),
		}
	}
}

func payloadFunc() func(data any) jwt_go.MapClaims {
	return func(data any) jwt_go.MapClaims {
		if v, ok := data.(*models.User); ok {
			return jwt_go.MapClaims{
				"email": v.Email,
			}
		}
		return jwt_go.MapClaims{}
	}
}
