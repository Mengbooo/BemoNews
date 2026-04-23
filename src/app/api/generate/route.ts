import { NextResponse } from 'next/server'

export async function GET() {
  // This endpoint is triggered by Vercel Cron
  // In production, call the generate script here
  try {
    // For now, return a placeholder response
    return NextResponse.json({ status: 'ok', message: 'Generate endpoint ready' })
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
