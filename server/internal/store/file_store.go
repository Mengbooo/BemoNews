package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/Mengbooo/BemoNews/server/internal/model"
)

type FileStore struct {
	root string
}

func NewFileStore(root string) (*FileStore, error) {
	store := &FileStore{root: root}
	if err := store.ensureLayout(); err != nil {
		return nil, err
	}
	return store, nil
}

func (s *FileStore) SaveCollectedItems(date string, items []model.CollectedItem) error {
	return s.writeJSON(filepath.Join(s.root, "collected", date+".json"), items)
}

func (s *FileStore) GetCollectedItems(date string) ([]model.CollectedItem, error) {
	var items []model.CollectedItem
	err := s.readJSON(filepath.Join(s.root, "collected", date+".json"), &items)
	if errors.Is(err, os.ErrNotExist) {
		return []model.CollectedItem{}, nil
	}
	return items, err
}

func (s *FileStore) SaveTopics(date string, topics []model.ProcessedTopic) error {
	return s.writeJSON(filepath.Join(s.root, "topics", date+".json"), topics)
}

func (s *FileStore) GetTopics(date string) ([]model.ProcessedTopic, error) {
	var topics []model.ProcessedTopic
	err := s.readJSON(filepath.Join(s.root, "topics", date+".json"), &topics)
	if errors.Is(err, os.ErrNotExist) {
		return []model.ProcessedTopic{}, nil
	}
	return topics, err
}

func (s *FileStore) SaveBriefDraft(draft model.BriefDraft) error {
	return s.writeJSON(filepath.Join(s.root, "briefs", fmt.Sprintf("%s-%s.json", draft.Date, draft.Type)), draft)
}

func (s *FileStore) GetBriefDraft(date string, briefType model.BriefType) (*model.BriefDraft, error) {
	var draft model.BriefDraft
	if err := s.readJSON(filepath.Join(s.root, "briefs", fmt.Sprintf("%s-%s.json", date, briefType)), &draft); err != nil {
		return nil, err
	}
	return &draft, nil
}

func (s *FileStore) GetManifest() (*model.Manifest, error) {
	var manifest model.Manifest
	err := s.readJSON(filepath.Join(s.root, "manifest.json"), &manifest)
	if errors.Is(err, os.ErrNotExist) {
		return &model.Manifest{
			Version:     "1.0",
			LastUpdated: time.Now().UTC(),
			Briefs:      []model.ManifestEntry{},
		}, nil
	}
	if err != nil {
		return nil, err
	}
	return &manifest, nil
}

func (s *FileStore) SaveManifest(manifest model.Manifest) error {
	manifest.LastUpdated = time.Now().UTC()
	return s.writeJSON(filepath.Join(s.root, "manifest.json"), manifest)
}

func (s *FileStore) SaveFetchRun(run model.FetchRun) error {
	return s.writeJSON(filepath.Join(s.root, "runs", fmt.Sprintf("fetch-%s.json", run.ID)), run)
}

func (s *FileStore) SaveProcessingRun(run model.ProcessingRun) error {
	return s.writeJSON(filepath.Join(s.root, "runs", fmt.Sprintf("processing-%s.json", run.ID)), run)
}

func (s *FileStore) SaveDeliveryRun(run model.DeliveryRun) error {
	return s.writeJSON(filepath.Join(s.root, "runs", fmt.Sprintf("delivery-%s.json", run.ID)), run)
}

func (s *FileStore) ensureLayout() error {
	dirs := []string{
		s.root,
		filepath.Join(s.root, "collected"),
		filepath.Join(s.root, "topics"),
		filepath.Join(s.root, "briefs"),
		filepath.Join(s.root, "runs"),
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}

	return nil
}

func (s *FileStore) writeJSON(path string, payload any) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return err
	}

	data = append(data, '\n')
	return os.WriteFile(path, data, 0o644)
}

func (s *FileStore) readJSON(path string, target any) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, target)
}
