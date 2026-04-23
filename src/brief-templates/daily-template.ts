import type { ProcessedArticle } from '@/lib/types'

export function generateDailyHTML(articles: ProcessedArticle[], date: string): string {
  const sourceClass = (source: string) => {
    if (source.includes('Hacker')) return 'source-hn'
    if (source.includes('GitHub')) return 'source-github'
    if (source.includes('arXiv')) return 'source-arxiv'
    if (source.includes('Twitter')) return 'source-twitter'
    return 'source-rss'
  }

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bemoNews 快讯 - ${date}</title>
  <link rel="stylesheet" href="/brief-templates/daily.css">
</head>
<body>
  <header>
    <h1>bemoNews 快讯</h1>
    <div class="meta">${date} · AI & 科技动态</div>
  </header>
  
  <main class="articles">
    ${articles.map(article => `
    <article class="article">
      <span class="source-badge ${sourceClass(article.source)}">${article.source}</span>
      <h2><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h2>
      <p class="summary">${article.summary}</p>
      ${article.aiComment ? `<p class="ai-comment">💡 ${article.aiComment.perspective}</p>` : ''}
    </article>
    `).join('')}
  </main>
  
  <footer>
    <p>由 bemoNews AI 生成 · ${new Date().toLocaleString('zh-CN')}</p>
  </footer>
</body>
</html>`
}
