package processing

import (
	"context"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type TopicCluster struct{}

func NewTopicCluster() *TopicCluster {
	return &TopicCluster{}
}

func (c *TopicCluster) Cluster(_ context.Context, items []model.CollectedItem) []model.ProcessedTopic {
	return buildTopics(items)
}
