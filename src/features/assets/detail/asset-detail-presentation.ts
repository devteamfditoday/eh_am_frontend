export function isTerminalAssetStatus(status: string): boolean {
  return status === 'DISPOSED' || status === 'CANCELLED'
}

export function presentAuditValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
