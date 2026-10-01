import { describe, expect, it } from 'vitest'
import { getRoleAssignmentState } from './personal-profile'

describe('getRoleAssignmentState', () => {
  it('phân biệt vai trò sắp hiệu lực và đang hiệu lực', () => {
    const now = new Date('2026-10-01T00:00:00.000Z')

    expect(getRoleAssignmentState('2026-10-02T00:00:00.000Z', null, now)).toBe(
      'UPCOMING'
    )
    expect(
      getRoleAssignmentState(
        '2026-09-01T00:00:00.000Z',
        '2026-10-02T00:00:00.000Z',
        now
      )
    ).toBe('ACTIVE')
  })
})
