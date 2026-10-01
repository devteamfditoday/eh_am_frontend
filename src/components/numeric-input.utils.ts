export type NumericInputKind = 'plain' | 'phone' | 'taxId' | 'money'

const MAX_DIGITS: Record<NumericInputKind, number> = {
  plain: 64,
  phone: 11,
  taxId: 13,
  money: 18,
}

export function normalizeNumericValue(
  value: string,
  kind: NumericInputKind
): string {
  return value.replace(/\D/g, '').slice(0, MAX_DIGITS[kind])
}

function chunk(value: string, sizes: number[]): string {
  const parts: string[] = []
  let offset = 0
  for (const size of sizes) {
    if (offset >= value.length) break
    parts.push(value.slice(offset, offset + size))
    offset += size
  }
  if (offset < value.length) parts.push(value.slice(offset))
  return parts.filter(Boolean).join(' ')
}

export function formatNumericValue(
  value: string,
  kind: NumericInputKind
): string {
  const digits = normalizeNumericValue(value, kind)
  if (!digits) return ''
  if (kind === 'phone') {
    return digits.startsWith('84')
      ? `+${chunk(digits, [2, 3, 3, 3])}`
      : chunk(digits, [4, 3, 3])
  }
  if (kind === 'taxId') {
    return digits.length > 10
      ? `${digits.slice(0, 10)}-${digits.slice(10)}`
      : digits
  }
  if (kind === 'money') {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(Number(digits))
  }
  return digits
}
