import { describe, expect, it } from 'vitest'
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from './department-schema'

describe('createDepartmentSchema', () => {
  it('chấp nhận mã + tên hợp lệ', () => {
    expect(
      createDepartmentSchema.safeParse({ code: 'VP-KT', name: 'Phòng Kế toán' })
        .success
    ).toBe(true)
  })

  it('từ chối mã sai ký tự đầu', () => {
    expect(
      createDepartmentSchema.safeParse({ code: '-KT', name: 'Phòng Kế toán' })
        .success
    ).toBe(false)
  })

  it('từ chối tên rỗng', () => {
    expect(
      createDepartmentSchema.safeParse({ code: 'VP-KT', name: '' }).success
    ).toBe(false)
  })
})

describe('updateDepartmentSchema', () => {
  it('chỉ cần tên (mã chỉ đọc khi sửa)', () => {
    expect(updateDepartmentSchema.safeParse({ name: 'Tên mới' }).success).toBe(
      true
    )
  })
})
