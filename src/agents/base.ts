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
