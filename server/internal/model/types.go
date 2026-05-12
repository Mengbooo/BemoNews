package model

import "time"

type ContentGroup string

const (
	GroupOfficialBlog ContentGroup = "official-blog"
	GroupResearch     ContentGroup = "research"
	GroupEngineering  ContentGroup = "engineering"
	GroupCommunity    ContentGroup = "community"
	GroupMedia        ContentGroup = "media"
	GroupNewsletter   ContentGroup = "newsletter"
)

type ConnectorType string

const (
	ConnectorRSS ConnectorType = "rss"
	ConnectorAPI ConnectorType = "api"
)

type BriefType string

const (
	BriefQuick BriefType = "quick"
	BriefFull  BriefType = "full"
)

type ItemStatus string

const (
	ItemReady     ItemStatus = "ready"
	ItemInvalid   ItemStatus = "invalid"
	ItemDuplicate ItemStatus = "duplicate"
)

type ImportanceLevel string

const (
	ImportanceHigh   ImportanceLevel = "high"
	ImportanceMedium ImportanceLevel = "medium"
	ImportanceLow    ImportanceLevel = "low"
)

type SourceConfig struct {
	ID               string        `json:"id"`
	Name             string        `json:"name"`
	Type             ConnectorType `json:"type"`
	URL              string        `json:"url"`
	Category         ContentGroup  `json:"category"`
	Enabled          bool          `json:"enabled"`
	Priority         int           `json:"priority"`
	FetchIntervalMin int           `json:"fetchIntervalMinutes"`
	TimeWindowHours  int           `json:"timeWindowHours"`
	ParserType       string        `json:"parserType"`
	LastFetchedAt    *time.Time    `json:"lastFetchedAt,omitempty"`
	LastStatus       string        `json:"lastStatus,omitempty"`
	LastItemCount    int           `json:"lastItemCount,omitempty"`
	LastErrorMessage string        `json:"lastErrorMessage,omitempty"`
}

type CollectedItem struct {
	ID            string       `json:"id"`
	SourceID      string       `json:"sourceId"`
	Title         string       `json:"title"`
	CanonicalURL  string       `json:"canonicalUrl"`
	Summary       string       `json:"summary"`
	Author        string       `json:"author,omitempty"`
	PublishedAt   time.Time    `json:"publishedAt"`
	FetchedAt     time.Time    `json:"fetchedAt"`
	Category      ContentGroup `json:"category"`
	DedupeKey     string       `json:"dedupeKey"`
	Status        ItemStatus   `json:"status"`
	InvalidReason string       `json:"invalidReason,omitempty"`
}

type ProcessedTopic struct {
	ID                     string          `json:"id"`
	ProcessingRunID        string          `json:"processingRunId"`
	Title                  string          `json:"title"`
	CanonicalURL           string          `json:"canonicalUrl"`
	Summary                string          `json:"summary"`
	SourceIDs              []string        `json:"sourceIds"`
	ItemIDs                []string        `json:"itemIds"`
	PrimaryCategory        ContentGroup    `json:"primaryCategory"`
	Tags                   []string        `json:"tags"`
	PublishedAt            time.Time       `json:"publishedAt"`
	Importance             ImportanceLevel `json:"importance"`
	NoveltyScore           float64         `json:"noveltyScore"`
	CredibilityScore       float64         `json:"credibilityScore"`
	RichnessScore          float64         `json:"richnessScore"`
	DuplicateGroupSize     int             `json:"duplicateGroupSize"`
	IsCrossSourceConfirmed bool            `json:"isCrossSourceConfirmed"`
	Status                 string          `json:"status"`
	DiscardReason          string          `json:"discardReason,omitempty"`
}

type BriefDraftSection struct {
	Key      string   `json:"key"`
	Title    string   `json:"title"`
	TopicIDs []string `json:"topicIds"`
}

type BriefStats struct {
	InputItems        int `json:"inputItems"`
	SelectedTopics    int `json:"selectedTopics"`
	DroppedItems      int `json:"droppedItems"`
	CrossSourceTopics int `json:"crossSourceTopics"`
}

type BriefDraft struct {
	ID              string              `json:"id"`
	ProcessingRunID string              `json:"processingRunId"`
	Type            BriefType           `json:"type"`
	Date            string              `json:"date"`
	Title           string              `json:"title"`
	Summary         string              `json:"summary"`
	GeneratedAt     time.Time           `json:"generatedAt"`
	LeadTopicID     string              `json:"leadTopicId,omitempty"`
	TopicIDs        []string            `json:"topicIds"`
	Sections        []BriefDraftSection `json:"sections"`
	Stats           BriefStats          `json:"stats"`
}

type FetchRun struct {
	ID             string    `json:"id"`
	TriggerType    string    `json:"triggerType"`
	Date           string    `json:"date"`
	Status         string    `json:"status"`
	StartedAt      time.Time `json:"startedAt"`
	EndedAt        time.Time `json:"endedAt"`
	SourceCount    int       `json:"sourceCount"`
	SuccessCount   int       `json:"successCount"`
	FailureCount   int       `json:"failureCount"`
	CollectedItems int       `json:"collectedItems"`
	ErrorMessage   string    `json:"errorMessage,omitempty"`
}

type ProcessingRun struct {
	ID               string    `json:"id"`
	FetchRunID       string    `json:"fetchRunId"`
	Date             string    `json:"date"`
	Status           string    `json:"status"`
	StartedAt        time.Time `json:"startedAt"`
	EndedAt          time.Time `json:"endedAt"`
	InputItems       int       `json:"inputItems"`
	TopicCount       int       `json:"topicCount"`
	QuickBriefID     string    `json:"quickBriefId,omitempty"`
	FullBriefID      string    `json:"fullBriefId,omitempty"`
	CrossSourceCount int       `json:"crossSourceCount"`
	ErrorMessage     string    `json:"errorMessage,omitempty"`
}

type DeliveryRun struct {
	ID             string    `json:"id"`
	TriggerType    string    `json:"triggerType"`
	Channel        string    `json:"channel"`
	Date           string    `json:"date"`
	Status         string    `json:"status"`
	StartedAt      time.Time `json:"startedAt"`
	EndedAt        time.Time `json:"endedAt"`
	RecipientCount int       `json:"recipientCount"`
	SuccessCount   int       `json:"successCount"`
	FailureCount   int       `json:"failureCount"`
	BriefDraftID   string    `json:"briefDraftId,omitempty"`
	LandingURL     string    `json:"landingUrl,omitempty"`
	ErrorMessage   string    `json:"errorMessage,omitempty"`
}

type ManifestEntry struct {
	Date        string     `json:"date"`
	Type        BriefType  `json:"type"`
	Title       string     `json:"title"`
	GeneratedAt time.Time  `json:"generatedAt"`
	Stats       BriefStats `json:"stats"`
}

type Manifest struct {
	Version     string          `json:"version"`
	LastUpdated time.Time       `json:"lastUpdated"`
	Briefs      []ManifestEntry `json:"briefs"`
}
