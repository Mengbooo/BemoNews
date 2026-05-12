---
doc_id: planning-2026-04-14-bemonews-implementation
title: bemoNews 实现计划
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/core-plans/bemonews-implementation.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/ai-daily-news-design.md
  - 01-planning/core-plans/bemonews-technical-architecture.md
  - 01-planning/phase1/phase1-information-collection-overview.md
  - 01-planning/phase2/phase2-information-processing-overview.md
  - 01-planning/phase3/phase3-frontend-presentation-overview.md
  - 01-planning/phase4/phase4-proactive-delivery-overview.md
tags:
  - bemonews
  - planning
  - implementation-plan
  - react
  - go
  - four-phase
  - modular-architecture
  - execution
summary: bemoNews 的工程落地计划，按四阶段（收集-加工-展示-推送）拆解任务，前端 React + 后端 Go 架构，对齐 phase 文档和 HTML 设计稿。
---
# bemoNews 实现计划

> **给 agentic workers：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 来逐任务实现此计划。步骤使用复选框（`- [ ]`）语法进行跟踪。

**目标：** 构建 bemoNews 四阶段管线 — 收集信息 → 加工信息 → 前端展示 → 主动推送。核心产物从 `CollectedItem` 到 `ProcessedTopic` 到 `BriefDraft` 到 `DeliveryRun`，各层解耦。

**架构：**
- Phase 1：RSS + API connector 采集 ~20 个信息源，标准化为 `CollectedItem`
- Phase 2：软过滤 → 语义去重 → topic 聚合 → 评分 → 摘要 → 组织 quick/full 两份 `BriefDraft`
- Phase 3：结构化数据驱动页面渲染，报告容器优先
- Phase 4：邮件推送 + 手动触发

**技术栈：** 前端 React (Vite + React Router + Tailwind CSS)，后端 Go (HTTP API + 采集/加工/推送管线 + 定时调度)

**视觉参考：**
- Quick 速报页：`docs/03-assets/design/briefing-page.html`
- Full 详报页：`docs/03-assets/design/detailed-report-page.html`

**技术架构详情：** `01-planning/core-plans/bemonews-technical-architecture.md`

---

## 文件结构

```
/Users/qiumengbo.123/Desktop/bemoNews/
├── server/                              # Go 后端
│   ├── cmd/
│   │   └── bemonews/
│   │       └── main.go                  # 入口：HTTP server + cron scheduler
│   ├── internal/
│   │   ├── api/
│   │   │   ├── router.go                # HTTP 路由注册
│   │   │   ├── handler_briefs.go        # 简报相关 handler
│   │   │   ├── handler_manifest.go      # manifest handler
│   │   │   ├── handler_generate.go      # 触发生成 handler
│   │   │   └── handler_sources.go       # source 管理 handler
│   │   ├── collection/                  # Phase 1：信息收集
│   │   │   ├── orchestrator.go          # 采集编排
│   │   │   ├── connector_rss.go         # 通用 RSS connector
│   │   │   ├── connector_api.go         # 通用 API connector
│   │   │   ├── parser_generic_rss.go    # 通用 RSS 字段映射
│   │   │   ├── parser_hn.go             # Hacker News 字段映射
│   │   │   ├── parser_github.go         # GitHub Trending 字段映射
│   │   │   ├── parser_arxiv.go          # arXiv 字段映射
│   │   │   ├── normalizer.go            # URL/时间/摘要 标准化
│   │   │   ├── validator.go             # 基础校验 + 时间窗口过滤
│   │   │   └── dedupe.go                # 硬去重（canonicalUrl）
│   │   ├── processing/                  # Phase 2：信息加工
│   │   │   ├── orchestrator.go          # 加工编排
│   │   │   ├── noise_filter.go          # 软过滤
│   │   │   ├── topic_cluster.go         # 语义去重 + topic 聚合
│   │   │   ├── topic_ranker.go          # 重要性评分
│   │   │   ├── topic_summarizer.go      # 摘要生成
│   │   │   └── brief_builder.go         # quick/full 双简报组织
│   │   ├── delivery/                    # Phase 4：主动推送
│   │   │   ├── orchestrator.go          # 推送编排
│   │   │   ├── email_composer.go        # 邮件内容生成
│   │   │   └── email_sender.go          # 邮件发送
│   │   ├── store/                       # 数据存储
│   │   │   ├── store.go                 # 存储接口定义
│   │   │   ├── file_store.go            # 文件系统实现
│   │   │   └── source_registry.go       # source 配置管理
│   │   ├── scheduler/
│   │   │   └── cron.go                  # 定时任务调度
│   │   ├── model/
│   │   │   └── types.go                 # 核心数据模型
│   │   └── config/
│   │       ├── config.go                # 应用配置
│   │       └── sources.go               # 首批 ~20 个 source 白名单
│   ├── go.mod
│   └── go.sum
├── web/                                 # React 前端
│   ├── src/
│   │   ├── main.tsx                     # 入口
│   │   ├── App.tsx                      # 路由定义
│   │   ├── index.css                    # 全局样式
│   │   ├── api/
│   │   │   └── client.ts                # API 客户端
│   │   ├── types/
│   │   │   └── index.ts                 # 前端类型定义
│   │   ├── pages/
│   │   │   ├── HomePage.tsx             # 首页：今日入口 + 历史列表
│   │   │   ├── DatePage.tsx             # 日期页：quick/full 入口
│   │   │   ├── QuickBriefPage.tsx       # Quick 速报页
│   │   │   └── FullBriefPage.tsx        # Full 详报页
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Topbar.tsx           # 顶部导航
│   │   │   │   └── Footer.tsx           # 页脚
│   │   │   ├── brief/
│   │   │   │   ├── HeroSection.tsx      # Hero 区域
│   │   │   │   ├── TopicCard.tsx        # topic 摘要卡片
│   │   │   │   ├── CompactStory.tsx     # 侧栏紧凑故事条
│   │   │   │   ├── LeadStory.tsx        # 主故事大卡片
│   │   │   │   └── BriefSection.tsx     # section 分组容器
│   │   │   ├── quick/
│   │   │   │   ├── ExecutiveSnapshot.tsx # 4 卡片快照
│   │   │   │   ├── DecisionSignals.tsx  # 3 列决策信号
│   │   │   │   └── WatchlistActions.tsx # 观察名单 + 行动建议
│   │   │   └── full/
│   │   │       ├── TrendingDiscussions.tsx
│   │   │       ├── CommunityPicks.tsx
│   │   │       ├── IndustryResearch.tsx
│   │   │       ├── NewTools.tsx
│   │   │       ├── CuratedResources.tsx
│   │   │       └── OpenSourceTools.tsx
│   │   └── hooks/
│   │       ├── useBrief.ts              # 加载简报数据
│   │       └── useManifest.ts           # 加载 manifest
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
├── data/                                # 运行时数据存储
│   ├── collected/                       # CollectedItem JSON
│   ├── topics/                          # ProcessedTopic JSON
│   ├── briefs/                          # BriefDraft JSON
│   └── runs/                            # FetchRun/ProcessingRun/DeliveryRun JSON
└── docs/                                # 文档（已有）
```

---

## Phase 1 任务：信息收集

### 任务 1: Go 项目脚手架

**文件：** `server/cmd/bemonews/main.go`, `server/go.mod`, `server/internal/model/types.go`, `server/internal/config/config.go`

- [ ] **步骤 1: 初始化 Go module**

```bash
cd server && go mod init github.com/bemonews/server
```

- [ ] **步骤 2: 创建 main.go**

入口文件：初始化配置 → 初始化存储 → 注册路由 → 启动 cron scheduler → 启动 HTTP server。

- [ ] **步骤 3: 创建 model/types.go**

定义四阶段全部核心 Go struct：`SourceConfig`、`CollectedItem`、`ProcessedTopic`、`BriefDraft`、`DeliveryRun`、`FetchRun`、`ProcessingRun`、`Manifest`。

- [ ] **步骤 4: 创建 config/config.go**

应用配置：server port、data dir、AI API key、SMTP 配置、cron schedule 等。支持环境变量读取。

- [ ] **步骤 5: 提交**

---

### 任务 2: React 项目脚手架

**文件：** `web/package.json`, `web/vite.config.ts`, `web/tailwind.config.ts`, `web/src/index.css`, `web/src/main.tsx`, `web/src/App.tsx`

- [ ] **步骤 1: 创建 Vite + React + TypeScript 项目**

```bash
cd web && npm create vite@latest . -- --template react-ts
```

- [ ] **步骤 2: 安装依赖**

```bash
npm install react-router-dom date-fns
npm install -D tailwindcss postcss autoprefixer @types/react-router-dom
npx tailwindcss init -p
```

- [ ] **步骤 3: 配置 tailwind.config.ts**

对齐 HTML 设计稿的配色和排版体系：bg-primary `#0a0a0a`、border `#27272a`、Inter 字体、10-28px 圆角分层。

- [ ] **步骤 4: 创建 src/index.css**

全局样式：dark 主调、32px 微网格背景、radial-gradient 叠加、Inter 字体栈。

- [ ] **步骤 5: 创建 src/App.tsx**

React Router 路由：`/` → HomePage、`/:date` → DatePage、`/:date/quick` → QuickBriefPage、`/:date/full` → FullBriefPage。

- [ ] **步骤 6: 创建 vite.config.ts**

配置 API proxy 到 Go 后端（开发环境 `localhost:8080`）。

- [ ] **步骤 7: 提交**

---

### 任务 3: 核心类型定义

**文件：** `server/internal/model/types.go`, `web/src/types/index.ts`

- [ ] **步骤 1: 创建 Go 类型（server/internal/model/types.go）**

Go struct 定义所有核心数据模型，json tag 对齐 API 响应。

- [ ] **步骤 2: 创建 TypeScript 类型（web/src/types/index.ts）**

前端 TypeScript interface，与 Go API 响应一致。

- [ ] **步骤 3: 提交**

---

### 任务 4: Source 配置

**文件：** `server/internal/config/sources.go`, `server/internal/store/source_registry.go`

- [ ] **步骤 1: 创建 config/sources.go**

首批 ~20 个 source 白名单，Go 结构体切片。分 6 组：official-blog (4)、research (3)、engineering (4)、community (2)、media (4)、newsletter (3)。

- [ ] **步骤 2: 创建 store/source_registry.go**

source 查询方法：GetEnabledSources、GetSourceByID、GetSourcesByCategory、GetSourcesByType。

- [ ] **步骤 3: 提交**

---

### 任务 5: 通用 Connectors

**文件：** `server/internal/collection/connector_rss.go`, `server/internal/collection/connector_api.go`

- [ ] **步骤 1: 创建 connector_rss.go**

通用 RSS 拉取：使用 `gofeed` 库解析 RSS/Atom，返回原始 feed items。

- [ ] **步骤 2: 创建 connector_api.go**

通用 API 请求：HTTP GET + JSON 解码，返回 `json.RawMessage`。

- [ ] **步骤 3: 提交**

---

### 任务 6: Source Parsers

**文件：** `server/internal/collection/parser_generic_rss.go`, `server/internal/collection/parser_hn.go`, `server/internal/collection/parser_github.go`, `server/internal/collection/parser_arxiv.go`

每个 parser 将原始返回值映射为 `CollectedItem` 草稿。

- [ ] **步骤 1: 创建 parser_generic_rss.go** — 通用 RSS/Atom 字段映射
- [ ] **步骤 2: 创建 parser_hn.go** — Hacker News hits → CollectedItem
- [ ] **步骤 3: 创建 parser_github.go** — GitHub search results → CollectedItem
- [ ] **步骤 4: 创建 parser_arxiv.go** — arXiv XML entries → CollectedItem
- [ ] **步骤 5: 提交**

---

### 任务 7: Normalizer + Validator + Dedupe

**文件：** `server/internal/collection/normalizer.go`, `server/internal/collection/validator.go`, `server/internal/collection/dedupe.go`

- [ ] **步骤 1: 创建 normalizer.go**

统一 URL 格式、日期格式、摘要截断，生成 canonicalUrl 和 dedupeKey。

- [ ] **步骤 2: 创建 validator.go**

基础校验（title/url 必填）+ 时间窗口过滤（默认 48h），标记 invalid 及原因。

- [ ] **步骤 3: 创建 dedupe.go**

基于 canonicalUrl 硬去重，标记 duplicate。

- [ ] **步骤 4: 提交**

---

### 任务 8: 文件存储层

**文件：** `server/internal/store/store.go`, `server/internal/store/file_store.go`

- [ ] **步骤 1: 创建 store.go**

存储接口定义：SaveCollectedItems、GetCollectedItems、SaveTopics、GetTopics、SaveBriefDraft、GetBriefDraft、SaveManifest、GetManifest 等。

- [ ] **步骤 2: 创建 file_store.go**

文件系统实现：JSON 文件读写，按日期和类型组织目录。

- [ ] **步骤 3: 提交**

---

### 任务 9: Fetch Orchestrator

**文件：** `server/internal/collection/orchestrator.go`

- [ ] **步骤 1: 创建 orchestrator.go**

编排一次完整采集：遍历启用 source → 按 type 分发到 connector → parser 转换 → normalizer → validator → dedupe → store。记录 FetchRun。支持并发采集。

- [ ] **步骤 2: 提交**

---

## Phase 2 任务：信息加工

### 任务 10: Noise Filter

**文件：** `server/internal/processing/noise_filter.go`

- [ ] **步骤 1: 创建 noise_filter.go**

软过滤规则：广告/促销、纯预告、标题党模式、偏离主题、信息密度过低。输出保留项和丢弃原因。

- [ ] **步骤 2: 提交**

---

### 任务 11: Topic Clustering + Semantic Dedupe

**文件：** `server/internal/processing/topic_cluster.go`

- [ ] **步骤 1: 创建 topic_cluster.go**

1. 语义级去重：标题相似度 + 关键词重叠 + 时间接近 + 引用同源
2. 聚合成 ProcessedTopic 草稿：主标题、主链接、所属 items
3. 标记 isCrossSourceConfirmed（多 source 交叉印证）
4. 记录 duplicateGroupSize

- [ ] **步骤 2: 提交**

---

### 任务 12: Topic Ranker + Summarizer

**文件：** `server/internal/processing/topic_ranker.go`, `server/internal/processing/topic_summarizer.go`

- [ ] **步骤 1: 创建 topic_ranker.go**

轻量评分维度：cross-source、source credibility、novelty、richness、theme relevance。输出 high/medium/low 及各维度分数。

- [ ] **步骤 2: 创建 topic_summarizer.go**

调用 AI API（OpenAI/Anthropic）为每个 topic 生成简短中性摘要。

- [ ] **步骤 3: 提交**

---

### 任务 13: Brief Builder + Processing Orchestrator

**文件：** `server/internal/processing/brief_builder.go`, `server/internal/processing/orchestrator.go`

- [ ] **步骤 1: 创建 brief_builder.go**

从同一批 ProcessedTopic 组织两份 BriefDraft：

**Quick** sections（对齐 `briefing-page.html`）：
- `executive-snapshot`：4 条最高优 topic
- `top-brief`：1 条 lead + 3 条 compact
- `decision-signals`：what-changed / why-matters / what-to-do
- `watchlist`：观察变量

**Full** sections（对齐 `detailed-report-page.html`）：
- `top-stories`：lead + 5 条 compact
- `trending-discussions`：community 类
- `community-picks`：media/newsletter 精选
- `industry-research`：research + engineering 类
- `new-tools`：工具类
- `curated-resources`：按分类聚合
- `open-source`：开源项目

- [ ] **步骤 2: 创建 orchestrator.go**

编排完整加工：读取 ready items → noise filter → topic cluster → ranker → summarizer → brief builder。记录 ProcessingRun。

- [ ] **步骤 3: 提交**

---

## Phase 3 任务：前端展示

### 任务 14: API 客户端 + Hooks

**文件：** `web/src/api/client.ts`, `web/src/hooks/useManifest.ts`, `web/src/hooks/useBrief.ts`

- [ ] **步骤 1: 创建 api/client.ts**

封装 API 请求：getManifest、getBrief(date, type)、triggerGenerate。

- [ ] **步骤 2: 创建 hooks/useManifest.ts**

获取 manifest 列表，驱动首页。

- [ ] **步骤 3: 创建 hooks/useBrief.ts**

按日期和类型加载 BriefDraft + ProcessedTopic。

- [ ] **步骤 4: 提交**

---

### 任务 15: Go API 路由

**文件：** `server/internal/api/router.go`, `server/internal/api/handler_*.go`

- [ ] **步骤 1: 创建 router.go**

注册路由：`GET /api/manifest`、`GET /api/briefs/:date/:type`、`POST /api/generate`、`GET /api/sources`。

- [ ] **步骤 2: 创建 handler_manifest.go**

返回 manifest JSON。

- [ ] **步骤 3: 创建 handler_briefs.go**

返回指定日期和类型的 BriefDraft + 关联 ProcessedTopic。

- [ ] **步骤 4: 创建 handler_generate.go**

触发全链路生成（Phase 1-4）。

- [ ] **步骤 5: 创建 handler_sources.go**

返回 source 列表和状态。

- [ ] **步骤 6: 提交**

---

### 任务 16: 布局与共用组件

**文件：** `web/src/components/layout/Topbar.tsx`, `web/src/components/layout/Footer.tsx`, `web/src/components/brief/HeroSection.tsx`, `web/src/components/brief/TopicCard.tsx`, `web/src/components/brief/CompactStory.tsx`, `web/src/components/brief/LeadStory.tsx`, `web/src/components/brief/BriefSection.tsx`

所有组件对齐 HTML 设计稿的视觉语言：pill 标签、card 样式、grid 布局、responsive 断点。

- [ ] **步骤 1: 创建 Topbar.tsx** — 品牌标记 + 导航 + Subscribe 按钮
- [ ] **步骤 2: 创建 Footer.tsx** — 品牌 + 说明 + 社交链接
- [ ] **步骤 3: 创建 HeroSection.tsx** — 共用 Hero：eyebrow、大标题、导语、元信息
- [ ] **步骤 4: 创建 TopicCard.tsx** — topic 摘要卡片
- [ ] **步骤 5: 创建 CompactStory.tsx** — 紧凑故事条
- [ ] **步骤 6: 创建 LeadStory.tsx** — 主故事大卡片
- [ ] **步骤 7: 创建 BriefSection.tsx** — section 分组容器
- [ ] **步骤 8: 提交**

---

### 任务 17: Quick 速报页专属组件

**文件：** `web/src/components/quick/ExecutiveSnapshot.tsx`, `web/src/components/quick/DecisionSignals.tsx`, `web/src/components/quick/WatchlistActions.tsx`

- [ ] **步骤 1: 创建 ExecutiveSnapshot.tsx** — 4 列 Thesis/Market/Watch/Action
- [ ] **步骤 2: 创建 DecisionSignals.tsx** — 3 列 What Changed/Why/What To Do
- [ ] **步骤 3: 创建 WatchlistActions.tsx** — 2 列 Watchlist + Next Actions
- [ ] **步骤 4: 提交**

---

### 任务 18: Full 详报页专属组件

**文件：** `web/src/components/full/*.tsx`

- [ ] **步骤 1: 创建 TrendingDiscussions.tsx** — 3 列讨论网格
- [ ] **步骤 2: 创建 CommunityPicks.tsx** — 4 列媒体卡片
- [ ] **步骤 3: 创建 IndustryResearch.tsx** — 双栏行业列表
- [ ] **步骤 4: 创建 NewTools.tsx** — 4 列工具卡片
- [ ] **步骤 5: 创建 CuratedResources.tsx** — 4x2 资源卡片
- [ ] **步骤 6: 创建 OpenSourceTools.tsx** — 2x3 开源项目
- [ ] **步骤 7: 提交**

---

### 任务 19: 页面路由

**文件：** `web/src/pages/HomePage.tsx`, `web/src/pages/DatePage.tsx`, `web/src/pages/QuickBriefPage.tsx`, `web/src/pages/FullBriefPage.tsx`

- [ ] **步骤 1: 创建 HomePage.tsx** — 今日入口 + 历史报告列表（manifest 驱动）
- [ ] **步骤 2: 创建 DatePage.tsx** — 该日 quick/full 入口 + 摘要统计
- [ ] **步骤 3: 创建 QuickBriefPage.tsx** — 组装 Quick 速报全部 section
- [ ] **步骤 4: 创建 FullBriefPage.tsx** — 组装 Full 详报全部 section
- [ ] **步骤 5: 提交**

---

## Phase 4 任务：主动推送

### 任务 20: 邮件推送

**文件：** `server/internal/delivery/orchestrator.go`, `server/internal/delivery/email_composer.go`, `server/internal/delivery/email_sender.go`

- [ ] **步骤 1: 创建 email_composer.go** — 生成邮件 HTML：lead topic + 重点摘要 + 报告链接
- [ ] **步骤 2: 创建 email_sender.go** — SMTP 发送
- [ ] **步骤 3: 创建 orchestrator.go** — 编排推送：加载 BriefDraft → 组装邮件 → 发送 → 记录 DeliveryRun
- [ ] **步骤 4: 提交**

---

### 任务 21: 定时调度

**文件：** `server/internal/scheduler/cron.go`

- [ ] **步骤 1: 创建 cron.go**

使用 `robfig/cron` 库，注册每日 14:00 全链路任务：Phase 1 采集 → Phase 2 加工 → 更新 manifest → Phase 4 推送。

- [ ] **步骤 2: 提交**

---

## 集成与验证

### 任务 22: 全链路编排

**文件：** `server/internal/api/handler_generate.go`（已在任务 15 创建，此处完善全链路逻辑）

- [ ] **步骤 1: 完善 handler_generate.go**

全链路：Phase 1 → Phase 2 → 更新 manifest → Phase 4（可选）。支持 query param 控制是否推送。

- [ ] **步骤 2: 提交**

---

### 任务 23: 验证和构建

- [ ] **步骤 1: Go 编译** — `cd server && go build ./cmd/bemonews/`
- [ ] **步骤 2: 前端构建** — `cd web && npm run build`
- [ ] **步骤 3: 本地联调** — 启动 Go server + Vite dev server，验证各路由
- [ ] **步骤 4: 试采集** — `curl -X POST localhost:8080/api/generate?sources=hn`
- [ ] **步骤 5: 全链路** — `curl -X POST localhost:8080/api/generate`
- [ ] **步骤 6: 最终提交**

---

## 需求覆盖检查

| Phase 文档需求 | 对应任务 |
|----------------|----------|
| Phase 1: ~20 source 白名单 | 任务 4 |
| Phase 1: RSS + API connector | 任务 5 |
| Phase 1: parser 轻量适配 | 任务 6 |
| Phase 1: normalizer + validator + dedupe | 任务 7 |
| Phase 1: fetch orchestrator | 任务 9 |
| Phase 1: source 状态追踪 | 任务 4, 8 |
| Phase 2: soft filter | 任务 10 |
| Phase 2: semantic dedupe + topic cluster | 任务 11 |
| Phase 2: importance scoring | 任务 12 |
| Phase 2: summary generation | 任务 12 |
| Phase 2: quick/full brief shaping | 任务 13 |
| Phase 3: API 接口 | 任务 15 |
| Phase 3: manifest 驱动 | 任务 14, 15 |
| Phase 3: 结构化数据渲染 | 任务 14, 19 |
| Phase 3: quick 页面（对齐 briefing-page.html）| 任务 17, 19 |
| Phase 3: full 页面（对齐 detailed-report-page.html）| 任务 18, 19 |
| Phase 3: 路由 /[date]/quick, /[date]/full | 任务 2, 19 |
| Phase 3: 视觉风格对齐设计稿 | 任务 2 (CSS), 16-18 |
| Phase 4: 邮件推送 | 任务 20 |
| Phase 4: 定时调度 | 任务 21 |
| Phase 4: 手动触发 | 任务 15, 22 |
| Phase 4: delivery 状态追踪 | 任务 20 |

---

## 执行方式

**推荐：Subagent-Driven Development** — 每个任务派一个 subagent 执行，任务间有 review checkpoint，快速迭代。

**备选：Inline Execution** — 在当前 session 中按任务顺序执行，定期 checkpoint review。

建议按 Phase 顺序推进：先完成 Phase 1 端到端验证，再推进 Phase 2，依此类推。Go 后端和 React 前端可以在 Phase 3 阶段并行开发（先完成 API 接口定义，再分头实现）。
