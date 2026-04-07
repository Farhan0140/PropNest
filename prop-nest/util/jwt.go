package util

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type CustomClaims struct {
	ID        int    `json:"id"`
	Full_Name string `json:"full_name"`
	Email_OR_Nid     string `json:"email_or_nid"`
	Role      string `json:"role"`
	jwt.RegisteredClaims
}

func CreateJWT(secret string, data CustomClaims) (string, error) {
	data.RegisteredClaims = jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(72 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, data)

	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func VerifyJWT(secret, tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}
