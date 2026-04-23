import type { ProcessedArticle } from '@/lib/types'

export function generateIntelligenceHTML(articles: ProcessedArticle[], date: string): string {
  // Group by source
  const bySource: Record<string, ProcessedArticle[]> = {}
  articles.forEach(a => {
    if (!bySource[a.source]) bySource[a.source] = []
    bySource[a.source].push(a)
  })

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bemoNews 深度情报 - ${date}</title>
  <link rel="stylesheet" href="/brief-templates/intelligence.css">
</head>
<body>
  <header>
    <h1>深度情报</h1>
    <div class="meta">${date} · AI 行业深度分析</div>
  </header>
  
  <div class="intro">
    <p>本报告汇集自 Hacker News、GitHub、arXiv 等多个高质量信源，由 AI 分析筛选出最具价值的动态与趋势。</p>
  </div>
  
  <main>
    ${Object.entries(bySource).map(([source, sourceArticles]) => `
    <section class="source-section">
      <div class="source-header">
        <h2>${source}</h2>
        <span style="color: var(--muted); font-size: 0.75rem">${sourceArticles.length} 条</span>
      </div>
      ${sourceArticles.map(article => `
      <article class="article">
        <h3><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h3>
        <p class="summary">${article.summary}</p>
        ${article.aiComment ? `
        <div class="ai-comment">
          <strong>💡 AI 点评：</strong>${article.aiComment.perspective}
          ${article.aiComment.applications.length ? `<br>应用场景：${article.aiComment.applications.join(' · ')}` : ''}
        </div>
        ` : ''}
      </article>
      `).join('')}
    </section>
    `).join('')}
  </main>
  
  <footer>
    <p>由 bemoNews AI 生成 · ${new Date().toLocaleString('zh-CN')}</p>
  </footer>
</body>
</html>`
}
