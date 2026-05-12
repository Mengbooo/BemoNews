package collection

import (
	"context"
	"encoding/json"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type APIConnector struct{}

func NewAPIConnector() *APIConnector {
	return &APIConnector{}
}

func (c *APIConnector) Fetch(_ context.Context, _ model.SourceConfig) (json.RawMessage, error) {
	return json.RawMessage("[]"), nil
}
