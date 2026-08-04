import { serve } from '@hono/node-server'
import { Hono, type Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'

const COOKIE_NAME = 'rsvp_sent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

const PORT = Number(process.env.PORT || 3000)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID ?? ''
const COOKIE_SECURE = process.env.COOKIE_SECURE !== 'false'

type RsvpBody = {
  name?: unknown
  attendance?: unknown
  drinks?: unknown
  allergy?: unknown
  plusOne?: unknown
}

type ValidRsvp = {
  name: string
  attendance: 'yes' | 'no'
  drinks: string[]
  allergy: string
  plusOne: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length > max) return null
  return trimmed
}

function validateRsvp(body: RsvpBody): { ok: true; data: ValidRsvp } | { ok: false; error: string } {
  const name = asTrimmedString(body.name, 120)
  if (!name) return { ok: false, error: 'Укажите имя' }

  if (body.attendance !== 'yes' && body.attendance !== 'no') {
    return { ok: false, error: 'Укажите, планируете ли вы присутствовать' }
  }

  let drinks: string[] = []
  if (body.drinks !== undefined) {
    if (!Array.isArray(body.drinks)) {
      return { ok: false, error: 'Некорректный список напитков' }
    }
    if (body.drinks.length > 10) {
      return { ok: false, error: 'Слишком много напитков' }
    }
    for (const d of body.drinks) {
      if (typeof d !== 'string' || d.trim().length === 0 || d.length > 80) {
        return { ok: false, error: 'Некорректный напиток' }
      }
      drinks.push(d.trim())
    }
  }

  const allergy = asTrimmedString(body.allergy ?? '', 300)
  if (allergy === null) return { ok: false, error: 'Слишком длинный ответ про аллергию' }

  const plusOne = asTrimmedString(body.plusOne ?? '', 120)
  if (plusOne === null) return { ok: false, error: 'Слишком длинный ответ про +1' }

  return {
    ok: true,
    data: {
      name,
      attendance: body.attendance,
      drinks,
      allergy,
      plusOne,
    },
  }
}

function formatTelegramMessage(data: ValidRsvp): string {
  const attendanceLabel = data.attendance === 'yes' ? 'Будет' : 'Не сможет'
  const drinksLabel = data.drinks.length > 0 ? data.drinks.join(', ') : '—'
  const allergyLabel = data.allergy || '—'
  const plusOneLabel = data.plusOne || '—'

  return [
    '<b>Анкета гостя</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(data.name)}`,
    `<b>Присутствие:</b> ${attendanceLabel}`,
    `<b>Напитки:</b> ${escapeHtml(drinksLabel)}`,
    `<b>Аллергия:</b> ${escapeHtml(allergyLabel)}`,
    `<b>+1:</b> ${escapeHtml(plusOneLabel)}`,
  ].join('\n')
}

async function sendTelegramMessage(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    throw new Error('Telegram is not configured')
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  const payload = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null
  if (!res.ok || !payload?.ok) {
    const reason = payload?.description || `HTTP ${res.status}`
    throw new Error(`Telegram API error: ${reason}`)
  }
}

function markSubmittedCookie(c: Context) {
  setCookie(c, COOKIE_NAME, '1', {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: 'Lax',
  })
}

const app = new Hono()

app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    credentials: true,
  }),
)

app.get('/api/rsvp/status', (c) => {
  const sent = getCookie(c, COOKIE_NAME) === '1'
  return c.json({ submitted: sent })
})

app.post('/api/rsvp', async (c) => {
  if (getCookie(c, COOKIE_NAME) === '1') {
    return c.json({ ok: false, error: 'Already submitted' }, 409)
  }

  let body: RsvpBody
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Некорректный JSON' }, 400)
  }

  const validated = validateRsvp(body)
  if (!validated.ok) {
    return c.json({ ok: false, error: validated.error }, 400)
  }

  try {
    await sendTelegramMessage(formatTelegramMessage(validated.data))
  } catch (err) {
    console.error('[rsvp] telegram failed', err)
    return c.json({ ok: false, error: 'Не удалось отправить ответ. Попробуйте позже.' }, 502)
  }

  markSubmittedCookie(c)
  return c.json({ ok: true })
})

app.get('/api/health', (c) => c.json({ ok: true }))

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`RSVP API listening on :${info.port}`)
})
