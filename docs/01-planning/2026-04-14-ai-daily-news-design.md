---
doc_id: planning-2026-04-14-ai-daily-news-design
title: bemoNews 设计文档
category: planning
status: active
is_iterating: true
updated_at: 2026-05-12
source_path: 01-planning/2026-04-14-ai-daily-news-design.md
related_docs:
  - README.md
  - 00-overview/bemonews-product-overview.md
  - 01-planning/2026-04-14-bemonews-implementation.md
  - 02-technical-design/ai-intelligence-design-system-vercel.md
  - 02-technical-design/ai-intelligence-design-system-vercel-rebuild.md
tags:
  - bemonews
  - planning
  - ai-news
  - information-architecture
  - source-strategy
  - agent-workflow
  - product-design
summary: bemoNews 产品设计文档，描述了信息源架构、双简报模式、页面结构和站点整体设计决策。
---
# bemoNews 设计文档

## 1. 项目概述

**项目名称**：bemoNews

**定位**：一个专注于科技/AI领域的智能日报平台。通过混合信息源获取一线信息，经 AI 过滤噪音和博眼球内容，生成两种不同深度的简报，并为每份简报提供新视角的评论。

**两种简报类型**：

| 类型 | 名称 | 定位 | 采集方式 | 耗时 |
|------|------|------|----------|------|
| 快讯 | `/ai-daily-news` | 3分钟了解今日AI圈动态 | 单线程顺序采集 6 大信源 | ~3-5分钟 |
| 深度情报 | `/ai-intelligence-briefing` | 高端情报产品，交叉验证 | 4路 Agent 并行采集 | ~5-8分钟 |

**核心价值**：
- 真实信息源，无标题党
- AI 评论提供新视角和应用方向分析
- 每日下午 2 点自动更新
- 两种深度满足不同场景需求

---

## 2. 信息源架构

### 2.1 信息源分类

| 类型 | 来源 | 获取方式 | 用途 |
|------|------|----------|------|
| 技术博客 | TechCrunch, MIT Technology Review, The Verge | RSS/API | 快讯+深度 |
| AI/ML 专业源 | OpenAI Blog, Google DeepMind Blog, Anthropic Blog, ArXiv | RSS/API | 快讯+深度 |
| VC/投资视角 | a16z Blog, Sequoia, Y Combinator | RSS/API | 快讯+深度 |
| Newsletter | Lenny's Newsletter, Stratechery, Benedict Evans, The Batch, Import AI, TLDR AI | RSS/API | 快讯+深度 |
| 视频内容 | Bilibili 橘鸦Juya | 平台特定 | 深度 |
| 社交媒体 | X/Twitter（AI High Signal 列表）| MCP（浏览器直接采集）| 深度 |
| 工程博客 | Anthropic Engineering, OpenAI Engineering, Cursor Research Blog, GitHub Engineering Blog | RSS/API | 快讯+深度 |
| 个人博客 | Simon Willison | RSS/API | 快讯+深度 |
| Podcast/音频 | Latent Space, The Rundown AI | RSS/API | 快讯+深度 |
| Hacker News | Hacker News API | API | 快讯+深度 |
| GitHub | GitHub Trending API | API | 快讯+深度 |
| Reddit | WebSearch | 补充 | 深度 |

### 2.2 信息源配置

所有信息源在配置文件中管理，支持增删改：

```typescript
// src/config/sources.ts
export interface SourceConfig {
  name: string
  url: string
  category: Category
  sourceType: SourceType
  enabled: boolean
  reportTypes: ('daily' | 'intelligence')[]  // 适用于哪种简报
}
```

---

## 3. Agent Teams 工作流

### 3.1 快讯模式 (`/ai-daily-news`)

单线程顺序采集，流程简单高效：

```
[Hacker News API] → [GitHub Trending] → [arXiv API] → [Twitter WebSearch] → [媒体 WebSearch] → [Reddit WebSearch]
     ↓                    ↓               ↓              ↓                  ↓                ↓
                              [清洗去重] → [生成 HTML Newsletter]
```

**特点**：
- 6 大信源顺序采集
- 总耗时约 3-5 分钟
- 输出：结构化 HTML

### 3.2 深度情报模式 (`/ai-intelligence-briefing`)

4 路 Agent 并行采集，交叉验证：

```
                          [Team Lead 协调者]
                                    │
        ┌──────────┬──────────┬──────────┬──────────┐
        │          │          │          │          │
    Agent1      Agent2      Agent3      Agent4
    (技术)     (社交)      (媒体)      (学术)
    HN+PH      Twitter     新闻+博客   arXiv+
    +Reddit    浏览器MCP   +Reddit     HuggingFace
```

**关键差异**：
- **Agent2 使用浏览器 MCP**：直接打开 Twitter 页面，JavaScript 读取 DOM 提取推文——像人一样刷 Twitter
- **多信源交叉验证**：同一话题在 2 个以上信源出现会自动标记为 TRENDING
- **重要性分级**：BREAKING → MAJOR → NOTABLE
- 总耗时约 5-8 分钟

### 3.3 共同原则

- **链接优先铁律**：每条内容必须有可点击的原始来源链接，没有链接的内容不允许收录
- **时效性要求**：
  - Twitter 内容限 36 小时内
  - 其他信源限 48 小时内
  - 过时的内容直接丢弃

---

## 4. 简报页面结构

### 4.1 快讯页面结构

```
├── 头条大新闻（Lead Story）
├── 侧栏速递（3-4 条）
├── Twitter 开发者动态（5-8 条推文卡片）
├── GitHub Trending（4-6 个项目卡片）
├── 学术论文（5 篇 arXiv 精选）
├── 行业新闻 + 社区热议（双栏）
└── 页脚（数据源声明）
```

### 4.2 深度情报页面结构

```
├── 头条大新闻（Lead Story）+ TRENDING 标记
├── 重要性分级标签（BREAKING / MAJOR / NOTABLE）
├── Agent1 技术动态（HN + Product Hunt + Reddit）
├── Agent2 社交媒体动态（Twitter 真实采集）
├── Agent3 媒体+博客动态
├── Agent4 学术动态（arXiv + HuggingFace）
├── 交叉验证话题聚合
└── 页脚（数据源声明 + 生成耗时）
```

---

## 5. 网站架构

### 5.1 整体架构

```
HTML 简报文件 → sync 脚本扫描生成 manifest.json → Next.js 构建静态页面
```

### 5.2 核心设计决策

- **iframe 嵌入简报**：简报是独立的 HTML 文件，有自己的 CSS，用 iframe 加载实现完美的样式隔离
- **主题同步**：主站切换亮暗主题时，通过 postMessage 同步到 iframe 内的简报
- **manifest 驱动**：一个 JSON 文件记录所有简报的日期、类型、标题，驱动日历视图和路由生成
- **纯静态导出**：next export 输出纯 HTML/CSS/JS，部署到任意静态托管

### 5.3 视觉风格

Cyberpunk / Terminal 风格：
- 深色背景 + 霓虹绿色调
- 网格效果
- 字体组合：Space Grotesk + Noto Sans SC + JetBrains Mono
- 支持亮色/暗色主题切换

### 5.4 路由结构

```
/                     # 首页，日历视图，展示所有简报
/[year]/[month]/[day] # 特定日期的简报
/manifest.json        # 简报清单
/briefs/
  daily-[date].html   # 快讯 HTML 文件
  intelligence-[date].html  # 深度情报 HTML 文件
```

---

## 6. 数据存储

### 6.1 简报文件

- **快讯**：`/public/briefs/daily-YYYY-MM-DD.html`
- **深度情报**：`/public/briefs/intelligence-YYYY-MM-DD.html`
- **manifest**：`/public/manifest.json`

### 6.2 manifest.json 结构

```json
{
  "briefs": [
    {
      "date": "2026-04-14",
      "type": "daily",
      "title": "AI Daily News - 2026年4月14日",
      "generatedAt": "2026-04-14T14:00:00Z",
      "stats": { "total": 25, "sources": 6 }
    },
    {
      "date": "2026-04-14",
      "type": "intelligence",
      "title": "AI Intelligence Briefing - 2026年4月14日",
      "generatedAt": "2026-04-14T14:05:00Z",
      "stats": { "total": 40, "sources": 8, "trending": 5 }
    }
  ]
}
```

---

## 7. 定时任务

- **触发时间**：每天下午 2:00（本地时间）
- **实现**：Vercel Cron
- **流程**：
  1. 触发 `/api/generate` 端点
  2. 并行生成快讯和深度情报
  3. 保存 HTML 文件到 `/public/briefs/`
  4. 更新 `manifest.json`
  5. 触发 Next.js 重新构建（如需要）

---

## 8. Agent 详细设计

### 8.1 信息源 Agent（每个信息源一个）

- 职责：负责特定信息源的内容抓取、去重、时间过滤
- 去重机制：基于链接或标题，已处理过的跳过
- 时间过滤：Twitter 36 小时，其他 48 小时
- 容错：单源失败不影响整体，失败源记录日志
- 输出：原始文章列表（标题、链接、摘要、来源、时间）

信息源 Agent 列表：
- `BlogAgent` — TechCrunch, MIT Technology Review, The Verge
- `AIResearchAgent` — OpenAI Blog, Google DeepMind Blog, Anthropic Blog, ArXiv
- `VCAgent` — a16z Blog, Sequoia, Y Combinator
- `NewsletterAgent` — Lenny's Newsletter, Stratechery, Benedict Evans, The Batch, Import AI, TLDR AI
- `VideoAgent` — Bilibili 橘鸦Juya
- `XAgent` — X/Twitter AI High Signal 列表（浏览器 MCP）
- `EngineeringAgent` — Anthropic Engineering, OpenAI Engineering, Cursor Research Blog, GitHub Engineering Blog
- `PersonalBlogAgent` — Simon Willison
- `PodcastAgent` — Latent Space, The Rundown AI
- `HNAgent` — Hacker News API
- `GitHubAgent` — GitHub Trending API
- `SearchAgent` — WebSearch 补充热门话题

### 8.2 Team Lead Agent（仅深度情报）

- 职责：协调其他 4 个 Agent，汇总结果，交叉验证
- 输出：带 TRENDING 标记和重要性分级的简报数据

### 8.3 质量过滤 Agent

- 职责：汇总所有信息源内容，过滤噪音、博眼球内容、无价值日常琐事
- 判定标准：
  - 是否为实质性新闻（非标题党）
  - 是否与科技/AI领域相关
  - 是否有一线信息源（非二手转发）
- 输出：过滤后的精选文章列表

### 8.4 AI 评论生成 Agent

- 职责：为每篇精选文章生成评论
- 评论内容：
  - AI 视角分析
  - 潜在应用方向
  - 行业影响评估
- 风格：客观、有深度、不博眼球
- 输出：文章 + AI 评论的结构化数据

### 8.5 内容聚合 Agent

- 职责：将所有内容整理成最终日报格式
- 输出：JSON 格式的日报数据

---

## 9. 扩展计划（后续）

- Agent 推送（Hermes/通讯软件）
- Notion 集成
- API 暴露

---

## 10. 技术约束

- 单用户场景，无需复杂权限系统
- 优先轻量实现，后续按需扩展
- 信息源获取需遵守各平台政策
- 链接优先：无链接内容不允许收录

---

## 11. 第一阶段范围（现在完成）

1. 信息源配置层
2. 快讯简报生成（单线程 6 信源）
3. 深度情报简报生成（4路 Agent 并行）
4. 质量过滤 + AI 评论生成
5. HTML 简报渲染
6. 静态网站 + iframe 嵌入
7. manifest.json 管理
8. 定时任务（CronJob）
