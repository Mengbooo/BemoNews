# bemoNews 实现计划

> **给 agentic workers：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 来逐任务实现此计划。步骤使用复选框（`- [ ]`）语法进行跟踪。

**目标：** 构建 bemoNews 核心架构 — 支持两种简报（快讯 + 深度情报），HTML 文件通过 iframe 嵌入静态站，manifest.json 驱动导航。

**架构：**
- 两种简报：快讯（单线程 6 信源） + 深度情报（4路 Agent 并行）
- HTML 简报独立文件，iframe 嵌入主站
- manifest.json 记录所有简报元数据
- 静态导出，部署到任意托管

**技术栈：** Next.js 14 (App Router), Tailwind CSS, Vercel AI SDK, node-cron, 静态文件存储

---

## 文件结构

```
/Users/qiumengbo.123/Desktop/bemoNews/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局，主题切换
│   │   ├── page.tsx                # 首页，日历视图
│   │   ├── [date]/page.tsx         # 特定日期简报
│   │   ├── globals.css             # 全局样式 + Tailwind
│   │   └── api/
│   │       └── generate/route.ts   # 触发生成 API
│   ├── components/
│   │   ├── Calendar.tsx            # 日历视图组件
│   │   ├── BriefCard.tsx           # 简报卡片
│   │   ├── ThemeToggle.tsx         # 主题切换
│   │   └── IframeViewer.tsx        # iframe 简报查看器
│   ├── lib/
│   │   ├── types.ts                # 类型定义
│   │   ├── manifest.ts             # manifest.json 读写
│   │   └── storage.ts              # 文件存储工具
│   ├── agents/
│   │   ├── index.ts               # Agent 入口
│   │   ├── base.ts                # 基础 Agent 类
│   │   ├── sources/               # 信息源 Agents
│   │   │   ├── rss.ts            # RSS 采集基类
│   │   │   ├── hn.ts             # Hacker News API
│   │   │   ├── github.ts         # GitHub Trending
│   │   │   ├── arxiv.ts          # arXiv API
│   │   │   ├── twitter.ts        # Twitter MCP
│   │   │   └── websearch.ts      # WebSearch
│   │   ├── quality-filter.ts     # 质量过滤
│   │   ├── ai-comment.ts         # AI 评论生成
│   │   └── html-generator.ts     # HTML 简报生成
│   ├── brief-templates/
│   │   ├── daily.css             # 快讯样式（Cyberpunk 风格）
│   │   ├── daily-template.ts     # 快讯 HTML 模板
│   │   ├── intelligence.css      # 深度情报样式
│   │   └── intelligence-template.ts
│   └── cron/
│       └── generate.ts           # Cron 任务
├── public/
│   ├── briefs/                   # HTML 简报输出
│   │   ├── daily-2026-04-14.html
│   │   └── intelligence-2026-04-14.html
│   └── manifest.json             # 简报清单
├── scripts/
│   └── sync-manifest.ts         # 同步 manifest 脚本
├── tailwind.config.ts
├── next.config.js
├── package.json
└── vercel.json
```

---

## 任务 1: 项目脚手架

**文件：**
- 创建: `package.json`
- 创建: `next.config.js`
- 创建: `tailwind.config.ts`
- 创建: `tsconfig.json`
- 创建: `src/app/globals.css`
- 创建: `vercel.json`

- [ ] **步骤 1: 创建 package.json**

```json
{
  "name": "bemonews",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "generate": "tsx src/cron/generate.ts",
    "sync": "tsx scripts/sync-manifest.ts"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^0.0.0",
    "rss-parser": "^3.13.0",
    "node-cron": "^3.0.3",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "tsx": "^4.7.0"
  }
}
```

- [ ] **步骤 2: 创建 next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig
```

- [ ] **步骤 3: 创建 tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          green: '#00ff88',
          purple: '#a855f7',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        noto: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **步骤 4: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **步骤 5: 创建 src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --color-bg: #0a0a0f;
  --color-green: #00ff88;
  --color-purple: #a855f7;
}

.dark {
  --color-bg: #0a0a0f;
  --color-green: #00ff88;
}

.light {
  --color-bg: #fafafa;
  --color-green: #00cc6a;
}

body {
  @apply bg-cyber-bg text-white font-space;
}
```

- [ ] **步骤 6: 创建 vercel.json**

```json
{
  "crons": [
    {
      "path": "/api/generate",
      "schedule": "0 14 * * *"
    }
  ]
}
```

- [ ] **步骤 7: 提交**

```bash
git init
git add package.json next.config.js tailwind.config.ts tsconfig.json vercel.json src/app/globals.css
git commit -m "feat: scaffold Next.js project"
```

---

## 任务 2: 类型定义和配置

**文件：**
- 创建: `src/lib/types.ts`
- 创建: `src/config/sources.ts`

- [ ] **步骤 1: 创建 src/lib/types.ts**

```typescript
export type ReportType = 'daily' | 'intelligence'

export type ImportanceLevel = 'BREAKING' | 'MAJOR' | 'NOTABLE'

export interface Article {
  id: string
  title: string
  link: string
  summary: string
  source: string
  sourceType: SourceType
  publishedAt: Date
  category: Category
}

export type SourceType = 'hn' | 'github' | 'arxiv' | 'twitter' | 'rss' | 'websearch'

export type Category = '全部' | 'AI' | '科技' | 'VC' | '行业' | '开发者'

export interface AIComment {
  perspective: string
  applications: string[]
  impact: string
}

export interface ProcessedArticle extends Article {
  aiComment: AIComment
  importance?: ImportanceLevel
  trending?: boolean
}

export interface BriefManifest {
  date: string
  type: ReportType
  title: string
  generatedAt: string
  stats: {
    total: number
    sources: number
    trending?: number
  }
}

export interface Manifest {
  version: string
  lastUpdated: string
  briefs: BriefManifest[]
}
```

- [ ] **步骤 2: 创建 src/config/sources.ts**

```typescript
import type { SourceConfig, ReportType } from '@/lib/types'

export interface SourceConfig {
  name: string
  url: string
  category: string
  sourceType: string
  enabled: boolean
  reportTypes: ReportType[]
}

export const sources: SourceConfig[] = [
  // Hacker News（快讯 + 深度）
  { name: 'Hacker News', url: 'https://hn.algolia.com/api/v1/search?query=AI', category: 'AI', sourceType: 'hn', enabled: true, reportTypes: ['daily', 'intelligence'] },

  // GitHub Trending（快讯 + 深度）
  { name: 'GitHub Trending', url: 'https://api.github.com/search/repositories?q=AI+created:>2026-04-13&sort=stars', category: '开发者', sourceType: 'github', enabled: true, reportTypes: ['daily', 'intelligence'] },

  // arXiv（快讯 + 深度）
  { name: 'arXiv cs.AI', url: 'https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&max_results=20', category: 'AI', sourceType: 'arxiv', enabled: true, reportTypes: ['daily', 'intelligence'] },

  // RSS 源（快讯 + 深度）
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: '科技', sourceType: 'rss', enabled: true, reportTypes: ['daily', 'intelligence'] },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: '科技', sourceType: 'rss', enabled: true, reportTypes: ['daily', 'intelligence'] },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', category: 'AI', sourceType: 'rss', enabled: true, reportTypes: ['daily', 'intelligence'] },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/news/rss', category: 'AI', sourceType: 'rss', enabled: true, reportTypes: ['daily', 'intelligence'] },
  { name: 'The Batch', url: 'https://www.deeplearning.ai/the-batch/feed/', category: 'AI', sourceType: 'rss', enabled: true, reportTypes: ['daily', 'intelligence'] },

  // Twitter（仅深度情报）
  { name: 'AI High Signal List', url: 'https://x.com/i/lists/1585430245762441216', category: 'AI', sourceType: 'twitter', enabled: true, reportTypes: ['intelligence'] },

  // WebSearch（快讯 + 深度）
  { name: 'AI News Search', url: '', category: 'AI', sourceType: 'websearch', enabled: true, reportTypes: ['daily', 'intelligence'] },
]
```

- [ ] **步骤 3: 提交**

```bash
git add src/lib/types.ts src/config/sources.ts
git commit -m "feat: add types and sources config"
```

---

## 任务 3: manifest.json 管理

**文件：**
- 创建: `src/lib/manifest.ts`
- 创建: `public/manifest.json`

- [ ] **步骤 1: 创建 src/lib/manifest.ts**

```typescript
import fs from 'fs/promises'
import path from 'path'
import type { Manifest, BriefManifest } from './types'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'manifest.json')

export async function getManifest(): Promise<Manifest> {
  try {
    const content = await fs.readFile(MANIFEST_PATH, 'utf-8')
    return JSON.parse(content) as Manifest
  } catch {
    return { version: '1.0', lastUpdated: new Date().toISOString(), briefs: [] }
  }
}

export async function addBrief(brief: BriefManifest): Promise<void> {
  const manifest = await getManifest()

  // 移除同日期同类型的旧版本
  manifest.briefs = manifest.briefs.filter(
    b => !(b.date === brief.date && b.type === brief.type)
  )

  // 添加新版本
  manifest.briefs.push(brief)
  manifest.lastUpdated = new Date().toISOString()

  // 按日期排序，最新的在前
  manifest.briefs.sort((a, b) => b.date.localeCompare(a.date))

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

export async function getBriefsByDate(date: string): Promise<BriefManifest[]> {
  const manifest = await getManifest()
  return manifest.briefs.filter(b => b.date === date)
}
```

- [ ] **步骤 2: 创建 public/manifest.json**

```json
{
  "version": "1.0",
  "lastUpdated": "2026-04-14T00:00:00Z",
  "briefs": []
}
```

- [ ] **步骤 3: 提交**

```bash
git add src/lib/manifest.ts public/manifest.json
git commit -m "feat: add manifest management"
```

---

## 任务 4: 基础 Agent 类

**文件：**
- 创建: `src/agents/base.ts`

- [ ] **步骤 1: 创建 src/agents/base.ts**

```typescript
import type { Article, SourceConfig } from '@/lib/types'

export abstract class BaseAgent {
  protected name: string
  protected config: SourceConfig

  constructor(name: string, config: SourceConfig) {
    this.name = name
    this.config = config
  }

  abstract collect(): Promise<Article[]>

  protected deduplicate(articles: Article[]): Article[] {
    const seen = new Set<string>()
    return articles.filter(article => {
      const key = `${article.title}-${article.source}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  protected filterByTime(articles: Article[], maxAgeHours: number): Article[] {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
    return articles.filter(article => new Date(article.publishedAt) >= cutoff)
  }

  protected generateId(title: string, source: string): string {
    return Buffer.from(`${title}-${source}`).toString('base64').slice(0, 20)
  }
}
```

- [ ] **步骤 2: 提交**

```bash
git add src/agents/base.ts
git commit -m "feat: add base agent class"
```

---

## 任务 5: 信息源 Agents

**文件：**
- 创建: `src/agents/sources/hn.ts`
- 创建: `src/agents/sources/github.ts`
- 创建: `src/agents/sources/arxiv.ts`
- 创建: `src/agents/sources/rss.ts`
- 创建: `src/agents/sources/twitter.ts` (占位符)
- 创建: `src/agents/sources/websearch.ts` (占位符)

- [ ] **步骤 1: 创建 src/agents/sources/hn.ts**

```typescript
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

interface HNHit {
  objectID: string
  title: string
  url: string
  points: number
  created_at: string
  author: string
}

export class HNAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'Hacker News')!
    super('HNAgent', config)
  }

  async collect(): Promise<Article[]> {
    try {
      const response = await fetch(
        'https://hn.algolia.com/api/v1/search?query=AI&sortBy=popularity&rows=20'
      )
      const data = await response.json() as { hits: HNHit[] }

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      return data.hits
        .filter(hit => {
          const createdAt = new Date(hit.created_at)
          return createdAt >= oneDayAgo && hit.url
        })
        .map(hit => ({
          id: this.generateId(hit.title, this.config.name),
          title: hit.title,
          link: hit.url,
          summary: `Points: ${hit.points} | Author: ${hit.author}`,
          source: this.config.name,
          sourceType: this.config.sourceType as any,
          publishedAt: new Date(hit.created_at),
          category: 'AI' as const,
        }))
    } catch (error) {
      console.error('HNAgent failed:', error)
      return []
    }
  }
}
```

- [ ] **步骤 2: 创建 src/agents/sources/github.ts**

```typescript
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

interface GHSearchResult {
  total_count: number
  items: {
    name: string
    full_name: string
    html_url: string
    description: string
    stargazers_count: number
    created_at: string
    language: string
  }[]
}

export class GitHubAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'GitHub Trending')!
    super('GitHubAgent', config)
  }

  async collect(): Promise<Article[]> {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const response = await fetch(
        `https://api.github.com/search/repositories?q=AI+created:>${yesterday}&sort=stars&per_page=20`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      )
      const data = await response.json() as GHSearchResult

      return data.items.map(item => ({
        id: this.generateId(item.name, this.config.name),
        title: `${item.name} - ${item.full_name}`,
        link: item.html_url,
        summary: `${item.description || 'No description'} | ⭐ ${item.stargazers_count} | ${item.language || 'Unknown'}`,
        source: this.config.name,
        sourceType: this.config.sourceType as any,
        publishedAt: new Date(item.created_at),
        category: '开发者' as const,
      }))
    } catch (error) {
      console.error('GitHubAgent failed:', error)
      return []
    }
  }
}
```

- [ ] **步骤 3: 创建 src/agents/sources/arxiv.ts**

```typescript
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

export class ArxivAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'arXiv cs.AI')!
    super('ArxivAgent', config)
  }

  async collect(): Promise<Article[]> {
    try {
      const response = await fetch(
        'https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&max_results=15'
      )
      const text = await response.text()

      // 简单的 XML 解析
      const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || []
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      return entries
        .map(entry => {
          const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim().replace(/\n/g, ' ')
          const link = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim()
          const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim().slice(0, 300)
          const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim()
          const authors = entry.match(/<name>([\s\S]*?)<\/name>/g)?.map(m => m.match(/<name>([\s\S]*?)<\/name>/)?.[1]).slice(0, 3).join(', ')

          return { title, link, summary, published, authors }
        })
        .filter(item => item.title && item.published && new Date(item.published) >= oneDayAgo)
        .map(item => ({
          id: this.generateId(item.title!, this.config.name),
          title: item.title!,
          link: item.link!,
          summary: `${item.authors} | ${item.summary}`,
          source: this.config.name,
          sourceType: this.config.sourceType as any,
          publishedAt: new Date(item.published!),
          category: 'AI' as const,
        }))
    } catch (error) {
      console.error('ArxivAgent failed:', error)
      return []
    }
  }
}
```

- [ ] **步骤 4: 创建 src/agents/sources/rss.ts**

```typescript
import Parser from 'rss-parser'
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/lib/types'

const parser = new Parser()

export class RSSAgent extends BaseAgent {
  constructor() {
    const rssSources = sources.filter(s => s.sourceType === 'rss' && s.enabled)
    // 第一个 RSS 源作为代表
    super('RSSAgent', rssSources[0])
  }

  async collect(sourceName?: string): Promise<Article[]> {
    const rssSources = sources.filter(s => s.sourceType === 'rss' && s.enabled)
    const results: Article[] = []

    for (const config of rssSources) {
      try {
        const feed = await parser.parseURL(config.url)
        const oneDayAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

        const items = feed.items
          .filter(item => item.pubDate && new Date(item.pubDate) >= oneDayAgo)
          .map(item => ({
            id: this.generateId(item.title || '', config.name),
            title: item.title || 'Untitled',
            link: item.link || '',
            summary: item.contentSnippet || item.content || item.description || '',
            source: config.name,
            sourceType: 'rss' as const,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            category: config.category as any,
          }))

        results.push(...items)
      } catch (error) {
        console.error(`RSSAgent failed for ${config.name}:`, error)
      }
    }

    return this.deduplicate(results)
  }
}
```

- [ ] **步骤 5: 创建 src/agents/sources/twitter.ts (占位符)**

```typescript
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

export class TwitterAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'AI High Signal List')!
    super('TwitterAgent', config)
  }

  async collect(): Promise<Article[]> {
    // TODO: 使用浏览器 MCP 直接采集 Twitter
    // Agent2 使用 Claude-in-Chrome MCP 直接打开 Twitter 页面
    // JavaScript 读取 DOM 提取推文数据
    console.log('TwitterAgent: 等待 MCP 集成')
    return []
  }
}
```

- [ ] **步骤 6: 创建 src/agents/sources/websearch.ts (占位符)**

```typescript
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

export class SearchAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'AI News Search')!
    super('SearchAgent', config)
  }

  async collect(): Promise<Article[]> {
    // TODO: WebSearch 补充热门话题
    console.log('SearchAgent: WebSearch 尚未实现')
    return []
  }
}
```

- [ ] **步骤 7: 提交**

```bash
git add src/agents/sources/
git commit -m "feat: add information source agents"
```

---

## 任务 6: 质量过滤 Agent

**文件：**
- 创建: `src/agents/quality-filter.ts`

- [ ] **步骤 1: 创建 src/agents/quality-filter.ts**

```typescript
import type { Article } from '@/lib/types'

const CLICKBAIT_PATTERNS = [
  /you won't believe/i, /shocking/i, /amazing/i, /unbelievable/i,
  /this is why/i, /the reason/i, /won't believe/i, /viral/i, /mind-blowing/i,
]

const LOW_VALUE_PATTERNS = [/just in:/i, /breaking:/i, /^update/i, /^news:/i]

export class QualityFilterAgent {
  private articles: Article[]

  constructor(articles: Article[]) {
    this.articles = articles
  }

  filter(): Article[] {
    return this.articles.filter(article => {
      // 必须有链接（链接优先铁律）
      if (!article.link) return false

      // 过滤标题党
      if (CLICKBAIT_PATTERNS.some(p => p.test(article.title))) return false

      // 过滤低价值
      if (LOW_VALUE_PATTERNS.some(p => p.test(article.title))) return false
      if (article.summary.length < 30 && article.title.length < 20) return false

      return true
    })
  }

  // 交叉验证：标记在多个信源出现的同一话题
  markTrending(articles: Article[]): Article[] {
    const topicMap = new Map<string, number>()

    // 简单基于标题关键词统计
    for (const article of articles) {
      const keywords = this.extractKeywords(article.title)
      for (const kw of keywords) {
        topicMap.set(kw, (topicMap.get(kw) || 0) + 1)
      }
    }

    const trendingKeywords = new Set<string>()
    for (const [kw, count] of topicMap) {
      if (count >= 2) trendingKeywords.add(kw)
    }

    return articles.map(article => {
      const keywords = this.extractKeywords(article.title)
      const isTrending = keywords.some(kw => trendingKeywords.has(kw))
      return { ...article, trending: isTrending }
    })
  }

  private extractKeywords(title: string): string[] {
    return title.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 5)
  }
}
```

- [ ] **步骤 2: 提交**

```bash
git add src/agents/quality-filter.ts
git commit -m "feat: add quality filter agent"
```

---

## 任务 7: AI 评论生成 Agent

**文件：**
- 创建: `src/agents/ai-comment.ts`

- [ ] **步骤 1: 创建 src/agents/ai-comment.ts**

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { Article, AIComment, ProcessedArticle } from '@/lib/types'

const SYSTEM_PROMPT = `You are an AI assistant generating insightful commentary for tech/AI news.

Generate a JSON object with:
- perspective: AI perspective analysis (1-2 sentences)
- applications: 2-3 potential application scenarios
- impact: Industry impact assessment (1 sentence)

Style: Objective, insightful, no sensationalism. Return ONLY valid JSON.`

export class AICommentAgent {
  private articles: Article[]

  constructor(articles: Article[]) {
    this.articles = articles
  }

  async generate(): Promise<ProcessedArticle[]> {
    const results = await Promise.all(
      this.articles.map(article => this.generateForArticle(article))
    )
    return results.filter((r): r is ProcessedArticle => r !== null)
  }

  private async generateForArticle(article: Article): Promise<ProcessedArticle | null> {
    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        system: SYSTEM_PROMPT,
        prompt: `Title: ${article.title}\nSummary: ${article.summary}\nSource: ${article.source}`,
      })

      const cleaned = text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '')
      const comment = JSON.parse(cleaned) as AIComment

      return { ...article, aiComment: comment }
    } catch (error) {
      console.error(`AI comment failed for "${article.title}":`, error)
      return {
        ...article,
        aiComment: { perspective: '暂无', applications: [], impact: '暂无' },
      }
    }
  }
}
```

- [ ] **步骤 2: 提交**

```bash
git add src/agents/ai-comment.ts
git commit -m "feat: add AI comment agent"
```

---

## 任务 8: HTML 简报生成器

**文件：**
- 创建: `src/brief-templates/daily.css`
- 创建: `src/brief-templates/daily-template.ts`
- 创建: `src/brief-templates/intelligence.css`
- 创建: `src/brief-templates/intelligence-template.ts`
- 创建: `src/agents/html-generator.ts`

- [ ] **步骤 1: 创建 src/brief-templates/daily.css**

```css
/* Cyberpunk Daily Brief Style */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --bg: #0a0a0f;
  --bg-card: #12121a;
  --border: #1e1e2e;
  --green: #00ff88;
  --purple: #a855f7;
  --blue: #3b82f6;
  --text: #e4e4e7;
  --text-muted: #71717a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  padding: 2rem;
}

.grid-bg {
  background-image:
    linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--green);
  text-shadow: 0 0 20px rgba(0,255,136,0.5);
}

.header .date {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stats span {
  background: var(--bg-card);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--border);
}

.lead-story {
  background: var(--bg-card);
  border: 1px solid var(--green);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 30px rgba(0,255,136,0.1);
}

.lead-story .tag {
  background: var(--green);
  color: var(--bg);
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.lead-story h2 {
  font-size: 1.5rem;
  margin: 0.75rem 0;
  line-height: 1.3;
}

.lead-story h2 a { color: inherit; text-decoration: none; }
.lead-story h2 a:hover { color: var(--green); }

.lead-story .source {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--purple);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
}

.card:hover { border-color: var(--green); }

.card h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card h3 a { color: inherit; text-decoration: none; }
.card h3 a:hover { color: var(--green); }

.card .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  color: var(--text-muted);
  display: flex;
  gap: 1rem;
}

.card .summary {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.ai-comment {
  background: rgba(0,255,136,0.05);
  border-left: 2px solid var(--green);
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
}

.ai-comment .label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  color: var(--green);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr; }
}

.footer {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: 2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
}
```

- [ ] **步骤 2: 创建 src/brief-templates/daily-template.ts**

```typescript
import type { ProcessedArticle } from '@/lib/types'

export function generateDailyHTML(articles: ProcessedArticle[], date: string): string {
  const lead = articles[0]
  const sidebar = articles.slice(1, 5)
  const rest = articles.slice(5)

  const hnArticles = rest.filter(a => a.sourceType === 'hn').slice(0, 8)
  const ghArticles = rest.filter(a => a.sourceType === 'github').slice(0, 6)
  const arxivArticles = rest.filter(a => a.sourceType === 'arxiv').slice(0, 5)
  const otherArticles = rest.filter(a => !['hn', 'github', 'arxiv'].includes(a.sourceType))

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bemoNews Daily - ${date}</title>
  <link rel="stylesheet" href="../brief-templates/daily.css">
</head>
<body class="grid-bg">
  <header class="header">
    <h1>bemoNews</h1>
    <p class="date">${date} | AI Daily News</p>
    <div class="stats">
      <span>${articles.length} articles</span>
      <span>6 sources</span>
      <span>Generated ${new Date().toLocaleTimeString()}</span>
    </div>
  </header>

  ${lead ? `
  <section class="lead-story">
    <span class="tag">Lead Story</span>
    <h2><a href="${lead.link}" target="_blank">${lead.title}</a></h2>
    <p class="source">${lead.source} | ${new Date(lead.publishedAt).toLocaleDateString()}</p>
    ${lead.aiComment ? `
    <div class="ai-comment">
      <div class="label">AI 视角</div>
      <p>${lead.aiComment.perspective}</p>
    </div>` : ''}
  </section>` : ''}

  <section class="section">
    <h2 class="section-title">Quick Hits</h2>
    <div class="two-col">
      ${sidebar.map(a => `
      <div class="card">
        <h3><a href="${a.link}" target="_blank">${a.title}</a></h3>
        <div class="meta">
          <span>${a.source}</span>
          <span>${a.category}</span>
        </div>
      </div>`).join('')}
    </div>
  </section>

  ${hnArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Hacker News</h2>
    ${hnArticles.map(a => `
    <div class="card">
      <h3><a href="${a.link}" target="_blank">${a.title}</a></h3>
      <div class="meta">
        <span>${a.source}</span>
        <span>${a.summary}</span>
      </div>
    </div>`).join('')}
  </section>` : ''}

  ${ghArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">GitHub Trending</h2>
    ${ghArticles.map(a => `
    <div class="card">
      <h3><a href="${a.link}" target="_blank">${a.title}</a></h3>
      <div class="summary">${a.summary}</div>
    </div>`).join('')}
  </section>` : ''}

  ${arxivArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">arXiv Papers</h2>
    ${arxivArticles.map(a => `
    <div class="card">
      <h3><a href="${a.link}" target="_blank">${a.title}</a></h3>
      <div class="summary">${a.summary}</div>
    </div>`).join('')}
  </section>` : ''}

  <footer class="footer">
    <p>Data sources: Hacker News, GitHub, arXiv, TechCrunch, MIT Technology Review, OpenAI, Anthropic, The Batch</p>
    <p>bemoNews | AI-powered daily digest</p>
  </footer>
</body>
</html>`
}
```

- [ ] **步骤 3: 创建 src/brief-templates/intelligence.css**

```css
/* Cyberpunk Intelligence Brief Style - enhanced version */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --bg: #0a0a0f;
  --bg-card: #12121a;
  --border: #1e1e2e;
  --green: #00ff88;
  --purple: #a855f7;
  --blue: #3b82f6;
  --red: #ef4444;
  --orange: #f97316;
  --text: #e4e4e7;
  --text-muted: #71717a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  padding: 2rem;
}

.grid-bg {
  background-image:
    linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--purple);
  text-shadow: 0 0 20px rgba(168,85,247,0.5);
}

.header .date {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stats span {
  background: var(--bg-card);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--border);
}

.tag-breaking {
  background: var(--red);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.tag-major {
  background: var(--orange);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.tag-notable {
  background: var(--blue);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.tag-trending {
  background: var(--green);
  color: var(--bg);
  font-size: 0.5rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.lead-story {
  background: var(--bg-card);
  border: 1px solid var(--purple);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 30px rgba(168,85,247,0.1);
}

.lead-story h2 {
  font-size: 1.5rem;
  margin: 0.75rem 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lead-story h2 a { color: inherit; text-decoration: none; }
.lead-story h2 a:hover { color: var(--purple); }

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
}

.card:hover { border-color: var(--purple); }

.card h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.card h3 a { color: inherit; text-decoration: none; }
.card h3 a:hover { color: var(--purple); }

.card .meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  color: var(--text-muted);
  display: flex;
  gap: 1rem;
}

.card .summary {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.ai-comment {
  background: rgba(168,85,247,0.05);
  border-left: 2px solid var(--purple);
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
}

.ai-comment .label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  color: var(--purple);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.four-col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1024px) {
  .four-col { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .four-col { grid-template-columns: 1fr; }
}

.footer {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: 2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
}
```

- [ ] **步骤 4: 创建 src/brief-templates/intelligence-template.ts**

```typescript
import type { ProcessedArticle } from '@/lib/types'

function getImportanceTag(article: ProcessedArticle): string {
  if (article.importance === 'BREAKING') return '<span class="tag-breaking">Breaking</span>'
  if (article.importance === 'MAJOR') return '<span class="tag-major">Major</span>'
  return '<span class="tag-notable">Notable</span>'
}

function getTrendingTag(trending?: boolean): string {
  return trending ? '<span class="tag-trending">TRENDING</span>' : ''
}

export function generateIntelligenceHTML(articles: ProcessedArticle[], date: string): string {
  const lead = articles.find(a => a.importance === 'BREAKING') || articles[0]
  const major = articles.filter(a => a.importance === 'MAJOR')
  const trending = articles.filter(a => a.trending)
  const hnArticles = articles.filter(a => a.sourceType === 'hn').slice(0, 5)
  const ghArticles = articles.filter(a => a.sourceType === 'github').slice(0, 4)
  const twitterArticles = articles.filter(a => a.sourceType === 'twitter').slice(0, 8)
  const arxivArticles = articles.filter(a => a.sourceType === 'arxiv').slice(0, 5)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bemoNews Intelligence - ${date}</title>
  <link rel="stylesheet" href="../brief-templates/intelligence.css">
</head>
<body class="grid-bg">
  <header class="header">
    <h1>bemoNews Intelligence</h1>
    <p class="date">${date} | Deep Intelligence Briefing</p>
    <div class="stats">
      <span>${articles.length} articles</span>
      <span>8 sources</span>
      <span>${trending.length} trending</span>
      <span>Generated ${new Date().toLocaleTimeString()}</span>
    </div>
  </header>

  ${lead ? `
  <section class="lead-story">
    ${getImportanceTag(lead)}
    <h2>
      <a href="${lead.link}" target="_blank">${lead.title}</a>
      ${getTrendingTag(lead.trending)}
    </h2>
    <p class="source">${lead.source} | ${new Date(lead.publishedAt).toLocaleDateString()}</p>
    ${lead.aiComment ? `
    <div class="ai-comment">
      <div class="label">AI 视角</div>
      <p>${lead.aiComment.perspective}</p>
      ${lead.aiComment.applications.length > 0 ? `
      <div style="margin-top:0.5rem;font-size:0.75rem;">
        <strong>应用方向:</strong> ${lead.aiComment.applications.join(', ')}
      </div>` : ''}
    </div>` : ''}
  </section>` : ''}

  <div class="four-col">
    ${major.slice(0, 4).map(a => `
    <div class="card">
      ${getImportanceTag(a)}
      <h3>
        <a href="${a.link}" target="_blank">${a.title}</a>
        ${getTrendingTag(a.trending)}
      </h3>
      <div class="meta">
        <span>${a.source}</span>
        <span>${a.category}</span>
      </div>
    </div>`).join('')}
  </div>

  ${hnArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Tech Discussions (HN + PH)</h2>
    ${hnArticles.map(a => `
    <div class="card">
      <h3>
        <a href="${a.link}" target="_blank">${a.title}</a>
        ${getTrendingTag(a.trending)}
      </h3>
      <div class="meta">
        <span>${a.source}</span>
        <span>${a.summary}</span>
      </div>
      ${a.aiComment ? `
      <div class="ai-comment">
        <div class="label">AI 视角</div>
        <p>${a.aiComment.perspective}</p>
      </div>` : ''}
    </div>`).join('')}
  </section>` : ''}

  ${twitterArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Twitter Developer Feed</h2>
    ${twitterArticles.map(a => `
    <div class="card">
      <h3>
        <a href="${a.link}" target="_blank">${a.title}</a>
        ${getTrendingTag(a.trending)}
      </h3>
      <div class="meta">
        <span>${a.source}</span>
        <span>${a.summary}</span>
      </div>
    </div>`).join('')}
  </section>` : ''}

  ${ghArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">GitHub Projects</h2>
    ${ghArticles.map(a => `
    <div class="card">
      <h3>
        <a href="${a.link}" target="_blank">${a.title}</a>
        ${getTrendingTag(a.trending)}
      </h3>
      <div class="summary">${a.summary}</div>
    </div>`).join('')}
  </section>` : ''}

  ${arxivArticles.length > 0 ? `
  <section class="section">
    <h2 class="section-title">arXiv Papers</h2>
    ${arxivArticles.map(a => `
    <div class="card">
      <h3>
        <a href="${a.link}" target="_blank">${a.title}</a>
        ${getTrendingTag(a.trending)}
      </h3>
      <div class="summary">${a.summary}</div>
      ${a.aiComment ? `
      <div class="ai-comment">
        <div class="label">AI 视角</div>
        <p>${a.aiComment.perspective}</p>
      </div>` : ''}
    </div>`).join('')}
  </section>` : ''}

  <footer class="footer">
    <p>Data sources: Hacker News, Product Hunt, GitHub, arXiv, Twitter, TechCrunch, MIT, OpenAI, Anthropic, Reddit</p>
    <p>Multi-source cross-validation | bemoNews Intelligence</p>
  </footer>
</body>
</html>`
}
```

- [ ] **步骤 5: 创建 src/agents/html-generator.ts**

```typescript
import fs from 'fs/promises'
import path from 'path'
import type { ProcessedArticle, ReportType, BriefManifest } from '@/lib/types'
import { generateDailyHTML } from '@/brief-templates/daily-template'
import { generateIntelligenceHTML } from '@/brief-templates/intelligence-template'
import { addBrief } from '@/lib/manifest'

const BRIEFS_DIR = path.join(process.cwd(), 'public', 'briefs')

export async function generateBriefHTML(
  articles: ProcessedArticle[],
  date: string,
  type: ReportType
): Promise<void> {
  const html = type === 'daily'
    ? generateDailyHTML(articles, date)
    : generateIntelligenceHTML(articles, date)

  const filename = `${type}-${date}.html`
  const filepath = path.join(BRIEFS_DIR, filename)

  await fs.mkdir(BRIEFS_DIR, { recursive: true })
  await fs.writeFile(filepath, html)

  // 更新 manifest
  const manifest: BriefManifest = {
    date,
    type,
    title: `${type === 'daily' ? 'Daily' : 'Intelligence'} - ${date}`,
    generatedAt: new Date().toISOString(),
    stats: {
      total: articles.length,
      sources: [...new Set(articles.map(a => a.sourceType))].length,
    },
  }

  await addBrief(manifest)
}
```

- [ ] **步骤 6: 提交**

```bash
git add src/brief-templates/ src/agents/html-generator.ts
git commit -m "feat: add HTML brief generators with Cyberpunk style"
```

---

## 任务 9: Agent 编排器

**文件：**
- 创建: `src/agents/index.ts`

- [ ] **步骤 1: 创建 src/agents/index.ts**

```typescript
import { HNAgent } from './sources/hn'
import { GitHubAgent } from './sources/github'
import { ArxivAgent } from './sources/arxiv'
import { RSSAgent } from './sources/rss'
import { TwitterAgent } from './sources/twitter'
import { SearchAgent } from './sources/search'
import { QualityFilterAgent } from './quality-filter'
import { AICommentAgent } from './ai-comment'
import { generateBriefHTML } from './html-generator'
import type { Article, ReportType } from '@/lib/types'

export async function generateDaily(): Promise<void> {
  console.log('[Daily] Starting...')
  const start = Date.now()

  // 顺序采集 6 大信源
  const agents = [new HNAgent(), new GitHubAgent(), new ArxivAgent()]

  // RSS 单独处理
  const rssAgent = new RSSAgent()
  const rssArticles = await rssAgent.collect()

  const allArticles: Article[] = []

  for (const agent of agents) {
    const articles = await agent.collect()
    allArticles.push(...articles)
    console.log(`[Daily] ${agent.constructor.name}: ${articles.length}`)
  }

  allArticles.push(...rssArticles)
  console.log(`[Daily] Total collected: ${allArticles.length}`)

  // 质量过滤
  const filter = new QualityFilterAgent(allArticles)
  const filtered = filter.filter()
  console.log(`[Daily] After filter: ${filtered.length}`)

  // AI 评论
  const commentAgent = new AICommentAgent(filtered)
  const processed = await commentAgent.generate()

  // 生成 HTML
  const date = new Date().toISOString().split('T')[0]
  await generateBriefHTML(processed, date, 'daily')

  console.log(`[Daily] Done in ${Date.now() - start}ms`)
}

export async function generateIntelligence(): Promise<void> {
  console.log('[Intelligence] Starting...')
  const start = Date.now()

  // 4 路并行采集
  const [hnArticles, ghArticles, arxivArticles, rssArticles] = await Promise.all([
    new HNAgent().collect(),
    new GitHubAgent().collect(),
    new ArxivAgent().collect(),
    new RSSAgent().collect(),
  ])

  // Twitter 暂用占位符
  const twitterArticles = await new TwitterAgent().collect()

  let allArticles: Article[] = [
    ...hnArticles,
    ...ghArticles,
    ...arxivArticles,
    ...rssArticles,
    ...twitterArticles,
  ]

  console.log(`[Intelligence] Total collected: ${allArticles.length}`)

  // 质量过滤 + 交叉验证
  const filter = new QualityFilterAgent(allArticles)
  let filtered = filter.filter()
  filtered = filter.markTrending(filtered)
  console.log(`[Intelligence] After filter: ${filtered.length}`)

  // 重要性分级（简化版：标题含 Breaking/Major 关键词）
  filtered = filtered.map(a => ({
    ...a,
    importance: /breaking|major|urgent/i.test(a.title)
      ? ('MAJOR' as const)
      : ('NOTABLE' as const),
  }))

  // AI 评论
  const commentAgent = new AICommentAgent(filtered)
  const processed = await commentAgent.generate()

  // 生成 HTML
  const date = new Date().toISOString().split('T')[0]
  await generateBriefHTML(processed, date, 'intelligence')

  console.log(`[Intelligence] Done in ${Date.now() - start}ms`)
}

export async function generateAll(): Promise<void> {
  await Promise.all([generateDaily(), generateIntelligence()])
}
```

- [ ] **步骤 2: 提交**

```bash
git add src/agents/index.ts
git commit -m "feat: add agent orchestrator"
```

---

## 任务 10: Cron 任务和 API

**文件：**
- 创建: `src/cron/generate.ts`
- 创建: `src/app/api/generate/route.ts`

- [ ] **步骤 1: 创建 src/cron/generate.ts**

```typescript
import { generateAll } from '@/agents'

async function main() {
  try {
    console.log('=== bemoNews Generation Started ===')
    await generateAll()
    console.log('=== bemoNews Generation Complete ===')
    process.exit(0)
  } catch (error) {
    console.error('Generation failed:', error)
    process.exit(1)
  }
}

main()
```

- [ ] **步骤 2: 创建 src/app/api/generate/route.ts**

```typescript
import { NextResponse } from 'next/server'
import { generateAll } from '@/agents'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await generateAll()
    return NextResponse.json({ success: true, message: 'Briefs generated' })
  } catch (error) {
    console.error('API generation failed:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
```

- [ ] **步骤 3: 提交**

```bash
git add src/cron/generate.ts src/app/api/generate/route.ts
git commit -m "feat: add cron job and API route"
```

---

## 任务 11: 网站页面

**文件：**
- 创建: `src/app/layout.tsx`
- 创建: `src/app/page.tsx`
- 创建: `src/components/Calendar.tsx`
- 创建: `src/components/BriefCard.tsx`
- 创建: `src/components/ThemeToggle.tsx`
- 创建: `src/components/IframeViewer.tsx`

- [ ] **步骤 1: 创建 src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'bemoNews - AI Daily Digest',
  description: 'AI-powered daily news digest with two modes: quick daily and deep intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-cyber-bg text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-cyber-green">bemoNews</h1>
              <p className="text-sm text-white/50">AI-powered news digest</p>
            </div>
            <ThemeToggle />
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
```

- [ ] **步骤 2: 创建 src/components/ThemeToggle.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) setDark(stored === 'dark')
  }, [])

  const toggle = () => {
    const newDark = !dark
    setDark(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
    document.documentElement.classList.toggle('light', !newDark)
  }

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyber-green transition-colors text-sm"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
```

- [ ] **步骤 3: 创建 src/components/Calendar.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { Manifest } from '@/lib/types'

interface CalendarProps {
  manifest: Manifest
  onSelectBrief: (date: string, type: string) => void
}

export function Calendar({ manifest, onSelectBrief }: CalendarProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const dates = [...new Set(manifest.briefs.map(b => b.date))].sort().reverse()

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-lg ${view === 'list' ? 'bg-cyber-green text-black' : 'border border-white/20'}`}
        >
          列表视图
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-4 py-2 rounded-lg ${view === 'calendar' ? 'bg-cyber-green text-black' : 'border border-white/20'}`}
        >
          日历视图
        </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {dates.map(date => {
            const dailyBrief = manifest.briefs.find(b => b.date === date && b.type === 'daily')
            const intelBrief = manifest.briefs.find(b => b.date === date && b.type === 'intelligence')

            return (
              <div key={date} className="border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-mono text-cyber-green mb-3">{date}</h3>
                <div className="flex gap-4">
                  {dailyBrief && (
                    <button
                      onClick={() => onSelectBrief(date, 'daily')}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm"
                    >
                      📰 Daily ({dailyBrief.stats.total} articles)
                    </button>
                  )}
                  {intelBrief && (
                    <button
                      onClick={() => onSelectBrief(date, 'intelligence')}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm"
                    >
                      🔮 Intelligence ({intelBrief.stats.total} articles)
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            const hasBrief = manifest.briefs.some(b => b.date === dateStr)

            return (
              <button
                key={i}
                onClick={() => hasBrief && onSelectBrief(dateStr, 'daily')}
                className={`p-2 rounded-lg text-center text-sm ${
                  hasBrief
                    ? 'bg-cyber-green/20 hover:bg-cyber-green/30 cursor-pointer'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **步骤 4: 创建 src/components/IframeViewer.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface IframeViewerProps {
  src: string
}

export function IframeViewer({ src }: IframeViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'theme') {
        iframeRef.current?.contentWindow?.postMessage(event.data, '*')
      }
    }

    window.addEventListener('message', handleMessage)

    // 同步主题到 iframe
    const theme = localStorage.getItem('theme') || 'dark'
    iframeRef.current?.contentWindow?.postMessage({ type: 'theme', theme }, '*')

    return () => window.removeEventListener('message', handleMessage)
  }, [src])

  return (
    <div className="w-full h-[80vh] border border-white/10 rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full"
        title="Brief Viewer"
      />
    </div>
  )
}
```

- [ ] **步骤 5: 创建 src/app/page.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/Calendar'
import { IframeViewer } from '@/components/IframeViewer'
import type { Manifest } from '@/lib/types'

export default function Home() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [selected, setSelected] = useState<{ date: string; type: string } | null>(null)

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then(setManifest)
      .catch(console.error)
  }, [])

  if (!manifest) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (selected) {
    const brief = manifest.briefs.find(b => b.date === selected.date && b.type === selected.type)
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="mb-4 px-4 py-2 border border-white/20 rounded-lg hover:border-cyber-green"
        >
          ← Back
        </button>
        <p className="text-sm text-white/50 mb-4">{brief?.title}</p>
        <IframeViewer src={`/briefs/${selected.type}-${selected.date}.html`} />
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">bemoNews Archive</h2>
        <p className="text-white/60">Select a brief to view</p>
      </div>

      {manifest.briefs.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <p>No briefs generated yet.</p>
          <p className="mt-2">Visit /api/generate to generate today's briefs.</p>
        </div>
      ) : (
        <Calendar manifest={manifest} onSelectBrief={(date, type) => setSelected({ date, type })} />
      )}
    </div>
  )
}
```

- [ ] **步骤 6: 提交**

```bash
git add src/app/layout.tsx src/app/page.tsx src/components/
git commit -m "feat: add web pages and components"
```

---

## 任务 12: 验证和构建

- [ ] **步骤 1: 安装依赖**

运行: `npm install`

- [ ] **步骤 2: 类型检查**

运行: `npx tsc --noEmit`
预期: 无错误

- [ ] **步骤 3: 构建项目**

运行: `npm run build`
预期: 构建成功

- [ ] **步骤 4: 本地测试**

运行: `npm run dev`
预期: 服务启动在 localhost:3000

- [ ] **步骤 5: 触发生成简报（可选）**

运行: `npm run generate`
预期: 生成 HTML 简报和更新 manifest.json

- [ ] **步骤 6: 最终提交**

```bash
git add -A
git commit -m "feat: complete bemoNews v1 implementation"
```

---

## 需求覆盖检查

| 需求章节 | 对应任务 |
|----------|----------|
| 2.1 信息源分类 | 任务 2, 5 |
| 3.1 快讯模式 | 任务 5, 8, 9 |
| 3.2 深度情报模式 | 任务 5, 8, 9 |
| 3.3 链接优先铁律 | 任务 6 |
| 4.1 快讯页面结构 | 任务 8 (daily-template) |
| 4.2 深度情报页面结构 | 任务 8 (intelligence-template) |
| 5.1 iframe 嵌入 | 任务 11 (IframeViewer) |
| 5.2 manifest 驱动 | 任务 3, 10 |
| 5.3 Cyberpunk 风格 | 任务 8 (CSS) |
| 7. 定时任务 | 任务 10 |

---

## 计划完成

**计划已保存至:** `docs/superpowers/plans/2026-04-14-bemonews-implementation.md`

**两种执行方式:**

**1. Subagent-Driven（推荐）** — 每个任务派一个新的 subagent 执行，任务间有 review，快速迭代

**2. Inline Execution** — 在当前 session 中批量执行，定期 checkpoint review

选择哪种方式？
