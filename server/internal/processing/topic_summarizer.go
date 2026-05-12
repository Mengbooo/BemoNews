package processing

import (
	"context"
	"strings"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type TopicSummarizer struct{}

func NewTopicSummarizer() *TopicSummarizer {
	return &TopicSummarizer{}
}

func (s *TopicSummarizer) Summarize(_ context.Context, topics []model.ProcessedTopic) []model.ProcessedTopic {
	result := make([]model.ProcessedTopic, 0, len(topics))
	for _, topic := range topics {
		if strings.TrimSpace(topic.Summary) == "" {
			topic.Summary = "Summary scaffold pending AI summarizer integration."
		}
		result = append(result, topic)
	}
	return result
}
