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
