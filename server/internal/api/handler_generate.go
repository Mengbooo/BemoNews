package api

import (
	"encoding/json"
	"net/http"
	"time"
)

type generateRequest struct {
	Date    string `json:"date"`
	Deliver bool   `json:"deliver"`
}

func (s *Server) handleGenerate(w http.ResponseWriter, r *http.Request) {
	var req generateRequest
	if r.Body != nil {
		_ = json.NewDecoder(r.Body).Decode(&req)
	}

	if req.Date == "" {
		req.Date = time.Now().Format("2006-01-02")
	}

	result, err := s.deps.GenerateDate(r.Context(), req.Date, req.Deliver)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusAccepted, map[string]any{
		"ok":     true,
		"result": result,
	})
}
