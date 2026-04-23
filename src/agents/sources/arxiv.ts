import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

interface ArXivEntry {
  id: string
  title: string
  summary: string
  published: string
  author: { name: string }[]
  link: string
}

export class ArXivAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'arXiv cs.AI')!
    super('ArXivAgent', config)
  }

  async collect(): Promise<Article[]> {
    try {
      const res = await fetch(
        'https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&max_results=15'
      )
      const text = await res.text()
      
      // Simple XML parsing for arXiv Atom feed
      const entries = text.match(/<entry>(.*?)<\/entry>/gs) || []
      
      return entries.map(entry => {
        const getTag = (tag: string) => {
          const match = entry.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 's'))
          return match ? match[1].replace(/<[^>]+>/g, '').trim() : ''
        }
        
        return {
          id: this.generateId(getTag('title'), 'arXiv'),
          title: getTag('title').replace(/\n/g, ' '),
          link: getTag('id'),
          summary: getTag('summary').replace(/\n/g, ' ').slice(0, 200) + '...',
          source: 'arXiv cs.AI',
          sourceType: 'arxiv' as const,
          publishedAt: new Date(getTag('published')),
          category: 'AI' as const,
        }
      })
    } catch (error) {
      console.error('ArXivAgent collect error:', error)
      return []
    }
  }
}
