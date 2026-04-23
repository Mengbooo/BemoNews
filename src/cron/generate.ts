// Cron job entry point for generating briefs
import { HNAgent, GitHubAgent, ArXivAgent, collectAllRSS } from '@/agents/index'
import { addBrief } from '@/lib/manifest'
import { saveBrief } from '@/lib/storage'
import { generateDailyHTML } from '@/brief-templates/daily-template'
import { generateIntelligenceHTML } from '@/brief-templates/intelligence-template'
import { today } from '@/lib/date'
import type { ProcessedArticle, Article } from '@/lib/types'

async function generateDaily() {
  console.log('[bemoNews] Generating daily brief...')
  
  const [hnArticles, githubArticles, arxivArticles, rssArticles] = await Promise.all([
    new HNAgent().collect(),
    new GitHubAgent().collect(),
    new ArXivAgent().collect(),
    collectAllRSS(),
  ])

  const allArticles: Article[] = [
    ...hnArticles,
    ...githubArticles,
    ...arxivArticles,
    ...rssArticles,
  ]

  // Filter and process articles
  const processed: ProcessedArticle[] = allArticles.map(article => ({
    ...article,
    aiComment: {
      perspective: `来自 ${article.source} 的最新动态`,
      applications: [],
      impact: 'medium',
    },
  }))

  const html = generateDailyHTML(processed, today())
  const filename = `daily-${today()}.html`
  await saveBrief(filename, html)
  
  await addBrief({
    date: today(),
    type: 'daily',
    title: `快讯 ${today()}`,
    generatedAt: new Date().toISOString(),
    stats: {
      total: processed.length,
      sources: 4,
    },
  })

  console.log(`[bemoNews] Daily brief generated: ${filename}`)
}

async function generateIntelligence() {
  console.log('[bemoNews] Generating intelligence brief...')
  // Similar to daily but with more sources and deeper analysis
  // TODO: Implement parallel agent collection for 4-way parallelism
  console.log('[bemoNews] Intelligence generation not yet implemented')
}

export async function run() {
  try {
    await generateDaily()
    // await generateIntelligence() // TODO: Enable when ready
    console.log('[bemoNews] Generation complete')
  } catch (error) {
    console.error('[bemoNews] Generation failed:', error)
    process.exit(1)
  }
}

// Run if called directly
run()
