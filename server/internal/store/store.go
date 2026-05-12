package store

import "github.com/Mengbooo/BemoNews/server/internal/model"

type Store interface {
	SaveCollectedItems(date string, items []model.CollectedItem) error
	GetCollectedItems(date string) ([]model.CollectedItem, error)

	SaveTopics(date string, topics []model.ProcessedTopic) error
	GetTopics(date string) ([]model.ProcessedTopic, error)

	SaveBriefDraft(draft model.BriefDraft) error
	GetBriefDraft(date string, briefType model.BriefType) (*model.BriefDraft, error)

	GetManifest() (*model.Manifest, error)
	SaveManifest(manifest model.Manifest) error

	SaveFetchRun(run model.FetchRun) error
	SaveProcessingRun(run model.ProcessingRun) error
	SaveDeliveryRun(run model.DeliveryRun) error
}
