import { type TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { getAssetColumns } from './assets-columns'

// Stub TFunction: trả về chính khoá để kiểm cấu trúc cột mà không cần i18n thật.
const t = ((key: string) => key) as unknown as TFunction

describe('getAssetColumns', () => {
  it('exposes the expected columns in order', () => {
    const keys = getAssetColumns(t).map((col) =>
      'accessorKey' in col ? col.accessorKey : undefined
    )
    expect(keys).toEqual([
      'assetCode',
      'name',
      'assetType',
      'location',
      'responsible',
      'lifecycleStatus',
      'physicalCondition',
    ])
  })

  it('does not expose a value/cost column (BR-CMN-06 — chưa có cột giá trị ở GĐ1)', () => {
    const keys = getAssetColumns(t).map((col) =>
      'accessorKey' in col ? col.accessorKey : undefined
    )
    expect(keys).not.toContain('costCenterId')
    expect(keys).not.toContain('value')
  })
})
