package collection

import (
	"net/url"
	"strings"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type Normalizer struct{}

func NewNormalizer() *Normalizer {
	return &Normalizer{}
}

func (n *Normalizer) Normalize(items []model.CollectedItem) []model.CollectedItem {
	result := make([]model.CollectedItem, 0, len(items))
	for _, item := range items {
		item.Title = strings.TrimSpace(item.Title)
		item.Summary = strings.TrimSpace(item.Summary)
		item.CanonicalURL = normalizeURL(item.CanonicalURL)
		item.DedupeKey = item.CanonicalURL
		result = append(result, item)
	}
	return result
}

func normalizeURL(raw string) string {
	parsed, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return strings.TrimSpace(raw)
	}
	parsed.Fragment = ""
	return parsed.String()
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		trimmed := strings.TrimSpace(value)
		if trimmed != "" {
			return trimmed
		}
	}
	return ""
}
