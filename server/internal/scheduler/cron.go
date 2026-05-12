package scheduler

import (
	"log"

	"github.com/robfig/cron/v3"
)

type Scheduler struct {
	cron    *cron.Cron
	enabled bool
}

func New(schedule string, enabled bool, job func() error) *Scheduler {
	c := cron.New()
	if enabled {
		_, err := c.AddFunc(schedule, func() {
			if runErr := job(); runErr != nil {
				log.Printf("scheduled pipeline failed: %v", runErr)
			}
		})
		if err != nil {
			log.Printf("schedule cron job failed: %v", err)
			enabled = false
		}
	}

	return &Scheduler{
		cron:    c,
		enabled: enabled,
	}
}

func (s *Scheduler) Start() {
	if s.enabled {
		s.cron.Start()
	}
}

func (s *Scheduler) Stop() {
	if s.enabled {
		ctx := s.cron.Stop()
		<-ctx.Done()
	}
}
