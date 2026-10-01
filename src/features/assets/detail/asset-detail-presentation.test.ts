import { describe, expect, it } from 'vitest'
import {
  isTerminalAssetStatus,
  presentAuditValue,
} from './asset-detail-presentation'

describe('asset detail presentation', () => {
  it.each(['DISPOSED', 'CANCELLED'])('marks %s as read-only', (status) => {
    expect(isTerminalAssetStatus(status)).toBe(true)
  })

  it('keeps active statuses editable for future actions', () => {
    expect(isTerminalAssetStatus('IN_USE')).toBe(false)
  })

  it('presents null and booleans without leaking raw JSON syntax', () => {
    expect(presentAuditValue(null)).toBe('—')
    expect(presentAuditValue(true)).toBe('true')
    expect(presentAuditValue({ code: 'Q1' })).toBe('{"code":"Q1"}')
  })
})
