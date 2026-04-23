import Calendar from '@/components/Calendar'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cyber-bg text-white">
      <header className="border-b border-cyber-green/20 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-cyber-green font-space">bemoNews</h1>
          <p className="text-gray-400 mt-1">AI-powered 简报 · 快讯 & 深度情报</p>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Calendar />
      </div>
    </main>
  )
}
