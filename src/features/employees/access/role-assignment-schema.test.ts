import { describe, expect, it } from 'vitest'
import { grantRoleSchema } from './role-assignment-schema'

const baseLocation = {
  roleCode: 'LOCATION_STAFF',
  contextType: 'LOCATION' as const,
  contextIds: ['11111111-1111-4111-8111-111111111111'],
  effectiveFrom: '2026-10-03',
  effectiveTo: '',
  reason: 'Nhận việc tại cửa hàng',
}

describe('grantRoleSchema', () => {
  it('accepts a platform role without any location', () => {
    const result = grantRoleSchema.safeParse({
      roleCode: 'EXECUTIVE',
      contextType: 'PLATFORM',
      contextIds: [],
      effectiveFrom: '2026-10-03',
      effectiveTo: '',
      reason: 'Bổ nhiệm ban giám đốc',
    })
    expect(result.success).toBe(true)
  })

  it('requires at least one location for a location role', () => {
    const result = grantRoleSchema.safeParse({
      ...baseLocation,
      contextIds: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects more than one location for location staff', () => {
    const result = grantRoleSchema.safeParse({
      ...baseLocation,
      contextIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an end date before the start date', () => {
    const result = grantRoleSchema.safeParse({
      ...baseLocation,
      effectiveTo: '2026-10-01',
    })
    expect(result.success).toBe(false)
  })
})
