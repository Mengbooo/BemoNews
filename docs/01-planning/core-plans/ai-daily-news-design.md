---
doc_id: planning-2026-04-14-ai-daily-news-design
title: bemoNews 设计文档
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/core-plans/ai-daily-news-design.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/core-plans/bemonews-implementation.md
  - 01-planning/core-plans/bemonews-technical-architecture.md
  - 01-planning/phase1/phase1-information-collection-overview.md
  - 01-planning/phase2/phase2-information-processing-overview.md
  - 01-planning/phase3/phase3-frontend-presentation-overview.md
  - 01-planning/phase4/phase4-proactive-delivery-overview.md
tags:
  - bemonews
  - planning
  - ai-news
  - information-architecture
  - source-strategy
  - four-phase
  - product-design
summary: bemoNews 产品设计文档，描述了四阶段架构（收集-加工-展示-推送）、信息源策略、页面设计和核心数据模型。
---
# bemoNews 设计文档

## 1. 项目概述

**项目名称**：bemoNews

**定位**：一个专注于科技/AI领域的智能日报平台。通过白名单信息源获取一线信息，经多层加工管线过滤噪音，生成两种不同深度的简报，以"报告容器"而非"资讯门户"的形态呈现。

**两种简报类型**：

| 类型 | 路由 | 定位 | 内容策略 |
|------|------|------|----------|
| Quick 速报 | `/[date]/quick` | 4 分钟掌握今日主线 | 少量高优先级 topic，强调判断和结论 |
| Full 详报 | `/[date]/full` | 完整信息巡检 | 更多 topic，覆盖全部分类 |

两种简报共享同一批 `ProcessedTopic`，只是取舍和编排不同。

**核心价值**：
- 白名单信源，无标题党
- 话题聚合（topic）替代文章列表，降噪增密
- 轻量评分与排序，不替用户做决定
- 每日定时生成 + 随时手动触发
- 邮件推送建立稳定信息节奏

**视觉参考**：
- Quick 速报页设计：`docs/03-assets/design/briefing-page.html`
- Full 详报页设计：`docs/03-assets/design/detailed-report-page.html`

---

## 2. 四阶段架构总览

```
Phase 1          Phase 2              Phase 3             Phase 4
信息收集    →    信息加工      →      前端展示      →     主动推送
RSS + API       软过滤/聚合/评分     报告容器渲染        邮件送达
    ↓                ↓                   ↓                  ↓
CollectedItem → ProcessedTopic →    BriefDraft →      DeliveryRun
               + BriefDraft         渲染为页面          邮件摘要
```

每个阶段有明确的输入输出边界，后续阶段只消费前一阶段的产出，不反向耦合。

---

## 3. 信息源架构（Phase 1）

### 3.1 内容分组

首批信息源分为 6 组，约 20 个：

| 分组 | 代表来源 | 数量 |
|------|----------|------|
| `official-blog` | OpenAI Blog, Anthropic News, Google DeepMind Blog, Hugging Face Blog | 4 |
| `research` | arXiv cs.AI, arXiv cs.LG, arXiv cs.CL | 3 |
| `engineering` | GitHub Engineering, Anthropic Engineering, OpenAI Engineering, Cursor Blog | 4 |
| `community` | Hacker News API, GitHub Trending API | 2 |
| `media` | MIT Technology Review, TechCrunch, The Verge, VentureBeat | 4 |
| `newsletter` | Import AI, The Batch, TLDR AI | 3 |

### 3.2 采集方式

MVP 仅支持两类 connector：
- `rss` — 通用 RSS 拉取与解析
- `api` — 通用 API 请求适配（HN、GitHub Trending 等）

不做 Twitter MCP、浏览器抓取等复杂采集方式。

### 3.3 信息源配置

所有信息源按可管理对象设计，支持 CRUD、启停、状态查看、试采集：

```typescript
interface SourceConfig {
  id: string
  name: string
  type: 'rss' | 'api'
  url: string
  category: ContentGroup
  enabled: boolean
  priority: number
  fetchIntervalMinutes: number
  timeWindowHours: number       // 默认 48
  parserType: string
  lastFetchedAt?: string
  lastStatus?: 'success' | 'failed'
  lastItemCount?: number
  lastErrorMessage?: string
}

type ContentGroup =
  | 'official-blog'
  | 'research'
  | 'engineering'
  | 'community'
  | 'media'
  | 'newsletter'
```

### 3.4 采集层职责边界

**负责**：管理源配置、触发采集、解析原始内容、标准化为统一结构、基础校验、硬去重、记录采集日志

**不负责**：判断内容是否重要、AI 总结/评论、语义级去重、最终排序

### 3.5 采集层模块拆解

```
source-registry        → 管理 source 配置
fetch-orchestrator     → 触发和编排采集任务
connectors/rss         → 通用 RSS 拉取
connectors/api         → 通用 API 请求
parsers/*              → source 特定字段映射
normalizers            → 统一字段格式、生成 canonicalUrl/dedupeKey
validators             → 基础校验、时间窗口过滤
dedupe                 → 硬去重（基于 canonicalUrl）
collection-store       → 写入 CollectedItem、更新采集状态
test-fetch             → 单个 source 试采集
```

---

## 4. 信息加工链路（Phase 2）

### 4.1 核心思路

将"文章列表思维"切换为"话题单元思维"。用户关心的是"今天发生了哪些值得知道的事"，不是看了多少篇文章。核心产物是 `ProcessedTopic`，不是单条文章。

### 4.2 六步处理链路

```
CollectedItem(ready) → Soft Filter → Semantic Dedupe → Topic Clustering
                                                            ↓
                    BriefDraft(quick/full) ← Brief Shaping ← Importance Scoring + Summary Generation
```

1. **Soft Filter** — 过滤广告、促销、纯预告、标题党、偏离主题的内容
2. **Semantic Dedupe** — 合并标题相似、引用同一来源、发布时间接近的重复报道
3. **Topic Clustering** — 将相关 item 聚成 topic，形成"今天这件事"的最小表达单元
4. **Importance Scoring** — 轻量评分：cross-source、credibility、novelty、richness、theme relevance → 输出 `high` / `medium` / `low`
5. **Summary Generation** — 为每个 topic 生成简短、中性、可读的摘要
6. **Brief Shaping** — 同一批 topic 组织成 quick 和 full 两份草稿

### 4.3 Quick vs Full 口径

| 维度 | Quick | Full |
|------|-------|------|
| 定位 | 快速判断今天有没有大事 | 完整信息巡检 |
| Topic 数量 | 少量 high + 较强 medium | 更多，含部分 low |
| Section 粒度 | 紧凑 | 细分 |
| 适合场景 | 碎片时间、摸鱼、通勤 | 集中阅读、每日巡检 |

### 4.4 加工层职责边界

**负责**：软过滤、语义去重、话题聚合、轻量评分、摘要生成、双简报组织

**不负责**：页面布局、邮件发送、个性化推荐、强结论评论、趋势预测

---

## 5. 页面设计（Phase 3）

### 5.1 定位

MVP 是"报告容器"，不是"资讯门户"。优先让用户快速进入今天的内容，回看历史足够顺滑。

### 5.2 Quick 速报页结构

视觉参考：`docs/03-assets/design/briefing-page.html`

```
├── Topbar（品牌 + 导航 + 操作按钮）
├── Hero 区域
│   ├── 日期与简报类型标识
│   ├── 主标题（当日主判断）
│   ├── 导语摘要（当日主线概述）
│   ├── 操作按钮（Read brief / Open archive）
│   ├── 元信息（更新时间、信源数、阅读时长、置信度）
│   └── 右侧面板（Today's Readout 统计卡片）
├── Executive Snapshot（4 卡片）
│   ├── Thesis — 当日核心判断
│   ├── Market — 市场信号
│   ├── Watch — 关注点
│   └── Action — 行动建议
├── Top Brief（主故事 + 侧栏速递）
│   ├── Lead Story（大卡片，含 key points 和来源验证信息）
│   └── Compact Stories（3 条辅助动态）
├── Decision Signals（3 列）
│   ├── What Changed
│   ├── Why It Matters
│   └── What To Do
├── Watchlist & Next Moves（2 列）
│   ├── Watchlist（72h 观察变量，2x2 网格）
│   └── Next Actions（产品迭代建议列表）
├── CTA（订阅区域）
└── Footer
```

### 5.3 Full 详报页结构

视觉参考：`docs/03-assets/design/detailed-report-page.html`

```
├── Topbar（品牌 + 导航 + 操作按钮）
├── Hero 区域
│   ├── 日期标识
│   ├── 主标题
│   ├── 导语
│   ├── 操作按钮（Subscribe / Read latest）
│   ├── 元信息
│   └── 右侧装饰面板
├── Top Stories（主故事 + 侧栏列表）
│   ├── Lead Story（大卡片，含 pill 标签和视觉区域）
│   └── Compact List（5 条次要故事，带图标标记）
├── Trending Discussions（3 列 x 2 行）
│   └── 每条含：来源、标题、描述、互动数据
├── Community Picks（4 列媒体卡片）
│   └── 每条含：缩略图、类型/时长、标题、来源
├── Industry & Research（双栏列表）
│   └── 每条含：标题、来源、时间
├── New Tools（4 列工具卡片）
│   └── 每条含：图标、名称、描述、标签
├── Curated Resources（4 列 x 2 行资源卡片）
│   └── 每条含：分类名、描述、数量
├── Open Source & Tools（2 列 x 3 行）
│   └── 每条含：图标、名称、描述
├── CTA（订阅区域）
└── Footer
```

### 5.4 视觉设计语言

基于两个 HTML 设计稿的统一风格：

- **色彩体系**：深色主调（`#0a0a0a`），白色文字，灰色层级（`#111111` / `#171717` / `#1c1c1e`）
- **排版**：Inter / SF Pro Display / PingFang SC，大标题负字间距
- **边框**：`#27272a` 实线 + `rgba(255,255,255,0.08)` 微透明
- **圆角**：10px-28px 分层
- **背景网格**：32px 间距微网格叠加，mask 渐淡
- **卡片**：深色底 + 微渐变 + 1px 边框，hover 无过度动效
- **标签 (pill)**：圆角 999px，11px 大写字母，微透明背景
- **品牌标记**：三角形 clip-path，渐变白色

---

## 6. 网站架构

### 6.1 路由结构

```
/                     # 首页：今日入口 + 历史报告列表
/[date]               # 日期页：该日 quick/full 入口
/[date]/quick         # Quick 速报
/[date]/full          # Full 详报
```

### 6.2 渲染策略

**结构化数据驱动页面渲染**：
- 页面消费 `BriefDraft` + `ProcessedTopic`
- 组件负责渲染
- HTML 只是输出形式之一

不以 HTML 文件作为唯一中间产物，避免内容判断和展示表现耦合。

### 6.3 Manifest 角色

manifest 是目录，不是正文：
- 记录有哪些报告
- 提供日期、类型、标题、生成时间、统计信息
- 驱动首页和历史列表

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
        "crossSourceTopics": 3
      }
    }
  ]
}
```

### 6.4 前端模块拆解

```
manifest-reader    → 读取报告索引
brief-resolver     → 按日期和类型读取 BriefDraft + ProcessedTopic
home-page          → 首页容器
brief-page         → 报告页容器（承载 quick/full 切换）
topic-card         → topic 摘要卡片组件
brief-section      → section 分组组件
brief-renderer     → 将结构化数据渲染为页面
```

---

## 7. 核心数据模型

### 7.1 CollectedItem（Phase 1 输出）

```typescript
type ItemStatus = 'ready' | 'invalid' | 'duplicate'

interface CollectedItem {
  id: string
  sourceId: string
  title: string
  canonicalUrl: string
  summary: string
  author?: string
  publishedAt: string
  fetchedAt: string
  category: ContentGroup
  dedupeKey: string
  status: ItemStatus
  invalidReason?: string
}
```

### 7.2 ProcessedTopic（Phase 2 核心产物）

```typescript
type ImportanceLevel = 'high' | 'medium' | 'low'
type TopicStatus = 'selected' | 'discarded'

interface ProcessedTopic {
  id: string
  processingRunId: string
  title: string
  canonicalUrl: string
  summary: string
  sourceIds: string[]
  itemIds: string[]
  primaryCategory: ContentGroup
  tags: string[]
  publishedAt: string
  importance: ImportanceLevel
  noveltyScore: number
  credibilityScore: number
  richnessScore: number
  duplicateGroupSize: number
  isCrossSourceConfirmed: boolean
  status: TopicStatus
  discardReason?: string
}
```

### 7.3 BriefDraft（Phase 2 最终输出）

```typescript
type BriefType = 'quick' | 'full'

interface BriefDraftSection {
  key: string
  title: string
  topicIds: string[]
}

interface BriefDraft {
  id: string
  processingRunId: string
  type: BriefType
  date: string
  leadTopicId?: string
  topicIds: string[]
  sections: BriefDraftSection[]
  stats: {
    inputItems: number
    selectedTopics: number
    droppedItems: number
    crossSourceTopics: number
  }
}
```

### 7.4 DeliveryRun（Phase 4）

```typescript
type DeliveryTrigger = 'scheduled' | 'manual' | 'retry'
type DeliveryStatus = 'running' | 'success' | 'partial' | 'failed'

interface DeliveryRun {
  id: string
  triggerType: DeliveryTrigger
  channel: 'email'
  date: string
  status: DeliveryStatus
  startedAt: string
  endedAt?: string
  recipientCount: number
  successCount: number
  failureCount: number
  briefDraftId?: string
  landingUrl?: string
  errorMessage?: string
}
```

---

## 8. 主动推送（Phase 4）

### 8.1 目标

- **定时送达**：每天固定时间把当天报告送到邮箱
- **即时可取**：随时通过命令手动生成最新报告

### 8.2 邮件内容策略

邮件承载 quick 风格摘要，提供 full 报告入口链接：

- 日期
- 今日 lead topic
- 3-5 条重点 topic 摘要
- Full 报告入口链接
- Quick 报告入口链接（可选）

邮件不承载完整报告正文，把完整阅读体验留给前端。

### 8.3 触发方式

| 方式 | 用途 |
|------|------|
| Scheduled | 每天固定时间自动触发 |
| Manual | 临时查看、重跑、调试、漏发补发 |

### 8.4 失败处理

- 发送失败记录错误
- 支持查看最近失败原因
- 支持手动重试
- 生成成功但发送失败时，不必重新加工

---

## 9. 定时任务

- **触发时间**：每天下午 2:00（本地时间）
- **完整流程**：
  1. Phase 1：触发全部启用 source 采集
  2. Phase 2：加工为 ProcessedTopic，组织为 BriefDraft(quick/full)
  3. Phase 3：渲染页面、更新 manifest
  4. Phase 4：生成邮件摘要、发送
- **手动触发**：支持通过命令或 API 随时执行上述完整链路

---

## 10. 技术约束

- 单用户场景，无需复杂权限系统
- 优先轻量实现，后续按需扩展
- 信息源获取遵守各平台政策
- 链接优先：无链接内容不允许收录
- MVP 信息源仅限 RSS + API，不做平台型抓取
- 加工层只做轻量判断，不做强结论评论

---

## 11. 实现范围

按 4 个 Phase 分阶段落地：

| Phase | 范围 | 核心产物 |
|-------|------|----------|
| Phase 1 信息收集 | source 配置、connector、parser、normalizer、validator、dedupe | `CollectedItem` |
| Phase 2 信息加工 | noise-filter、topic-cluster、ranker、summarizer、brief-builder | `ProcessedTopic` + `BriefDraft` |
| Phase 3 前端展示 | 首页、日期页、quick/full 报告页、组件库 | 可浏览的报告容器 |
| Phase 4 主动推送 | email-composer、sender、delivery tracking、manual trigger | `DeliveryRun` |

详细工程实现步骤参见：`01-planning/core-plans/bemonews-implementation.md`
技术架构方案参见：`01-planning/core-plans/bemonews-technical-architecture.md`
