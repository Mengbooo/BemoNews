package processing

import (
	"context"
	"strings"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type NoiseFilter struct{}

func NewNoiseFilter() *NoiseFilter {
	return &NoiseFilter{}
}

func (f *NoiseFilter) Filter(_ context.Context, items []model.CollectedItem) []model.CollectedItem {
	result := make([]model.CollectedItem, 0, len(items))
	for _, item := range items {
		title := strings.ToLower(item.Title)
		if strings.Contains(title, "sponsored") || strings.Contains(title, "promotion") {
			item.Status = model.ItemInvalid
			item.InvalidReason = "soft-filtered as promotional"
		}
		result = append(result, item)
	}
	return result
}
