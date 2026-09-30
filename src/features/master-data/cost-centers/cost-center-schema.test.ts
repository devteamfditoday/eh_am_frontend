import { describe, expect, it } from 'vitest'
import {
  createCostCenterSchema,
  updateCostCenterSchema,
} from './cost-center-schema'

describe('createCostCenterSchema', () => {
  it('chấp nhận mã + tên hợp lệ', () => {
    expect(
      createCostCenterSchema.safeParse({ code: 'CC-STORE-01', name: 'Chi phí' })
        .success
    ).toBe(true)
  })

  it('từ chối mã quá ngắn', () => {
    expect(
      createCostCenterSchema.safeParse({ code: 'C', name: 'Chi phí' }).success
    ).toBe(false)
  })

  it('từ chối tên rỗng', () => {
    expect(
      createCostCenterSchema.safeParse({ code: 'CC-01', name: '' }).success
    ).toBe(false)
  })
})

describe('updateCostCenterSchema', () => {
  it('chỉ cần tên (mã chỉ đọc khi sửa)', () => {
    expect(updateCostCenterSchema.safeParse({ name: 'Tên mới' }).success).toBe(
      true
    )
  })
})
