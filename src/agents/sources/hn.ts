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
      const res = await fetch(`https://hn.algolia.com/api/v1/search?query=AI&tags=story&hitsPerPage=20`)
      const data = await res.json() as { hits: HNHit[] }
      
      return data.hits.map(hit => ({
        id: this.generateId(hit.title, 'Hacker News'),
        title: hit.title,
        link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        summary: `Points: ${hit.points} | Author: ${hit.author}`,
        source: 'Hacker News',
        sourceType: 'hn' as const,
        publishedAt: new Date(hit.created_at),
        category: 'AI' as const,
      }))
    } catch (error) {
      console.error('HNAgent collect error:', error)
      return []
    }
  }
}
