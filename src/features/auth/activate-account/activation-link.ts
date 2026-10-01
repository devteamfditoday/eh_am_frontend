export type ActivationHashResult =
  | { ok: true; accessToken: string }
  | { ok: false }

/** Chỉ nhận session sinh từ email mời; signup/recovery thuộc các luồng khác. */
export function parseActivationHash(hash: string): ActivationHashResult {
  const params = new URLSearchParams(
    hash.startsWith('#') ? hash.slice(1) : hash
  )
  if (params.get('error') || params.get('error_code')) return { ok: false }
  if (params.get('type') !== 'invite') return { ok: false }
  const accessToken = params.get('access_token')?.trim()
  if (!accessToken || accessToken.length > 4096) return { ok: false }
  return { ok: true, accessToken }
}
