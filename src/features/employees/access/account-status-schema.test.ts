import { describe, expect, it } from 'vitest'
import {
  accountStatusSchema,
  canChangeAccountStatus,
} from './account-status-schema'

describe('accountStatusSchema (UC-IAM-12)', () => {
  const reasonId = '11111111-1111-4111-8111-111111111111'

  it('requires a valid selected reason', () => {
    expect(
      accountStatusSchema.safeParse({
        reasonCodeId: '',
        reasonNote: '',
        requiresNote: false,
      }).success
    ).toBe(false)
    expect(
      accountStatusSchema.safeParse({
        reasonCodeId: reasonId,
        reasonNote: '',
        requiresNote: false,
      }).success
    ).toBe(true)
  })

  it('requires a useful note when the selected reason is free text', () => {
    expect(
      accountStatusSchema.safeParse({
        reasonCodeId: reasonId,
        reasonNote: ' ',
        requiresNote: true,
      }).success
    ).toBe(false)
    expect(
      accountStatusSchema.safeParse({
        reasonCodeId: reasonId,
        reasonNote: 'Nghỉ dài ngày',
        requiresNote: true,
      }).success
    ).toBe(true)
  })
})

describe('canChangeAccountStatus', () => {
  it('shows the action only for another ACTIVE or SUSPENDED employee', () => {
    expect(canChangeAccountStatus('ACTIVE', 'emp-1', 'actor-1')).toBe(true)
    expect(canChangeAccountStatus('SUSPENDED', 'emp-1', 'actor-1')).toBe(true)
    expect(canChangeAccountStatus('DEACTIVATED', 'emp-1', 'actor-1')).toBe(
      false
    )
    expect(canChangeAccountStatus('ACTIVE', 'actor-1', 'actor-1')).toBe(false)
  })
})
