import Parser from 'rss-parser'
import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

const parser = new Parser({
  customFields: {
    item: ['media:content', 'content:encoded'],
  },
})

export class RSSAgent extends BaseAgent {
  private feedName: string

  constructor(feedName: string) {
    const config = sources.find(s => s.name === feedName)!
    super(`RSSAgent:${feedName}`, config)
    this.feedName = feedName
  }

  async collect(): Promise<Article[]> {
    try {
      const feed = await parser.parseURL(this.config.url)
      
      return feed.items.slice(0, 10).map(item => ({
        id: this.generateId(item.title || '', this.feedName),
        title: item.title || 'No title',
        link: item.link || item.guid || '',
        summary: item.contentSnippet || item.content || item.description || '',
        source: this.feedName,
        sourceType: 'rss' as const,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        category: this.config.category as any,
      }))
    } catch (error) {
      console.error(`RSSAgent:${this.feedName} collect error:`, error)
      return []
    }
  }
}

// Collect from all enabled RSS sources
export async function collectAllRSS(): Promise<Article[]> {
  const rssSources = sources.filter(s => s.sourceType === 'rss' && s.enabled)
  const agents = rssSources.map(s => new RSSAgent(s.name))
  
  const results = await Promise.all(agents.map(a => a.collect()))
  return results.flat()
}
