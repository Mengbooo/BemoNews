package api

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/config"
	"github.com/Mengbooo/BemoNews/server/internal/model"
	"github.com/Mengbooo/BemoNews/server/internal/store"
)

type GenerateResult struct {
	Date            string `json:"date"`
	FetchRunID      string `json:"fetchRunId"`
	ProcessingRunID string `json:"processingRunId"`
	DeliveryRunID   string `json:"deliveryRunId,omitempty"`
}

type Dependencies struct {
	Config       config.Config
	Store        store.Store
	Sources      *store.SourceRegistry
	GenerateDate func(ctx context.Context, date string, deliver bool) (GenerateResult, error)
}

type Server struct {
	deps Dependencies
}

func NewRouter(deps Dependencies) http.Handler {
	server := &Server{deps: deps}
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", server.handleHealth)
	mux.HandleFunc("GET /api/manifest", server.handleManifest)
	mux.HandleFunc("GET /api/briefs/{date}/{type}", server.handleBrief)
	mux.HandleFunc("GET /api/sources", server.handleSources)
	mux.HandleFunc("POST /api/generate", server.handleGenerate)

	return withCORS(deps.Config.WebOrigin, withRecovery(withLogging(mux)))
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	respondJSON(w, http.StatusOK, map[string]any{
		"status": "ok",
		"time":   time.Now().UTC(),
	})
}

func respondJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("encode response: %v", err)
	}
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(startedAt))
	})
}

func withRecovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				log.Printf("panic in %s %s: %v", r.Method, r.URL.Path, recovered)
				respondError(w, http.StatusInternalServerError, "internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func withCORS(origin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type BriefPayload struct {
	Brief  model.BriefDraft       `json:"brief"`
	Topics []model.ProcessedTopic `json:"topics"`
}
