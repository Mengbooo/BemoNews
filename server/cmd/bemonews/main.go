package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/api"
	"github.com/Mengbooo/BemoNews/server/internal/collection"
	"github.com/Mengbooo/BemoNews/server/internal/config"
	"github.com/Mengbooo/BemoNews/server/internal/delivery"
	"github.com/Mengbooo/BemoNews/server/internal/processing"
	"github.com/Mengbooo/BemoNews/server/internal/scheduler"
	"github.com/Mengbooo/BemoNews/server/internal/store"
)

func main() {
	cfg := config.Load()

	fileStore, err := store.NewFileStore(cfg.DataDir)
	if err != nil {
		log.Fatalf("init file store: %v", err)
	}

	sourceRegistry := store.NewSourceRegistry(config.DefaultSources())
	collector := collection.NewOrchestrator(fileStore, sourceRegistry)
	processor := processing.NewOrchestrator(fileStore)
	deliverer := delivery.NewOrchestrator(fileStore, cfg)

	generateDate := func(ctx context.Context, date string, deliver bool) (api.GenerateResult, error) {
		fetchRun, err := collector.Run(ctx, date, "manual")
		if err != nil {
			return api.GenerateResult{}, err
		}

		processingRun, err := processor.Run(ctx, date, fetchRun.ID)
		if err != nil {
			return api.GenerateResult{}, err
		}

		result := api.GenerateResult{
			Date:            date,
			FetchRunID:      fetchRun.ID,
			ProcessingRunID: processingRun.ID,
		}

		if deliver {
			deliveryRun, deliveryErr := deliverer.Run(ctx, date, "email")
			if deliveryErr != nil {
				return result, deliveryErr
			}
			result.DeliveryRunID = deliveryRun.ID
		}

		return result, nil
	}

	httpHandler := api.NewRouter(api.Dependencies{
		Config:       cfg,
		Store:        fileStore,
		Sources:      sourceRegistry,
		GenerateDate: generateDate,
	})

	cronScheduler := scheduler.New(cfg.CronSchedule, cfg.CronEnabled, func() error {
		today := time.Now().Format("2006-01-02")
		_, err := generateDate(context.Background(), today, cfg.CronDeliver)
		return err
	})
	cronScheduler.Start()
	defer cronScheduler.Stop()

	server := &http.Server{
		Addr:              cfg.ServerAddr,
		Handler:           httpHandler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("bemoNews server listening on %s", cfg.ServerAddr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("listen and serve: %v", err)
	}
}
