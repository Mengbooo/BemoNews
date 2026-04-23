import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'bemoNews',
  description: 'AI-powered news briefs - 快讯 & 深度情报',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
