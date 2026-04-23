// Manifest sync script
import { getManifest } from '../src/lib/manifest'

async function sync() {
  const manifest = await getManifest()
  console.log(`Manifest has ${manifest.briefs.length} briefs`)
  console.log('Last updated:', manifest.lastUpdated)
}

sync()
