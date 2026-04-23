// Twitter agent placeholder
// In production, integrate with Twitter MCP or API

import { BaseAgent } from '../base'
import type { Article } from '@/lib/types'
import { sources } from '@/config/sources'

export class TwitterAgent extends BaseAgent {
  constructor() {
    const config = sources.find(s => s.name === 'AI High Signal List')!
    super('TwitterAgent', config)
  }

  async collect(): Promise<Article[]> {
    // Placeholder - Twitter API requires authentication
    console.warn('TwitterAgent: MCP integration not implemented')
    return []
  }
}
