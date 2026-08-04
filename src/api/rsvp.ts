export type RsvpPayload = {
  name: string
  attendance: 'yes' | 'no'
  drinks: string[]
  allergy: string
  plusOne: string
}

export type RsvpResult =
  | { ok: true }
  | { ok: false; alreadySubmitted?: boolean; error: string }

export async function getRsvpStatus(): Promise<boolean> {
  const res = await fetch('/api/rsvp/status', {
    credentials: 'same-origin',
  })
  if (!res.ok) return false
  const data = (await res.json()) as { submitted?: boolean }
  return data.submitted === true
}

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResult> {
  const res = await fetch('/api/rsvp', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (res.status === 409) {
    return { ok: false, alreadySubmitted: true, error: 'Already submitted' }
  }

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null

  if (res.ok && data?.ok) {
    return { ok: true }
  }

  return {
    ok: false,
    error: data?.error || 'Не удалось отправить ответ. Попробуйте позже.',
  }
}
