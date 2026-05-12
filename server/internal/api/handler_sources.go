package api

import "net/http"

func (s *Server) handleSources(w http.ResponseWriter, _ *http.Request) {
	respondJSON(w, http.StatusOK, map[string]any{
		"sources": s.deps.Sources.GetAllSources(),
		"count":   len(s.deps.Sources.GetAllSources()),
	})
}
