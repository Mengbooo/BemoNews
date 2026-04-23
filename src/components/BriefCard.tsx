import type { BriefManifest } from '@/lib/types'
import { formatDate } from '@/lib/date'

interface Props {
  brief: BriefManifest
}

export default function BriefCard({ brief }: Props) {
  const typeLabel = brief.type === 'daily' ? '快讯' : '深度情报'
  const typeColor = brief.type === 'daily' ? 'text-cyber-green' : 'text-cyber-purple'

  return (
    <a
      href={`/${brief.date}/?type=${brief.type}`}
      className="block p-4 rounded-lg border border-gray-800 hover:border-cyber-green/50 transition-colors bg-cyber-bg"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-mono ${typeColor}`}>{typeLabel}</span>
          <h3 className="mt-1 font-semibold">{brief.title || formatDate(brief.date)}</h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(brief.generatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-gray-500">
        <span>{brief.stats.total} 条</span>
        <span>{brief.stats.sources} 个信源</span>
        {brief.stats.trending !== undefined && (
          <span>{brief.stats.trending} 趋势</span>
        )}
      </div>
    </a>
  )
}
