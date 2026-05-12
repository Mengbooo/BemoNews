---
doc_id: planning-2026-05-12-bemonews-technical-architecture
title: bemoNews 技术架构方案
category: planning
status: draft
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/core-plans/bemonews-technical-architecture.md
related_docs:
  - 01-planning/core-plans/ai-daily-news-design.md
  - 01-planning/core-plans/bemonews-implementation.md
  - 01-planning/phase1/phase1-information-collection-overview.md
  - 01-planning/phase2/phase2-information-processing-overview.md
  - 01-planning/phase3/phase3-frontend-presentation-overview.md
  - 01-planning/phase4/phase4-proactive-delivery-overview.md
tags:
  - bemonews
  - technical-architecture
  - react
  - go
  - api-design
  - deployment
summary: bemoNews 技术架构方案，采用 Go 后端 + React 前端分离架构，覆盖系统总览、模块设计、API 契约、数据存储和部署策略。
---
# bemoNews 技术架构方案

## 1. 架构总览

### 1.1 技术栈选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **后端** | Go 1.22+ | HTTP API server + 采集/加工/推送管线 + 定时调度 |
| **前端** | React 18 + TypeScript | Vite 构建，React Router v6，Tailwind CSS |
| **AI 调用** | OpenAI API / Anthropic API | 摘要生成、噪音过滤、topic 聚合辅助 |
| **邮件** | Go net/smtp + gomail | SMTP 发送 |
| **定时调度** | robfig/cron v3 | 进程内 cron，每日 14:00 触发全链路 |
| **数据存储** | 文件系统 JSON（MVP）| 按日期目录组织，后续可迁移 SQLite/PostgreSQL |
| **部署** | 单二进制 + 静态文件 | Go 编译产出 + React build 产出，反向代理或内嵌 |

### 1.2 系统拓扑

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                           │
│                 React SPA (Vite build)                   │
│            /:date/quick  /:date/full  /                 │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP (JSON API)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Go HTTP Server                        │
│                     :8080                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ API 层    │  │Collection│  │Processing│  │Delivery│  │
│  │ (路由/   │  │ (Phase1) │  │ (Phase2) │  │(Phase4)│  │
│  │  handler)│  │          │  │          │  │        │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
│       │             │             │             │        │
│  ┌────▼─────────────▼─────────────▼─────────────▼────┐  │
│  │                  Store 层                          │  │
│  │           (文件系统 JSON 读写)                      │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐  │
│  │               Scheduler (cron)                     │  │
│  │          每日 14:00 → 全链路 pipeline              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │     data/ 目录         │
              │  collected/ topics/   │
              │  briefs/ runs/        │
              └───────────────────────┘
```

### 1.3 数据流

```
外部信息源 (RSS/API)
        │
        ▼
  Phase 1: Collection ──→ data/collected/{date}.json     → CollectedItem[]
        │
        ▼
  Phase 2: Processing ──→ data/topics/{date}.json        → ProcessedTopic[]
                     └──→ data/briefs/{date}-{type}.json → BriefDraft
        │
        ▼
  Phase 3: Manifest  ──→ data/manifest.json              → Manifest
        │
        ▼
  Phase 4: Delivery  ──→ data/runs/{runId}.json          → DeliveryRun
        │
        ▼
  React 前端 ←── GET /api/manifest, GET /api/briefs/:date/:type
```

---

## 2. Go 后端设计

### 2.1 项目结构

```
server/
├── cmd/bemonews/
│   └── main.go              # 程序入口
├── internal/
│   ├── api/                 # HTTP 层
│   │   ├── router.go        # 路由注册
│   │   ├── middleware.go     # CORS、日志、recovery
│   │   ├── handler_manifest.go
│   │   ├── handler_briefs.go
│   │   ├── handler_generate.go
│   │   └── handler_sources.go
│   ├── collection/          # Phase 1
│   │   ├── orchestrator.go
│   │   ├── connector_rss.go
│   │   ├── connector_api.go
│   │   ├── parser_generic_rss.go
│   │   ├── parser_hn.go
│   │   ├── parser_github.go
│   │   ├── parser_arxiv.go
│   │   ├── normalizer.go
│   │   ├── validator.go
│   │   └── dedupe.go
│   ├── processing/          # Phase 2
│   │   ├── orchestrator.go
│   │   ├── noise_filter.go
│   │   ├── topic_cluster.go
│   │   ├── topic_ranker.go
│   │   ├── topic_summarizer.go
│   │   └── brief_builder.go
│   ├── delivery/            # Phase 4
│   │   ├── orchestrator.go
│   │   ├── email_composer.go
│   │   └── email_sender.go
│   ├── store/               # 数据存储
│   │   ├── store.go         # 接口
│   │   ├── file_store.go    # JSON 文件实现
│   │   └── source_registry.go
│   ├── scheduler/
│   │   └── cron.go
│   ├── model/
│   │   └── types.go         # 全部数据结构
│   ├── ai/
│   │   └── client.go        # AI API 调用封装
│   └── config/
│       ├── config.go        # 应用配置
│       └── sources.go       # source 白名单
├── go.mod
└── go.sum
```

### 2.2 Go 依赖

| 包 | 用途 |
|----|------|
| `net/http` (标准库) | HTTP server |
| `github.com/mmcdole/gofeed` | RSS/Atom 解析 |
| `github.com/robfig/cron/v3` | 定时调度 |
| `github.com/go-gomail/gomail` | 邮件发送 |
| `github.com/google/uuid` | ID 生成 |
| `github.com/rs/cors` | CORS 中间件 |
| `encoding/json` (标准库) | JSON 读写 |
| `encoding/xml` (标准库) | arXiv XML 解析 |

MVP 尽量使用标准库，减少外部依赖。HTTP 路由使用 Go 1.22 内置的 `http.ServeMux` 增强路由（支持方法匹配和路径参数），无需引入 gorilla/mux 或 chi。

### 2.3 核心数据模型（Go）

```go
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

// Phase 1
type SourceConfig struct {
    ID                 string        `json:"id"`
    Name               string        `json:"name"`
    Type               ConnectorType `json:"type"`
    URL                string        `json:"url"`
    Category           ContentGroup  `json:"category"`
    Enabled            bool          `json:"enabled"`
    Priority           int           `json:"priority"`
    FetchIntervalMin   int           `json:"fetchIntervalMinutes"`
    TimeWindowHours    int           `json:"timeWindowHours"`
    ParserType         string        `json:"parserType"`
    LastFetchedAt      *time.Time    `json:"lastFetchedAt,omitempty"`
    LastStatus         string        `json:"lastStatus,omitempty"`
    LastItemCount      int           `json:"lastItemCount,omitempty"`
    LastErrorMessage   string        `json:"lastErrorMessage,omitempty"`
}

type ItemStatus string

const (
    ItemReady     ItemStatus = "ready"
    ItemInvalid   ItemStatus = "invalid"
    ItemDuplicate ItemStatus = "duplicate"
)

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

// Phase 2
type ImportanceLevel string

const (
    ImportanceHigh   ImportanceLevel = "high"
    ImportanceMedium ImportanceLevel = "medium"
    ImportanceLow    ImportanceLevel = "low"
)

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

type BriefType string

const (
    BriefQuick BriefType = "quick"
    BriefFull  BriefType = "full"
)

type BriefDraftSection struct {
    Key      string   `json:"key"`
    Title    string   `json:"title"`
    TopicIDs []string `json:"topicIds"`
}

type BriefDraft struct {
    ID              string              `json:"id"`
    ProcessingRunID string              `json:"processingRunId"`
    Type            BriefType           `json:"type"`
    Date            string              `json:"date"`
    LeadTopicID     string              `json:"leadTopicId,omitempty"`
    TopicIDs        []string            `json:"topicIds"`
    Sections        []BriefDraftSection `json:"sections"`
    Stats           BriefStats          `json:"stats"`
}

type BriefStats struct {
    InputItems        int `json:"inputItems"`
    SelectedTopics    int `json:"selectedTopics"`
    DroppedItems      int `json:"droppedItems"`
    CrossSourceTopics int `json:"crossSourceTopics"`
}

// Phase 4
type DeliveryRun struct {
    ID             string    `json:"id"`
    TriggerType    string    `json:"triggerType"`
    Channel        string    `json:"channel"`
    Date           string    `json:"date"`
    Status         string    `json:"status"`
    StartedAt      time.Time `json:"startedAt"`
    EndedAt        time.Time `json:"endedAt,omitempty"`
    RecipientCount int       `json:"recipientCount"`
    SuccessCount   int       `json:"successCount"`
    FailureCount   int       `json:"failureCount"`
    BriefDraftID   string    `json:"briefDraftId,omitempty"`
    LandingURL     string    `json:"landingUrl,omitempty"`
    ErrorMessage   string    `json:"errorMessage,omitempty"`
}

// Manifest
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
```

### 2.4 存储接口

```go
package store

type Store interface {
    // Collection
    SaveCollectedItems(date string, items []model.CollectedItem) error
    GetCollectedItems(date string) ([]model.CollectedItem, error)

    // Processing
    SaveTopics(date string, topics []model.ProcessedTopic) error
    GetTopics(date string) ([]model.ProcessedTopic, error)
    SaveBriefDraft(draft model.BriefDraft) error
    GetBriefDraft(date string, briefType model.BriefType) (*model.BriefDraft, error)

    // Manifest
    GetManifest() (*model.Manifest, error)
    SaveManifest(manifest model.Manifest) error

    // Runs
    SaveFetchRun(run model.FetchRun) error
    SaveProcessingRun(run model.ProcessingRun) error
    SaveDeliveryRun(run model.DeliveryRun) error
}
```

MVP 使用文件系统实现：每类数据一个 JSON 文件，按日期组织。文件粒度足够支撑单用户场景，无需数据库。

文件布局：

```
data/
├── collected/
│   └── 2026-05-12.json          # []CollectedItem
├── topics/
│   └── 2026-05-12.json          # []ProcessedTopic
├── briefs/
│   ├── 2026-05-12-quick.json    # BriefDraft
│   └── 2026-05-12-full.json     # BriefDraft
├── runs/
│   ├── fetch-{id}.json          # FetchRun
│   ├── processing-{id}.json     # ProcessingRun
│   └── delivery-{id}.json       # DeliveryRun
└── manifest.json                # Manifest
```

### 2.5 Collection 模块设计

```go
// orchestrator.go 核心流程
func (o *Orchestrator) Run(ctx context.Context) (*model.FetchRun, error) {
    sources := o.registry.GetEnabledSources()
    run := newFetchRun("manual")

    var allItems []model.CollectedItem
    var mu sync.Mutex
    var wg sync.WaitGroup

    for _, src := range sources {
        wg.Add(1)
        go func(s model.SourceConfig) {
            defer wg.Done()
            rawItems, err := o.fetch(ctx, s)
            if err != nil {
                // 记录错误，继续下一个 source
                return
            }
            parsed := o.parse(s, rawItems)
            normalized := o.normalizer.Normalize(parsed)
            validated := o.validator.Validate(normalized, s.TimeWindowHours)

            mu.Lock()
            allItems = append(allItems, validated...)
            mu.Unlock()
        }(src)
    }
    wg.Wait()

    deduped := o.dedupe.Dedupe(allItems)
    o.store.SaveCollectedItems(today(), deduped)
    // 更新 run 统计并保存
    return &run, nil
}
```

关键设计：
- **并发采集**：每个 source 一个 goroutine，互不阻塞
- **容错**：单源失败不影响整体，错误记录到 run 日志
- **分层处理**：fetch → parse → normalize → validate → dedupe，各步职责清晰

### 2.6 Processing 模块设计

```go
// orchestrator.go 核心流程
func (o *Orchestrator) Run(ctx context.Context, date string) (*model.ProcessingRun, error) {
    items, _ := o.store.GetCollectedItems(date)
    readyItems := filterReady(items)

    // Step 1: Noise Filter
    filtered := o.noiseFilter.Filter(ctx, readyItems)

    // Step 2-3: Semantic Dedupe + Topic Clustering
    topics := o.topicCluster.Cluster(ctx, filtered)

    // Step 4: Importance Scoring
    scored := o.ranker.Score(ctx, topics)

    // Step 5: Summary Generation
    summarized := o.summarizer.Summarize(ctx, scored)

    // Step 6: Brief Shaping
    quickDraft := o.briefBuilder.BuildQuick(summarized, date)
    fullDraft := o.briefBuilder.BuildFull(summarized, date)

    // 保存
    o.store.SaveTopics(date, summarized)
    o.store.SaveBriefDraft(quickDraft)
    o.store.SaveBriefDraft(fullDraft)
    // 更新 manifest
    return &run, nil
}
```

### 2.7 AI 调用封装

```go
package ai

type Client struct {
    apiKey   string
    endpoint string
    model    string
}

type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

func (c *Client) Chat(ctx context.Context, messages []Message) (string, error) {
    // HTTP POST to OpenAI/Anthropic API
    // 返回 assistant 回复文本
}
```

AI 调用集中在 Phase 2 的三个环节：
- `noise_filter.go`：判断内容是否为噪音（可选，也可用规则）
- `topic_cluster.go`：辅助语义相似度判断
- `topic_summarizer.go`：生成 topic 摘要

MVP 可以先用规则实现 noise filter 和 topic cluster，只在 summarizer 环节调用 AI。

### 2.8 Scheduler 设计

```go
package scheduler

import "github.com/robfig/cron/v3"

type Scheduler struct {
    cron     *cron.Cron
    pipeline *pipeline.FullPipeline
}

func (s *Scheduler) Start() {
    s.cron.AddFunc("0 14 * * *", func() {
        ctx := context.Background()
        s.pipeline.RunFull(ctx) // Phase 1 → 2 → manifest → 4
    })
    s.cron.Start()
}
```

### 2.9 Delivery 模块设计

```go
// orchestrator.go
func (o *Orchestrator) Run(ctx context.Context, date string) (*model.DeliveryRun, error) {
    quickDraft, _ := o.store.GetBriefDraft(date, model.BriefQuick)
    topics, _ := o.store.GetTopics(date)

    html := o.composer.Compose(quickDraft, topics)
    err := o.sender.Send(o.config.Recipients, html)

    // 记录 DeliveryRun
    return &run, err
}
```

邮件内容策略：
- 取 quick draft 的 lead topic + 前 3-5 条 topic 摘要
- 附 quick/full 报告链接
- 纯 HTML，兼容主流邮件客户端

---

## 3. React 前端设计

### 3.1 项目结构

```
web/
├── src/
│   ├── main.tsx                 # 入口
│   ├── App.tsx                  # 路由
│   ├── index.css                # 全局样式
│   ├── api/
│   │   └── client.ts            # API 客户端
│   ├── types/
│   │   └── index.ts             # 与 Go API 对齐的类型
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DatePage.tsx
│   │   ├── QuickBriefPage.tsx
│   │   └── FullBriefPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── brief/               # 共用组件
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TopicCard.tsx
│   │   │   ├── CompactStory.tsx
│   │   │   ├── LeadStory.tsx
│   │   │   └── BriefSection.tsx
│   │   ├── quick/               # Quick 专属
│   │   │   ├── ExecutiveSnapshot.tsx
│   │   │   ├── DecisionSignals.tsx
│   │   │   └── WatchlistActions.tsx
│   │   └── full/                # Full 专属
│   │       ├── TrendingDiscussions.tsx
│   │       ├── CommunityPicks.tsx
│   │       ├── IndustryResearch.tsx
│   │       ├── NewTools.tsx
│   │       ├── CuratedResources.tsx
│   │       └── OpenSourceTools.tsx
│   └── hooks/
│       ├── useBrief.ts
│       └── useManifest.ts
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

### 3.2 前端依赖

| 包 | 用途 |
|----|------|
| `react` + `react-dom` | UI 框架 |
| `react-router-dom` v6 | 客户端路由 |
| `tailwindcss` | 原子化 CSS |
| `date-fns` | 日期格式化 |
| `vite` | 构建工具 |

无需状态管理库（zustand/redux）——数据流简单，页面级 fetch 即可。

### 3.3 路由设计

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Topbar } from './components/layout/Topbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { DatePage } from './pages/DatePage'
import { QuickBriefPage } from './pages/QuickBriefPage'
import { FullBriefPage } from './pages/FullBriefPage'

export function App() {
    return (
        <BrowserRouter>
            <Topbar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:date" element={<DatePage />} />
                    <Route path="/:date/quick" element={<QuickBriefPage />} />
                    <Route path="/:date/full" element={<FullBriefPage />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    )
}
```

### 3.4 API 客户端

```typescript
// api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function getManifest(): Promise<Manifest> {
    const res = await fetch(`${BASE_URL}/manifest`)
    return res.json()
}

export async function getBrief(date: string, type: 'quick' | 'full'): Promise<BriefResponse> {
    const res = await fetch(`${BASE_URL}/briefs/${date}/${type}`)
    return res.json()
}

export async function triggerGenerate(options?: { sendEmail?: boolean }): Promise<void> {
    await fetch(`${BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
    })
}
```

### 3.5 Tailwind 配置

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0a0a',
                    secondary: '#111111',
                    tertiary: '#171717',
                    elevated: '#1c1c1e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                },
                border: {
                    default: '#27272a',
                    subtle: 'rgba(255, 255, 255, 0.08)',
                },
                success: '#22c55e',
                warning: '#f59e0b',
                info: '#60a5fa',
            },
            borderRadius: {
                sm: '10px',
                md: '12px',
                lg: '16px',
                xl: '20px',
                '2xl': '24px',
                '3xl': '28px',
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
```

### 3.6 全局样式

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #111111;
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --border-default: #27272a;
    --border-subtle: rgba(255, 255, 255, 0.08);
}

html { color-scheme: dark; }

body {
    margin: 0;
    font-family: Inter, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
    background:
        radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 26%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 20%),
        var(--bg-primary);
    color: var(--text-primary);
}

/* 32px 微网格背景 */
body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent 82%);
}
```

### 3.7 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
    },
})
```

开发时：Vite dev server (3000) → proxy `/api` → Go server (8080)。
生产时：Go server 同时托管 React 静态文件和 API。

---

## 4. API 契约

### 4.1 接口一览

| 方法 | 路径 | 说明 | 请求 | 响应 |
|------|------|------|------|------|
| GET | `/api/manifest` | 获取报告索引 | — | `Manifest` |
| GET | `/api/briefs/{date}/{type}` | 获取指定简报 | — | `BriefResponse` |
| POST | `/api/generate` | 触发全链路生成 | `GenerateRequest` | `GenerateResponse` |
| GET | `/api/sources` | 获取信息源列表 | — | `SourceConfig[]` |
| GET | `/api/health` | 健康检查 | — | `{ status: "ok" }` |

### 4.2 接口详情

#### GET /api/manifest

返回报告索引，驱动首页历史列表。

```json
{
    "version": "1.0",
    "lastUpdated": "2026-05-12T14:00:00Z",
    "briefs": [
        {
            "date": "2026-05-12",
            "type": "quick",
            "title": "Quick Briefing - 2026-05-12",
            "generatedAt": "2026-05-12T14:00:00Z",
            "stats": {
                "inputItems": 120,
                "selectedTopics": 8,
                "droppedItems": 45,
                "crossSourceTopics": 3
            }
        }
    ]
}
```

#### GET /api/briefs/{date}/{type}

返回指定日期和类型的完整简报数据（BriefDraft + 关联的 ProcessedTopic）。

路径参数：
- `date`: `YYYY-MM-DD` 格式
- `type`: `quick` 或 `full`

```json
{
    "brief": {
        "id": "brief-2026-05-12-quick",
        "type": "quick",
        "date": "2026-05-12",
        "leadTopicId": "topic-001",
        "topicIds": ["topic-001", "topic-002", "..."],
        "sections": [
            {
                "key": "executive-snapshot",
                "title": "Executive Snapshot",
                "topicIds": ["topic-001", "topic-002", "topic-003", "topic-004"]
            }
        ],
        "stats": { "inputItems": 120, "selectedTopics": 8, "droppedItems": 45, "crossSourceTopics": 3 }
    },
    "topics": [
        {
            "id": "topic-001",
            "title": "OpenAI Releases GPT-5",
            "summary": "OpenAI announced GPT-5 with...",
            "importance": "high",
            "primaryCategory": "official-blog",
            "isCrossSourceConfirmed": true,
            "tags": ["openai", "gpt-5", "language-model"],
            "canonicalUrl": "https://openai.com/blog/gpt-5",
            "sourceIds": ["openai-blog", "techcrunch"],
            "publishedAt": "2026-05-12T10:00:00Z"
        }
    ]
}
```

#### POST /api/generate

触发全链路生成。

请求体（可选）：
```json
{
    "sendEmail": false,
    "sources": ["hn", "openai-blog"]
}
```

- `sendEmail`: 是否在生成后发送邮件，默认 false
- `sources`: 限定采集的 source ID 列表，空则采集全部启用 source

响应：
```json
{
    "status": "success",
    "fetchRun": { "id": "...", "itemCount": 120 },
    "processingRun": { "id": "...", "topicCount": 25, "selectedTopicCount": 15 },
    "deliveryRun": null
}
```

#### GET /api/sources

返回所有 source 配置及最近状态。

```json
[
    {
        "id": "openai-blog",
        "name": "OpenAI Blog",
        "type": "rss",
        "category": "official-blog",
        "enabled": true,
        "lastFetchedAt": "2026-05-12T13:00:00Z",
        "lastStatus": "success",
        "lastItemCount": 3
    }
]
```

### 4.3 错误响应

统一错误格式：

```json
{
    "error": {
        "code": "NOT_FOUND",
        "message": "Brief not found for date 2026-05-13 type quick"
    }
}
```

HTTP 状态码：
- `200` — 成功
- `400` — 请求参数错误
- `404` — 资源不存在
- `500` — 服务端错误

---

## 5. 部署策略

### 5.1 本地开发

```bash
# 终端 1: Go 后端
cd server
go run ./cmd/bemonews/

# 终端 2: React 前端
cd web
npm run dev
```

Vite proxy 将 `/api` 请求转发到 Go server (8080)。

### 5.2 生产部署

**方案 A：Go 内嵌静态文件（推荐 MVP）**

```go
// main.go
//go:embed all:../web/dist
var webDist embed.FS

func main() {
    mux := http.NewServeMux()

    // API 路由
    api.RegisterRoutes(mux, ...)

    // 静态文件（React build）
    webFS, _ := fs.Sub(webDist, "web/dist")
    mux.Handle("/", http.FileServer(http.FS(webFS)))

    http.ListenAndServe(":8080", mux)
}
```

优势：单二进制部署，无需 Nginx/Caddy。

构建步骤：
```bash
cd web && npm run build       # → web/dist/
cd server && go build -o bemonews ./cmd/bemonews/
./bemonews                     # 同时提供 API + 静态文件
```

**方案 B：Nginx 反向代理**

```nginx
server {
    listen 80;

    location /api/ {
        proxy_pass http://localhost:8080;
    }

    location / {
        root /var/www/bemonews/web/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

适合需要 HTTPS、负载均衡的场景。

### 5.3 环境变量

```bash
# Go 后端
BEMONEWS_PORT=8080                    # HTTP 端口
BEMONEWS_DATA_DIR=./data              # 数据目录
BEMONEWS_CRON_SCHEDULE="0 14 * * *"   # 每日定时
BEMONEWS_AI_API_KEY=sk-...            # AI API key
BEMONEWS_AI_MODEL=gpt-4o             # AI 模型
BEMONEWS_SMTP_HOST=smtp.gmail.com     # 邮件 SMTP
BEMONEWS_SMTP_PORT=587
BEMONEWS_SMTP_USER=...
BEMONEWS_SMTP_PASS=...
BEMONEWS_EMAIL_FROM=news@bemo.dev
BEMONEWS_EMAIL_TO=user@example.com
BEMONEWS_SITE_URL=https://news.bemo.dev  # 用于邮件中的链接

# React 前端（构建时）
VITE_API_URL=/api                     # API 基础路径
```

### 5.4 Docker 部署（可选）

```dockerfile
# 多阶段构建
FROM node:20-alpine AS web-builder
WORKDIR /app/web
COPY web/ .
RUN npm ci && npm run build

FROM golang:1.22-alpine AS go-builder
WORKDIR /app/server
COPY server/ .
COPY --from=web-builder /app/web/dist ../web/dist
RUN go build -o bemonews ./cmd/bemonews/

FROM alpine:3.19
WORKDIR /app
COPY --from=go-builder /app/server/bemonews .
EXPOSE 8080
CMD ["./bemonews"]
```

---

## 6. 关键设计决策

### 6.1 为什么前后端分离？

| 考量 | 决策 |
|------|------|
| Go 擅长并发采集和管线处理 | 后端用 Go |
| React 生态丰富，组件化开发效率高 | 前端用 React |
| 单用户 MVP 不需要 SSR/SSG | SPA 足够 |
| 未来可独立扩展前后端 | 清晰的 API 边界 |

### 6.2 为什么文件存储而非数据库？

- 单用户场景，数据量小（每天 ~100 条 item，~20 个 topic）
- JSON 文件可直接阅读和调试
- 无需安装和维护数据库
- 后续迁移到 SQLite 只需替换 Store 实现

### 6.3 为什么进程内 cron 而非外部调度？

- Go 二进制是长驻进程，天然适合内嵌 cron
- 无需额外的 crontab 或 systemd timer 配置
- 失败重试和日志集中管理
- MVP 足够，后续可迁移到外部调度

### 6.4 AI 调用策略

- **MVP 阶段**：只在 topic summarizer 环节调用 AI API
- **噪音过滤**：先用规则（关键词、模式匹配），效果不足再引入 AI
- **Topic 聚合**：先用标题相似度 + 关键词重叠，效果不足再引入 embedding
- **成本控制**：每日 ~20 个 topic，每个 ~200 token input + ~100 token output，日均成本极低

---

## 7. 开发里程碑

| 里程碑 | 内容 | 预估 |
|--------|------|------|
| M1: 骨架就位 | Go 项目 + React 项目 + 类型定义 + API 骨架 | 1 天 |
| M2: 采集跑通 | connector + parser + normalizer + dedupe + 存储 | 2-3 天 |
| M3: 加工跑通 | noise filter + topic cluster + ranker + summarizer + brief builder | 2-3 天 |
| M4: 页面成型 | 所有组件 + 页面路由 + API 联调 | 2-3 天 |
| M5: 推送就绪 | 邮件模板 + 发送 + cron 调度 | 1 天 |
| M6: 端到端验证 | 全链路测试 + 修 bug + 部署 | 1-2 天 |

预估总工期：**10-13 天**（单人全职开发）

---

## 8. 后续演进方向

- **存储升级**：文件 → SQLite → PostgreSQL（按需）
- **缓存层**：Redis 缓存热数据（manifest、最新简报）
- **全文搜索**：历史 topic 搜索
- **订阅系统**：多用户邮件订阅
- **API 开放**：第三方集成
- **多渠道推送**：Slack、Telegram、微信
- **个性化**：用户偏好影响 topic 排序
