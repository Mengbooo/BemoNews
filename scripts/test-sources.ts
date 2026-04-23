/**
 * 测试信息源 URL 连通性
 * 运行: npx tsx scripts/test-sources.ts
 */

import { sources } from '../src/config/sources'

interface TestResult {
  name: string
  url: string
  status: 'ok' | 'fail' | 'timeout'
  statusCode?: number
  error?: string
  latency?: number
}

async function testUrl(name: string, url: string, timeout = 10000): Promise<TestResult> {
  if (!url) {
    return { name, url, status: 'fail', error: 'No URL provided' }
  }

  const start = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'bemoNews Tester/1.0',
        'Accept': '*/*',
      },
    })

    clearTimeout(timeoutId)
    const latency = Date.now() - start

    if (response.ok || response.status === 301 || response.status === 302) {
      return { name, url, status: 'ok', statusCode: response.status, latency }
    } else {
      return { name, url, status: 'fail', statusCode: response.status, error: `HTTP ${response.status}`, latency }
    }
  } catch (error: any) {
    const latency = Date.now() - start
    if (error.name === 'AbortError') {
      return { name, url, status: 'timeout', error: `Timeout after ${timeout}ms`, latency }
    }
    return { name, url, status: 'fail', error: error.message, latency }
  }
}

async function main() {
  console.log('🧪 Testing bemoNews Information Sources\n')
  console.log(`Total sources: ${sources.length}`)
  console.log(`Enabled: ${sources.filter(s => s.enabled).length}\n`)

  const results: TestResult[] = []
  // 测试所有源，包括禁用的
  const allSources = sources

  // 测试所有 URL
  for (const source of allSources) {
    if (!source.url) {
      results.push({ name: source.name, url: '(empty)', status: 'fail', error: 'URL not configured' })
      continue
    }

    const result = await testUrl(source.name, source.url)
    results.push(result)

    const icon = result.status === 'ok' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌'
    const latencyStr = result.latency ? `(${result.latency}ms)` : ''
    const statusStr = result.statusCode ? `[${result.statusCode}]` : ''

    console.log(`${icon} ${source.name} ${statusStr} ${latencyStr}`)
    if (result.error) {
      console.log(`   └─ ${result.error}`)
    }
  }

  // 统计
  console.log('\n📊 Summary')
  console.log('─'.repeat(50))

  const ok = results.filter(r => r.status === 'ok').length
  const fail = results.filter(r => r.status === 'fail').length
  const timeout = results.filter(r => r.status === 'timeout').length

  console.log(`✅ OK: ${ok}`)
  console.log(`❌ FAIL: ${fail}`)
  console.log(`⏱️ TIMEOUT: ${timeout}`)

  // 失败列表
  if (fail > 0 || timeout > 0) {
    console.log('\n⚠️  Failed/Timeout URLs:')
    results
      .filter(r => r.status !== 'ok')
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.url}`)
        console.log(`    Error: ${r.error}`)
      })
  }

  // 按媒体类型统计
  console.log('\n📁 By Media Type')
  console.log('─'.repeat(50))

  const byMediaType = new Map<string, { total: number; ok: number }>()

  for (const source of enabledSources) {
    const key = source.mediaType
    if (!byMediaType.has(key)) {
      byMediaType.set(key, { total: 0, ok: 0 })
    }
    const stats = byMediaType.get(key)!
    stats.total++
    const result = results.find(r => r.name === source.name)
    if (result?.status === 'ok') {
      stats.ok++
    }
  }

  byMediaType.forEach((stats, type) => {
    const icon = stats.ok === stats.total ? '✅' : stats.ok === 0 ? '❌' : '⚠️'
    console.log(`${icon} ${type}: ${stats.ok}/${stats.total}`)
  })

  process.exit(fail + timeout > 0 ? 1 : 0)
}

main()
