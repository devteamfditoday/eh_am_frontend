import { describe, expect, it } from 'vitest'
import { createAssetSchema } from './asset-form-schema'

const TYPE_WITH_SERIAL = '11111111-1111-4111-8111-111111111111'
const TYPE_NO_SERIAL = '22222222-2222-4222-8222-222222222222'
const LOCATION = '33333333-3333-4333-8333-333333333333'
const USER = '44444444-4444-4444-8444-444444444444'

const base = {
  name: 'Máy pha cà phê',
  assetTypeId: TYPE_NO_SERIAL,
  primaryLocationId: LOCATION,
  responsibleUserId: USER,
  initialStatus: 'IN_STORAGE' as const,
}

describe('createAssetSchema', () => {
  const schema = createAssetSchema(new Set([TYPE_WITH_SERIAL]))

  it('accepts a minimal valid payload without serial for a non-serial type', () => {
    expect(schema.safeParse(base).success).toBe(true)
  })

  it('rejects a blank name', () => {
    const result = schema.safeParse({ ...base, name: '  ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('nameRequired')
    }
  })

  it('rejects a status outside the domain', () => {
    expect(
      schema.safeParse({ ...base, initialStatus: 'DISPOSED' }).success
    ).toBe(false)
  })

  it('requires serial when the chosen type needs one (EX.1)', () => {
    const result = schema.safeParse({ ...base, assetTypeId: TYPE_WITH_SERIAL })
    expect(result.success).toBe(false)
    if (!result.success) {
      const serialIssue = result.error.issues.find((i) =>
        i.path.includes('serial')
      )
      expect(serialIssue?.message).toBe('serialRequired')
    }
  })

  it('accepts a serial-required type when serial is provided', () => {
    const result = schema.safeParse({
      ...base,
      assetTypeId: TYPE_WITH_SERIAL,
      serial: 'SN-123',
    })
    expect(result.success).toBe(true)
  })
})
