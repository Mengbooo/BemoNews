import IframeViewer from '@/components/IframeViewer'
import { getBriefsByDate } from '@/lib/manifest'
import { formatDate } from '@/lib/date'

interface Props {
  params: { date: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.date} 简报 - bemoNews`,
  }
}

export default async function DatePage({ params }: Props) {
  const briefs = await getBriefsByDate(params.date)
  const formatted = formatDate(params.date)

  return (
    <main className="min-h-screen bg-cyber-bg text-white">
      <header className="border-b border-cyber-green/20 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <a href="/" className="text-cyber-green hover:text-cyber-green/80 text-sm">
            ← 返回日历
          </a>
          <h1 className="text-2xl font-bold mt-2">{formatted}</h1>
          <p className="text-gray-400 mt-1">{briefs.length} 份简报</p>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {briefs.map(brief => (
          <div key={`${brief.date}-${brief.type}`}>
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {brief.type === 'daily' ? '快讯' : '深度情报'}
            </h2>
            <IframeViewer
              src={`/briefs/${brief.type}-${brief.date}.html`}
              title={brief.title}
            />
          </div>
        ))}
        {briefs.length === 0 && (
          <p className="text-gray-500 text-center py-12">该日期暂无简报</p>
        )}
      </div>
    </main>
  )
}
