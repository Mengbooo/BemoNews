import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    return format(date, 'yyyy 年 MM 月 dd 日', { locale: zhCN })
  } catch {
    return dateStr
  }
}

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getDateRange(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(format(d, 'yyyy-MM-dd'))
  }
  return dates
}
