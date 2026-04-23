import fs from 'fs/promises'
import path from 'path'
import type { Manifest, BriefManifest } from './types'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'manifest.json')

export async function getManifest(): Promise<Manifest> {
  try {
    const content = await fs.readFile(MANIFEST_PATH, 'utf-8')
    return JSON.parse(content) as Manifest
  } catch {
    return { version: '1.0', lastUpdated: new Date().toISOString(), briefs: [] }
  }
}

export async function addBrief(brief: BriefManifest): Promise<void> {
  const manifest = await getManifest()

  // Remove old version with same date and type
  manifest.briefs = manifest.briefs.filter(
    b => !(b.date === brief.date && b.type === brief.type)
  )

  // Add new version
  manifest.briefs.push(brief)
  manifest.lastUpdated = new Date().toISOString()

  // Sort by date, newest first
  manifest.briefs.sort((a, b) => b.date.localeCompare(a.date))

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

export async function getBriefsByDate(date: string): Promise<BriefManifest[]> {
  const manifest = await getManifest()
  return manifest.briefs.filter(b => b.date === date)
}
