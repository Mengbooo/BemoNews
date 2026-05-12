package collection

import (
	"fmt"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type GenericRSSParser struct{}

func NewGenericRSSParser() *GenericRSSParser {
	return &GenericRSSParser{}
}

func (p *GenericRSSParser) Parse(source model.SourceConfig, items []RSSItem) []model.CollectedItem {
	now := time.Now().UTC()
	result := make([]model.CollectedItem, 0, len(items))
	for index, item := range items {
		result = append(result, model.CollectedItem{
			ID:           fmt.Sprintf("%s-rss-%d", source.ID, index),
			SourceID:     source.ID,
			Title:        item.Title,
			CanonicalURL: item.Link,
			Summary:      item.Summary,
			Author:       item.Author,
			PublishedAt:  now,
			FetchedAt:    now,
			Category:     source.Category,
			Status:       model.ItemReady,
		})
	}
	return result
}
