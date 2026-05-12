export type ContentGroup =
  | "official-blog"
  | "research"
  | "engineering"
  | "community"
  | "media"
  | "newsletter";

export type ConnectorType = "rss" | "api";
export type BriefType = "quick" | "full";
export type ItemStatus = "ready" | "invalid" | "duplicate";
export type ImportanceLevel = "high" | "medium" | "low";

export interface SourceConfig {
  id: string;
  name: string;
  type: ConnectorType;
  url: string;
  category: ContentGroup;
  enabled: boolean;
  priority: number;
  fetchIntervalMinutes: number;
  timeWindowHours: number;
  parserType: string;
  lastFetchedAt?: string;
  lastStatus?: string;
  lastItemCount?: number;
  lastErrorMessage?: string;
}

export interface ProcessedTopic {
  id: string;
  processingRunId: string;
  title: string;
  canonicalUrl: string;
  summary: string;
  sourceIds: string[];
  itemIds: string[];
  primaryCategory: ContentGroup;
  tags: string[];
  publishedAt: string;
  importance: ImportanceLevel;
  noveltyScore: number;
  credibilityScore: number;
  richnessScore: number;
  duplicateGroupSize: number;
  isCrossSourceConfirmed: boolean;
  status: string;
  discardReason?: string;
}

export interface BriefDraftSection {
  key: string;
  title: string;
  topicIds: string[];
}

export interface BriefStats {
  inputItems: number;
  selectedTopics: number;
  droppedItems: number;
  crossSourceTopics: number;
}

export interface BriefDraft {
  id: string;
  processingRunId: string;
  type: BriefType;
  date: string;
  title: string;
  summary: string;
  generatedAt: string;
  leadTopicId?: string;
  topicIds: string[];
  sections: BriefDraftSection[];
  stats: BriefStats;
}

export interface ManifestEntry {
  date: string;
  type: BriefType;
  title: string;
  generatedAt: string;
  stats: BriefStats;
}

export interface Manifest {
  version: string;
  lastUpdated: string;
  briefs: ManifestEntry[];
}

export interface BriefPayload {
  brief: BriefDraft;
  topics: ProcessedTopic[];
}

export interface GenerateResult {
  date: string;
  fetchRunId: string;
  processingRunId: string;
  deliveryRunId?: string;
}
