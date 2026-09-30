import { describe, expect, it } from 'vitest'
import {
  createAssetTypeGroupSchema,
  createAssetTypeSchema,
} from './asset-type-schema'

describe('createAssetTypeGroupSchema', () => {
  it('nhận mã + tên hợp lệ', () => {
    expect(
      createAssetTypeGroupSchema.safeParse({
        code: 'IT-EQ',
        name: 'Thiết bị IT',
      }).success
    ).toBe(true)
  })

  it('từ chối mã quá ngắn', () => {
    expect(
      createAssetTypeGroupSchema.safeParse({ code: 'I', name: 'X' }).success
    ).toBe(false)
  })
})

describe('createAssetTypeSchema', () => {
  const base = {
    code: 'LAPTOP',
    name: 'Máy tính xách tay',
    assetKind: 'FIXED_ASSET' as const,
    serialRequired: true,
    usefulLifeMonths: '',
    fastGroupCode: '',
  }

  it('nhận loại hợp lệ với thời gian để trống', () => {
    expect(createAssetTypeSchema.safeParse(base).success).toBe(true)
  })

  it('nhận thời gian là số nguyên dương', () => {
    expect(
      createAssetTypeSchema.safeParse({ ...base, usefulLifeMonths: '36' })
        .success
    ).toBe(true)
  })

  it('từ chối thời gian không phải số nguyên dương', () => {
    expect(
      createAssetTypeSchema.safeParse({ ...base, usefulLifeMonths: '0' }).success
    ).toBe(false)
    expect(
      createAssetTypeSchema.safeParse({ ...base, usefulLifeMonths: 'abc' })
        .success
    ).toBe(false)
  })

  it('từ chối phân loại ngoài TSCĐ/CCDC', () => {
    expect(
      createAssetTypeSchema.safeParse({ ...base, assetKind: 'OTHER' }).success
    ).toBe(false)
  })
})
