package processing

import (
	"context"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type TopicRanker struct{}

func NewTopicRanker() *TopicRanker {
	return &TopicRanker{}
}

func (r *TopicRanker) Score(_ context.Context, topics []model.ProcessedTopic) []model.ProcessedTopic {
	result := make([]model.ProcessedTopic, 0, len(topics))
	for index, topic := range topics {
		if index == 0 {
			topic.Importance = model.ImportanceHigh
		}
		result = append(result, topic)
	}
	return result
}
