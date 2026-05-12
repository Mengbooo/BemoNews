package api

import "net/http"

func (s *Server) handleManifest(w http.ResponseWriter, _ *http.Request) {
	manifest, err := s.deps.Store.GetManifest()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, manifest)
}
