package delivery

import (
	"context"
	"fmt"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/config"
	"github.com/Mengbooo/BemoNews/server/internal/model"
	"github.com/Mengbooo/BemoNews/server/internal/store"
)

type Orchestrator struct {
	store  store.Store
	config config.Config
}

func NewOrchestrator(dataStore store.Store, cfg config.Config) *Orchestrator {
	return &Orchestrator{
		store:  dataStore,
		config: cfg,
	}
}

func (o *Orchestrator) Run(_ context.Context, date string, channel string) (*model.DeliveryRun, error) {
	startedAt := time.Now().UTC()
	quickDraft, err := o.store.GetBriefDraft(date, model.BriefQuick)
	if err != nil {
		return nil, err
	}

	status := "skipped"
	successCount := 0
	if len(o.config.MailRecipients) > 0 {
		status = "queued"
		successCount = len(o.config.MailRecipients)
	}

	run := model.DeliveryRun{
		ID:             fmt.Sprintf("delivery-%d", startedAt.UnixNano()),
		TriggerType:    "manual",
		Channel:        channel,
		Date:           date,
		Status:         status,
		StartedAt:      startedAt,
		EndedAt:        time.Now().UTC(),
		RecipientCount: len(o.config.MailRecipients),
		SuccessCount:   successCount,
		FailureCount:   0,
		BriefDraftID:   quickDraft.ID,
		LandingURL:     fmt.Sprintf("/%s/quick", date),
	}

	if err := o.store.SaveDeliveryRun(run); err != nil {
		return nil, err
	}

	return &run, nil
}
