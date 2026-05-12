package processing

import "github.com/Mengbooo/BemoNews/server/internal/model"

type BriefBuilder struct{}

func NewBriefBuilder() *BriefBuilder {
	return &BriefBuilder{}
}

func (b *BriefBuilder) BuildQuick(date string, topics []model.ProcessedTopic) model.BriefDraft {
	return buildBriefDraft(date, model.BriefQuick, topics)
}

func (b *BriefBuilder) BuildFull(date string, topics []model.ProcessedTopic) model.BriefDraft {
	return buildBriefDraft(date, model.BriefFull, topics)
}
