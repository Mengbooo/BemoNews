package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Env            string
	ServerAddr     string
	DataDir        string
	WebOrigin      string
	CronEnabled    bool
	CronDeliver    bool
	CronSchedule   string
	AIProvider     string
	AIModel        string
	AIAPIKey       string
	SMTPHost       string
	SMTPPort       int
	SMTPUsername   string
	SMTPPassword   string
	SMTPFrom       string
	MailRecipients []string
}

func Load() Config {
	return Config{
		Env:            envOr("BEMONEWS_ENV", "development"),
		ServerAddr:     envOr("BEMONEWS_SERVER_ADDR", ":8080"),
		DataDir:        envOr("BEMONEWS_DATA_DIR", "../data"),
		WebOrigin:      envOr("BEMONEWS_WEB_ORIGIN", "http://localhost:5173"),
		CronEnabled:    boolEnvOr("BEMONEWS_CRON_ENABLED", true),
		CronDeliver:    boolEnvOr("BEMONEWS_CRON_DELIVER", false),
		CronSchedule:   envOr("BEMONEWS_CRON_SCHEDULE", "0 14 * * *"),
		AIProvider:     envOr("BEMONEWS_AI_PROVIDER", "openai"),
		AIModel:        envOr("BEMONEWS_AI_MODEL", "gpt-4.1-mini"),
		AIAPIKey:       strings.TrimSpace(os.Getenv("BEMONEWS_AI_API_KEY")),
		SMTPHost:       envOr("BEMONEWS_SMTP_HOST", ""),
		SMTPPort:       intEnvOr("BEMONEWS_SMTP_PORT", 587),
		SMTPUsername:   envOr("BEMONEWS_SMTP_USERNAME", ""),
		SMTPPassword:   envOr("BEMONEWS_SMTP_PASSWORD", ""),
		SMTPFrom:       envOr("BEMONEWS_SMTP_FROM", ""),
		MailRecipients: csvEnv("BEMONEWS_MAIL_RECIPIENTS"),
	}
}

func envOr(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && strings.TrimSpace(value) != "" {
		return value
	}
	return fallback
}

func boolEnvOr(key string, fallback bool) bool {
	value, ok := os.LookupEnv(key)
	if !ok || strings.TrimSpace(value) == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func intEnvOr(key string, fallback int) int {
	value, ok := os.LookupEnv(key)
	if !ok || strings.TrimSpace(value) == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func csvEnv(key string) []string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return nil
	}

	parts := strings.Split(value, ",")
	items := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			items = append(items, trimmed)
		}
	}
	return items
}
