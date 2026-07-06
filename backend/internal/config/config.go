package config

import "github.com/spf13/viper"

type Config struct {
	ServerPort string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	JWTSecret string

	AIProvider string

	GroqAPIKey  string
	GroqBaseURL string
	GroqModel   string
}

func LoadConfig() *Config {
	viper.SetConfigFile(".env")

	_ = viper.ReadInConfig()

	viper.AutomaticEnv()

	return &Config{
		ServerPort: viper.GetString("SERVER_PORT"),

		DBHost:     viper.GetString("DB_HOST"),
		DBPort:     viper.GetString("DB_PORT"),
		DBUser:     viper.GetString("DB_USER"),
		DBPassword: viper.GetString("DB_PASSWORD"),
		DBName:     viper.GetString("DB_NAME"),
		DBSSLMode:  viper.GetString("DB_SSLMODE"),

		JWTSecret: viper.GetString("JWT_SECRET"),

		AIProvider: viper.GetString("AI_PROVIDER"),

		GroqAPIKey:  viper.GetString("GROQ_API_KEY"),
		GroqBaseURL: viper.GetString("GROQ_BASE_URL"),
		GroqModel:   viper.GetString("GROQ_MODEL"),
	}
}
