import { describe, expect, it } from 'vitest'
import { createLocationSchema, updateLocationSchema } from './location-schema'

const validCreate = {
  code: 'Q1',
  name: 'Cửa hàng Quận 1',
  type: 'STORE' as const,
  address: '123 Nguyễn Huệ',
  defaultCostCenterId: '00000000-0000-4000-8000-000000000001',
}

describe('createLocationSchema', () => {
  it('chấp nhận dữ liệu hợp lệ', () => {
    expect(createLocationSchema.safeParse(validCreate).success).toBe(true)
  })

  it('cho phép địa chỉ rỗng (tuỳ chọn)', () => {
    expect(
      createLocationSchema.safeParse({ ...validCreate, address: '' }).success
    ).toBe(true)
  })

  it('từ chối mã quá ngắn', () => {
    expect(
      createLocationSchema.safeParse({ ...validCreate, code: 'A' }).success
    ).toBe(false)
  })

  it('từ chối mã có ký tự đầu không phải chữ/số', () => {
    expect(
      createLocationSchema.safeParse({ ...validCreate, code: '-Q1' }).success
    ).toBe(false)
  })

  it('từ chối loại ngoài 5 loại cho phép', () => {
    expect(
      createLocationSchema.safeParse({ ...validCreate, type: 'FACTORY' })
        .success
    ).toBe(false)
  })

  it('từ chối cost center không phải UUID', () => {
    expect(
      createLocationSchema.safeParse({
        ...validCreate,
        defaultCostCenterId: 'not-a-uuid',
      }).success
    ).toBe(false)
  })

  it('từ chối tên vượt 150 ký tự', () => {
    expect(
      createLocationSchema.safeParse({
        ...validCreate,
        name: 'x'.repeat(151),
      }).success
    ).toBe(false)
  })
})

describe('updateLocationSchema', () => {
  it('không yêu cầu mã và loại (chỉ đọc khi sửa)', () => {
    const result = updateLocationSchema.safeParse({
      name: 'Tên mới',
      address: '',
      defaultCostCenterId: '00000000-0000-4000-8000-000000000001',
    })
    expect(result.success).toBe(true)
  })
})
