package collection

import "github.com/Mengbooo/BemoNews/server/internal/model"

type Dedupe struct{}

func NewDedupe() *Dedupe {
	return &Dedupe{}
}

func (d *Dedupe) Dedupe(items []model.CollectedItem) []model.CollectedItem {
	seen := make(map[string]struct{}, len(items))
	result := make([]model.CollectedItem, 0, len(items))
	for _, item := range items {
		if item.CanonicalURL == "" {
			result = append(result, item)
			continue
		}
		if _, exists := seen[item.CanonicalURL]; exists {
			item.Status = model.ItemDuplicate
			item.InvalidReason = "duplicate canonical url"
		} else {
			seen[item.CanonicalURL] = struct{}{}
		}
		result = append(result, item)
	}
	return result
}
