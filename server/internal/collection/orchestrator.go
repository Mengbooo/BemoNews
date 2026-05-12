package collection

import (
	"context"
	"fmt"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
	"github.com/Mengbooo/BemoNews/server/internal/store"
)

type Orchestrator struct {
	store    store.Store
	registry *store.SourceRegistry
}

func NewOrchestrator(dataStore store.Store, registry *store.SourceRegistry) *Orchestrator {
	return &Orchestrator{
		store:    dataStore,
		registry: registry,
	}
}

func (o *Orchestrator) Run(_ context.Context, date string, triggerType string) (*model.FetchRun, error) {
	startedAt := time.Now().UTC()
	sources := o.registry.GetEnabledSources()

	items := []model.CollectedItem{}
	if err := o.store.SaveCollectedItems(date, items); err != nil {
		return nil, err
	}

	run := model.FetchRun{
		ID:             runID("fetch"),
		TriggerType:    triggerType,
		Date:           date,
		Status:         "success",
		StartedAt:      startedAt,
		EndedAt:        time.Now().UTC(),
		SourceCount:    len(sources),
		SuccessCount:   len(sources),
		FailureCount:   0,
		CollectedItems: len(items),
	}

	if err := o.store.SaveFetchRun(run); err != nil {
		return nil, err
	}

	return &run, nil
}

func runID(prefix string) string {
	return fmt.Sprintf("%s-%d", prefix, time.Now().UTC().UnixNano())
}
