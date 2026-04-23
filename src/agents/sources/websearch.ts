// WebSearch agent placeholder
// In production, integrate with search API (Bing, Google, etc.)

import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

export class WebSearchAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'AI News Search')!
    super('WebSearchAgent', config)
  }

  async collect(): Promise<Article[]> {
    // Placeholder - needs search API key
    console.warn('WebSearchAgent: API integration not implemented')
    return []
  }
}
