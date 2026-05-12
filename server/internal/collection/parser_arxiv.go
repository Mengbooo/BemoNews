package collection

import (
	"encoding/xml"
	"fmt"
	"strings"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type arxivFeed struct {
	Entries []struct {
		Title     string `xml:"title"`
		Summary   string `xml:"summary"`
		ID        string `xml:"id"`
		Published string `xml:"published"`
		Author    struct {
			Name string `xml:"name"`
		} `xml:"author"`
	} `xml:"entry"`
}

type ArxivParser struct{}

func NewArxivParser() *ArxivParser {
	return &ArxivParser{}
}

func (p *ArxivParser) Parse(source model.SourceConfig, payload []byte) ([]model.CollectedItem, error) {
	var feed arxivFeed
	if err := xml.Unmarshal(payload, &feed); err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	result := make([]model.CollectedItem, 0, len(feed.Entries))
	for index, entry := range feed.Entries {
		publishedAt, _ := time.Parse(time.RFC3339, entry.Published)
		if publishedAt.IsZero() {
			publishedAt = now
		}
		result = append(result, model.CollectedItem{
			ID:           fmt.Sprintf("%s-arxiv-%d", source.ID, index),
			SourceID:     source.ID,
			Title:        strings.TrimSpace(entry.Title),
			CanonicalURL: strings.TrimSpace(entry.ID),
			Summary:      strings.TrimSpace(entry.Summary),
			Author:       strings.TrimSpace(entry.Author.Name),
			PublishedAt:  publishedAt,
			FetchedAt:    now,
			Category:     source.Category,
			Status:       model.ItemReady,
		})
	}

	return result, nil
}
