import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

interface GitHubRepo {
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  created_at: string
  topics: string[]
}

export class GitHubAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'GitHub Trending')!
    super('GitHubAgent', config)
  }

  async collect(): Promise<Article[]> {
    try {
      const date = new Date()
      date.setDate(date.getDate() - 7) // Last 7 days
      const dateStr = date.toISOString().split('T')[0]
      
      const res = await fetch(
        `https://api.github.com/search/repositories?q=AI+created:>${dateStr}&sort=stars&order=desc`,
        { headers: { 'User-Agent': 'bemoNews' } }
      )
      const data = await res.json() as { items: GitHubRepo[] }
      
      return data.items.slice(0, 15).map(repo => ({
        id: this.generateId(repo.full_name, 'GitHub'),
        title: repo.full_name,
        link: repo.html_url,
        summary: repo.description || `⭐ ${repo.stargazers_count}`,
        source: 'GitHub Trending',
        sourceType: 'github' as const,
        publishedAt: new Date(repo.created_at),
        category: '开发者' as const,
      }))
    } catch (error) {
      console.error('GitHubAgent collect error:', error)
      return []
    }
  }
}
