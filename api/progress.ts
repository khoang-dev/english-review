import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Vercel function: stores the practice progress (`ProgressState` in src/types/progress.ts) as
 * one JSON value in Upstash Redis, so every device sees the same progress.
 *
 * - GET  /api/progress → the saved progress, or null
 * - PUT  /api/progress → replace it (the app merges before it saves)
 *
 * Needs `SYNC_TOKEN` (the sync key typed into the app, sent as `Authorization: Bearer …`) and the
 * Redis env vars that the Upstash integration on Vercel adds (KV_REST_API_URL /
 * KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 */

const STORAGE_KEY = 'english-review:progress:v1'
const MAX_BYTES = 2_000_000

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest()
}

/** Null when the request may go on, else the error response. */
function checkAuth(request: Request): Response | null {
  const expected = process.env.SYNC_TOKEN
  if (!expected) return json({ error: 'SYNC_TOKEN is not set on the server' }, 500)
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  // Compare digests so the check takes the same time whatever the key's length
  if (!timingSafeEqual(sha256(given), sha256(expected))) return json({ error: 'Unauthorized' }, 401)
  return null
}

async function redis(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Redis is not configured')
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  const data = (await response.json()) as { result?: unknown; error?: string }
  if (!response.ok || data.error) throw new Error(`Redis: ${data.error ?? response.status}`)
  return data.result
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isProgress(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.items) || !Array.isArray(value.practiceDays)) return false
  if (!value.practiceDays.every((day) => typeof day === 'string')) return false
  return Object.values(value.items).every(
    (item) =>
      isRecord(item) &&
      typeof item.right === 'number' &&
      typeof item.wrong === 'number' &&
      typeof item.last === 'string' &&
      typeof item.known === 'boolean' &&
      (item.updatedAt === undefined || typeof item.updatedAt === 'number'),
  )
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(request: Request): Promise<Response> {
  const denied = checkAuth(request)
  if (denied) return denied
  try {
    const saved = await redis(['GET', STORAGE_KEY])
    return json(typeof saved === 'string' ? JSON.parse(saved) : null)
  } catch (error) {
    console.error(error)
    return json({ error: 'Could not read progress' }, 502)
  }
}

export async function PUT(request: Request): Promise<Response> {
  const denied = checkAuth(request)
  if (denied) return denied
  const text = await request.text()
  if (text.length > MAX_BYTES) return json({ error: 'Progress is too large' }, 413)
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return json({ error: 'Body must be JSON' }, 400)
  }
  if (!isProgress(body)) return json({ error: 'Body is not a progress object' }, 400)
  try {
    await redis(['SET', STORAGE_KEY, JSON.stringify(body)])
    return json({ ok: true })
  } catch (error) {
    console.error(error)
    return json({ error: 'Could not save progress' }, 502)
  }
}
