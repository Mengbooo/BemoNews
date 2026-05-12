package delivery

import (
	"fmt"
	"strings"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type EmailComposer struct{}

func NewEmailComposer() *EmailComposer {
	return &EmailComposer{}
}

func (c *EmailComposer) Compose(brief model.BriefDraft, topics []model.ProcessedTopic) string {
	lines := []string{
		fmt.Sprintf("<h1>%s</h1>", brief.Title),
		fmt.Sprintf("<p>%s</p>", brief.Summary),
	}
	for _, topic := range topics {
		lines = append(lines, fmt.Sprintf("<h2>%s</h2><p>%s</p>", topic.Title, topic.Summary))
	}
	return strings.Join(lines, "\n")
}
