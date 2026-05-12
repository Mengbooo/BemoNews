package collection

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type githubSearchResponse struct {
	Items []struct {
		Name        string `json:"name"`
		HTMLURL     string `json:"html_url"`
		Description string `json:"description"`
		Language    string `json:"language"`
		UpdatedAt   string `json:"updated_at"`
	} `json:"items"`
}

type GitHubParser struct{}

func NewGitHubParser() *GitHubParser {
	return &GitHubParser{}
}

func (p *GitHubParser) Parse(source model.SourceConfig, payload json.RawMessage) ([]model.CollectedItem, error) {
	var response githubSearchResponse
	if err := json.Unmarshal(payload, &response); err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	result := make([]model.CollectedItem, 0, len(response.Items))
	for index, item := range response.Items {
		publishedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
		if publishedAt.IsZero() {
			publishedAt = now
		}
		result = append(result, model.CollectedItem{
			ID:           fmt.Sprintf("%s-gh-%d", source.ID, index),
			SourceID:     source.ID,
			Title:        item.Name,
			CanonicalURL: item.HTMLURL,
			Summary:      firstNonEmpty(item.Description, item.Language),
			PublishedAt:  publishedAt,
			FetchedAt:    now,
			Category:     source.Category,
			Status:       model.ItemReady,
		})
	}

	return result, nil
}
