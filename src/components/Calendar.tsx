'use client'

import { useState, useEffect } from 'react'
import { getManifest } from '@/lib/manifest'
import { getDateRange, formatDate } from '@/lib/date'
import BriefCard from './BriefCard'

export default function Calendar() {
  const [dates, setDates] = useState<string[]>([])
  const [briefsMap, setBriefsMap] = useState<Record<string, number>>({})

  useEffect(() => {
    setDates(getDateRange(30))
    getManifest().then(m => {
      const map: Record<string, number> = {}
      m.briefs.forEach(b => {
        map[b.date] = (map[b.date] || 0) + 1
      })
      setBriefsMap(map)
    })
  }, [])

  // Group dates by month
  const months: Record<string, string[]> = {}
  dates.forEach(d => {
    const month = d.slice(0, 7)
    if (!months[month]) months[month] = []
    months[month].push(d)
  })

  return (
    <div className="space-y-8">
      {Object.entries(months).reverse().map(([month, monthDates]) => (
        <div key={month}>
          <h2 className="text-lg font-semibold text-gray-400 mb-4">{month}</h2>
          <div className="grid grid-cols-7 gap-2">
            {monthDates.map(date => (
              <a
                key={date}
                href={`/${date}/`}
                className={`
                  block p-3 rounded-lg border text-center transition-colors
                  ${briefsMap[date]
                    ? 'border-cyber-green bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20'
                    : 'border-gray-800 text-gray-500 hover:border-gray-600'
                  }
                `}
              >
                <div className="text-xs text-gray-500">{new Date(date).getDate()}</div>
                {briefsMap[date] && (
                  <div className="mt-1 text-xs">
                    {briefsMap[date]} 份
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
      {dates.length === 0 && (
        <p className="text-center text-gray-500 py-12">暂无简报数据</p>
      )}
    </div>
  )
}
