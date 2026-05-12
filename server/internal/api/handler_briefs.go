package api

import (
	"net/http"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

func (s *Server) handleBrief(w http.ResponseWriter, r *http.Request) {
	date := r.PathValue("date")
	briefType := model.BriefType(r.PathValue("type"))

	if briefType != model.BriefQuick && briefType != model.BriefFull {
		respondError(w, http.StatusBadRequest, "invalid brief type")
		return
	}

	brief, err := s.deps.Store.GetBriefDraft(date, briefType)
	if err != nil {
		respondError(w, http.StatusNotFound, "brief not found")
		return
	}

	topics, err := s.deps.Store.GetTopics(date)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, BriefPayload{
		Brief:  *brief,
		Topics: orderTopics(topics, brief.TopicIDs),
	})
}

func orderTopics(topics []model.ProcessedTopic, orderedIDs []string) []model.ProcessedTopic {
	byID := make(map[string]model.ProcessedTopic, len(topics))
	for _, topic := range topics {
		byID[topic.ID] = topic
	}

	ordered := make([]model.ProcessedTopic, 0, len(orderedIDs))
	for _, id := range orderedIDs {
		if topic, ok := byID[id]; ok {
			ordered = append(ordered, topic)
		}
	}

	return ordered
}
