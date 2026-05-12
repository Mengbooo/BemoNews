package collection

import (
	"context"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type RSSItem struct {
	Title       string
	Link        string
	Summary     string
	Author      string
	PublishedAt string
}

type RSSConnector struct{}

func NewRSSConnector() *RSSConnector {
	return &RSSConnector{}
}

func (c *RSSConnector) Fetch(_ context.Context, _ model.SourceConfig) ([]RSSItem, error) {
	return []RSSItem{}, nil
}
