package store

import "github.com/Mengbooo/BemoNews/server/internal/model"

type SourceRegistry struct {
	sources []model.SourceConfig
}

func NewSourceRegistry(sources []model.SourceConfig) *SourceRegistry {
	cloned := append([]model.SourceConfig(nil), sources...)
	return &SourceRegistry{sources: cloned}
}

func (r *SourceRegistry) GetAllSources() []model.SourceConfig {
	return append([]model.SourceConfig(nil), r.sources...)
}

func (r *SourceRegistry) GetEnabledSources() []model.SourceConfig {
	result := make([]model.SourceConfig, 0, len(r.sources))
	for _, source := range r.sources {
		if source.Enabled {
			result = append(result, source)
		}
	}
	return result
}

func (r *SourceRegistry) GetSourceByID(id string) (model.SourceConfig, bool) {
	for _, source := range r.sources {
		if source.ID == id {
			return source, true
		}
	}
	return model.SourceConfig{}, false
}

func (r *SourceRegistry) GetSourcesByCategory(category model.ContentGroup) []model.SourceConfig {
	result := make([]model.SourceConfig, 0)
	for _, source := range r.sources {
		if source.Category == category {
			result = append(result, source)
		}
	}
	return result
}

func (r *SourceRegistry) GetSourcesByType(connectorType model.ConnectorType) []model.SourceConfig {
	result := make([]model.SourceConfig, 0)
	for _, source := range r.sources {
		if source.Type == connectorType {
			result = append(result, source)
		}
	}
	return result
}
