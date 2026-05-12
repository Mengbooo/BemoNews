package collection

import (
	"strings"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type Validator struct{}

func NewValidator() *Validator {
	return &Validator{}
}

func (v *Validator) Validate(items []model.CollectedItem, timeWindowHours int) []model.CollectedItem {
	now := time.Now().UTC()
	threshold := now.Add(-time.Duration(timeWindowHours) * time.Hour)
	result := make([]model.CollectedItem, 0, len(items))
	for _, item := range items {
		if strings.TrimSpace(item.Title) == "" || strings.TrimSpace(item.CanonicalURL) == "" {
			item.Status = model.ItemInvalid
			item.InvalidReason = "missing required fields"
		} else if item.PublishedAt.Before(threshold) {
			item.Status = model.ItemInvalid
			item.InvalidReason = "outside time window"
		} else if item.Status == "" {
			item.Status = model.ItemReady
		}
		result = append(result, item)
	}
	return result
}
