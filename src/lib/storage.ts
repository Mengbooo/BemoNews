import fs from 'fs/promises'
import path from 'path'

const BRIEFS_DIR = path.join(process.cwd(), 'public', 'briefs')

export async function saveBrief(filename: string, content: string): Promise<void> {
  await fs.mkdir(BRIEFS_DIR, { recursive: true })
  await fs.writeFile(path.join(BRIEFS_DIR, filename), content, 'utf-8')
}

export async function getBrief(filename: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(BRIEFS_DIR, filename), 'utf-8')
  } catch {
    return null
  }
}

export async function listBriefs(): Promise<string[]> {
  try {
    const files = await fs.readdir(BRIEFS_DIR)
    return files.filter(f => f.endsWith('.html'))
  } catch {
    return []
  }
}
