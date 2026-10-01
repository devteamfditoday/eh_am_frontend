import { describe, expect, it } from 'vitest'
import { createAssetDescriptionSchema } from './asset-description-form-schema'

const FIXED = '11111111-1111-4111-8111-111111111111'
const TOOL = '22222222-2222-4222-8222-222222222222'

const base = {
  name: 'Máy pha cà phê',
  assetTypeId: FIXED,
  serial: 'SN-001',
  note: '',
  reasonCodeId: '',
  reasonNote: '',
}

describe('createAssetDescriptionSchema', () => {
  const kinds = new Map([
    [FIXED, 'FIXED_ASSET'],
    [TOOL, 'TOOL'],
  ])

  it('accepts a description update within the same asset kind', () => {
    expect(
      createAssetDescriptionSchema('FIXED_ASSET', kinds, new Set()).safeParse(
        base
      ).success
    ).toBe(true)
  })

  it('requires a reason when the asset kind changes', () => {
    const result = createAssetDescriptionSchema(
      'FIXED_ASSET',
      kinds,
      new Set()
    ).safeParse({ ...base, assetTypeId: TOOL })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'reasonCodeId')
      ).toBe(true)
    }
  })

  it('requires an explanation for the free-text reason', () => {
    const result = createAssetDescriptionSchema(
      'FIXED_ASSET',
      kinds,
      new Set(['reason-other'])
    ).safeParse({ ...base, assetTypeId: TOOL, reasonCodeId: 'reason-other' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'reasonNote')
      ).toBe(true)
    }
  })

  it('requires serial for a type configured with serial', () => {
    const result = createAssetDescriptionSchema(
      'FIXED_ASSET',
      kinds,
      new Set(),
      new Set([FIXED])
    ).safeParse({ ...base, serial: ' ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'serial')
      ).toBe(true)
    }
  })
})
