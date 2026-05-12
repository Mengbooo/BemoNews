package collection

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type hackerNewsResponse struct {
	Hits []struct {
		Title       string `json:"title"`
		URL         string `json:"url"`
		Author      string `json:"author"`
		CreatedAt   string `json:"created_at"`
		StoryText   string `json:"story_text"`
		CommentText string `json:"comment_text"`
	} `json:"hits"`
}

type HackerNewsParser struct{}

func NewHackerNewsParser() *HackerNewsParser {
	return &HackerNewsParser{}
}

func (p *HackerNewsParser) Parse(source model.SourceConfig, payload json.RawMessage) ([]model.CollectedItem, error) {
	var response hackerNewsResponse
	if err := json.Unmarshal(payload, &response); err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	result := make([]model.CollectedItem, 0, len(response.Hits))
	for index, hit := range response.Hits {
		publishedAt, _ := time.Parse(time.RFC3339, hit.CreatedAt)
		if publishedAt.IsZero() {
			publishedAt = now
		}
		result = append(result, model.CollectedItem{
			ID:           fmt.Sprintf("%s-hn-%d", source.ID, index),
			SourceID:     source.ID,
			Title:        hit.Title,
			CanonicalURL: hit.URL,
			Summary:      firstNonEmpty(hit.StoryText, hit.CommentText),
			Author:       hit.Author,
			PublishedAt:  publishedAt,
			FetchedAt:    now,
			Category:     source.Category,
			Status:       model.ItemReady,
		})
	}

	return result, nil
}
